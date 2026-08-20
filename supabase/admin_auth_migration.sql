-- ============================================================================
-- Admin panel → Supabase Auth + RLS
--
-- WHY: Supabase now blocks `sb_secret_…` keys from browsers ("Forbidden use of
-- secret API key in browser"), so the old design — an elevated key held in
-- sessionStorage — cannot work any more. Admins now sign in as real Supabase
-- Auth users and every permission is enforced by the DATABASE via RLS, not by
-- client-side JavaScript.
--
-- Run AFTER admin_rbac_migration.sql. Safe to re-run.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Link admin_users to auth.users
--    admin_users becomes a *profile* table: it holds the role + permissions,
--    while Supabase Auth owns the email, password and session.
-- ---------------------------------------------------------------------------

ALTER TABLE admin_users
  ADD COLUMN IF NOT EXISTS auth_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE UNIQUE INDEX IF NOT EXISTS admin_users_auth_user_id_key
  ON admin_users (auth_user_id) WHERE auth_user_id IS NOT NULL;

-- Supabase Auth owns passwords now, so our own password columns are dead.
-- Keep them (nullable) so nothing breaks mid-migration, but blank the values
-- so no stale hashes linger in the table.
ALTER TABLE admin_users ALTER COLUMN password DROP NOT NULL;
UPDATE admin_users SET password = NULL, password_salt = NULL
 WHERE password IS NOT NULL OR password_salt IS NOT NULL;

-- Email is now the login identifier, so it must be present.
-- Backfill anything missing from the username so no row is left unusable.
UPDATE admin_users
   SET email = lower(username) || '@easemyoffice.in'
 WHERE email IS NULL OR btrim(email) = '';

-- ---------------------------------------------------------------------------
-- 2. Auto-link auth users to their profile by email
--    So creating a user in Authentication → Users is enough; no manual
--    id-copying. Fires on signup and on email change.
-- ---------------------------------------------------------------------------

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

-- Link any auth users that already exist
UPDATE admin_users a
   SET auth_user_id = u.id
  FROM auth.users u
 WHERE lower(a.email) = lower(u.email)
   AND a.auth_user_id IS NULL;

-- ---------------------------------------------------------------------------
-- 3. The permission check — the heart of the whole system
--
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

  -- full access
  IF v_perms ? '*' THEN
    RETURN true;
  END IF;
  -- exact permission
  IF v_perms ? p_permission THEN
    RETURN true;
  END IF;
  -- section wildcard, e.g. "blog.*"
  RETURN v_perms ? (split_part(p_permission, '.', 1) || '.*');
END;
$$;

-- Convenience: is the caller an active admin at all?
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

REVOKE ALL ON FUNCTION public.admin_can(text) FROM public;
REVOKE ALL ON FUNCTION public.is_admin_user() FROM public;
GRANT EXECUTE ON FUNCTION public.admin_can(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin_user() TO authenticated;

-- ---------------------------------------------------------------------------
-- 4. Content tables — one set of CRUD policies per section
--    Generated in a loop so the mapping stays obvious and consistent.
--    Existing "public can read active …" anon policies are left untouched;
--    RLS policies are OR'd, so the public site keeps working exactly as before.
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
-- 5. Leads — anon may INSERT (contact forms); admins read/update/delete
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

-- spaces (public virtual-office listings) — let admins read everything
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
     WHERE table_schema = 'public' AND table_name = 'spaces'
  ) THEN
    EXECUTE 'DROP POLICY IF EXISTS "admin read spaces" ON public.spaces';
    EXECUTE 'CREATE POLICY "admin read spaces" ON public.spaces FOR SELECT TO authenticated USING (public.is_admin_user())';
  END IF;
END;
$$;

-- ---------------------------------------------------------------------------
-- 6. admin_users — every signed-in admin must be able to read their OWN row
--    (that is how the app discovers its permissions). Managing OTHER users
--    requires the users.* permissions.
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
-- 7. admin_settings — readable by any admin, writable with settings.edit
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
-- 8. admin_audit_log — any admin may append; reading needs settings.view
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS "admin append audit" ON admin_audit_log;
CREATE POLICY "admin append audit" ON admin_audit_log
  FOR INSERT TO authenticated WITH CHECK (public.is_admin_user());

DROP POLICY IF EXISTS "admin read audit" ON admin_audit_log;
CREATE POLICY "admin read audit" ON admin_audit_log
  FOR SELECT TO authenticated USING (public.admin_can('settings.view'));

-- ---------------------------------------------------------------------------
-- 9. Drop the custom password-reset machinery
--    Supabase Auth sends real reset emails now, so the manual token flow and
--    its SECURITY DEFINER functions are no longer needed (and every unused
--    SECURITY DEFINER function is attack surface).
-- ---------------------------------------------------------------------------

DROP FUNCTION IF EXISTS public.redeem_admin_reset_token(text, text, text);
DROP FUNCTION IF EXISTS public.check_admin_reset_token(text);
DROP TABLE IF EXISTS public.password_reset_requests;

ALTER TABLE admin_users DROP COLUMN IF EXISTS reset_token;
ALTER TABLE admin_users DROP COLUMN IF EXISTS reset_expires_at;

-- ---------------------------------------------------------------------------
-- 10. Verify — run this after the migration to see who can log in
-- ---------------------------------------------------------------------------

-- SELECT a.username, a.email, a.role, a.is_active,
--        (a.auth_user_id IS NOT NULL) AS can_log_in,
--        a.permissions
--   FROM admin_users a
--  ORDER BY a.created_at;
