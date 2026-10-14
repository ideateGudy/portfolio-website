'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { CloseIcon, MenuIcon } from '@/components/ui/icons';

/** Sticky glass navbar (design §7.1). No login link on the portfolio page. */
export function Navbar({ name, resumeUrl }: { name: string; resumeUrl: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const links = [
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Services', href: '#services' },
    { label: 'Experience', href: '#experience' },
    { label: 'Writing', href: '#writing' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header className="glass navbar-shell sticky top-0 z-40">
      <nav aria-label="Primary" className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <a href="#top" className="flex min-h-10 items-center gap-2.5">
          <span aria-hidden className="grid h-9 w-9 place-items-center rounded-full bg-accent font-mono text-xs font-bold text-accent-fg">
            {initials || 'GA'}
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-semibold text-fg">{name}</span>
            <span className="flex items-center gap-1.5 text-xs text-muted">
              <span className="relative flex h-2 w-2 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75 duration-1000" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              open to remote roles
            </span>
          </span>
        </a>
        <div className="ml-auto hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="rounded-full px-3 py-2 text-sm text-muted transition-colors hover:bg-fg/5 hover:text-fg">
              {l.label}
            </a>
          ))}
          <Link href="/blog" className="rounded-full px-3 py-2 text-sm text-muted transition-colors hover:bg-fg/5 hover:text-fg">
            Blog
          </Link>
        </div>
        <div className="ml-auto flex items-center gap-2 lg:ml-2">
          <ThemeToggle />
          {resumeUrl ? (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-10 items-center rounded-full border border-line px-4 text-sm font-medium text-fg transition-colors hover:bg-fg/5 sm:inline-flex"
            >
              View Resume
            </a>
          ) : null}
          <button
            type="button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-primary-menu"
            onClick={() => setMenuOpen((open) => !open)}
            className="grid h-10 w-10 place-items-center rounded-full border border-line text-muted transition-colors hover:bg-fg/5 hover:text-fg lg:hidden"
          >
            {menuOpen ? <CloseIcon size={18} /> : <MenuIcon size={18} />}
          </button>
        </div>
      </nav>

      {/* Smooth mobile drawer transition */}
      <div
        id="mobile-primary-menu"
        aria-label="Mobile primary"
        className={`grid transition-all duration-300 ease-in-out lg:hidden border-t border-line overflow-hidden ${
          menuOpen ? 'grid-rows-[1fr] opacity-100 py-3 px-4 sm:px-6' : 'grid-rows-[0fr] opacity-0 py-0 px-4 sm:px-6 border-t-transparent pointer-events-none'
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="mx-auto grid max-w-6xl gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-muted transition-colors hover:bg-fg/5 hover:text-fg"
              >
                {l.label}
              </a>
            ))}
            <Link
              href="/blog"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm text-muted transition-colors hover:bg-fg/5 hover:text-fg"
            >
              Blog
            </Link>
            {resumeUrl ? (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg px-3 py-2.5 text-sm text-muted transition-colors hover:bg-fg/5 hover:text-fg"
              >
                View Resume
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
