'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { useUIStore } from '@/store/ui';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { ConfirmDelete } from '@/components/ui/ConfirmDelete';
import { MenuIcon, CloseIcon, LogoutIcon, SettingsIcon, CompassIcon, BookOpenIcon } from '@/components/ui/icons';
import { adminApi } from '@/lib/dashboard-api';
import { cld } from '@/lib/format';

const NAV = [
  { href: '/dashboard/posts', label: 'Posts' },
  { href: '/dashboard/projects', label: 'Projects' },
  { href: '/dashboard/content', label: 'Site content' },
  { href: '/dashboard/settings', label: 'Settings' },
];

/**
 * Dashboard shell (design §7.13): sidebar + auth guard + logout icon.
 * Features:
 * - Mobile drawer has no radius, fills 100vh full height cleanly.
 * - Logout icon in mobile header & bottom of side menu.
 * - Settings info card at bottom with user name, profile picture, and link to profile/password settings.
 * - Quick links back to Portfolio and Blog.
 */
export function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { status, user, fetchMe, logout } = useAuthStore();
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);

  const [profile, setProfile] = useState<{ name: string; role: string; avatarUrl: string } | null>(null);

  useEffect(() => {
    if (status === 'idle') void fetchMe();
  }, [status, fetchMe]);

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/login');
  }, [status, router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname, setSidebarOpen]);

  useEffect(() => {
    let active = true;
    void adminApi.content
      .getAll()
      .then((data) => {
        if (!active || !data) return;
        const prof = data.profile as { name?: string; role?: string; avatarUrl?: string } | undefined;
        if (prof) {
          setProfile({
            name: prof.name || 'Goodnews Azonubi',
            role: prof.role || 'Admin',
            avatarUrl: prof.avatarUrl || '',
          });
        }
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  if (status !== 'authenticated') {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-accent" />
          </span>
          <p className="text-sm font-medium text-muted">Checking session…</p>
        </div>
      </main>
    );
  }

  const avatar = profile?.avatarUrl ? cld(profile.avatarUrl, 64) : null;
  const initials = (profile?.name || user?.email || 'Admin')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl gap-6 px-4 py-8 sm:px-6">
      {/* Sidebar (Desktop) */}
      <aside className="hidden w-64 shrink-0 md:block">
        <div className="glass sticky top-20 flex min-h-[calc(100vh-8rem)] flex-col justify-between p-3.5">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-xs font-semibold tracking-wider text-muted uppercase">Dashboard</span>
              <ThemeToggle />
            </div>

            <nav className="mt-2 flex flex-col gap-1">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                    pathname.startsWith(item.href)
                      ? 'bg-accent/10 text-accent font-semibold'
                      : 'text-muted hover:bg-fg/5 hover:text-fg'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Bottom Sidebar Sections */}
          <div className="flex flex-col gap-3 border-t border-line pt-3">
            {/* Quick Public Links */}
            <div className="flex flex-col gap-0.5 px-1">
              <span className="text-[10px] font-semibold tracking-wider text-muted uppercase">Public Links</span>
              <div className="flex items-center gap-2 pt-1 text-xs text-muted">
                <Link
                  href="/"
                  className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-fg/5 hover:text-fg"
                >
                  <CompassIcon size={14} /> Portfolio
                </Link>
                <Link
                  href="/blog"
                  className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-fg/5 hover:text-fg"
                >
                  <BookOpenIcon size={14} /> Blog
                </Link>
              </div>
            </div>

            {/* Profile info & Settings direct link */}
            <div className="flex items-center justify-between rounded-xl bg-fg/5 p-2.5">
              <Link
                href="/dashboard/settings"
                title="Edit profile & change password"
                className="flex min-w-0 flex-1 items-center gap-2.5 rounded-lg transition-opacity hover:opacity-85"
              >
                {avatar ? (
                  <Image
                    src={avatar}
                    alt="Admin Avatar"
                    width={34}
                    height={34}
                    className="h-8.5 w-8.5 rounded-full object-cover"
                  />
                ) : (
                  <span className="grid h-8.5 w-8.5 shrink-0 place-items-center rounded-full bg-accent font-mono text-xs font-bold text-accent-fg">
                    {initials}
                  </span>
                )}
                <div className="min-w-0 flex-1 leading-tight">
                  <p className="truncate text-xs font-semibold text-fg">
                    {profile?.name || user?.email}
                  </p>
                  <p className="flex items-center gap-1 text-[11px] text-muted">
                    <SettingsIcon size={11} /> Settings
                  </p>
                </div>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                title="Log out"
                aria-label="Log out"
                className="grid h-8.5 w-8.5 place-items-center rounded-lg text-muted transition-colors hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400"
              >
                <LogoutIcon size={16} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
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
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={handleLogout}
              title="Log out"
              aria-label="Log out"
              className="grid h-10 w-10 place-items-center rounded-full border border-line text-muted transition-colors hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400"
            >
              <LogoutIcon size={18} />
            </button>
          </div>
        </div>

        {/* Mobile sidebar sheet (full-height, 0 radius on mobile) */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="glass absolute top-0 left-0 flex h-full w-72 flex-col justify-between rounded-none border-t-0 border-b-0 border-l-0 p-4 shadow-2xl">
              <div>
                <div className="mb-4 flex items-center justify-between border-b border-line pb-3">
                  <span className="text-sm font-semibold tracking-wide text-fg uppercase">Dashboard Menu</span>
                  <button
                    type="button"
                    aria-label="Close menu"
                    onClick={() => setSidebarOpen(false)}
                    className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-fg/5 hover:text-fg"
                  >
                    <CloseIcon size={18} />
                  </button>
                </div>
                <nav className="flex flex-col gap-1.5">
                  {NAV.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`rounded-xl px-3 py-2.5 text-sm font-medium ${
                        pathname.startsWith(item.href)
                          ? 'bg-accent/10 text-accent font-semibold'
                          : 'text-muted hover:bg-fg/5 hover:text-fg'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Mobile Drawer Bottom Section */}
              <div className="flex flex-col gap-3 border-t border-line pt-3">
                <div className="flex flex-col gap-1 px-1">
                  <span className="text-[10px] font-semibold tracking-wider text-muted uppercase">Public Links</span>
                  <div className="flex items-center gap-2 pt-1 text-xs text-muted">
                    <Link
                      href="/"
                      className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 hover:bg-fg/5 hover:text-fg"
                    >
                      <CompassIcon size={14} /> Portfolio
                    </Link>
                    <Link
                      href="/blog"
                      className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 hover:bg-fg/5 hover:text-fg"
                    >
                      <BookOpenIcon size={14} /> Blog
                    </Link>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-fg/5 p-2.5">
                  <Link
                    href="/dashboard/settings"
                    className="flex min-w-0 flex-1 items-center gap-2.5"
                    onClick={() => setSidebarOpen(false)}
                  >
                    {avatar ? (
                      <Image
                        src={avatar}
                        alt="Profile avatar"
                        width={34}
                        height={34}
                        className="h-8.5 w-8.5 rounded-full object-cover"
                      />
                    ) : (
                      <span className="grid h-8.5 w-8.5 shrink-0 place-items-center rounded-full bg-accent font-mono text-xs font-bold text-accent-fg">
                        {initials}
                      </span>
                    )}
                    <div className="min-w-0 flex-1 leading-tight">
                      <p className="truncate text-xs font-semibold text-fg">
                        {profile?.name || user?.email}
                      </p>
                      <p className="flex items-center gap-1 text-[11px] text-muted">
                        <SettingsIcon size={11} /> Settings
                      </p>
                    </div>
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    title="Log out"
                    aria-label="Log out"
                    className="grid h-8.5 w-8.5 place-items-center rounded-lg text-muted transition-colors hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400"
                  >
                    <LogoutIcon size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {user && (
          <p className="mb-4 text-xs text-muted">
            Signed in as <span className="font-mono text-fg">{user.email}</span>
          </p>
        )}
        {children}
      </div>

      <ConfirmDelete />
    </div>
  );
}
