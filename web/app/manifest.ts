import type { MetadataRoute } from 'next';

/** Web app manifest (PRD §3/§10). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Goodnews Azonubi | Backend & DevOps Engineer (Fullstack)',
    short_name: 'G. Azonubi',
    description:
      'Portfolio of Goodnews Azonubi, Backend & DevOps Engineer specializing in scalable server architecture, resilient REST APIs, AWS cloud infrastructure, Docker, CI/CD, and fullstack modern web applications.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0B1210',
    theme_color: '#0B1210',
    icons: [
      { src: '/icon', sizes: 'any', type: 'image/png' },
    ],
  };
}
