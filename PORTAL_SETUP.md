# Client Portal — Setup (≈15 minutes, one time)

The portal is fully built. It just needs to be connected to a free Supabase
backend, which handles secure logins, the database, and PDF storage. Do these
steps once and the **Client Login** link on the site goes live.

> **Why Supabase?** GitHub Pages is a static host — it can't log people in or
> store files securely. Supabase provides real authentication, a Postgres
> database, and file storage that the static site talks to from the browser.
> Your data is protected by database **Row-Level Security**, so one client can
> never see another client's materials.

---

## 1. Create a Supabase project

1. Go to <https://supabase.com> → **Start your project** → sign in with GitHub.
2. **New project**. Pick a name (e.g. `ohs-portal`), set a database password
   (save it somewhere), choose the region closest to you. Click **Create**.
3. Wait ~2 minutes for it to provision.

## 2. Create the database tables

1. In the project, open **SQL Editor** (left sidebar) → **New query**.
2. Open [`supabase/setup.sql`](supabase/setup.sql) from this repo, copy the
   **entire** file, paste it into the editor, and click **Run**.
3. You should see "Success. No rows returned." That created the `profiles`,
   `materials`, `assignments`, and `messages` tables, the security policies, and
   the private `materials` storage bucket.

   > **Already ran an older version?** Just paste and **Run** the whole file
   > again — every statement is idempotent, so it only adds the new `messages`
   > table (which powers the client ↔ coach Q&A) and leaves your data untouched.

## 3. Plug your keys into the site

1. In Supabase: **Project Settings** (gear icon) → **API**.
2. Copy two values:
   - **Project URL** (e.g. `https://abcd1234.supabase.co`)
   - **anon / public** key (a long string under "Project API keys")
3. Open [`js/portal-config.js`](js/portal-config.js) and paste them in:

   ```js
   window.OHS_PORTAL = {
     SUPABASE_URL:      "https://abcd1234.supabase.co",
     SUPABASE_ANON_KEY: "eyJhbGciOi...your-anon-key..."
   };
   ```

   > The anon key is **meant** to be public — it's safe in client code. Never
   > paste the `service_role` key here.

4. Commit & push (or just re-upload) so GitHub Pages picks up the change.

## 4. Make yourself the admin

1. Visit `https://olympiansolutions.org/login.html` → **Create account** →
   sign up with **zeustrength@gmail.com** and a password.
   - If you get "check your email to confirm," open the email and confirm.
     (To skip email confirmation entirely: Supabase → **Authentication** →
     **Providers** → **Email** → turn **Confirm email** off.)
2. Back in Supabase → **SQL Editor**, run:

   ```sql
   update public.profiles set role = 'admin'
     where email = 'zeustrength@gmail.com';
   ```

3. Sign in again. You'll now see an **Admin** link in the portal nav, and
   `admin.html` will let you create and assign materials.

## 5. Allow your domain (avoids redirect warnings)

Supabase → **Authentication** → **URL Configuration**:
- **Site URL**: `https://olympiansolutions.org`
- **Redirect URLs**: add `https://olympiansolutions.org/login.html`

---

## How it works day to day

- **Clients** sign up at `/login.html`, then see only what you assign at
  `/dashboard.html`.
- **You** go to `/admin.html` to:
  - **Create a material** — a note, a structured workout (exercise/sets/reps
    table), or a PDF upload.
  - **Assign** any material to any client. They see it instantly on next load.
  - **Delete** materials (also un-assigns them).
  - **Answer questions** — the **Client questions** inbox shows every thread;
    open one to read what a client asked about their workouts and reply. They
    see your answer under **Ask Coach** on their dashboard, with an unread badge.

## Files in this feature

| File | Purpose |
|------|---------|
| `login.html` | Sign in / create account |
| `dashboard.html` | Client view of assigned materials |
| `admin.html` | Your coach console (gated to admin) |
| `js/portal.js` | Shared Supabase client + auth guards |
| `js/portal-config.js` | **Your keys go here** |
| `css/portal.css` | Portal styling (reuses site theme) |
| `supabase/setup.sql` | Database schema + security policies |

## Security notes

- All access rules are enforced in Postgres (Row-Level Security), not in
  JavaScript — tampering with the page can't expose other clients' data.
- PDFs live in a **private** bucket; clients get a temporary signed link only
  for files assigned to them.
- A new signup is always a `client`; admin must be granted by the SQL in step 4,
  so nobody can self-promote.

## Cost

Supabase's free tier (50,000 monthly active users, 500 MB database, 1 GB file
storage) is far more than this portal will use. No card required to start.
