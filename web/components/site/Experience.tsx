import { Reveal } from '@/components/motion/Reveal';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ProjectsIcon } from '@/components/ui/icons';
import type { ExperienceContent } from '@/lib/content';

/**
 * Professional LinkedIn-styled Experience timeline:
 * - Company & Role headers with timeline rail
 * - Employment type, dates, and locations
 * - Impact description
 * - Key technologies & skills tags
 */
export function Experience({ experience }: { experience: ExperienceContent }) {
  return (
    <section id="experience" aria-label="Experience" className="scroll-mt-24 mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <Reveal>
        <SectionHeader index="04" label={experience.title} title={experience.subtitle} />
      </Reveal>
      <ol className="relative mt-8 flex flex-col gap-6 border-l border-line pl-6 sm:pl-8">
        {experience.items.map((item, i) => (
          <li key={`${item.company}-${item.role}-${i}`} className="relative">
            {/* Timeline node */}
            <span
              aria-hidden
              className="absolute top-6 -left-6 flex h-3.5 w-3.5 -translate-x-[calc(50%-0.5px)] items-center justify-center rounded-full border-2 border-surface bg-accent sm:-left-8"
            />
            <Reveal delay={Math.min(i * 0.05, 0.2)}>
              <article className="glass glass-hover p-6 sm:p-7">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3.5">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
                      <ProjectsIcon size={22} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-fg">
                        {item.role}
                      </h3>
                      <p className="mt-0.5 text-sm font-medium text-accent">
                        {item.company}
                        {item.employmentType ? (
                          <span className="font-normal text-muted"> · {item.employmentType}</span>
                        ) : null}
                      </p>
                      {(item.duration || item.location) ? (
                        <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                          {item.duration && <span>{item.duration}</span>}
                          {item.duration && item.location && <span>·</span>}
                          {item.location && <span>{item.location}</span>}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-muted">{item.description}</p>

                {item.skills && item.skills.length > 0 ? (
                  <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-line pt-3.5">
                    <span className="text-[11px] font-semibold tracking-wider text-muted uppercase mr-1">
                      Skills:
                    </span>
                    {item.skills.map((s) => (
                      <span
                        key={s}
                        className="rounded-lg bg-fg/5 px-2.5 py-1 text-xs font-mono text-fg transition-colors hover:border-accent/40"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                ) : null}
              </article>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}

