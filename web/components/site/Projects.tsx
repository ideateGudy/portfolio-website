import Image from 'next/image';
import { Reveal } from '@/components/motion/Reveal';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Tag } from '@/components/ui/Tag';
import { ArrowUpRightIcon } from '@/components/ui/icons';
import { cld } from '@/lib/format';
import type { Project } from '@/lib/api';
import type { ProjectsHeader } from '@/lib/content';

/** Project card: cover → index → title → description → tech → links (design §7.4). */
export function Projects({ header, projects }: { header: ProjectsHeader; projects: Project[] }) {
  return (
    <section id="projects" aria-label="Projects" className="scroll-mt-24 mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <Reveal>
        <SectionHeader index="02" label={header.subtitle} title={header.sectionTitle} subtitle={header.sectionSubtitle} />
      </Reveal>
      {projects.length === 0 ? (
        <p className="mt-8 text-muted">Projects are being updated — check back soon.</p>
      ) : (
        <ol className="mt-8 grid gap-6 md:grid-cols-2">
          {projects.map((p, i) => {
            const cover = cld(p.imageUrl, 800);
            const num = String(i + 1).padStart(2, '0');
            return (
              <li key={p.id}>
                <Reveal delay={Math.min(i * 0.06, 0.3)} className="h-full">
                  <article className="glass glass-hover flex h-full flex-col overflow-hidden">
                    {cover ? (
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image
                          src={cover}
                          alt={p.imageAlt || `${p.title} preview`}
                          fill
                          sizes="(min-width: 768px) 50vw, 100vw"
                          loading={i === 0 ? 'eager' : 'lazy'}
                          className="object-cover transition-transform duration-200 hover:scale-[1.03]"
                        />
                      </div>
                    ) : null}
                    <div className="flex flex-1 flex-col p-6">
                      <p aria-hidden className="font-mono text-sm text-accent">{num}</p>
                      <h3 className="mt-1 text-xl font-semibold text-fg">{p.title}</h3>
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{p.description}</p>
                      {p.tech.length > 0 ? (
                        <ul aria-label="Technologies" className="mt-4 flex flex-wrap gap-2">
                          {p.tech.map((t) => (
                            <li key={t}><Tag>{t}</Tag></li>
                          ))}
                        </ul>
                      ) : null}
                      <div className="mt-4 flex flex-wrap gap-4 border-t border-line pt-4 text-sm font-medium">
                        {p.liveUrl ? (
                          <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-accent hover:underline">
                            Live site <ArrowUpRightIcon size={16} />
                          </a>
                        ) : null}
                        {p.repoUrl ? (
                          <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-accent hover:underline">
                            Code <ArrowUpRightIcon size={16} />
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
