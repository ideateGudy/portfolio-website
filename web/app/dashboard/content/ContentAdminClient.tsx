'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/dashboard-api';
import { useUIStore } from '@/store/ui';
import { Button } from '@/components/ui/Button';
import { ContentForm } from '@/components/dashboard/content/ContentForm';
import {
  fallbackAbout,
  fallbackContact,
  fallbackEducation,
  fallbackExperience,
  fallbackHero,
  fallbackProjectsHeader,
  fallbackProfile,
  fallbackServices,
  fallbackSocials,
} from '@/lib/content';

// Editable blocks. `techStack` and `footer` use the fallback text of "" so a
// fresh section opens with sensible, editable values.
const KEYS = [
  'hero',
  'about',
  'services',
  'experience',
  'education',
  'projects',
  'techStack',
  'contact',
  'profile',
  'socials',
  'resumeUrl',
  'footer',
  'seo',
] as const;
type Key = (typeof KEYS)[number];

const LABELS: Record<Key, string> = {
  hero: 'Hero',
  about: 'About',
  services: 'Services',
  experience: 'Experience',
  education: 'Education',
  projects: 'Projects heading',
  techStack: 'Tech stack',
  contact: 'Contact',
  profile: 'Profile',
  socials: 'Social links',
  resumeUrl: 'Resume',
  footer: 'Footer',
  seo: 'SEO',
};

// Fallback object per section so the form always renders real fields,
// even before the DB row exists.
function fallbackFor(key: Key): Record<string, unknown> {
  switch (key) {
    case 'hero':
      return fallbackHero as unknown as Record<string, unknown>;
    case 'about':
      return fallbackAbout as unknown as Record<string, unknown>;
    case 'services':
      return fallbackServices as unknown as Record<string, unknown>;
    case 'experience':
      return fallbackExperience as unknown as Record<string, unknown>;
    case 'education':
      return fallbackEducation as unknown as Record<string, unknown>;
    case 'projects':
      return fallbackProjectsHeader as unknown as Record<string, unknown>;
    case 'contact':
      return fallbackContact as unknown as Record<string, unknown>;
    case 'profile':
      return fallbackProfile as unknown as Record<string, unknown>;
    case 'socials':
      return fallbackSocials as unknown as Record<string, unknown>;
    case 'resumeUrl':
      return { url: '' };
    case 'techStack':
      return { chips: fallbackHero.techChips };
    case 'footer':
      return { text: 'Goodnews Azonubi · Backend & DevOps Engineer · Fullstack Developer' };
    case 'seo':
      return {
        title: 'Goodnews Azonubi | Backend & DevOps Engineer (Fullstack)',
        description:
          'Portfolio of Goodnews Azonubi, Backend & DevOps Engineer specializing in scalable server architecture, resilient REST APIs, AWS cloud infrastructure, Docker, CI/CD, and fullstack modern web applications.',
        keywords: [],
        ogImageUrl: '',
      };
    default:
      return {};
  }
}

// The public page reads techStack as a bare string[], but the form edits it as
// { chips }. Bridge the two on the way in/out.
function incoming(key: Key, raw: unknown): Record<string, unknown> {
  const base = fallbackFor(key);
  if (key === 'resumeUrl') return { url: typeof raw === 'string' ? raw : '' };
  if (key === 'techStack') {
    return { chips: Array.isArray(raw) ? (raw as string[]) : (base.chips as string[]) };
  }
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    return { ...base, ...(raw as Record<string, unknown>) };
  }
  return base;
}
function outgoing(key: Key, value: Record<string, unknown>): unknown {
  if (key === 'techStack') return (value.chips as string[]) ?? [];
  if (key === 'resumeUrl') return typeof value.url === 'string' ? value.url : '';
  return value;
}

/** Structured, per-field editor for every portfolio content block (PRD §5.4). */
export function ContentAdminClient() {
  const [values, setValues] = useState<Partial<Record<Key, Record<string, unknown>>>>({});
  const [open, setOpen] = useState<Key | null>(null);
  const [busy, setBusy] = useState<Key | null>(null);
  const [error, setError] = useState<string | null>(null);
  const toast = useUIStore((s) => s.toast);

  useEffect(() => {
    void adminApi.content.getAll().then((all) => {
      if (!all) return;
      const next: Partial<Record<Key, Record<string, unknown>>> = {};
      for (const k of KEYS) next[k] = incoming(k, all[k]);
      setValues(next);
    });
  }, []);

  async function save(key: Key) {
    setError(null);
    const value = values[key];
    if (!value) return;
    setBusy(key);
    try {
      await adminApi.content.set(key, outgoing(key, value));
      toast(`${LABELS[key]} saved`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-fg">Site content</h1>
        <p className="mt-1 text-sm text-muted">
          Edit each portfolio section field by field. Changes appear on the public site after saving.
        </p>
      </div>

      {error && (
        <p role="alert" className="rounded-xl border border-red-600/40 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-3">
        {KEYS.map((key) => {
          const value = values[key] ?? fallbackFor(key);
          return (
            <div key={key} className="glass overflow-hidden">
              <button
                type="button"
                onClick={() => setOpen(open === key ? null : key)}
                className="flex w-full items-center justify-between px-4 py-3 text-left"
              >
                <span className="font-medium text-fg">{LABELS[key]}</span>
                <span className="text-muted">{open === key ? '−' : '+'}</span>
              </button>
              {open === key && (
                <div className="flex flex-col gap-4 border-t border-line p-4">
                  <ContentForm
                    section={key}
                    value={value}
                    onChange={(next) => setValues((v) => ({ ...v, [key]: next }))}
                  />
                  <div className="flex justify-end">
                    <Button disabled={busy === key} onClick={() => void save(key)}>
                      {busy === key ? 'Saving…' : 'Save'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
