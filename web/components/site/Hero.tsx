import Image from 'next/image';
import { Reveal } from '@/components/motion/Reveal';
import { Tag } from '@/components/ui/Tag';
import { SocialLinks } from '@/components/site/SocialLinks';
import { cld } from '@/lib/format';
import type { HeroContent, ProfileContent, SocialsContent } from '@/lib/content';

type Props = { hero: HeroContent; profile: ProfileContent; socials: SocialsContent; resumeUrl: string };

/** Hero: eyebrow → H1 → tagline → intro → CTAs → chips → profile card (design §7.2). */
export function Hero({ hero, profile, socials, resumeUrl }: Props) {
  const avatar = cld(profile.avatarUrl, 192);
  const showResume = resumeUrl || hero.secondaryCta.href;
  return (
    <section aria-label="Introduction" className="mx-auto max-w-6xl px-4 pt-14 pb-10 sm:px-6 lg:pt-20">
      <div className="grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <Reveal>
            <p className="font-mono text-sm text-accent">{hero.greeting}</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-fg text-balance sm:text-5xl">
              {hero.headline}
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-3 text-xl text-muted">{hero.tagline}</p>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="mt-4 max-w-2xl leading-relaxed text-muted">{hero.intro}</p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a href={hero.primaryCta.href || '#projects'} className="inline-flex h-11 items-center rounded-full bg-accent px-5 font-medium text-accent-fg transition hover:brightness-[1.08]">
                {hero.primaryCta.label || 'Show my work'}
              </a>
              {showResume ? (
                <a href={resumeUrl || hero.secondaryCta.href} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center rounded-full border border-line px-5 font-medium text-fg transition-colors hover:bg-fg/5">
                  {hero.secondaryCta.label || 'View Resume'}
                </a>
              ) : null}
            </div>
          </Reveal>
          <Reveal delay={0.3}>
            <ul aria-label="Core technologies" className="mt-6 flex flex-wrap gap-2">
              {hero.techChips.map((chip) => (
                <li key={chip}><Tag>{chip}</Tag></li>
              ))}
            </ul>
          </Reveal>
        </div>
        <Reveal delay={0.15}>
          <aside aria-label="Profile" className="glass p-6">
            <div className="flex items-center gap-4">
              {avatar ? (
                <Image src={avatar} alt={`${profile.name} profile photo`} width={96} height={96} priority className="h-24 w-24 rounded-full object-cover" />
              ) : (
                <span aria-hidden className="grid h-24 w-24 place-items-center rounded-full bg-accent font-mono text-2xl font-bold text-accent-fg">
                  {profile.name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()}
                </span>
              )}
              <div>
                <p className="text-lg font-semibold text-fg">{profile.name}</p>
                <p className="text-sm text-muted">{profile.role}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              <span className="font-medium text-fg">Current focus:</span> {hero.currentFocus}
            </p>
            <div className="mt-4"><SocialLinks socials={socials} /></div>
            <p className="mt-4 border-t border-line pt-4 text-xs text-muted">{hero.availability}</p>
          </aside>
        </Reveal>
      </div>
    </section>
  );
}
