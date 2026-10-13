import Image from 'next/image';
import Link from 'next/link';
import { Reveal } from '@/components/motion/Reveal';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Tag } from '@/components/ui/Tag';
import { cld, formatDate } from '@/lib/format';
import type { PostListItem } from '@/lib/api';
import type { ProfileContent } from '@/lib/content';

type Props = { posts: PostListItem[]; profile: ProfileContent };

/** Writing preview: latest 3 posts + link to /blog (PRD §5.1). */
export function Writing({ posts, profile }: Props) {
  const avatar = cld(profile.avatarUrl, 48);
  return (
    <section id="writing" aria-label="Writing" className="scroll-mt-24 mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <Reveal>
        <SectionHeader index="05" label="Writing" title="Technical articles" subtitle="Notes on backend, DevOps, cloud and fullstack engineering." />
      </Reveal>
      {posts.length === 0 ? (
        <p className="mt-8 text-muted">Articles are on the way — check back soon.</p>
      ) : (
        <>
          <ol className="mt-8 grid gap-6 md:grid-cols-3">
            {posts.slice(0, 3).map((post, i) => {
              const cover = cld(post.coverUrl, 600);
              return (
                <li key={post.id} className="h-full">
                  <Reveal delay={Math.min(i * 0.06, 0.2)} className="h-full">
                    <article className="glass glass-hover flex h-full flex-col overflow-hidden">
                      {cover ? (
                        <div className="relative aspect-[16/9] overflow-hidden">
                          <Image
                            src={cover}
                            alt={post.coverAlt || `${post.title} cover`}
                            fill
                            sizes="(min-width: 768px) 33vw, 100vw"
                            loading="lazy"
                            className="object-cover"
                          />
                        </div>
                      ) : null}
                      <div className="flex flex-1 flex-col p-5">
                        {post.tags.length > 0 ? (
                          <ul aria-label="Tags" className="flex flex-wrap gap-1.5">
                            {post.tags.slice(0, 3).map((t) => (
                              <li key={t}><Tag>{t}</Tag></li>
                            ))}
                          </ul>
                        ) : null}
                        <h3 className="mt-3 line-clamp-2 text-lg font-semibold text-fg">
                          <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-accent">
                            {post.title}
                          </Link>
                        </h3>
                        {post.excerpt ? (
                          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{post.excerpt}</p>
                        ) : null}
                        <p className="mt-4 flex items-center gap-2 border-t border-line pt-4 text-xs text-muted">
                          {avatar ? (
                            <Image src={avatar} alt="" width={24} height={24} loading="lazy" className="h-6 w-6 rounded-full object-cover" />
                          ) : (
                            <span aria-hidden className="grid h-6 w-6 place-items-center rounded-full bg-accent font-mono text-[10px] font-bold text-accent-fg">
                              {profile.name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()}
                            </span>
                          )}
                          <span className="font-medium text-fg">{profile.name}</span>
                          <span aria-hidden>·</span>
                          <time dateTime={post.publishedAt ?? undefined}>{formatDate(post.publishedAt)}</time>
                          <span aria-hidden>·</span>
                          <span>{post.readingTime} min read</span>
                        </p>
                      </div>
                    </article>
                  </Reveal>
                </li>
              );
            })}
          </ol>
          <Reveal delay={0.1}>
            <div className="mt-8 text-center">
              <Link href="/blog" className="inline-flex h-11 items-center rounded-full border border-line px-5 text-sm font-medium text-fg transition-colors hover:bg-fg/5">
                All articles →
              </Link>
            </div>
          </Reveal>
        </>
      )}
    </section>
  );
}
