-- ============================================================================
-- EaseMyOffice — Admin Panel Setup (ALL IN ONE)
--
-- This single script replaces running admin_rbac_migration.sql followed by
-- admin_auth_migration.sql. The old two-file sequence created a custom
-- password-reset system (a password_reset_requests table, two SECURITY DEFINER
-- token functions and reset_token columns) that the second file then deleted,
-- because Supabase Auth now sends real reset emails. That dead code is simply
-- omitted here.
--
-- WHY THIS MIGRATION EXISTS
-- Supabase blocks `sb_secret_…` keys from browsers ("Forbidden use of secret
-- API key in browser"), so the old design — an elevated key held in the
-- browser's sessionStorage — cannot work any more. Admins now sign in as real
-- Supabase Auth users, and every permission is enforced by the DATABASE via
-- RLS rather than by client-side JavaScript.
--
-- HOW TO RUN
--   Supabase Dashboard → SQL Editor → New query → paste ALL of this → Run.
--   Paste the CONTENTS of this file, not its filename.
--
-- Safe to re-run: every statement is idempotent.
-- ============================================================================


-- ---------------------------------------------------------------------------
-- 0. Make sure the profile table exists
--    (no-op on an existing project; needed for a fresh database)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS admin_users (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  username   text UNIQUE NOT NULL,
  password   text,
  name       text,
  role       text DEFAULT 'editor',
  is_active  boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;


-- ---------------------------------------------------------------------------
-- 1. Extend admin_users into a proper profile table
-- ---------------------------------------------------------------------------

ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS email         text;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS permissions   jsonb DEFAULT '[]'::jsonb;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS last_login_at timestamptz;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS updated_at    timestamptz DEFAULT now();

-- The original CHECK only allowed ('admin','editor'). Widen it.
ALTER TABLE admin_users DROP CONSTRAINT IF EXISTS admin_users_role_check;
ALTER TABLE admin_users
  ADD CONSTRAINT admin_users_role_check
  CHECK (role IN ('admin', 'manager', 'editor', 'viewer'));

-- Email is the login identifier now, so it must be unique when present.
CREATE UNIQUE INDEX IF NOT EXISTS admin_users_email_unique
  ON admin_users (lower(email)) WHERE email IS NOT NULL;

-- Shared updated_at trigger function
CREATE OR REPLACE FUNCTION set_admin_users_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS admin_users_updated_at ON admin_users;
CREATE TRIGGER admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION set_admin_users_updated_at();


-- ---------------------------------------------------------------------------
-- 2. Hand passwords over to Supabase Auth
--    Our own password columns are dead. Keep them nullable so nothing breaks
--    mid-migration, but blank the values so no stale hashes linger.
-- ---------------------------------------------------------------------------

ALTER TABLE admin_users ALTER COLUMN password DROP NOT NULL;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS password_salt text;

UPDATE admin_users
   SET password = NULL, password_salt = NULL
 WHERE password IS NOT NULL OR password_salt IS NOT NULL;

-- Backfill any missing email from the username so no row is left unusable.
UPDATE admin_users
   SET email = lower(username) || '@easemyoffice.in'
 WHERE email IS NULL OR btrim(email) = '';


-- ---------------------------------------------------------------------------
-- 3. Guarantee one full-access admin profile exists
--    '*' is the wildcard the app reads as "everything".
-- ---------------------------------------------------------------------------

-- Guarded on BOTH username and email, because a unique index covers each one.
INSERT INTO admin_users (username, email, name, role, is_active, permissions)
SELECT 'admin', 'admin@easemyoffice.in', 'Administrator', 'admin', true, '["*"]'::jsonb
 WHERE NOT EXISTS (SELECT 1 FROM admin_users WHERE username = 'admin')
   AND NOT EXISTS (SELECT 1 FROM admin_users WHERE lower(email) = 'admin@easemyoffice.in');

-- Any existing admin-role row with no permissions gets full access.
UPDATE admin_users
   SET permissions = '["*"]'::jsonb
 WHERE role = 'admin'
   AND (permissions IS NULL OR permissions = '[]'::jsonb);


-- ---------------------------------------------------------------------------
-- 4. Global admin settings (single row, id is always 1) + audit log
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS admin_settings (
  id                      integer PRIMARY KEY DEFAULT 1,
  login_enabled           boolean DEFAULT true,
  allow_password_reset    boolean DEFAULT true,
  session_timeout_minutes integer DEFAULT 480,
  max_failed_attempts     integer DEFAULT 5,
  lockout_minutes         integer DEFAULT 15,
  default_role            text    DEFAULT 'viewer',
  maintenance_note        text,
  updated_at              timestamptz DEFAULT now(),
  CONSTRAINT admin_settings_singleton CHECK (id = 1)
);

ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

INSERT INTO admin_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

DROP TRIGGER IF EXISTS admin_settings_updated_at ON admin_settings;
CREATE TRIGGER admin_settings_updated_at
  BEFORE UPDATE ON admin_settings
  FOR EACH ROW EXECUTE FUNCTION set_admin_users_updated_at();

CREATE TABLE IF NOT EXISTS admin_audit_log (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  username   text,
  action     text NOT NULL,
  detail     text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS admin_audit_log_created_idx
  ON admin_audit_log (created_at DESC);


-- ---------------------------------------------------------------------------
-- 5. Link admin_users to auth.users
--    Supabase Auth owns the email, password and session; admin_users holds
--    the role and permissions.
-- ---------------------------------------------------------------------------

ALTER TABLE admin_users
  ADD COLUMN IF NOT EXISTS auth_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE UNIQUE INDEX IF NOT EXISTS admin_users_auth_user_id_key
  ON admin_users (auth_user_id) WHERE auth_user_id IS NOT NULL;

-- Auto-link by email, so creating a user in Authentication → Users is enough;
-- no manual id copying. Fires on signup and on email change.
CREATE OR REPLACE FUNCTION public.link_auth_user_to_admin_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE admin_users
     SET auth_user_id = NEW.id
   WHERE lower(email) = lower(NEW.email)
     AND (auth_user_id IS NULL OR auth_user_id = NEW.id);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_link_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_link_admin
  AFTER INSERT OR UPDATE OF email ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.link_auth_user_to_admin_profile();

-- Link any auth users that already exist.
UPDATE admin_users a
   SET auth_user_id = u.id
  FROM auth.users u
 WHERE lower(a.email) = lower(u.email)
   AND a.auth_user_id IS NULL;

-- ...and the mirror image: link a NEW profile to an auth account that already
-- exists. Both directions are needed because the two objects can be created in
-- either order:
--
--   Dashboard → Authentication → Users   : auth user second → trigger above
--   Admin panel → Users & Access → New   : auth user FIRST, profile second
--
-- The panel calls createAuthUser() and only then inserts the profile, so at
-- auth-insert time there is no profile to match. Without this trigger every
-- panel-created admin is left with auth_user_id NULL — showing "No login" and
-- unable to sign in until someone links the row by hand.

CREATE OR REPLACE FUNCTION public.link_admin_profile_to_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF new.auth_user_id IS NULL AND new.email IS NOT NULL THEN
    SELECT u.id
      INTO new.auth_user_id
      FROM auth.users u
     WHERE lower(u.email) = lower(new.email)
     LIMIT 1;
  END IF;

  -- Reaching this trigger means an authenticated admin holding users.create
  -- inserted the profile — RLS enforces that — so the address has been vouched
  -- for by someone who already has access. Confirm it, so the new admin can
  -- sign in with their initial password instead of chasing a confirmation
  -- email (Supabase's built-in SMTP is rate-limited and those links expire).
  --
  -- Deliberately NOT done in the auth.users trigger. That path can be reached
  -- by a stranger calling signUp() with an admin email that has no login yet,
  -- and email confirmation is precisely what stops them claiming the profile.
  IF new.auth_user_id IS NOT NULL THEN
    BEGIN
      UPDATE auth.users
         SET email_confirmed_at = now()
       WHERE id = new.auth_user_id
         AND email_confirmed_at IS NULL;
    EXCEPTION
      WHEN insufficient_privilege THEN
        NULL;  -- fall back to Supabase's normal confirmation email
    END;
  END IF;

  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS admin_users_link_auth ON admin_users;
CREATE TRIGGER admin_users_link_auth
  BEFORE INSERT OR UPDATE OF email ON admin_users
  FOR EACH ROW EXECUTE FUNCTION public.link_admin_profile_to_auth_user();


-- ---------------------------------------------------------------------------
-- 6. The permission check — the heart of the whole system
--    SECURITY DEFINER so it can read admin_users regardless of RLS.
--    Understands the same wildcards as the app: "*" and "section.*".
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.admin_can(p_permission text)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_perms jsonb;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;

  SELECT permissions INTO v_perms
    FROM admin_users
   WHERE auth_user_id = auth.uid()
     AND is_active = true
   LIMIT 1;

  IF v_perms IS NULL THEN
    RETURN false;
  END IF;

  IF v_perms ? '*' THEN                 -- full access
    RETURN true;
  END IF;

  IF v_perms ? p_permission THEN        -- exact permission
    RETURN true;
  END IF;

  -- section wildcard, e.g. "blog.*"
  RETURN v_perms ? (split_part(p_permission, '.', 1) || '.*');
END;
$$;

CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users
     WHERE auth_user_id = auth.uid() AND is_active = true
  );
$$;

REVOKE ALL ON FUNCTION public.admin_can(text)   FROM public;
REVOKE ALL ON FUNCTION public.is_admin_user()   FROM public;
GRANT EXECUTE ON FUNCTION public.admin_can(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin_user() TO authenticated;


-- ---------------------------------------------------------------------------
-- 7. Content tables — one set of CRUD policies per section
--    Generated in a loop so the table→section mapping stays obvious.
--    Existing "public can read active …" anon policies are left untouched;
--    RLS policies are OR'd, so the public site keeps working as before.
-- ---------------------------------------------------------------------------

DO $$
DECLARE
  t record;
BEGIN
  FOR t IN
    SELECT * FROM (VALUES
      ('blog_posts',       'blog'),
      ('blog_articles',    'articles'),
      ('coworking_spaces', 'coworking'),
      ('job_openings',     'jobs'),
      ('site_pages',       'pages')
    ) AS x(tbl, section)
  LOOP
    -- Skip tables that don't exist on this project
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.tables
       WHERE table_schema = 'public' AND table_name = t.tbl
    ) THEN
      CONTINUE;
    END IF;

    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t.tbl);

    EXECUTE format('DROP POLICY IF EXISTS "admin read %s" ON public.%I', t.section, t.tbl);
    EXECUTE format(
      'CREATE POLICY "admin read %s" ON public.%I FOR SELECT TO authenticated USING (public.admin_can(%L))',
      t.section, t.tbl, t.section || '.view'
    );

    EXECUTE format('DROP POLICY IF EXISTS "admin insert %s" ON public.%I', t.section, t.tbl);
    EXECUTE format(
      'CREATE POLICY "admin insert %s" ON public.%I FOR INSERT TO authenticated WITH CHECK (public.admin_can(%L))',
      t.section, t.tbl, t.section || '.create'
    );

    EXECUTE format('DROP POLICY IF EXISTS "admin update %s" ON public.%I', t.section, t.tbl);
    EXECUTE format(
      'CREATE POLICY "admin update %s" ON public.%I FOR UPDATE TO authenticated USING (public.admin_can(%L)) WITH CHECK (public.admin_can(%L))',
      t.section, t.tbl, t.section || '.edit', t.section || '.edit'
    );

    EXECUTE format('DROP POLICY IF EXISTS "admin delete %s" ON public.%I', t.section, t.tbl);
    EXECUTE format(
      'CREATE POLICY "admin delete %s" ON public.%I FOR DELETE TO authenticated USING (public.admin_can(%L))',
      t.section, t.tbl, t.section || '.delete'
    );
  END LOOP;
END;
$$;


-- ---------------------------------------------------------------------------
-- 8. Leads — anon may INSERT (contact forms); admins read/update/delete.
--    The existing anon-insert policy is deliberately NOT touched.
-- ---------------------------------------------------------------------------

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin read leads" ON public.leads;
CREATE POLICY "admin read leads" ON public.leads
  FOR SELECT TO authenticated USING (public.admin_can('leads.view'));

DROP POLICY IF EXISTS "admin update leads" ON public.leads;
CREATE POLICY "admin update leads" ON public.leads
  FOR UPDATE TO authenticated
  USING (public.admin_can('leads.edit'))
  WITH CHECK (public.admin_can('leads.edit'));

DROP POLICY IF EXISTS "admin delete leads" ON public.leads;
CREATE POLICY "admin delete leads" ON public.leads
  FOR DELETE TO authenticated USING (public.admin_can('leads.delete'));

-- bookings, if present, follows the same rules as leads
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
     WHERE table_schema = 'public' AND table_name = 'bookings'
  ) THEN
    EXECUTE 'ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "admin read bookings" ON public.bookings';
    EXECUTE 'CREATE POLICY "admin read bookings" ON public.bookings FOR SELECT TO authenticated USING (public.admin_can(''leads.view''))';
  END IF;
END;
$$;

-- spaces (public virtual-office listings) — full admin CRUD
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
     WHERE table_schema = 'public' AND table_name = 'spaces'
  ) THEN
    EXECUTE 'DROP POLICY IF EXISTS "admin read spaces" ON public.spaces';
    EXECUTE 'CREATE POLICY "admin read spaces" ON public.spaces FOR SELECT TO authenticated USING (public.admin_can(''spaces.view''))';

    EXECUTE 'DROP POLICY IF EXISTS "admin insert spaces" ON public.spaces';
    EXECUTE 'CREATE POLICY "admin insert spaces" ON public.spaces FOR INSERT TO authenticated WITH CHECK (public.admin_can(''spaces.create''))';

    EXECUTE 'DROP POLICY IF EXISTS "admin update spaces" ON public.spaces';
    EXECUTE 'CREATE POLICY "admin update spaces" ON public.spaces FOR UPDATE TO authenticated USING (public.admin_can(''spaces.edit'')) WITH CHECK (public.admin_can(''spaces.edit''))';

    EXECUTE 'DROP POLICY IF EXISTS "admin delete spaces" ON public.spaces';
    EXECUTE 'CREATE POLICY "admin delete spaces" ON public.spaces FOR DELETE TO authenticated USING (public.admin_can(''spaces.delete''))';
  END IF;
END;
$$;


-- ---------------------------------------------------------------------------
-- 9. admin_users policies
--    Every signed-in admin must read their OWN row — that is how the app
--    discovers its permissions. Managing OTHER users needs users.* perms.
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS "read own admin profile" ON admin_users;
CREATE POLICY "read own admin profile" ON admin_users
  FOR SELECT TO authenticated
  USING (auth_user_id = auth.uid());

DROP POLICY IF EXISTS "admin read users" ON admin_users;
CREATE POLICY "admin read users" ON admin_users
  FOR SELECT TO authenticated USING (public.admin_can('users.view'));

DROP POLICY IF EXISTS "admin insert users" ON admin_users;
CREATE POLICY "admin insert users" ON admin_users
  FOR INSERT TO authenticated WITH CHECK (public.admin_can('users.create'));

DROP POLICY IF EXISTS "admin update users" ON admin_users;
CREATE POLICY "admin update users" ON admin_users
  FOR UPDATE TO authenticated
  USING (public.admin_can('users.edit'))
  WITH CHECK (public.admin_can('users.edit'));

DROP POLICY IF EXISTS "admin delete users" ON admin_users;
CREATE POLICY "admin delete users" ON admin_users
  FOR DELETE TO authenticated USING (public.admin_can('users.delete'));


-- ---------------------------------------------------------------------------
-- 10. admin_settings — readable by any admin, writable with settings.edit
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS "admin read settings" ON admin_settings;
CREATE POLICY "admin read settings" ON admin_settings
  FOR SELECT TO authenticated USING (public.is_admin_user());

DROP POLICY IF EXISTS "admin update settings" ON admin_settings;
CREATE POLICY "admin update settings" ON admin_settings
  FOR UPDATE TO authenticated
  USING (public.admin_can('settings.edit'))
  WITH CHECK (public.admin_can('settings.edit'));

DROP POLICY IF EXISTS "admin insert settings" ON admin_settings;
CREATE POLICY "admin insert settings" ON admin_settings
  FOR INSERT TO authenticated WITH CHECK (public.admin_can('settings.edit'));


-- ---------------------------------------------------------------------------
-- 11. admin_audit_log — any admin may append; reading needs settings.view
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS "admin append audit" ON admin_audit_log;
CREATE POLICY "admin append audit" ON admin_audit_log
  FOR INSERT TO authenticated WITH CHECK (public.is_admin_user());

DROP POLICY IF EXISTS "admin read audit" ON admin_audit_log;
CREATE POLICY "admin read audit" ON admin_audit_log
  FOR SELECT TO authenticated USING (public.admin_can('settings.view'));


-- ---------------------------------------------------------------------------
-- 12. Remove the old custom password-reset machinery
--     Supabase Auth sends real reset emails now, so the manual token flow is
--     gone — and every unused SECURITY DEFINER function is attack surface.
--     These statements clean up after an earlier run of admin_rbac_migration.
-- ---------------------------------------------------------------------------

DROP FUNCTION IF EXISTS public.redeem_admin_reset_token(text, text, text);
DROP FUNCTION IF EXISTS public.check_admin_reset_token(text);
DROP TABLE    IF EXISTS public.password_reset_requests;

DROP INDEX IF EXISTS admin_users_reset_token_idx;
ALTER TABLE admin_users DROP COLUMN IF EXISTS reset_token;
ALTER TABLE admin_users DROP COLUMN IF EXISTS reset_expires_at;

-- Legacy service_role policies are pointless now (legacy keys are disabled and
-- the service role bypasses RLS anyway).
DROP POLICY IF EXISTS "Service role full access" ON admin_users;
DROP POLICY IF EXISTS "Service role full access" ON admin_settings;
DROP POLICY IF EXISTS "Service role full access" ON admin_audit_log;


-- ---------------------------------------------------------------------------
-- 13. Verify
-- ---------------------------------------------------------------------------

-- Both functions must exist:
SELECT routine_name
  FROM information_schema.routines
 WHERE routine_schema = 'public'
   AND routine_name IN ('admin_can', 'is_admin_user')
 ORDER BY routine_name;

-- Who can log in? can_log_in stays false until you create the matching user
-- in Authentication → Users (with the SAME email).
SELECT username, email, role, is_active,
       (auth_user_id IS NOT NULL) AS can_log_in,
       permissions
  FROM admin_users
 ORDER BY created_at;
