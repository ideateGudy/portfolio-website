'use client';

import { Reveal } from '@/components/motion/Reveal';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { CheckIcon } from '@/components/ui/icons';
import { useUIStore } from '@/store/ui';
import type { ServicesContent } from '@/lib/content';

/** Service cards with deliverables (design §7.5). */
export function Services({ services }: { services: ServicesContent }) {
  const openContactModal = useUIStore((s) => s.openContactModal);

  return (
    <section id="services" aria-label="Services" className="scroll-mt-24 mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <Reveal>
        <SectionHeader index="03" label={services.subtitle} title={services.sectionTitle} subtitle={services.sectionSubtitle} />
      </Reveal>
      <ol className="mt-8 grid gap-6 lg:grid-cols-3">
        {services.items.map((s, i) => (
          <li key={s.title} className="h-full">
            <Reveal delay={Math.min(i * 0.06, 0.2)} className="h-full">
              <article className="glass glass-hover flex h-full flex-col p-6 sm:p-7">
                <p aria-hidden className="font-mono text-sm text-accent">{s.index}</p>
                <p className="mt-1 text-xs font-medium tracking-wide text-muted uppercase">{s.label}</p>
                <h3 className="mt-2 text-xl font-semibold text-fg">{s.title}</h3>
                <p className="mt-1 text-sm text-muted">{s.description}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{s.detail}</p>
                <h4 className="mt-5 text-sm font-semibold text-fg">Key deliverables</h4>
                <ul className="mt-3 flex flex-col gap-2.5">
                  {s.deliverables.map((d) => (
                    <li key={d} className="flex items-start gap-2.5 text-sm text-muted">
                      <span className="mt-0.5 text-accent"><CheckIcon size={16} /></span>
                      {d}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => openContactModal(s.title)}
                  className="mt-5 inline-flex items-center gap-1 border-t border-line pt-4 text-sm font-medium text-accent hover:underline text-left cursor-pointer transition-colors"
                >
                  Get in touch →
                </button>
              </article>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}

