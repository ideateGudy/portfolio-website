import { Reveal } from '@/components/motion/Reveal';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ProjectsIcon } from '@/components/ui/icons';
import type { ExperienceContent, ExperienceItem } from '@/lib/content';

/**
 * Parses and formats description text that contains bullet points:
 * e.g., sentences separated by " • ", "•", "- ", "* ", or newline bullet points.
 */
function FormattedDescription({ text }: { text: string }) {
  if (!text) return null;

  // Check if text has bullet markers (e.g. " • ", "\n•", "\n-", or starts with "•")
  const hasBullets = text.includes('•') || /^\s*[-*]\s+/m.test(text);

  if (!hasBullets) {
    return <p className="mt-3.5 text-sm leading-relaxed text-muted">{text}</p>;
  }

  // Split by bullet markers, newlines, or inline bullets
  const parts = text
    .split(/(?:^|\n|\s+)•\s*|(?:\r?\n\s*[-*]\s+)/g)
    .map((p) => p.trim())
    .filter(Boolean);

  if (parts.length <= 1) {
    return <p className="mt-3.5 text-sm leading-relaxed text-muted">{text}</p>;
  }

  return (
    <ul className="mt-3.5 space-y-2 text-sm leading-relaxed text-muted">
      {parts.map((item, idx) => (
        <li key={idx} className="flex items-start gap-2.5">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/70" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

type CompanyGroup = {
  company: string;
  items: ExperienceItem[];
};

/**
 * Groups consecutive or same-company experience items so multiple roles
 * at the same company (e.g., Coriftech Solutions: Frontend Instructor & Frontend Developer)
 * appear together inside a single card with an internal timeline rail, exactly like LinkedIn!
 */
function groupExperienceByCompany(items: ExperienceItem[]): CompanyGroup[] {
  const groups: CompanyGroup[] = [];
  const map = new Map<string, CompanyGroup>();

  for (const item of items) {
    const key = (item.company || '').trim().toLowerCase();
    if (!key) {
      groups.push({ company: item.company || 'Experience', items: [item] });
      continue;
    }
    const existing = map.get(key);
    if (existing) {
      existing.items.push(item);
    } else {
      const newGroup: CompanyGroup = { company: item.company, items: [item] };
      map.set(key, newGroup);
      groups.push(newGroup);
    }
  }

  return groups;
}

/**
 * Professional LinkedIn-styled Experience timeline:
 * - Grouped by company (single card for multiple roles at the same company)
 * - Timeline rail connecting company and roles
 * - Clean bullet point formatting for achievements
 * - Skills chips per role
 */
export function Experience({ experience }: { experience: ExperienceContent }) {
  const companyGroups = groupExperienceByCompany(experience.items);

  return (
    <section id="experience" aria-label="Experience" className="scroll-mt-24 mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <Reveal>
        <SectionHeader index="04" label={experience.title} title={experience.subtitle} />
      </Reveal>

      <ol className="relative mt-8 flex flex-col gap-8 border-l border-line pl-6 sm:pl-8">
        {companyGroups.map((group, groupIdx) => {
          const isMultiRole = group.items.length > 1;

          return (
            <li key={`${group.company}-${groupIdx}`} className="relative">
              {/* Outer timeline node */}
              <span
                aria-hidden
                className="absolute top-7 -left-6 flex h-3.5 w-3.5 -translate-x-[calc(50%-0.5px)] items-center justify-center rounded-full border-2 border-surface bg-accent sm:-left-8"
              />

              <Reveal delay={Math.min(groupIdx * 0.05, 0.25)}>
                <article className="glass glass-hover p-6 sm:p-8">
                  {/* Company Header */}
                  <div className="flex items-start gap-4">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-accent/10 text-accent ring-1 ring-accent/20">
                      <ProjectsIcon size={24} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xl font-bold tracking-tight text-fg">
                        {group.company}
                      </h3>
                      {isMultiRole ? (
                        <p className="mt-0.5 text-xs font-medium text-muted">
                          {group.items.length} positions
                        </p>
                      ) : null}
                    </div>
                  </div>

                  {/* Roles within company */}
                  <div className={`mt-6 ${isMultiRole ? 'relative pl-5 sm:pl-6 border-l border-line/70 ml-2 sm:ml-2.5 space-y-7' : ''}`}>
                    {group.items.map((item, roleIdx) => (
                      <div key={`${item.role}-${roleIdx}`} className="relative">
                        {isMultiRole ? (
                          /* Internal role timeline bullet */
                          <span
                            aria-hidden
                            className="absolute top-1.5 -left-[25px] sm:-left-[29px] h-2.5 w-2.5 rounded-full border-2 border-surface bg-muted/60"
                          />
                        ) : null}

                        <div>
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                            <h4 className="text-base font-semibold text-fg">
                              {item.role}
                              {item.employmentType ? (
                                <span className="font-normal text-muted"> · {item.employmentType}</span>
                              ) : null}
                            </h4>
                          </div>

                          {(item.duration || item.location) ? (
                            <p className="mt-1 flex flex-wrap items-center gap-2 text-xs font-mono text-muted">
                              {item.duration && <span>{item.duration}</span>}
                              {item.duration && item.location && <span>·</span>}
                              {item.location && <span>{item.location}</span>}
                            </p>
                          ) : null}

                          {/* Description with proper bullet points formatting */}
                          <FormattedDescription text={item.description} />

                          {/* Skills tags */}
                          {item.skills && item.skills.length > 0 ? (
                            <div className="mt-3.5 flex flex-wrap items-center gap-1.5 pt-2">
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
                        </div>
                      </div>
                    ))}
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
