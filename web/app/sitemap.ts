import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
const API_URL = process.env.API_URL ?? 'http://localhost:4000';

/** Home + blog + every published post (PRD §10). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/blog`, changeFrequency: 'daily', priority: 0.8 },
  ];
  try {
    const res = await fetch(`${API_URL}/posts?limit=50`, { next: { revalidate: 60 } });
    if (!res.ok) return base;
    const data = (await res.json()) as { items: { slug: string; updatedAt: string }[] };
    for (const item of data.items ?? []) {
      base.push({
        url: `${siteUrl}/blog/${item.slug}`,
        lastModified: item.updatedAt ? new Date(item.updatedAt) : undefined,
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  } catch {
    /* API down during build — fall back to home + blog */
  }
  return base;
}
