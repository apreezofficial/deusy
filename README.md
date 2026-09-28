# Deusy & Planners Services

Marketing site and admin panel for Deusy & Planners Services. Next.js 16 (App Router,
Turbopack) with Supabase for content, enquiries, media and staff accounts.

## Local setup

```bash
npm install
cp .env.example .env.local   # then fill in the Supabase values
npm run dev
```

The site runs before Supabase is connected: it serves the starter content from
`src/lib/content/fallback.ts` and the admin panel asks for the project details. Once
`.env.local` holds real credentials, everything is read from Postgres instead.

## Supabase

1. **Project Settings → API Keys** for the URL and the two keys:
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — safe for the browser (`sb_publishable_…`).
   - `SUPABASE_SECRET_KEY` — server only (`sb_secret_…`, called the service role key on
     older projects). It bypasses row level security, so it is only used for staff
     invites and profile bootstrapping. Never prefix it with `NEXT_PUBLIC_`; `.env*` is
     already ignored by git.
2. **Run the schema**, then the starter content, in the Supabase SQL editor
   (Dashboard → SQL Editor → New query), in this order:
   - `supabase/migrations/0001_init.sql` — tables, triggers, row level security, storage.
   - `supabase/seed.sql` — services, pages, FAQs, team and settings. Safe to re-run:
     content is upserted by slug.
3. Create the first staff account: **Authentication → Users → Add user**, then set the
   role in `profiles`:
   ```sql
   update profiles set role = 'admin' where id = '<user-uuid>';
   ```

Order matters. With credentials in place but no content in the database, the public
pages have nothing to show, because the starter content is only used when Supabase is
unconfigured.

## Routes

| Path | What it is |
| --- | --- |
| `/` | Home: hero, title block, process, audience, services, agency, closing |
| `/services` | Every service, grouped into practices and agency services |
| `/services/[slug]` | One service, with scope, body and a consultation call to action |
| `/[slug]` | Pages from the database: About, Our team, FAQ, Contact, Legal pages |
| `/team/[slug]` | One person's full profile |
| `/admin` | Dashboard, pages, services, FAQs, team, enquiries, media, settings, users |
| `/admin/login` | Staff sign-in |

Call-to-action links carry intent, for example `/contact?intent=consultation` and
`/contact?intent=consultation&topic=Consultancy`. The contact page reads those and
pre-selects the topic.

## Editing content

- **Pages, services, FAQs, team, media, enquiries, settings, users** live in the admin
  panel. Saving revalidates the affected routes and content tags immediately.
- **Home page text** lives in Settings → Home page, together with the "How we work"
  steps.
- Site name, tagline, phone, email, WhatsApp, address and social links live in
  Settings → Site.
- The header logo comes from `public/logo.png` unless a different one is uploaded in
  Settings → Site.

## Commands

```bash
npm run dev     # development server
npm run build   # production build
npm run start   # serve the production build
npm run lint    # ESLint
npx tsc --noEmit
```

## Notes

- Public pages are dynamic (`force-dynamic`) and use `unstable_cache` with tags. Public
  queries use the cookie-free client in `src/lib/supabase/public.ts`, because reading
  cookies is not allowed inside `unstable_cache`.
- After changing `src/lib/content/fallback.ts` while developing, delete
  `.next/dev/cache` (or restart the server) so the cached starter content is dropped.
- Design: square corners, hard offset shadows, black with orange `#F26A1B`, drafting
  blue `#8FCBEA`. Depth comes from the shadow offset, never a blur.
