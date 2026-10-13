# Goodnews Azonubi — Portfolio, Blog & Admin Dashboard

A fast, minimalist personal site for a Backend & DevOps (Fullstack) engineer:

1. a one-page **portfolio** (public),
2. a **technical blog** (public),
3. a private **dashboard** to manage posts, projects, site text, profile and résumé link.

Monorepo layout:

```
web/    Next.js (App Router) — public site + dashboard
api/    NestJS — REST API
```

## Tech stack

| Layer | Choice |
|-------|--------|
| Frontend | Next.js 16 (App Router) + TypeScript + Tailwind v4 + `motion` |
| State | Zustand (theme, toasts, auth, editor) |
| Backend | NestJS 12 |
| Database | Neon Postgres via Prisma 7 |
| Images | Cloudinary (uploaded through the API) |
| Auth | JWT in an httpOnly cookie, single seeded admin |
| Article rendering | react-markdown + remark-gfm + rehype-slug + rehype-sanitize + rehype-pretty-code (Shiki) |

Package manager: **pnpm**.

---

## Prerequisites

- Node 20+
- pnpm
- A Neon Postgres database (`DATABASE_URL`)
- A Cloudinary account (cloud name + API key/secret)
- API on port 4000, web on port 3000

## 1. Configure environment

**API** — copy `api/.env.example` → `api/.env` and fill in:

```
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require
JWT_SECRET=<long random string>
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=<your-password>
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
WEB_URL=http://localhost:3000
PORT=4000
```

**Web** — copy `web/.env.example` → `web/.env.local`:

```
API_URL=http://localhost:4000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
REVALIDATE_SECRET=<same shared secret used to protect /api/revalidate>
```

Never commit `.env` / `.env.local`.

## 2. Install dependencies

```bash
cd api && pnpm install
cd ../web && pnpm install
```

## 3. Database + seed

From `api/`:

```bash
pnpm prisma migrate dev     # create/apply migrations against DATABASE_URL
pnpm prisma db seed         # create the admin user + seed content/projects/posts
```

The seed creates the single admin from `ADMIN_EMAIL` + `ADMIN_PASSWORD` (bcrypt-hashed),
all site content, the 4 projects, and the 11 dev.to article placeholders (as drafts).

## 4. Run

Two terminals:

```bash
# terminal 1 — API on :4000
cd api && pnpm start:dev

# terminal 2 — web on :3000
cd web && pnpm dev
```

Open http://localhost:3000.

---

## Admin login

- **The login link is intentionally hidden.** Per the spec, a small **"Admin"** link lives only in the
  **blog footer** (`/blog` → scroll to bottom). It is not on the portfolio page.
- Or open **http://localhost:3000/login** directly.
- `/dashboard/*` is guarded twice: Next `middleware.ts` (cookie presence → redirect `/login`) and the API `JwtAuthGuard`.
- On success you are redirected to `/dashboard`.

There is **no register page and no forgot-password** (by design).

## Resetting the admin password

There is no in-app password change. Update `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `api/.env`
and re-run the seed — it upserts the single user, so the credentials are overwritten:

```bash
cd api
# edit ADMIN_EMAIL / ADMIN_PASSWORD in .env, then:
pnpm prisma db seed
```

Log in again with the new credentials.

---

## Deploy

- **API**: build (`pnpm build`) and run (`node dist/main`), or use `nest deploy`. Set all `api/.env` values in your host.
  In production `JWT_SECRET` must be strong and the auth cookie is set `secure`.
- **Web**: `pnpm build` then `pnpm start` (or deploy to Vercel). Set `API_URL`, `NEXT_PUBLIC_SITE_URL`,
  `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `REVALIDATE_SECRET`. The `next.config.ts` rewrites `/backend/*` → `API_URL`
  so cookie auth stays same-origin.
- Run `prisma migrate deploy` + `prisma db seed` against the production database.

## Notes

- Public pages are Server Components fetching the API server-side with cache tags
  (`posts`, `projects`, `content`); dashboard mutations call `/api/revalidate` to refresh instantly.
- `/login` and `/dashboard/*` are `noindex`. Public SEO: `sitemap.ts`, `robots.ts`, JSON-LD, canonical URLs.
- Articles are stored as Markdown; `readingTime = ceil(words / 200)` is computed on save.
