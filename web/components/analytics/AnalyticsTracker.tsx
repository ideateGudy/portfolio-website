'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackActivity } from '@/lib/analytics';

/**
 * Global Analytics Tracker component:
 * - Automatically tracks route and page changes
 * - Tracks document visibility (sessions)
 * - Listens for global clicks on data-analytics attributes (e.g. resume, contact, project links)
 */
export function AnalyticsTracker() {
  const pathname = usePathname();
  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    // Avoid double logging identical paths on fast re-renders
    if (lastPathRef.current === pathname) return;
    lastPathRef.current = pathname;

    // Track page view
    trackActivity({
      type: 'PAGE_VIEW',
      path: pathname,
    });
  }, [pathname]);

  useEffect(() => {
    // Delegated click listener for declared analytics actions
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // 1. Resume download / view links
      const resumeEl = target.closest('a[href*="resume"], a[href*="drive.google"], a[href*="docs.google"], [data-analytics="resume"]');
      if (resumeEl) {
        trackActivity({
          type: 'RESUME_CLICK',
          path: window.location.pathname,
          metadata: { href: resumeEl.getAttribute('href') },
        });
        return;
      }

      // 2. Contact modal / mailto clicks
      const contactEl = target.closest('a[href^="mailto:"], [data-analytics="contact"], button[aria-label*="contact" i]');
      if (contactEl) {
        trackActivity({
          type: 'CONTACT_CLICK',
          path: window.location.pathname,
          metadata: { text: contactEl.textContent?.trim() },
        });
        return;
      }

      // 3. Social media links
      const socialEl = target.closest('a[href*="github.com"], a[href*="x.com"], a[href*="twitter.com"], a[href*="linkedin.com"], a[href*="dev.to"]');
      if (socialEl) {
        const href = socialEl.getAttribute('href') || '';
        let network = 'other';
        if (href.includes('github.com')) network = 'github';
        else if (href.includes('x.com') || href.includes('twitter.com')) network = 'x';
        else if (href.includes('linkedin.com')) network = 'linkedin';
        else if (href.includes('dev.to')) network = 'devto';

        trackActivity({
          type: 'SOCIAL_CLICK',
          entityId: network,
          path: window.location.pathname,
          metadata: { href },
        });
        return;
      }

      // 4. Project live site / repo clicks
      const projectEl = target.closest('[data-analytics="project"]');
      if (projectEl) {
        trackActivity({
          type: 'PROJECT_CLICK',
          entityId: projectEl.getAttribute('data-project-id') || undefined,
          metadata: { title: projectEl.getAttribute('data-project-title') },
        });
      }
    };

    document.addEventListener('click', handleGlobalClick, { passive: true });
    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  return null;
}

