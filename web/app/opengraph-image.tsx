import { ImageResponse } from 'next/og';
import fs from 'node:fs';
import path from 'node:path';
import { getContent } from '@/lib/api';
import { parseContent } from '@/lib/content';

export const alt = 'Goodnews Azonubi — Portfolio & Technical Profile';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * GitHub-styled preview card for the portfolio with user picture & summary info.
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
  const headline = c.hero.headline || 'Architecting Robust Backends & Cloud Infrastructure';
  const chips = (c.techStack && c.techStack.length > 0 ? c.techStack : c.hero.techChips).slice(0, 5);

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
        {/* Top bar with initials / badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: '#34D399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#04120C',
                fontWeight: 800,
                fontSize: '20px',
              }}
            >
              GA
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ display: 'flex', fontSize: '20px', fontWeight: 700, color: '#ECF3EF' }}>dev.ideategudy.tech</span>
              <span style={{ display: 'flex', fontSize: '14px', color: '#34D399' }}>● Available for contracts &amp; full-time</span>
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
            Portfolio
          </div>
        </div>

        {/* Middle Main Section: GitHub repo/profile style */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '48px', margin: '32px 0' }}>
          {photoBase64 ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={photoBase64}
              alt={name}
              style={{
                width: '190px',
                height: '190px',
                borderRadius: '32px',
                objectFit: 'cover',
                border: '4px solid rgba(52, 211, 153, 0.4)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
              }}
            />
          ) : null}

          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div style={{ display: 'flex', fontSize: '52px', fontWeight: 800, margin: 0, lineHeight: 1.15 }}>
              {name}
            </div>
            <div style={{ display: 'flex', fontSize: '24px', fontWeight: 600, color: '#34D399', margin: '8px 0 0 0' }}>
              {role}
            </div>
            <div style={{ display: 'flex', fontSize: '20px', color: '#93A59C', margin: '14px 0 0 0', lineHeight: 1.4 }}>
              {headline}
            </div>
          </div>
        </div>

        {/* Bottom Tech Stack Tags (GitHub style) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {chips.map((chip, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                padding: '6px 16px',
                borderRadius: '999px',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#ECF3EF',
                fontSize: '16px',
                fontFamily: 'monospace',
                fontWeight: 600,
              }}
            >
              {chip}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
