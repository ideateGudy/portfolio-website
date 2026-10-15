// Date + Cloudinary helpers for public pages.
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

/** Formats a timestamp into relative time: "just now", "2m ago", "3h ago", "yesterday", etc. */
export function formatRelativeTime(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';

  const now = Date.now();
  const diffMs = now - d.getTime();
  const diffSec = Math.max(0, Math.floor(diffMs / 1000));

  if (diffSec < 45) return 'just now';
  if (diffSec < 90) return '1 minute ago';

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} minutes ago`;

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours === 1) return '1 hour ago';
  if (diffHours < 24) return `${diffHours} hours ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;

  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks === 1) return '1 week ago';
  if (diffWeeks < 4) return `${diffWeeks} weeks ago`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths === 1) return '1 month ago';
  if (diffMonths < 12) return `${diffMonths} months ago`;

  const diffYears = Math.floor(diffDays / 365);
  if (diffYears === 1) return '1 year ago';
  return `${diffYears} years ago`;
}

/** Add Cloudinary auto-format/quality (and optional width) to a res.cloudinary.com URL. */
export function cld(url: string | null | undefined, width?: number): string | undefined {
  if (!url || !url.includes('res.cloudinary.com')) return url ?? undefined;
  const auto = `f_auto,q_auto${width ? `,w_${width}` : ''}`;
  if (url.includes('/upload/')) return url.replace('/upload/', `/upload/${auto}/`);
  return url;
}
