// Date + Cloudinary helpers for public pages.
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

/** Add Cloudinary auto-format/quality (and optional width) to a res.cloudinary.com URL. */
export function cld(url: string | null | undefined, width?: number): string | undefined {
  if (!url || !url.includes('res.cloudinary.com')) return url ?? undefined;
  const auto = `f_auto,q_auto${width ? `,w_${width}` : ''}`;
  if (url.includes('/upload/')) return url.replace('/upload/', `/upload/${auto}/`);
  return url;
}
