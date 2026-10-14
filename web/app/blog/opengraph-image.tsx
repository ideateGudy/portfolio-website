import { ImageResponse } from 'next/og';
import fs from 'node:fs';
import path from 'node:path';
import { getContent } from '@/lib/api';
import { parseContent } from '@/lib/content';

export const alt = 'Technical Articles — Goodnews Azonubi';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * GitHub-styled OG image for the blog listing page with avatar and summary.
 */
export default async function OpengraphImage() {
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

  const contentRaw = await getContent().catch(() => null);
  const c = parseContent(contentRaw);
  const name = c.profile.name || 'Goodnews Azonubi';
  const role = c.profile.role || 'Backend & DevOps Engineer';

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
            Technical Blog
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', margin: '20px 0' }}>
          <div style={{ display: 'flex', fontSize: '20px', color: '#34D399', fontWeight: 600, letterSpacing: '1px' }}>
            ENGINEERING &amp; ARCHITECTURE
          </div>
          <div style={{ display: 'flex', fontSize: '56px', fontWeight: 800, margin: '12px 0 0 0', lineHeight: 1.15 }}>
            Technical Articles &amp; Insights
          </div>
          <div style={{ display: 'flex', fontSize: '22px', color: '#93A59C', margin: '16px 0 0 0', lineHeight: 1.4 }}>
            Deep-dives on backend scalability, AWS, Docker, CI/CD, database performance, and fullstack development.
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {['DevOps', 'NestJS', 'PostgreSQL', 'AWS', 'Docker', 'Next.js'].map((tag, idx) => (
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
