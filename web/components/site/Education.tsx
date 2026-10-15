import { Reveal } from '@/components/motion/Reveal';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { GraduationIcon, ArrowUpRightIcon } from '@/components/ui/icons';
import type { EducationContent } from '@/lib/content';

/**
 * Professional LinkedIn-styled Education section:
 * - School & Degree title
 * - Field of study, dates, and graduation grade
 * - Activities and societies
 * - Key associated skills tags
 * - External link to credential/certificate if available
 */
export function Education({ education }: { education: EducationContent }) {
  if (!education.items || education.items.length === 0) return null;

  return (
    <section id="education" aria-label="Education" className="scroll-mt-24 mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <Reveal>
        <SectionHeader index="05" label={education.title} title={education.subtitle} />
      </Reveal>

      <ol className="relative mt-8 flex flex-col gap-6 border-l border-line pl-6 sm:pl-8">
        {education.items.map((item, i) => (
          <li key={`${item.school}-${item.degree}-${i}`} className="relative">
            {/* Timeline node */}
            <span
              aria-hidden
              className="absolute top-7 -left-6 flex h-3.5 w-3.5 -translate-x-[calc(50%-0.5px)] items-center justify-center rounded-full border-2 border-surface bg-accent sm:-left-8"
            />

            <Reveal delay={Math.min(i * 0.05, 0.2)}>
              <article className="glass glass-hover p-6 sm:p-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-accent/10 text-accent ring-1 ring-accent/20">
                      <GraduationIcon size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold tracking-tight text-fg">
                        {item.school}
                      </h3>
                      <p className="mt-1 text-sm font-medium text-accent">
                        {item.degree}
                      </p>
                      {(item.duration || item.grade) ? (
                        <p className="mt-1 flex flex-wrap items-center gap-2 text-xs font-mono text-muted">
                          {item.duration && <span>{item.duration}</span>}
                          {item.duration && item.grade && <span>·</span>}
                          {item.grade && <span>Grade: {item.grade}</span>}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  {item.credentialUrl ? (
                    <a
                      href={item.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 self-start rounded-full border border-line px-3.5 py-1.5 text-xs font-medium text-fg transition-colors hover:border-accent hover:text-accent"
                    >
                      <span>Show credential</span>
                      <ArrowUpRightIcon size={14} />
                    </a>
                  ) : null}
                </div>

                {item.activities ? (
                  <p className="mt-3 text-xs text-muted">
                    <span className="font-semibold text-fg">Activities and societies: </span>
                    {item.activities}
                  </p>
                ) : null}

                {item.description ? (
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {item.description}
                  </p>
                ) : null}

                {item.skills && item.skills.length > 0 ? (
                  <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-line/70 pt-3.5">
                    <span className="text-[11px] font-semibold tracking-wider text-muted uppercase mr-1">
                      Skills:
                    </span>
                    {item.skills.map((s) => (
                      <span
                        key={s}
                        className="rounded-md bg-fg/5 px-2 py-0.5 text-xs font-mono text-fg transition-colors hover:border-accent/40"
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

