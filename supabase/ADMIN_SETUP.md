# Admin Panel Setup

The admin panel uses **Supabase Auth** for sign-in and **RLS policies** for
permissions. Nothing privileged is held in the browser — a signed-in admin's JWT
is the only credential, and the database decides what they may read or write.

Follow these steps once, in order.

---

## 1. Run the two migrations

Supabase Dashboard → **SQL Editor** → paste the file contents (not the filename)
→ **Run**.

| Order | File | What it does |
| --- | --- | --- |
| 1st | `supabase/admin_rbac_migration.sql` | Adds roles, permissions, settings and the audit log |
| 2nd | `supabase/admin_auth_migration.sql` | Wires `admin_users` to Supabase Auth and installs every RLS policy |

Both are safe to re-run.

Check it worked:

```sql
select routine_name
  from information_schema.routines
 where routine_name in ('admin_can', 'is_admin_user');
```

You should get two rows.

---

## 2. Configure Auth

### a. Allow the reset link to come back to the site

**Authentication → URL Configuration**

- **Site URL:** `https://www.easemyoffice.in`
- **Redirect URLs** — add both:
  - `https://www.easemyoffice.in/admin/reset-password`
  - `http://localhost:5173/admin/reset-password` *(only if you run the site locally)*

Without this, password-reset emails will refuse to redirect back.

### b. Turn off email confirmation (recommended for an internal panel)

**Authentication → Sign In / Providers → Email**

- **Confirm email:** OFF

With it on, every new admin has to click a confirmation link before their first
sign-in. For a small internal team that is just friction — you are creating the
accounts yourself.

> Leaving **Enable email provider** ON is required. Signups being enabled is what
> lets the panel create new admin accounts for you.

---

## 3. Create your own login

Your existing profile row has no Supabase Auth account yet, so it cannot sign in.

**Authentication → Users → Add user → Create new user**

- **Email:** `admin@easemyoffice.in`
- **Password:** pick a strong one
- **Auto Confirm User:** ✅ tick this

> The migration backfilled emails as `username@easemyoffice.in`. Run
> `select username, email from admin_users;` to see the exact address to use —
> the email must match **exactly** or the accounts won't link.

A database trigger links the new Auth user to your `admin_users` profile
automatically. Verify:

```sql
select username, email, role, is_active,
       (auth_user_id is not null) as can_log_in
  from admin_users;
```

`can_log_in` must be `true`.

---

## 4. Sign in

<https://www.easemyoffice.in/admin>

Use the **email** and password from step 3. There is no service-key prompt any
more.

---

## Adding more people

Once you're in, do it all from the panel: **Users & Access → + New User**.

Enter their email, pick a role, fine-tune the permission checkboxes, set an
initial password, and save. The panel creates the Auth account and the profile
together, and the trigger links them.

| Role | Can do |
| --- | --- |
| **Administrator** | Everything, including users and settings |
| **Manager** | All content and leads; not users or settings |
| **Editor** | Create and edit content; no deletes, no leads |
| **Viewer** | Read-only |

Role presets are only a starting point — tick individual permissions to make any
combination you like (e.g. "leads: view only, nothing else").

---

## Forgotten passwords

- **The user:** clicks *Forgot your password?* on the login page and gets a reset
  email from Supabase.
- **You:** open **Users & Access** and hit **Email reset** next to their name.

Links expire after an hour and work once.

---

## Troubleshooting

| Symptom | Cause & fix |
| --- | --- |
| *"That account is not set up for admin access"* | The Auth user exists but has no matching `admin_users` row, or `is_active = false`. Check the emails match exactly. |
| **"No login"** badge in the users list | No Auth account for that email yet — create it in **Authentication → Users**. |
| *"Email not confirmed"* | Either confirm the user in **Authentication → Users**, or turn off **Confirm email** (step 2b). |
| Reset email never arrives | Check spam. Supabase's built-in SMTP is rate-limited to a few emails per hour — for regular use add your own SMTP under **Project Settings → Auth → SMTP**. |
| Reset link opens but says invalid | The redirect URL from step 2a is missing, or the link was already used. |
| Panel loads but every list is empty | The migrations haven't been run, so no policy grants you access. Re-check step 1. |
| Locked out entirely | Set your role back with SQL: `update admin_users set role='admin', permissions='["*"]'::jsonb, is_active=true where email='you@…';` |

---

## Why it's built this way

Supabase blocks `sb_secret_…` keys in browsers (*"Forbidden use of secret API key
in browser"*), which is what broke the previous design. That design was also
unsafe: the browser held a `service_role` key with unrestricted database access,
so the permission checks in the UI were decoration — anyone who could open
devtools could bypass them.

Now every query runs as the signed-in user and each table has policies calling
`admin_can('section.action')`. A user with `blog.view` genuinely cannot delete a
blog post, because Postgres refuses the statement. Hiding the button is just a
courtesy on top.
