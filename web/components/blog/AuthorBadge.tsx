import Image from 'next/image';
import { cld } from '@/lib/format';
import type { ProfileContent } from '@/lib/content';

/**
 * Author block used on articles (PRD §5.3 / §5 shared components): avatar,
 * name, role, and (optionally) published date + reading time.
 */
export function AuthorBadge({
  profile,
  publishedAt,
  readingTime,
}: {
  profile: ProfileContent;
  publishedAt?: string;
  readingTime?: number;
}) {
  const avatar = cld(profile.avatarUrl, 96);
  const initials = profile.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <div className="flex items-center gap-3">
      {avatar ? (
        <Image
          src={avatar}
          alt={`${profile.name} profile photo`}
          width={48}
          height={48}
          priority
          className="h-12 w-12 rounded-full object-cover"
        />
      ) : (
        <span
          aria-hidden
          className="grid h-12 w-12 place-items-center rounded-full bg-accent font-mono text-sm font-bold text-accent-fg"
        >
          {initials}
        </span>
      )}
      <div className="text-sm">
        <p className="font-semibold text-fg">{profile.name}</p>
        <p className="text-muted">{profile.role}</p>
      </div>
      {(publishedAt || readingTime) && (
        <div className="ml-auto text-right text-sm text-muted">
          {publishedAt && (
            <p>
              <time dateTime={publishedAt}>
                {new Date(publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </time>
            </p>
          )}
          {readingTime ? <p>{readingTime} min read</p> : null}
        </div>
      )}
    </div>
  );
}
