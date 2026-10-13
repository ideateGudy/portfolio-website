import { Reveal } from '@/components/motion/Reveal';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Tag } from '@/components/ui/Tag';
import { CheckIcon } from '@/components/ui/icons';
import type { AboutContent } from '@/lib/content';

export function About({ about, techStack }: { about: AboutContent; techStack: string[] }) {
  return (
    <section id="about" aria-label="About" className="scroll-mt-24 mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <Reveal>
        <SectionHeader index="01" label={about.title} title={about.subtitle} />
      </Reveal>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Reveal delay={0.05}>
          <div className="glass h-full p-6 sm:p-8">
            <p className="text-lg font-semibold text-fg">{about.statement}</p>
            <p className="mt-4 leading-relaxed text-muted">{about.paragraph}</p>
            <ul className="mt-6 flex flex-col gap-3">
              {about.principles.map((p) => (
                <li key={p} className="flex items-start gap-3 text-sm text-fg">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent/10 text-accent">
                    <CheckIcon size={14} />
                  </span>
                  {p}
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
                    <dd className="mt-0.5 text-sm font-medium text-fg">{f.value}</dd>
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
