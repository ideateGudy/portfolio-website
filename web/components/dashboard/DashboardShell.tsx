'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { useUIStore } from '@/store/ui';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { ConfirmDelete } from '@/components/ui/ConfirmDelete';
import { MenuIcon, CloseIcon } from '@/components/ui/icons';

const NAV = [
  { href: '/dashboard/posts', label: 'Posts' },
  { href: '/dashboard/projects', label: 'Projects' },
  { href: '/dashboard/content', label: 'Site content' },
  { href: '/dashboard/settings', label: 'Settings' },
];

/**
 * Dashboard shell (design §7.13): sidebar + auth guard + logout. `noindex`
 * is set in the page metadata; middleware already blocks cookie-less hits.
 */
export function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { status, user, fetchMe, logout } = useAuthStore();
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);

  useEffect(() => {
    if (status === 'idle') void fetchMe();
  }, [status, fetchMe]);

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/login');
  }, [status, router]);

  // Close the mobile sidebar on navigation.
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname, setSidebarOpen]);

  if (status !== 'authenticated') {
    return (
      <main className="mx-auto grid min-h-[60vh] max-w-md place-items-center px-4">
        <p className="text-sm text-muted">Checking your session…</p>
      </main>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl gap-6 px-4 py-8 sm:px-6">
      {/* Sidebar (desktop) */}
      <aside className="hidden w-56 shrink-0 md:block">
        <div className="glass sticky top-20 flex flex-col gap-1 p-3">
          <div className="flex items-center justify-between px-3 py-2">
            <p className="text-xs font-semibold tracking-wide text-muted uppercase">Dashboard</p>
            <ThemeToggle />
          </div>
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-xl px-3 py-2 text-sm transition-colors ${
                pathname.startsWith(item.href)
                  ? 'bg-accent/10 text-accent'
                  : 'text-muted hover:bg-fg/5 hover:text-fg'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-2 border-t border-line pt-2">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={async () => {
                await logout();
                router.replace('/login');
              }}
            >
              Log out
            </Button>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        {/* Mobile top bar */}
        <div className="glass mb-4 flex items-center justify-between gap-3 rounded-xl p-3 md:hidden">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setSidebarOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-full text-fg hover:bg-fg/5"
          >
            <MenuIcon size={18} />
          </button>
          <span className="text-sm font-semibold text-fg">Dashboard</span>
          <ThemeToggle />
          <Button
            variant="ghost"
            onClick={async () => {
              await logout();
              router.replace('/login');
            }}
          >
            Log out
          </Button>
        </div>

        {/* Mobile sidebar sheet */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <div className="glass dialog-panel absolute top-0 left-0 h-full w-64 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-fg">Menu</span>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setSidebarOpen(false)}
                  className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-fg/5"
                >
                  <CloseIcon size={18} />
                </button>
              </div>
              <nav className="flex flex-col gap-1">
                {NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-xl px-3 py-2 text-sm ${
                      pathname.startsWith(item.href) ? 'bg-accent/10 text-accent' : 'text-muted hover:bg-fg/5'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}

        {user && (
          <p className="mb-4 text-xs text-muted">
            Signed in as <span className="text-fg">{user.email}</span>
          </p>
        )}
        {children}
      </div>

      <ConfirmDelete />
    </div>
  );
}
