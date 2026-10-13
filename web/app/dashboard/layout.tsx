import type { Metadata } from 'next';
import { DashboardShell } from '@/components/dashboard/DashboardShell';

// DashboardShell checks the client session before rendering protected pages.
// These authenticated routes are intentionally allowed to block on that check.
export const instant = false;

export const metadata: Metadata = {
  title: 'Dashboard',
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main id="main-content" className="min-h-screen">
      <DashboardShell>{children}</DashboardShell>
    </main>
  );
}
