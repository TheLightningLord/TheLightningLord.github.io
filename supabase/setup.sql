-- ============================================================
-- OLYMPIAN HEALTH SOLUTIONS — Client Portal database setup
-- Run this ONCE in your Supabase project:
--   Dashboard → SQL Editor → New query → paste all → Run.
--
-- Safe to re-run: every statement is idempotent.
-- ============================================================

-- ---------- Extensions ----------
create extension if not exists "pgcrypto";   -- for gen_random_uuid()

-- ============================================================
-- 1. PROFILES  (one row per auth user)
-- ============================================================
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text,
  full_name   text,
  role        text not null default 'client'
                check (role in ('client','admin')),
  created_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Helper: is the CURRENT user an admin?
-- SECURITY DEFINER so it can read profiles without tripping RLS recursion.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Auto-create a profile row whenever someone signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Profiles policies
drop policy if exists "own profile read"   on public.profiles;
drop policy if exists "own profile update" on public.profiles;
drop policy if exists "admin reads all profiles" on public.profiles;

create policy "own profile read"
  on public.profiles for select
  using (id = auth.uid());

create policy "own profile update"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid() and role = 'client');  -- clients can't self-promote

create policy "admin reads all profiles"
  on public.profiles for select
  using (public.is_admin());

create policy "admin updates profiles"
  on public.profiles for update
  using (public.is_admin());

-- ============================================================
-- 2. MATERIALS  (a PDF, a structured workout, or a note)
-- ============================================================
create table if not exists public.materials (
  id          uuid primary key default gen_random_uuid(),
  type        text not null check (type in ('pdf','workout','note')),
  title       text not null,
  body        jsonb,            -- workout structure, or { "text": "..." } for notes
  file_path   text,             -- storage object path for PDFs
  created_by  uuid references auth.users(id) on delete set null,
  created_at  timestamptz not null default now()
);

alter table public.materials enable row level security;

drop policy if exists "admin manages materials" on public.materials;
drop policy if exists "client reads assigned materials" on public.materials;

-- Admin: full control.
create policy "admin manages materials"
  on public.materials for all
  using (public.is_admin())
  with check (public.is_admin());

-- (The client read-policy for materials is defined in section 3 below,
--  after the assignments table exists.)

-- ============================================================
-- 3. ASSIGNMENTS  (links a material to a client)
-- ============================================================
create table if not exists public.assignments (
  id           uuid primary key default gen_random_uuid(),
  material_id  uuid not null references public.materials(id) on delete cascade,
  client_id    uuid not null references auth.users(id) on delete cascade,
  assigned_by  uuid references auth.users(id) on delete set null,
  assigned_at  timestamptz not null default now(),
  unique (material_id, client_id)
);

alter table public.assignments enable row level security;

drop policy if exists "admin manages assignments" on public.assignments;
drop policy if exists "client reads own assignments" on public.assignments;

create policy "admin manages assignments"
  on public.assignments for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "client reads own assignments"
  on public.assignments for select
  using (client_id = auth.uid());

-- Now that assignments exists, add the materials client-read policy.
drop policy if exists "client reads assigned materials" on public.materials;
create policy "client reads assigned materials"
  on public.materials for select
  using (
    exists (
      select 1 from public.assignments a
      where a.material_id = materials.id
        and a.client_id = auth.uid()
    )
  );

-- ============================================================
-- 3b. MESSAGES  (client ↔ coach Q&A thread)
--     One row per message. `client_id` is always the CLIENT the
--     thread belongs to; `sender_id` is whoever wrote the line
--     (the client themselves, or the admin/coach replying).
--     `material_id` optionally ties a question to a workout.
-- ============================================================
create table if not exists public.messages (
  id           uuid primary key default gen_random_uuid(),
  client_id    uuid not null references auth.users(id) on delete cascade,
  sender_id    uuid not null references auth.users(id) on delete cascade,
  material_id  uuid references public.materials(id) on delete set null,
  body         text not null check (char_length(body) between 1 and 4000),
  read_at      timestamptz,                       -- set when the other party has seen it
  created_at   timestamptz not null default now()
);

create index if not exists messages_client_created_idx
  on public.messages (client_id, created_at);

alter table public.messages enable row level security;

drop policy if exists "client reads own thread"    on public.messages;
drop policy if exists "client writes own thread"    on public.messages;
drop policy if exists "client marks own thread read" on public.messages;
drop policy if exists "admin manages messages"      on public.messages;

-- Client: can read every message in THEIR thread…
create policy "client reads own thread"
  on public.messages for select
  using (client_id = auth.uid());

-- …and can post, but only into their own thread, as themselves.
create policy "client writes own thread"
  on public.messages for insert
  with check (client_id = auth.uid() and sender_id = auth.uid());

-- Client: may mark coach replies in their thread as read.
create policy "client marks own thread read"
  on public.messages for update
  using (client_id = auth.uid())
  with check (client_id = auth.uid());

-- Admin/coach: full control over every thread.
create policy "admin manages messages"
  on public.messages for all
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- 4. STORAGE  (private bucket for PDF materials)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('materials', 'materials', false)
on conflict (id) do nothing;

drop policy if exists "admin manages material files"  on storage.objects;
drop policy if exists "client reads assigned files"   on storage.objects;

-- Admin: upload / overwrite / delete files in the bucket.
create policy "admin manages material files"
  on storage.objects for all
  using (bucket_id = 'materials' and public.is_admin())
  with check (bucket_id = 'materials' and public.is_admin());

-- Client: download a file only if a material pointing at it is assigned to them.
create policy "client reads assigned files"
  on storage.objects for select
  using (
    bucket_id = 'materials'
    and exists (
      select 1
      from public.materials m
      join public.assignments a on a.material_id = m.id
      where m.file_path = storage.objects.name
        and a.client_id = auth.uid()
    )
  );

-- ============================================================
-- 5. MAKE YOURSELF AN ADMIN
--    Sign up through the website FIRST (so your auth user exists),
--    then run the line below with your email.
-- ============================================================
-- update public.profiles set role = 'admin'
--   where email = 'zeustrength@gmail.com';
