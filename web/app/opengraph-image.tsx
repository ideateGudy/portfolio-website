import { ImageResponse } from 'next/og';

export const alt = 'Goodnews Azonubi — Backend & DevOps Engineer (Fullstack)';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Default OpenGraph image for the whole site (PRD §10). */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          backgroundColor: '#0B1210',
          color: '#E9F1EE',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 28, opacity: 0.7, letterSpacing: 2 }}>
          BACKEND · DEVOPS · FULLSTACK
        </div>
        <div style={{ fontSize: 68, fontWeight: 800, marginTop: 24, lineHeight: 1.1 }}>
          Goodnews Azonubi
        </div>
        <div style={{ fontSize: 34, marginTop: 20, opacity: 0.85 }}>
          Architecting Robust Backends &amp; Cloud Infrastructure
        </div>
      </div>
    ),
    { ...size },
  );
}
