import type { Metadata } from 'next';
import Link from 'next/link';
import { BlogNavbar } from '@/components/site/BlogNavbar';
import { BlogFooter } from '@/components/site/BlogFooter';
import { PostCard } from '@/components/blog/PostCard';
import { Tag } from '@/components/ui/Tag';
import { getContent, getPosts } from '@/lib/api';
import { parseContent } from '@/lib/content';

export const instant = false;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
const PER_PAGE = 9;

export async function generateMetadata(): Promise<Metadata> {
  const parsed = parseContent(await getContent());
  const title = 'Technical articles | Goodnews Azonubi';
  return {
    title,
    description: 'Articles on backend engineering, DevOps, AWS, Docker and fullstack development.',
    alternates: { canonical: '/blog' },
    openGraph: { type: 'website', url: `${siteUrl}/blog`, title, description: parsed.seoDescription },
  };
}

type SearchParams = { tag?: string | string[]; page?: string | string[] };

/** Blog list (PRD §5.2): newest first, ?tag= filter + ?page= pagination, Admin link in footer. */
export default async function BlogList({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const tag = Array.isArray(sp.tag) ? sp.tag[0] : sp.tag;
  const page = Math.max(1, Number(Array.isArray(sp.page) ? sp.page[0] : sp.page) || 1);

  const [contentRaw, result] = await Promise.all([getContent(), getPosts(tag, page, PER_PAGE)]);
  const c = parseContent(contentRaw);
  const posts = result?.items ?? [];
  const total = result?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  const pageHref = (p: number) => {
    const params = new URLSearchParams();
    if (tag) params.set('tag', tag);
    if (p > 1) params.set('page', String(p));
    const qs = params.toString();
    return `/blog${qs ? `?${qs}` : ''}`;
  };

  const tags = [...new Set(posts.flatMap((p) => p.tags))].slice(0, 12);

  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Technical articles — Goodnews Azonubi',
    url: `${siteUrl}/blog`,
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }} />
      <BlogNavbar />
      <main id="main-content" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <header className="max-w-2xl">
          <p className="font-mono text-xs font-medium tracking-[0.12em] uppercase text-accent">Blog</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-fg md:text-5xl">Technical articles</h1>
          <p className="mt-3 text-base text-muted md:text-lg">
            Notes on backend engineering, DevOps, cloud infrastructure and fullstack development.
          </p>
        </header>

        {tag ? (
          <p className="mt-6 text-sm text-muted">
            Filtering by <Tag>{tag}</Tag>{' '}
            <Link href="/blog" className="ml-2 text-accent underline underline-offset-4 hover:brightness-110">
              Clear filter
            </Link>
          </p>
        ) : null}

        {tags.length > 0 && !tag ? (
          <ul aria-label="Popular tags" className="mt-6 flex flex-wrap gap-2">
            {tags.map((t) => (
              <li key={t}>
                <Link href={`/blog?tag=${encodeURIComponent(t)}`}>
                  <Tag className="transition-colors hover:border-accent hover:text-fg">{t}</Tag>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}

        {posts.length === 0 ? (
          <div className="glass mt-10 p-10 text-center">
            <p className="text-lg font-medium text-fg">No articles yet</p>
            <p className="mt-2 text-sm text-muted">
              {tag ? (
                <>No articles tagged “{tag}”. <Link href="/blog" className="text-accent underline underline-offset-4">View all articles</Link></>
              ) : (
                'Articles are on the way — check back soon.'
              )}
            </p>
          </div>
        ) : (
          <>
            <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <li key={post.id} className="h-full">
                  <PostCard post={post} profile={c.profile} index={i} />
                </li>
              ))}
            </ol>
            {totalPages > 1 ? (
              <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-2">
                {page > 1 ? (
                  <Link href={pageHref(page - 1)} className="inline-flex h-11 items-center rounded-full border border-line px-5 text-sm font-medium text-fg transition-colors hover:bg-fg/5">
                    ← Newer
                  </Link>
                ) : null}
                <span className="px-2 font-mono text-sm text-muted" aria-current="page">
                  {page} / {totalPages}
                </span>
                {page < totalPages ? (
                  <Link href={pageHref(page + 1)} className="inline-flex h-11 items-center rounded-full border border-line px-5 text-sm font-medium text-fg transition-colors hover:bg-fg/5">
                    Older →
                  </Link>
                ) : null}
              </nav>
            ) : null}
          </>
        )}
      </main>
      <BlogFooter text={c.footerText} socials={c.socials} />
    </div>
  );
}
