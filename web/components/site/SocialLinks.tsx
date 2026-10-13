import { DevToIcon, GithubIcon, LinkedinIcon, XIcon } from '@/components/ui/icons';
import type { SocialsContent } from '@/lib/content';

export function SocialLinks({ socials }: { socials: SocialsContent }) {
  const items = [
    { href: socials.github, label: 'GitHub', Icon: GithubIcon },
    { href: socials.x, label: 'X', Icon: XIcon },
    { href: socials.linkedin, label: 'LinkedIn', Icon: LinkedinIcon },
    { href: socials.devto, label: 'dev.to', Icon: DevToIcon },
  ].filter((i) => !!i.href);
  if (items.length === 0) return null;
  return (
    <ul className="flex items-center gap-2" aria-label="Social links">
      {items.map(({ href, label, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="grid h-10 w-10 place-items-center rounded-full border border-line text-muted transition-colors hover:bg-fg/5 hover:text-fg"
          >
            <Icon size={18} />
          </a>
        </li>
      ))}
    </ul>
  );
}
