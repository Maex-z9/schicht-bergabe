-- 0001_initial.sql
-- ----------------------------------------------------------------------
-- Initial schema for Certificate Tracker.
-- Run via Supabase Studio → SQL Editor, or `supabase db push` if you
-- use the Supabase CLI locally.
--
-- Conventions:
--   - Every row carries organization_id so RLS can scope by tenant.
--   - profiles.id == auth.users.id so the Supabase Auth user is the
--     foreign key.
--   - reminder_log is append-only, no updates expected.
-- ----------------------------------------------------------------------

create extension if not exists "pgcrypto";

create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  organization_id uuid not null references organizations(id) on delete cascade,
  email text not null,
  role text not null default 'admin' check (role in ('admin', 'member')),
  created_at timestamptz not null default now()
);

create index if not exists profiles_organization_idx on profiles(organization_id);

create table if not exists employees (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  employee_number text,
  email text,
  department text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists employees_organization_idx on employees(organization_id);

create table if not exists certificates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  employee_id uuid not null references employees(id) on delete cascade,
  cert_type text not null,
  cert_name text not null,
  issued_on date,
  expires_on date not null,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists certificates_organization_idx on certificates(organization_id);
create index if not exists certificates_employee_idx on certificates(employee_id);
create index if not exists certificates_expires_idx on certificates(expires_on);

create table if not exists reminder_log (
  id uuid primary key default gen_random_uuid(),
  certificate_id uuid not null references certificates(id) on delete cascade,
  reminder_days smallint not null check (reminder_days in (90, 60, 30, 14, 7)),
  sent_at timestamptz not null default now(),
  recipient_email text not null,
  status text not null default 'sent' check (status in ('sent', 'failed'))
);

create unique index if not exists reminder_log_unique
  on reminder_log(certificate_id, reminder_days, recipient_email);

-- ----------------------------------------------------------------------
-- Row Level Security: every authenticated user only sees rows where
-- organization_id matches their profile.
-- ----------------------------------------------------------------------

alter table organizations enable row level security;
alter table profiles enable row level security;
alter table employees enable row level security;
alter table certificates enable row level security;
alter table reminder_log enable row level security;

-- Helper: return current user's organization_id
create or replace function current_org() returns uuid
  language sql stable
  security definer
  set search_path = public
as $$
  select organization_id from profiles where id = auth.uid()
$$;

-- organizations: read your own row
drop policy if exists org_read on organizations;
create policy org_read on organizations for select
  using (id = current_org());

-- profiles: read your org's profiles, only update yourself
drop policy if exists profile_read on profiles;
create policy profile_read on profiles for select
  using (organization_id = current_org());

drop policy if exists profile_update_self on profiles;
create policy profile_update_self on profiles for update
  using (id = auth.uid());

-- employees: full CRUD within your org
drop policy if exists employee_all on employees;
create policy employee_all on employees for all
  using (organization_id = current_org())
  with check (organization_id = current_org());

-- certificates: full CRUD within your org
drop policy if exists certificate_all on certificates;
create policy certificate_all on certificates for all
  using (organization_id = current_org())
  with check (organization_id = current_org());

-- reminder_log: read your org's reminders (joined via certificate)
drop policy if exists reminder_read on reminder_log;
create policy reminder_read on reminder_log for select
  using (
    exists (
      select 1 from certificates
      where certificates.id = reminder_log.certificate_id
        and certificates.organization_id = current_org()
    )
  );
