import Link from 'next/link';
import { BackToTop } from '@/components/ui/BackToTop';
import { CopyrightYear } from '@/components/ui/CopyrightYear';
import { SocialLinks } from './SocialLinks';
import type { SocialsContent } from '@/lib/content';

/**
 * Blog footer: copyright + socials, plus the subtle Admin link → /login.
 * This is the ONLY login entry point (hard rule: never on the portfolio page).
 */
export function BlogFooter({ text, socials }: { text: string; socials: SocialsContent }) {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-10 text-center sm:px-6 md:flex-row md:justify-between md:text-left">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <p className="text-sm text-muted">
            © <CopyrightYear /> {text}
          </p>
          <Link href="/login" className="text-xs text-muted/70 transition-colors hover:text-accent">
            Admin
          </Link>
        </div>
        <SocialLinks socials={socials} />
      </div>
      <BackToTop />
    </footer>
  );
}
