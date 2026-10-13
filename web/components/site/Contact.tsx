"use client";

import { Reveal } from '@/components/motion/Reveal';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SocialLinks } from '@/components/site/SocialLinks';
import { CopyIcon, MailIcon } from '@/components/ui/icons';
import { useUIStore } from '@/store/ui';
import type { ContactContent, SocialsContent } from '@/lib/content';

type Props = { contact: ContactContent; socials: SocialsContent; resumeUrl: string };

/** Contact block: mailto + copy-email toast, socials, resume (PRD §5.1). */
export function Contact({ contact, socials, resumeUrl }: Props) {
  const toast = useUIStore((s) => s.toast);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      toast('Email copied to clipboard');
    } catch {
      toast('Could not copy email', 'error');
    }
  };

  return (
    <section id="contact" aria-label="Contact" className="scroll-mt-24 mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <Reveal>
        <SectionHeader index="06" label={contact.subtitle} title={contact.heading} subtitle={contact.sectionSubtitle} />
      </Reveal>
      <Reveal delay={0.08}>
        <div className="glass mt-8 p-6 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <h3 className="text-2xl font-semibold text-fg">{contact.blockHeading}</h3>
              <p className="mt-3 leading-relaxed text-muted">{contact.blockText}</p>
              <p className="mt-4 flex items-center gap-2 text-sm text-muted">
                <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {contact.availability}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <a
                href={`mailto:${contact.email}`}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent px-5 font-medium text-accent-fg transition hover:brightness-[1.08]"
              >
                <MailIcon size={18} />
                {contact.email}
              </a>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={copyEmail}
                  className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-line px-5 text-sm font-medium text-fg transition-colors hover:bg-fg/5"
                >
                  <CopyIcon size={16} />
                  Copy email
                </button>
                {resumeUrl ? (
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 flex-1 items-center justify-center rounded-full border border-line px-5 text-sm font-medium text-fg transition-colors hover:bg-fg/5"
                  >
                    View Resume
                  </a>
                ) : null}
              </div>
              <div className="mt-1 flex justify-center lg:justify-start">
                <SocialLinks socials={socials} />
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
