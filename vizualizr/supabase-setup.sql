-- Run this once in your Supabase project's SQL Editor.
-- (Dashboard → SQL Editor → New query → paste this → Run)

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  format text not null check (format in ('interior', 'exterior', 'combined')),
  title text not null default 'Untitled project',
  client_line text,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Keep updated_at current on every edit.
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists projects_set_updated_at on projects;
create trigger projects_set_updated_at
  before update on projects
  for each row
  execute function set_updated_at();

-- Row Level Security: the anon key is public (it ships in your frontend JS),
-- so policies — not the password gate — are what actually control access
-- to the database itself. The password gate only hides the UI; it does not
-- and cannot protect direct API calls. These policies are deliberately open
-- because there is no real user-auth layer in this app: anyone with the
-- anon key (i.e. anyone who can view your site's JS) can read or write
-- any project. This is acceptable only because every project here is
-- intended to be shareable with clients eventually. Do not put anything
-- truly sensitive in this table without adding Supabase Auth and tightening
-- these policies to check auth.uid().
alter table projects enable row level security;

create policy "Public read access"
  on projects for select
  using (true);

create policy "Public write access"
  on projects for insert
  with check (true);

create policy "Public update access"
  on projects for update
  using (true);

create policy "Public delete access"
  on projects for delete
  using (true);

-- ─────────────────────────────────────────────────────────────────────────
-- OPTIONAL, RECOMMENDED HARDENING (do this once you're comfortable):
-- Restrict writes to a Supabase Auth session, so only a logged-in editor
-- can create/edit/delete, while reads (for client links) stay public.
-- This requires switching the password gate over to real Supabase Auth
-- (email/password sign-in) instead of the simple client-side check.
-- If/when you want this, the policies would instead look like:
--
-- drop policy "Public write access" on projects;
-- drop policy "Public update access" on projects;
-- drop policy "Public delete access" on projects;
--
-- create policy "Authenticated write access"
--   on projects for insert
--   with check (auth.uid() is not null);
--
-- create policy "Authenticated update access"
--   on projects for update
--   using (auth.uid() is not null);
--
-- create policy "Authenticated delete access"
--   on projects for delete
--   using (auth.uid() is not null);
-- ─────────────────────────────────────────────────────────────────────────
