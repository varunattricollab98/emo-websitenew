-- Admin Users table for role-based access control
-- Run this in the Supabase Dashboard SQL Editor

CREATE TABLE IF NOT EXISTS admin_users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  username text UNIQUE NOT NULL,
  password text NOT NULL,
  name text,
  role text DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Only service_role can access (no public read)
CREATE POLICY "Service role full access" ON admin_users
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Insert default admin user
INSERT INTO admin_users (username, password, name, role, is_active)
VALUES ('admin', 'emo@2026', 'Administrator', 'admin', true)
ON CONFLICT (username) DO NOTHING;
