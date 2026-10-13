import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { BlogNavbar } from '@/components/site/BlogNavbar';
import { BlogFooter } from '@/components/site/BlogFooter';
import { ReadingProgress } from '@/components/blog/ReadingProgress';
import { Tag } from '@/components/ui/Tag';
import { getContent, getPost, getPosts } from '@/lib/api';
import { parseContent } from '@/lib/content';
import { cld } from '@/lib/format';
import { ArticleBody } from '@/lib/markdown';
import { AuthorBadge } from '@/components/blog/AuthorBadge';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

type Params = { slug: string };

/** Pre-render published slugs; new publishes arrive via on-demand revalidation. */
export async function generateStaticParams(): Promise<Params[]> {
  const page = await getPosts(undefined, 1, 50);
  const params = (page?.items ?? []).map((p) => ({ slug: p.slug }));
  // Cache Components requires at least one sample param for build validation.
  // The normal page path resolves this sentinel with notFound().
  return params.length > 0 ? params : [{ slug: '__static_validation__' }];
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { robots: { index: false, follow: true } };
  const url = `/blog/${post.slug}`;
  const canonical = post.canonicalUrl || `${siteUrl}${url}`;
  const cover = cld(post.coverUrl, 1200);
  return {
    title: post.title,
    description: post.excerpt || `${post.title} — by Goodnews Azonubi`,
    keywords: post.tags,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      url,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt,
      authors: ['Goodnews Azonubi'],
      tags: post.tags,
      ...(cover ? { images: [{ url: cover, alt: post.coverAlt || post.title }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      ...(cover ? { images: [cover] } : {}),
    },
  };
}

/** Single article (PRD §5.3): tags → H1 → author meta → cover → 68ch body. */
export default function ArticlePage({ params }: { params: Promise<Params> }) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <p className="text-muted">Loading article…</p>
        </main>
      }
    >
      <ArticleContent params={params} />
    </Suspense>
  );
}

async function ArticleContent({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const [contentRaw, post] = await Promise.all([getContent(), getPost(slug)]);
  if (!post) notFound();
  const c = parseContent(contentRaw);
  const cover = cld(post.coverUrl, 1200);
  const avatar = cld(c.profile.avatarUrl, 96);
  const canonical = post.canonicalUrl || `${siteUrl}/blog/${post.slug}`;
  const initials = c.profile.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

  const postingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    ...(cover ? { image: [cover] } : {}),
    author: { '@type': 'Person', name: c.profile.name, url: siteUrl },
    publisher: { '@type': 'Person', name: c.profile.name },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
  };
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteUrl}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: canonical },
    ],
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(postingJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <ReadingProgress />
      <BlogNavbar />
      <main id="main-content" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <article>
          <header className="mx-auto max-w-[68ch]">
            {post.tags.length > 0 ? (
              <ul aria-label="Tags" className="flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <li key={t}>
                    <Link href={`/blog?tag=${encodeURIComponent(t)}`} aria-label={`Posts tagged ${t}`}>
                      <Tag className="transition-colors hover:border-accent hover:text-fg">{t}</Tag>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-balance text-fg sm:text-4xl md:text-[2.75rem] md:leading-[1.15]">
              {post.title}
            </h1>
            <div className="mt-6 border-y border-line py-4">
              <AuthorBadge profile={c.profile} publishedAt={post.publishedAt ?? undefined} readingTime={post.readingTime} />
            </div>
          </header>
          {cover ? (
            <figure className="mx-auto mt-8 max-w-4xl">
              <Image src={cover} alt={post.coverAlt || `${post.title} cover`} width={1200} height={675} priority className="h-auto w-full rounded-2xl object-cover" />
            </figure>
          ) : null}
          <div className="mx-auto mt-8 max-w-[68ch]">
            <Suspense fallback={null}>
              <ArticleBody markdown={post.content} />
            </Suspense>
          </div>
          <footer className="mx-auto mt-12 max-w-[68ch]">
            {post.canonicalUrl ? (
              <p className="text-sm text-muted">
                Originally published on{' '}
                <a href={post.canonicalUrl} target="_blank" rel="noopener noreferrer canonical" className="text-accent underline underline-offset-4 hover:brightness-110">
                  dev.to ↗
                </a>
              </p>
            ) : null}
            <div className="glass mt-6 flex items-center gap-4 p-5">
              {avatar ? (
                <Image src={avatar} alt={`${c.profile.name} profile photo`} width={64} height={64} loading="lazy" className="h-16 w-16 shrink-0 rounded-full object-cover" />
              ) : (
                <span aria-hidden className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-accent font-mono text-lg font-bold text-accent-fg">
                  {initials}
                </span>
              )}
              <div>
                <p className="font-semibold text-fg">{c.profile.name}</p>
                <p className="text-sm text-muted">{c.profile.role}</p>
                {c.profile.bio ? <p className="mt-1 text-sm text-muted">{c.profile.bio}</p> : null}
              </div>
            </div>
            <Link href="/blog" className="mt-8 inline-flex h-11 items-center rounded-full border border-line px-5 text-sm font-medium text-fg transition-colors hover:bg-fg/5">
              ← All articles
            </Link>
          </footer>
        </article>
      </main>
      <BlogFooter text={c.footerText} socials={c.socials} />
    </div>
  );
}
