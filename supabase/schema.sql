-- ============================================================
--  EaseMyOffice — Supabase schema
--  Run this in your Supabase project: SQL Editor → New query → paste → Run
-- ============================================================

-- ---------- LEADS / ENQUIRIES ----------
create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  phone       text not null,
  email       text,
  interest    text,           -- service / plan they're interested in
  city        text,
  message     text,
  source      text default 'website',   -- lead-modal | contact-page | ...
  page        text,           -- which page it was submitted from
  status      text default 'new'        -- new | contacted | won | lost
);

alter table public.leads enable row level security;

-- Website visitors (anon key) may ONLY insert a lead.
drop policy if exists "anon can insert leads" on public.leads;
create policy "anon can insert leads"
  on public.leads for insert
  to anon
  with check (true);

-- NOTE: no SELECT/UPDATE/DELETE policy for anon → nobody can read your leads
-- publicly. You read/manage them in the Supabase dashboard (Table editor),
-- or later from an authenticated admin panel.

create index if not exists leads_created_at_idx on public.leads (created_at desc);


-- ---------- (OPTIONAL) BOOKINGS ----------
-- For when you wire instant bookings to store an order before payment.
create table if not exists public.bookings (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  phone       text not null,
  email       text,
  city        text,
  space       text,           -- space / locality name
  plan        text,           -- GST / Company Reg / Mailing / Day Pass ...
  amount      integer,        -- in INR
  status      text default 'initiated', -- initiated | paid | cancelled
  page        text
);

alter table public.bookings enable row level security;

drop policy if exists "anon can insert bookings" on public.bookings;
create policy "anon can insert bookings"
  on public.bookings for insert
  to anon
  with check (true);

create index if not exists bookings_created_at_idx on public.bookings (created_at desc);
