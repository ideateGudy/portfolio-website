import Image from 'next/image';
import Link from 'next/link';
import { Reveal } from '@/components/motion/Reveal';
import { Tag } from '@/components/ui/Tag';
import { cld, formatDate } from '@/lib/format';
import type { PostListItem } from '@/lib/api';
import type { ProfileContent } from '@/lib/content';

type Props = { post: PostListItem; profile: ProfileContent; index?: number };

/** Glass post card (design §7.7): cover 16:9, tags, title, excerpt, author footer. */
export function PostCard({ post, profile, index = 0 }: Props) {
  const cover = cld(post.coverUrl, 800);
  const avatar = cld(profile.avatarUrl, 48);
  return (
    <Reveal delay={Math.min(index * 0.06, 0.24)} className="h-full">
      <article className="glass glass-hover flex h-full flex-col overflow-hidden">
        {cover ? (
          <Link href={`/blog/${post.slug}`} aria-label={post.title} className="relative block aspect-[16/9] overflow-hidden">
            <Image
              src={cover}
              alt={post.coverAlt || `${post.title} cover`}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              loading="lazy"
              className="object-cover"
            />
          </Link>
        ) : null}
        <div className="flex flex-1 flex-col p-5">
          {post.tags.length > 0 ? (
            <ul aria-label="Tags" className="flex flex-wrap gap-1.5">
              {post.tags.slice(0, 3).map((t) => (
                <li key={t}>
                  <Link href={`/blog?tag=${encodeURIComponent(t)}`} aria-label={`Posts tagged ${t}`}>
                    <Tag className="transition-colors hover:border-accent hover:text-fg">{t}</Tag>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
          <h2 className="mt-3 line-clamp-2 text-lg font-semibold text-fg">
            <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-accent">
              {post.title}
            </Link>
          </h2>
          {post.excerpt ? (
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{post.excerpt}</p>
          ) : null}
          <p className="mt-4 flex items-center gap-2 border-t border-line pt-4 text-xs text-muted">
            {avatar ? (
              <Image src={avatar} alt="" width={24} height={24} loading="lazy" className="h-6 w-6 rounded-full object-cover" />
            ) : (
              <span aria-hidden className="grid h-6 w-6 place-items-center rounded-full bg-accent font-mono text-[10px] font-bold text-accent-fg">
                {profile.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()}
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
  );
}
