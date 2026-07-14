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
-- 5. QUESTIONNAIRES  (assignments + synchronized responses)
--    The questionnaire CONTENT lives in js/questionnaires.js.
--    Here we only store WHICH forms are assigned to a client and
--    the client's saved ANSWERS (autosaved per-answer = "synced").
-- ============================================================

-- 5a. Which questionnaires a coach has assigned to a client.
create table if not exists public.form_assignments (
  id           uuid primary key default gen_random_uuid(),
  client_id    uuid not null references auth.users(id) on delete cascade,
  form_key     text not null,                 -- matches a key in questionnaires.js
  assigned_by  uuid references auth.users(id) on delete set null,
  assigned_at  timestamptz not null default now(),
  due_at       timestamptz,
  note         text,                          -- optional coach note shown to client
  unique (client_id, form_key)
);

alter table public.form_assignments enable row level security;

drop policy if exists "client reads own form assignments" on public.form_assignments;
drop policy if exists "admin manages form assignments"     on public.form_assignments;

create policy "client reads own form assignments"
  on public.form_assignments for select
  using (client_id = auth.uid());

create policy "admin manages form assignments"
  on public.form_assignments for all
  using (public.is_admin())
  with check (public.is_admin());

-- 5b. A client's saved answers for one form (one row per client+form).
--     `answers` is a jsonb map { question_id: value }. Autosaved as
--     the client works, so they can resume on any device.
create table if not exists public.form_responses (
  id            uuid primary key default gen_random_uuid(),
  client_id     uuid not null references auth.users(id) on delete cascade,
  form_key      text not null,
  answers       jsonb not null default '{}'::jsonb,
  status        text not null default 'in_progress'
                  check (status in ('in_progress','completed')),
  completed_at  timestamptz,
  updated_at    timestamptz not null default now(),
  unique (client_id, form_key)
);

alter table public.form_responses enable row level security;

drop policy if exists "client manages own responses" on public.form_responses;
drop policy if exists "admin reads all responses"     on public.form_responses;

-- Client: full control over their OWN responses (insert / update / read).
create policy "client manages own responses"
  on public.form_responses for all
  using (client_id = auth.uid())
  with check (client_id = auth.uid());

-- Admin/coach: read every client's responses.
create policy "admin reads all responses"
  on public.form_responses for select
  using (public.is_admin());

-- ============================================================
-- 6. SESSIONS  (paper-tracked in-person workouts, logged by coach)
--    The coach logs a session they did WITH the client; the client
--    sees it on their dashboard and can rate / comment on it.
-- ============================================================
create table if not exists public.sessions (
  id            uuid primary key default gen_random_uuid(),
  client_id     uuid not null references auth.users(id) on delete cascade,
  coach_id      uuid references auth.users(id) on delete set null,
  session_date  date not null default current_date,
  title         text not null,
  focus         text,                    -- e.g. "Lower body + conditioning"
  body          jsonb,                   -- { exercises: [ { name, sets, reps, load, notes } ] }
  coach_notes   text,                    -- what the coach wants the client to see
  created_at    timestamptz not null default now()
);

create index if not exists sessions_client_date_idx
  on public.sessions (client_id, session_date desc);

alter table public.sessions enable row level security;

drop policy if exists "client reads own sessions" on public.sessions;
drop policy if exists "admin manages sessions"     on public.sessions;

create policy "client reads own sessions"
  on public.sessions for select
  using (client_id = auth.uid());

create policy "admin manages sessions"
  on public.sessions for all
  using (public.is_admin())
  with check (public.is_admin());

-- 6b. The client's rating + comment on a logged session.
create table if not exists public.session_feedback (
  id            uuid primary key default gen_random_uuid(),
  session_id    uuid not null references public.sessions(id) on delete cascade,
  client_id     uuid not null references auth.users(id) on delete cascade,
  rating        int check (rating between 1 and 5),
  comment       text check (char_length(comment) <= 2000),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (session_id, client_id)
);

alter table public.session_feedback enable row level security;

drop policy if exists "client manages own session feedback" on public.session_feedback;
drop policy if exists "admin reads session feedback"         on public.session_feedback;

-- Client: rate / comment only on THEIR OWN sessions.
create policy "client manages own session feedback"
  on public.session_feedback for all
  using (client_id = auth.uid())
  with check (
    client_id = auth.uid()
    and exists (
      select 1 from public.sessions s
      where s.id = session_feedback.session_id
        and s.client_id = auth.uid()
    )
  );

create policy "admin reads session feedback"
  on public.session_feedback for select
  using (public.is_admin());

-- ============================================================
-- 7. FEEDBACK  (the "Give feedback" button — client → coach)
-- ============================================================
create table if not exists public.feedback (
  id           uuid primary key default gen_random_uuid(),
  client_id    uuid not null references auth.users(id) on delete cascade,
  category     text not null default 'general'
                 check (category in ('general','portal','workouts','nutrition','coaching','bug','idea')),
  rating       int check (rating between 1 and 5),
  body         text not null check (char_length(body) between 1 and 4000),
  read_at      timestamptz,
  created_at   timestamptz not null default now()
);

create index if not exists feedback_created_idx on public.feedback (created_at desc);

alter table public.feedback enable row level security;

drop policy if exists "client writes own feedback" on public.feedback;
drop policy if exists "client reads own feedback"   on public.feedback;
drop policy if exists "admin manages feedback"      on public.feedback;

create policy "client writes own feedback"
  on public.feedback for insert
  with check (client_id = auth.uid());

create policy "client reads own feedback"
  on public.feedback for select
  using (client_id = auth.uid());

create policy "admin manages feedback"
  on public.feedback for all
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- 8. MAKE YOURSELF AN ADMIN
--    Sign up through the website FIRST (so your auth user exists),
--    then run the line below with your email.
-- ============================================================
-- update public.profiles set role = 'admin'
--   where email = 'zeustrength@gmail.com';
