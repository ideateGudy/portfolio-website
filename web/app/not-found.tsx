import Link from 'next/link';

/** Root 404 (PRD §6). Same language as the article-level not-found. */
export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <p className="font-mono text-xs font-medium tracking-[0.12em] uppercase text-accent">404</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-fg">Page not found</h1>
      <p className="mt-3 text-muted">This page doesn&apos;t exist or was moved.</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex h-11 items-center rounded-full bg-accent px-5 font-medium text-accent-fg transition hover:brightness-[1.08]"
        >
          ← Back home
        </Link>
        <Link
          href="/blog"
          className="inline-flex h-11 items-center rounded-full border border-line px-5 font-medium text-fg transition hover:bg-fg/5"
        >
          Read the blog
        </Link>
      </div>
    </div>
  );
}
