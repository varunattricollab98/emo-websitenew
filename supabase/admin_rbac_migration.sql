-- ============================================================================
-- Admin RBAC Migration
-- Adds: email, granular permissions, password hashing, reset tokens,
--       login lockout, audit timestamps + a global admin_settings table.
--
-- Safe to re-run (all statements are idempotent).
-- Run this in the Supabase Dashboard → SQL Editor.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Extend admin_users
-- ---------------------------------------------------------------------------

ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS permissions jsonb DEFAULT '[]'::jsonb;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS password_salt text;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS last_login_at timestamptz;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Password reset flow
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS reset_token text;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS reset_expires_at timestamptz;

-- Brute-force protection
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS failed_attempts integer DEFAULT 0;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS locked_until timestamptz;

-- The old CHECK constraint only allowed ('admin','editor'). Drop it so we can
-- add 'viewer' and any future custom roles.
ALTER TABLE admin_users DROP CONSTRAINT IF EXISTS admin_users_role_check;
ALTER TABLE admin_users
  ADD CONSTRAINT admin_users_role_check
  CHECK (role IN ('admin', 'manager', 'editor', 'viewer'));

-- Unique email (only when present, so existing NULL rows are fine)
CREATE UNIQUE INDEX IF NOT EXISTS admin_users_email_unique
  ON admin_users (lower(email)) WHERE email IS NOT NULL;

-- Fast token lookup on the reset-password screen
CREATE INDEX IF NOT EXISTS admin_users_reset_token_idx
  ON admin_users (reset_token) WHERE reset_token IS NOT NULL;

-- Keep updated_at fresh
CREATE OR REPLACE FUNCTION set_admin_users_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS admin_users_updated_at ON admin_users;
CREATE TRIGGER admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION set_admin_users_updated_at();

-- ---------------------------------------------------------------------------
-- 2. Backfill: give the existing admin account full permissions
--    ('*' is the wildcard the app understands as "everything")
-- ---------------------------------------------------------------------------

UPDATE admin_users
   SET permissions = '["*"]'::jsonb
 WHERE role = 'admin'
   AND (permissions IS NULL OR permissions = '[]'::jsonb);

-- ---------------------------------------------------------------------------
-- 3. Global admin settings (single row, id is always 1)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS admin_settings (
  id integer PRIMARY KEY DEFAULT 1,
  login_enabled boolean DEFAULT true,
  allow_password_reset boolean DEFAULT true,
  session_timeout_minutes integer DEFAULT 480,
  max_failed_attempts integer DEFAULT 5,
  lockout_minutes integer DEFAULT 15,
  default_role text DEFAULT 'viewer',
  maintenance_note text,
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT admin_settings_singleton CHECK (id = 1)
);

ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access" ON admin_settings;
CREATE POLICY "Service role full access" ON admin_settings
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

INSERT INTO admin_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

DROP TRIGGER IF EXISTS admin_settings_updated_at ON admin_settings;
CREATE TRIGGER admin_settings_updated_at
  BEFORE UPDATE ON admin_settings
  FOR EACH ROW EXECUTE FUNCTION set_admin_users_updated_at();

-- ---------------------------------------------------------------------------
-- 4. Audit log — who did what, when
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS admin_audit_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  username text,
  action text NOT NULL,
  detail text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access" ON admin_audit_log;
CREATE POLICY "Service role full access" ON admin_audit_log
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS admin_audit_log_created_idx
  ON admin_audit_log (created_at DESC);


-- ---------------------------------------------------------------------------
-- 5. Password reset requests
--    Anonymous visitors on /admin/forgot-password may INSERT a request (that
--    is all they can do — no reads, no updates). Admins read + action them.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS password_reset_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier text NOT NULL,            -- username or email the user typed
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'handled', 'rejected')),
  handled_by text,
  handled_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE password_reset_requests ENABLE ROW LEVEL SECURITY;

-- Anonymous users can only create a request.
DROP POLICY IF EXISTS "Anon can request reset" ON password_reset_requests;
CREATE POLICY "Anon can request reset" ON password_reset_requests
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access" ON password_reset_requests;
CREATE POLICY "Service role full access" ON password_reset_requests
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS password_reset_requests_status_idx
  ON password_reset_requests (status, created_at DESC);

-- ---------------------------------------------------------------------------
-- 6. Token redemption RPC
--    Lets a logged-OUT user complete a reset using a token an admin generated,
--    without ever exposing the admin_users table to the anon role.
--    SECURITY DEFINER = runs with the function owner's rights, but the only
--    way in is a valid, unexpired, single-use token.
-- ---------------------------------------------------------------------------

-- Step 1: check a token is valid (used to decide whether to show the form)
CREATE OR REPLACE FUNCTION check_admin_reset_token(p_token text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user admin_users;
BEGIN
  IF p_token IS NULL OR length(p_token) < 20 THEN
    RETURN jsonb_build_object('valid', false, 'reason', 'invalid');
  END IF;

  SELECT * INTO v_user FROM admin_users WHERE reset_token = p_token LIMIT 1;

  IF v_user.id IS NULL THEN
    RETURN jsonb_build_object('valid', false, 'reason', 'invalid');
  END IF;

  IF v_user.reset_expires_at IS NULL OR v_user.reset_expires_at < now() THEN
    RETURN jsonb_build_object('valid', false, 'reason', 'expired');
  END IF;

  RETURN jsonb_build_object('valid', true, 'username', v_user.username);
END;
$$;

-- Step 2: redeem it. The app hashes the password client-side (PBKDF2) and
-- passes the hash + salt, so no plaintext ever reaches the database.
CREATE OR REPLACE FUNCTION redeem_admin_reset_token(
  p_token text,
  p_password_hash text,
  p_password_salt text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user admin_users;
BEGIN
  IF p_token IS NULL OR p_password_hash IS NULL OR length(p_password_hash) < 20 THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'invalid');
  END IF;

  SELECT * INTO v_user FROM admin_users WHERE reset_token = p_token LIMIT 1;

  IF v_user.id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'invalid');
  END IF;

  IF v_user.reset_expires_at IS NULL OR v_user.reset_expires_at < now() THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'expired');
  END IF;

  UPDATE admin_users
     SET password         = p_password_hash,
         password_salt    = p_password_salt,
         reset_token      = NULL,       -- single use
         reset_expires_at = NULL,
         failed_attempts  = 0,
         locked_until     = NULL
   WHERE id = v_user.id;

  INSERT INTO admin_audit_log (username, action, detail)
  VALUES (v_user.username, 'password.reset', 'Completed via reset token');

  RETURN jsonb_build_object('ok', true, 'username', v_user.username);
END;
$$;

REVOKE ALL ON FUNCTION check_admin_reset_token(text) FROM public;
REVOKE ALL ON FUNCTION redeem_admin_reset_token(text, text, text) FROM public;
GRANT EXECUTE ON FUNCTION check_admin_reset_token(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION redeem_admin_reset_token(text, text, text) TO anon, authenticated;
