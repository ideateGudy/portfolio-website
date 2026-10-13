import { BackToTop } from '@/components/ui/BackToTop';
import { CopyrightYear } from '@/components/ui/CopyrightYear';
import { SocialLinks } from './SocialLinks';
import type { SocialsContent } from '@/lib/content';

/** Portfolio footer: copyright + socials + back-to-top. No Admin link here (blog footer only). */
export function Footer({ text, socials }: { text: string; socials: SocialsContent }) {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-10 text-center sm:px-6 md:flex-row md:justify-between md:text-left">
        <p className="text-sm text-muted">
          © <CopyrightYear /> {text}
        </p>
        <SocialLinks socials={socials} />
      </div>
      <BackToTop />
    </footer>
  );
}
