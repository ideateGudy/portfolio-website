import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

/** Slim blog nav: Home · Blog · theme toggle (design §7.1). */
export function BlogNavbar() {
  return (
    <header className="glass navbar-shell sticky top-0 z-40">
      <nav aria-label="Blog" className="mx-auto flex h-16 max-w-6xl items-center gap-1 px-4 sm:px-6">
        <Link href="/" className="rounded-full px-3 py-2 text-sm text-muted transition-colors hover:bg-fg/5 hover:text-fg">
          Home
        </Link>
        <Link href="/blog" aria-current="page" className="rounded-full px-3 py-2 text-sm font-medium text-fg transition-colors hover:bg-fg/5">
          Blog
        </Link>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
