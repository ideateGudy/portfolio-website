import Link from 'next/link';

/** Unknown/draft slug (PRD §5.3): drafts 404 for the public. */
export default function ArticleNotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <p className="font-mono text-xs font-medium tracking-[0.12em] uppercase text-accent">404</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-fg">Article not found</h1>
      <p className="mt-3 text-muted">This article doesn&apos;t exist, was moved, or is still a draft.</p>
      <Link href="/blog" className="mt-8 inline-flex h-11 items-center rounded-full bg-accent px-5 font-medium text-accent-fg transition hover:brightness-[1.08]">
        ← All articles
      </Link>
    </div>
  );
}
