'use client';

import { Reveal } from '@/components/motion/Reveal';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { CheckIcon, ServerIcon, CodeIcon, CloudIcon } from '@/components/ui/icons';
import { useUIStore } from '@/store/ui';
import type { ServicesContent } from '@/lib/content';

const trackIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  '01': ServerIcon,
  '02': CodeIcon,
  '03': CloudIcon,
};

/**
 * Service & capabilities section styled like an executive LinkedIn Experience block:
 * - Clear role/track badges (Backend, Frontend, DevOps)
 * - Professional timeline rail & card layout
 * - Key competencies & deliverables
 * - One-click "Get in touch" modal launcher
 */
export function Services({ services }: { services: ServicesContent }) {
  const openContactModal = useUIStore((s) => s.openContactModal);

  return (
    <section id="services" data-cursor="services" aria-label="Services" className="scroll-mt-24 mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <Reveal>
        <SectionHeader
          index="03"
          label={services.subtitle}
          title={services.sectionTitle}
          subtitle={services.sectionSubtitle}
        />
      </Reveal>

      <ol className="relative mt-8 flex flex-col gap-6 border-l border-line pl-6 sm:pl-8">
        {services.items.map((s, i) => {
          const Icon = trackIcons[s.index] || ServerIcon;
          return (
            <li key={s.title} className="relative">
              {/* LinkedIn Timeline Node Marker */}
              <span
                aria-hidden
                className="absolute top-7 -left-6 flex h-3.5 w-3.5 -translate-x-[calc(50%-0.5px)] items-center justify-center rounded-full border-2 border-surface bg-accent sm:-left-8"
              />

              <Reveal delay={Math.min(i * 0.06, 0.2)}>
                <article className="glass glass-hover p-6 sm:p-7">
                  {/* Header Row */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-3.5">
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
                        <Icon size={22} />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-xl font-semibold text-fg">{s.title}</h3>
                          <span className="rounded-full bg-accent/15 px-2.5 py-0.5 font-mono text-[11px] font-semibold tracking-wide text-accent uppercase">
                            {s.label}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs font-medium text-muted">
                          {s.description} · <span className="text-accent font-mono font-semibold">{s.index}</span>
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => openContactModal(s.title)}
                      className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full border border-line px-4 py-1.5 text-xs font-medium text-fg transition-colors hover:border-accent hover:bg-accent/10 hover:text-accent cursor-pointer"
                    >
                      Get in touch →
                    </button>
                  </div>

                  {/* Summary / Detail */}
                  <p className="mt-4 text-sm leading-relaxed text-muted">{s.detail}</p>

                  {/* Key Deliverables / Competencies (LinkedIn Skills style) */}
                  <div className="mt-5 border-t border-line pt-4">
                    <h4 className="text-xs font-semibold tracking-wider text-muted uppercase">
                      Core competencies &amp; deliverables
                    </h4>
                    <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                      {s.deliverables.map((d) => (
                        <li key={d} className="flex items-start gap-2 text-xs sm:text-sm text-muted">
                          <span className="mt-0.5 shrink-0 text-accent">
                            <CheckIcon size={15} />
                          </span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </section>
  );
}


