import { Reveal } from '@/components/motion/Reveal';
import { SectionHeader } from '@/components/ui/SectionHeader';
import type { ExperienceContent } from '@/lib/content';

/** Experience timeline: rail + glass cards, newest first (design §7.6). */
export function Experience({ experience }: { experience: ExperienceContent }) {
  return (
    <section id="experience" aria-label="Experience" className="scroll-mt-24 mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <Reveal>
        <SectionHeader index="04" label={experience.title} title={experience.subtitle} />
      </Reveal>
      <ol className="relative mt-8 flex flex-col gap-5 border-l border-line pl-6 sm:pl-8">
        {experience.items.map((item, i) => (
          <li key={`${item.company}-${item.role}`} className="relative">
            <span aria-hidden className="absolute top-6 -left-6 h-2.5 w-2.5 -translate-x-[calc(50%-0.5px)] rounded-full bg-accent sm:-left-8" />
            <Reveal delay={Math.min(i * 0.05, 0.2)}>
              <article className="glass glass-hover p-6">
                <h3 className="text-lg font-semibold text-fg">
                  {item.role} <span className="font-normal text-muted">· {item.company}</span>
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
              </article>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
