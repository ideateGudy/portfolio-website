import { type ReactNode } from 'react';
import { Reveal } from '@/components/motion/Reveal';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Tag } from '@/components/ui/Tag';
import { CheckIcon } from '@/components/ui/icons';
import type { AboutContent } from '@/lib/content';

/**
 * Parses inline formatting tags like **bold**, <b>bold</b>, <strong>bold</strong>,
 * and *italic* into native styled React elements.
 */
function renderFormattedInline(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|<strong>[\s\S]*?<\/strong>|<b>[\s\S]*?<\/b>|\*[^*]+\*|_[^_]+_)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={key++} className="font-semibold text-fg">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('<strong>') && token.endsWith('</strong>')) {
      parts.push(
        <strong key={key++} className="font-semibold text-fg">
          {token.slice(8, -9)}
        </strong>
      );
    } else if (token.startsWith('<b>') && token.endsWith('</b>')) {
      parts.push(
        <strong key={key++} className="font-semibold text-fg">
          {token.slice(3, -4)}
        </strong>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(
        <em key={key++} className="italic text-fg">
          {token.slice(1, -1)}
        </em>
      );
    } else if (token.startsWith('_') && token.endsWith('_')) {
      parts.push(
        <em key={key++} className="italic text-fg">
          {token.slice(1, -1)}
        </em>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

/**
 * Formats a multi-line paragraph block from the dashboard:
 * - Preserves spacing between paragraphs (double newline)
 * - Preserves single newlines (line breaks) within paragraphs
 * - Formats bold (**text** or <b>text</b>) and italic (*text*)
 */
function FormattedParagraph({ text, className = '' }: { text: string; className?: string }) {
  if (!text) return null;

  const paragraphs = text
    .split(/\r?\n\s*\r?\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (paragraphs.length <= 1) {
    return (
      <div className={`whitespace-pre-line ${className}`}>
        {renderFormattedInline(text)}
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-3.5 ${className}`}>
      {paragraphs.map((para, i) => (
        <p key={i} className="whitespace-pre-line">
          {renderFormattedInline(para)}
        </p>
      ))}
    </div>
  );
}

export function About({ about, techStack }: { about: AboutContent; techStack: string[] }) {
  return (
    <section id="about" aria-label="About" className="scroll-mt-24 mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <Reveal>
        <SectionHeader index="01" label={about.title} title={about.subtitle} />
      </Reveal>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Reveal delay={0.05}>
          <div className="glass flex h-full flex-col justify-between p-6 sm:p-8">
            <div>
              <p className="text-lg font-semibold text-fg">
                {renderFormattedInline(about.statement)}
              </p>
              <FormattedParagraph
                text={about.paragraph}
                className="mt-4 leading-relaxed text-muted"
              />
            </div>
            <ul className="mt-6 flex flex-col gap-3">
              {about.principles.map((p) => (
                <li key={p} className="flex items-start gap-3 text-sm text-fg">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent/10 text-accent">
                    <CheckIcon size={14} />
                  </span>
                  <span>{renderFormattedInline(p)}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <div className="flex flex-col gap-6">
          <Reveal delay={0.1}>
            <div className="glass p-6 sm:p-8">
              <h3 className="text-sm font-semibold tracking-wide text-muted uppercase">Quick facts</h3>
              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                {about.facts.map((f) => (
                  <div key={f.label}>
                    <dt className="text-xs text-muted">{f.label}</dt>
                    <dd className="mt-0.5 text-sm font-medium text-fg">
                      {renderFormattedInline(f.value)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="glass p-6 sm:p-8">
              <h3 className="text-sm font-semibold tracking-wide text-muted uppercase">Tech stack</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {techStack.map((t) => (
                  <li key={t}><Tag>{t}</Tag></li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

