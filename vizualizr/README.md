# Visualization Project Portal

A small internal tool for organizing client presentation decks for
architectural visualization projects — interior, exterior, or full-project
formats — with shareable, read-only client links.

## What this is

- **`/`** — your project dashboard (password-protected). Create, edit, delete
  projects, copy client links.
- **`/edit/:id`** — the sheet-by-sheet editor for one project (password-protected).
- **`/p/:slug`** — the public, read-only view a client opens. No login needed.

Images are added by pasting a URL to an image hosted elsewhere (your own
site, a public Google Drive link, Imgur, etc.) — there's no file upload,
since this app only stores text/JSON.

---

## 1. Set up Supabase (the database)

1. Go to [supabase.com](https://supabase.com) and create a free account / project.
2. Once your project is created, go to **SQL Editor** in the left sidebar.
3. Open `supabase-setup.sql` (included in this folder), copy the whole thing,
   paste it into a new query, and click **Run**.
   - This creates the `projects` table and the access rules it needs.
4. Go to **Project Settings → API**. You'll need two values from this page:
   - **Project URL** (looks like `https://abcxyz.supabase.co`)
   - **anon public** key (a long string)

**Important to understand:** the "anon" key is not a secret — it ships inside
your site's JavaScript and is visible to anyone who opens dev tools. The SQL
script sets up fully open read/write access on the `projects` table, which
means the password gate in this app only hides the *interface* — it doesn't
stop someone from calling the database directly if they really wanted to.
For an internal tool used by you, this is a reasonable tradeoff. If this ever
needs to be more locked-down, the SQL file has a commented-out section
showing how to require real login (Supabase Auth) for edits.

## 2. Set up your environment variables

1. In this project folder, copy `.env.example` to a new file named `.env`:
   ```
   cp .env.example .env
   ```
2. Open `.env` and fill in:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-from-step-1
   VITE_EDITOR_PASSWORD=pick-a-password-only-you-know
   ```

## 3. Run it locally to confirm it works

```
npm install
npm run dev
```

Open the URL it prints (usually `http://localhost:5173`). You should see the
password screen. Enter the password you set, and you should land on an empty
dashboard. Try creating a project to confirm Supabase is wired up correctly —
if it saves and shows up in your Supabase **Table Editor** under `projects`,
you're good.

## 4. Deploy to Vercel

1. Push this project to a GitHub repo (or use Vercel's CLI directly — `npx vercel`
   from inside this folder also works without GitHub).
2. Go to [vercel.com](https://vercel.com), **Add New Project**, import the repo.
3. Vercel will detect it as a Vite project automatically. Before deploying,
   add your environment variables under **Settings → Environment Variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_EDITOR_PASSWORD`
4. Click **Deploy**.
5. One extra step for routing: this app uses client-side routes (`/edit/:id`,
   `/p/:slug`), so Vercel needs to know to serve `index.html` for all paths.
   Add a file named `vercel.json` in the project root with:
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```
   Commit and redeploy (or add this before your first deploy).

Once deployed, your dashboard lives at your Vercel URL (e.g.
`https://your-app.vercel.app`), and any project's client link will look like
`https://your-app.vercel.app/p/oak-residence-a1b2c3`.

## 5. Day-to-day use

- Go to your site, enter your password, hit **+ New project**, pick a format.
- Fill in each sheet — paste image URLs as you go; a small preview confirms
  they loaded.
- Click **Copy client link** on the dashboard (or **Open client view** inside
  the editor) to get the read-only URL to send a client.
- Projects save automatically about 700ms after you stop typing.

## Notes / things worth knowing

- There's no image hosting built in. If you don't already have somewhere to
  host renders, a public Google Drive folder (sharing set to "anyone with
  the link") or a free Cloudinary account both work fine as an image host.
- The password gate is intentionally simple (matches the pattern from your
  portfolio project) — good for keeping casual visitors out, not meant to be
  bulletproof security.
- If a client link ever needs to be revoked, delete the project — its slug
  stops resolving immediately.
