import type { MetadataRoute } from 'next';

/** Allow everything except auth-gated routes (PRD §10). */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/dashboard', '/login'] }],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
