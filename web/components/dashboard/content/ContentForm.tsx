'use client';

import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { ChipsInput, KeyValueEditor, ListControls, moveItem } from './editors';
import type {
  AboutContent,
  ContactContent,
  ExperienceContent,
  ExperienceItem,
  HeroContent,
  ProjectsHeader,
  ProfileContent,
  ServiceItem,
  ServicesContent,
  SocialsContent,
} from '@/lib/content';

/**
 * Structured, per-field editor for one SiteContent block (PRD §5.4). Each
 * section is a real form (no JSON), with add/remove/reorder for list items.
 * `onChange` receives the full new object for that section.
 */
export function ContentForm({
  section,
  value,
  onChange,
}: {
  section: string;
  value: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
}) {
  const set = (patch: Record<string, unknown>) => onChange({ ...value, ...patch });

  switch (section) {
    case 'hero':
      return <HeroForm v={value as unknown as HeroContent} set={set} />;
    case 'about':
      return <AboutForm v={value as unknown as AboutContent} set={set} />;
    case 'contact':
      return <ContactForm v={value as unknown as ContactContent} set={set} />;
    case 'services':
      return <ServicesForm v={value as unknown as ServicesContent} set={set} />;
    case 'experience':
      return <ExperienceForm v={value as unknown as ExperienceContent} set={set} />;
    case 'projects': {
      const v = value as unknown as ProjectsHeader;
      return (
        <div className="flex flex-col gap-4">
          <Input label="Section label" value={v.subtitle ?? ''} onChange={(e) => set({ subtitle: e.target.value })} />
          <Input label="Heading" value={v.sectionTitle ?? ''} onChange={(e) => set({ sectionTitle: e.target.value })} />
          <Textarea label="Section description" value={v.sectionSubtitle ?? ''} onChange={(e) => set({ sectionSubtitle: e.target.value })} rows={3} />
        </div>
      );
    }
    case 'profile': {
      const v = value as unknown as ProfileContent;
      return (
        <div className="flex flex-col gap-4">
          <Input label="Name" value={v.name ?? ''} onChange={(e) => set({ name: e.target.value })} />
          <Input label="Role" value={v.role ?? ''} onChange={(e) => set({ role: e.target.value })} />
          <Input label="Avatar URL" value={v.avatarUrl ?? ''} onChange={(e) => set({ avatarUrl: e.target.value })} />
          <Textarea label="Bio" value={v.bio ?? ''} onChange={(e) => set({ bio: e.target.value })} rows={3} />
        </div>
      );
    }
    case 'socials': {
      const v = value as unknown as SocialsContent;
      return (
        <div className="flex flex-col gap-4">
          <Input label="GitHub URL" value={v.github ?? ''} onChange={(e) => set({ github: e.target.value })} />
          <Input label="X URL" value={v.x ?? ''} onChange={(e) => set({ x: e.target.value })} />
          <Input label="LinkedIn URL" value={v.linkedin ?? ''} onChange={(e) => set({ linkedin: e.target.value })} />
          <Input label="DEV Community URL" value={v.devto ?? ''} onChange={(e) => set({ devto: e.target.value })} />
        </div>
      );
    }
    case 'resumeUrl':
      return (
        <Input
          label="Resume URL"
          value={String(value.url ?? '')}
          onChange={(e) => set({ url: e.target.value })}
          placeholder="https://…"
        />
      );
    case 'seo':
      return (
        <div className="flex flex-col gap-4">
          <Input
            label="Site title"
            value={String(value.title ?? '')}
            onChange={(e) => set({ title: e.target.value })}
          />
          <Textarea
            label="Meta description"
            value={String(value.description ?? '')}
            onChange={(e) => set({ description: e.target.value })}
            rows={3}
          />
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-fg">Keywords</span>
            <ChipsInput
              value={Array.isArray(value.keywords) ? (value.keywords as string[]) : []}
              onChange={(keywords) => set({ keywords })}
              placeholder="Add a keyword"
            />
          </div>
          <Input
            label="OG image URL (optional)"
            value={String(value.ogImageUrl ?? '')}
            onChange={(e) => set({ ogImageUrl: e.target.value })}
            placeholder="https://… (defaults to the built-in OG image)"
          />
        </div>
      );
    case 'footer':
      return (
        <Input
          label="Footer text"
          value={String(value.text ?? '')}
          onChange={(e) => set({ text: e.target.value })}
          placeholder="Goodnews Azonubi · Backend & DevOps Engineer · Fullstack Developer"
        />
      );
    default:
      return <p className="text-sm text-muted">Unknown section: {section}</p>;
  }
}

/* --------------------------------- Sections -------------------------------- */

type Setter = (patch: Record<string, unknown>) => void;

function HeroForm({ v, set }: { v: HeroContent; set: Setter }) {
  return (
    <div className="flex flex-col gap-4">
      <Input label="Greeting (eyebrow)" value={v.greeting ?? ''} onChange={(e) => set({ greeting: e.target.value })} />
      <Input label="Headline" value={v.headline ?? ''} onChange={(e) => set({ headline: e.target.value })} />
      <Input label="Tagline" value={v.tagline ?? ''} onChange={(e) => set({ tagline: e.target.value })} />
      <Textarea label="Intro paragraph" value={v.intro ?? ''} onChange={(e) => set({ intro: e.target.value })} rows={3} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Primary CTA label"
          value={v.primaryCta?.label ?? ''}
          onChange={(e) => set({ primaryCta: { ...(v.primaryCta ?? {}), label: e.target.value } })}
        />
        <Input
          label="Primary CTA href"
          value={v.primaryCta?.href ?? ''}
          onChange={(e) => set({ primaryCta: { ...(v.primaryCta ?? {}), href: e.target.value } })}
        />
        <Input
          label="Secondary CTA label"
          value={v.secondaryCta?.label ?? ''}
          onChange={(e) => set({ secondaryCta: { ...(v.secondaryCta ?? {}), label: e.target.value } })}
        />
        <Input
          label="Secondary CTA href"
          value={v.secondaryCta?.href ?? ''}
          onChange={(e) => set({ secondaryCta: { ...(v.secondaryCta ?? {}), href: e.target.value } })}
        />
      </div>
      <Input label="Availability" value={v.availability ?? ''} onChange={(e) => set({ availability: e.target.value })} />
      <Input label="Current focus" value={v.currentFocus ?? ''} onChange={(e) => set({ currentFocus: e.target.value })} />
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-fg">Tech chips</span>
        <ChipsInput value={v.techChips ?? []} onChange={(techChips) => set({ techChips })} placeholder="Add a tech chip" />
      </div>
    </div>
  );
}

function AboutForm({ v, set }: { v: AboutContent; set: Setter }) {
  return (
    <div className="flex flex-col gap-4">
      <Input label="Title" value={v.title ?? ''} onChange={(e) => set({ title: e.target.value })} />
      <Input label="Subtitle" value={v.subtitle ?? ''} onChange={(e) => set({ subtitle: e.target.value })} />
      <Textarea label="Statement" value={v.statement ?? ''} onChange={(e) => set({ statement: e.target.value })} rows={2} />
      <Textarea label="Paragraph" value={v.paragraph ?? ''} onChange={(e) => set({ paragraph: e.target.value })} rows={4} />
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-fg">Principles</span>
        <ChipsInput value={v.principles ?? []} onChange={(principles) => set({ principles })} placeholder="Add a principle" />
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-fg">Quick facts</span>
        <KeyValueEditor value={v.facts ?? []} onChange={(facts) => set({ facts })} />
      </div>
    </div>
  );
}

function ContactForm({ v, set }: { v: ContactContent; set: Setter }) {
  return (
    <div className="flex flex-col gap-4">
      <Input label="Title" value={v.title ?? ''} onChange={(e) => set({ title: e.target.value })} />
      <Input label="Subtitle" value={v.subtitle ?? ''} onChange={(e) => set({ subtitle: e.target.value })} />
      <Textarea label="Heading" value={v.heading ?? ''} onChange={(e) => set({ heading: e.target.value })} rows={2} />
      <Textarea label="Section subtitle" value={v.sectionSubtitle ?? ''} onChange={(e) => set({ sectionSubtitle: e.target.value })} rows={2} />
      <Input label="Block heading" value={v.blockHeading ?? ''} onChange={(e) => set({ blockHeading: e.target.value })} />
      <Textarea label="Block text" value={v.blockText ?? ''} onChange={(e) => set({ blockText: e.target.value })} rows={2} />
      <Input label="Email" type="email" value={v.email ?? ''} onChange={(e) => set({ email: e.target.value })} />
      <Input label="Availability" value={v.availability ?? ''} onChange={(e) => set({ availability: e.target.value })} />
    </div>
  );
}

function ServicesForm({ v, set }: { v: ServicesContent; set: Setter }) {
  const items = v.items ?? [];
  const patchItem = (i: number, patch: Partial<ServiceItem>) =>
    set({ items: items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)) });
  return (
    <div className="flex flex-col gap-5">
      <Input label="Title" value={v.title ?? ''} onChange={(e) => set({ title: e.target.value })} />
      <Input label="Subtitle" value={v.subtitle ?? ''} onChange={(e) => set({ subtitle: e.target.value })} />
      <Input label="Section title" value={v.sectionTitle ?? ''} onChange={(e) => set({ sectionTitle: e.target.value })} />
      <Textarea label="Section subtitle" value={v.sectionSubtitle ?? ''} onChange={(e) => set({ sectionSubtitle: e.target.value })} rows={2} />
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-fg">Service cards ({items.length})</span>
        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            set({ items: [...items, { index: String(items.length + 1).padStart(2, '0'), label: '', title: '', description: '', detail: '', deliverables: [] }] })
          }
        >
          Add card
        </Button>
      </div>
      {items.map((it, i) => (
        <div key={i} className="flex gap-3 rounded-xl border border-line p-4">
          <ListControls
            index={i}
            count={items.length}
            onMove={(dir) => set({ items: moveItem(items, i, dir) })}
            onRemove={() => set({ items: items.filter((_, idx) => idx !== i) })}
          />
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Input label="Index" value={it.index ?? ''} onChange={(e) => patchItem(i, { index: e.target.value })} />
              <Input label="Label" value={it.label ?? ''} onChange={(e) => patchItem(i, { label: e.target.value })} />
            </div>
            <Input label="Title" value={it.title ?? ''} onChange={(e) => patchItem(i, { title: e.target.value })} />
            <Input label="Subtitle" value={it.description ?? ''} onChange={(e) => patchItem(i, { description: e.target.value })} />
            <Textarea label="Detail" value={it.detail ?? ''} onChange={(e) => patchItem(i, { detail: e.target.value })} rows={2} />
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-fg">Deliverables</span>
              <ChipsInput
                value={it.deliverables ?? []}
                onChange={(deliverables) => patchItem(i, { deliverables })}
                placeholder="Add a deliverable"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ExperienceForm({ v, set }: { v: ExperienceContent; set: Setter }) {
  const items = v.items ?? [];
  const patchItem = (i: number, patch: Partial<ExperienceItem>) =>
    set({ items: items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)) });
  return (
    <div className="flex flex-col gap-5">
      <Input label="Title" value={v.title ?? ''} onChange={(e) => set({ title: e.target.value })} />
      <Input label="Subtitle" value={v.subtitle ?? ''} onChange={(e) => set({ subtitle: e.target.value })} />
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-fg">Roles ({items.length}) — newest first</span>
        <Button
          type="button"
          variant="secondary"
          onClick={() => set({ items: [...items, { role: '', company: '', description: '' }] })}
        >
          Add role
        </Button>
      </div>
      {items.map((it, i) => (
        <div key={i} className="flex gap-3 rounded-xl border border-line p-4">
          <ListControls
            index={i}
            count={items.length}
            onMove={(dir) => set({ items: moveItem(items, i, dir) })}
            onRemove={() => set({ items: items.filter((_, idx) => idx !== i) })}
          />
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Input label="Role" value={it.role ?? ''} onChange={(e) => patchItem(i, { role: e.target.value })} />
              <Input label="Company" value={it.company ?? ''} onChange={(e) => patchItem(i, { company: e.target.value })} />
            </div>
            <Textarea label="Description" value={it.description ?? ''} onChange={(e) => patchItem(i, { description: e.target.value })} rows={2} />
          </div>
        </div>
      ))}
    </div>
  );
}
