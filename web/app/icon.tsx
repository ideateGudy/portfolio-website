import { ImageResponse } from 'next/og';
import fs from 'node:fs';
import path from 'node:path';

export const size = { width: 48, height: 48 };
export const contentType = 'image/png';

/**
 * Dynamic favicon generated from profile photo (/public/gudy.jpg).
 */
export default function Icon() {
  let photoBase64 = '';
  try {
    const photoPath = path.join(process.cwd(), 'public', 'gudy.jpg');
    if (fs.existsSync(photoPath)) {
      const buffer = fs.readFileSync(photoPath);
      photoBase64 = `data:image/jpeg;base64,${buffer.toString('base64')}`;
    }
  } catch {
    // fallback
  }

  return new ImageResponse(
    photoBase64 ? (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          overflow: 'hidden',
          backgroundColor: '#047857',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photoBase64}
          alt="Avatar"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '50%',
          }}
        />
      </div>
    ) : (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          backgroundColor: '#047857',
          color: '#ffffff',
          fontWeight: 800,
          fontSize: '24px',
          fontFamily: 'monospace',
        }}
      >
        GA
      </div>
    ),
    { ...size },
  );
}
