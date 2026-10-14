import { ImageResponse } from 'next/og';
import fs from 'node:fs';
import path from 'node:path';
import { getContent, getPost } from '@/lib/api';
import { parseContent } from '@/lib/content';

export const alt = 'Article — Goodnews Azonubi';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Dynamic GitHub-style social card for an individual blog post.
 */
export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [contentRaw, post] = await Promise.all([
    getContent().catch(() => null),
    getPost(slug).catch(() => null),
  ]);

  const c = parseContent(contentRaw);
  const name = c.profile.name || 'Goodnews Azonubi';
  const role = c.profile.role || 'Backend & DevOps Engineer';

  let photoBase64 = '';
  try {
    const photoPath = path.join(process.cwd(), 'public', 'gudy.jpg');
    if (fs.existsSync(photoPath)) {
      const buffer = fs.readFileSync(photoPath);
      photoBase64 = `data:image/jpeg;base64,${buffer.toString('base64')}`;
    }
  } catch {
    // ignore
  }

  const title = post?.title || 'Technical Article';
  const excerpt = post?.excerpt || 'A deep-dive article by Goodnews Azonubi.';
  const tags = (post?.tags ?? []).slice(0, 4);
  const readTime = post?.readingTime ? `${post.readingTime} min read` : '5 min read';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px',
          backgroundColor: '#070C0A',
          color: '#ECF3EF',
          fontFamily: 'sans-serif',
          border: '12px solid #0E1512',
        }}
      >
        {/* Top: Author header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {photoBase64 ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={photoBase64}
                alt={name}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #34D399',
                }}
              />
            ) : null}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ display: 'flex', fontSize: '22px', fontWeight: 700, color: '#ECF3EF' }}>{name}</span>
              <span style={{ display: 'flex', fontSize: '15px', color: '#34D399' }}>{role}</span>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              padding: '6px 16px',
              borderRadius: '999px',
              backgroundColor: 'rgba(52, 211, 153, 0.1)',
              border: '1px solid rgba(52, 211, 153, 0.3)',
              color: '#34D399',
              fontSize: '15px',
              fontWeight: 600,
            }}
          >
            {readTime}
          </div>
        </div>

        {/* Middle: Article Title and Excerpt */}
        <div style={{ display: 'flex', flexDirection: 'column', margin: '24px 0' }}>
          <div
            style={{
              display: 'flex',
              fontSize: title.length > 55 ? '44px' : '52px',
              fontWeight: 800,
              margin: 0,
              lineHeight: 1.18,
              letterSpacing: '-0.5px',
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '21px',
              color: '#93A59C',
              margin: '16px 0 0 0',
              lineHeight: 1.4,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {excerpt}
          </div>
        </div>

        {/* Bottom: Tags */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {tags.map((tag, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                padding: '6px 16px',
                borderRadius: '999px',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#ECF3EF',
                fontSize: '15px',
                fontFamily: 'monospace',
                fontWeight: 600,
              }}
            >
              #{tag}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
