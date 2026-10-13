# Web — Portfolio, Blog & Dashboard

Next.js 16 (App Router) frontend for the portfolio + blog (public) and the admin dashboard.
See the repository-root `README.md` for full setup (env, Prisma migrate + seed, running both apps).

## Run
```bash
pnpm install
pnpm dev        # http://localhost:3000
```
The API (`../api`) must run on `API_URL` (default `http://localhost:4000`). Browser calls go to
`/backend/*`, which `next.config.ts` rewrites to `API_URL`, so the httpOnly auth cookie works same-origin.

## Scripts
- `pnpm dev` — dev server (Turbopack)
- `pnpm build` — production build (**run this to catch type/boundary errors**)
- `pnpm start` — serve the build
- `pnpm lint` — ESLint
- `npx tsc --noEmit` — type-check without emitting

## Routes
| Route | Auth | Notes |
|-------|------|-------|
| `/` | public | one-page portfolio (Server Component, API data + seed fallbacks) |
| `/blog` | public | list, `?tag=` filter, `?page=` pagination, Blog JSON-LD |
| `/blog/[slug]` | public | article; `generateStaticParams` + on-demand revalidation; canonical → dev.to when set |
| `/login` | public | admin sign-in (linked only from the blog footer "Admin" link) |
| `/dashboard` | admin | → `/dashboard/posts`; guarded by `middleware.ts` + API |
| `/dashboard/posts` · `/projects` · `/content` · `/settings` | admin | CMS |

`/login` and `/dashboard/*` are `noindex`.

## Content editing (dashboard)
- **Posts / Projects** — full CRUD; images upload to Cloudinary **or** paste an existing image URL (saved straight to the DB). Markdown editor with toolbar, inline image insert, back-dating, live preview.
- **Site content** — structured per-field forms for Hero, About, Services, Experience, Tech stack, Contact, Footer, SEO (no JSON editing).
- Every save calls `/api/revalidate`, so public pages refresh within seconds.

## Environment
Copy `web/.env.example` → `web/.env.local` (never commit `.env.local`).
`NEXT_PUBLIC_SITE_URL` drives canonicals, sitemap, robots and JSON-LD.
