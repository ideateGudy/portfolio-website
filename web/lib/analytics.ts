import { getVisitorId } from './interactions-api';

export type ActivityEventType =
  | 'PAGE_VIEW'
  | 'RESUME_CLICK'
  | 'PROJECT_CLICK'
  | 'CONTACT_CLICK'
  | 'SOCIAL_CLICK'
  | 'LIKE'
  | 'COMMENT'
  | string;

export interface TrackEventParams {
  type: ActivityEventType;
  path?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}

export function detectClientInfo(): { browser: string; os: string; device: 'mobile' | 'tablet' | 'desktop' } {
  if (typeof navigator === 'undefined') {
    return { browser: 'Unknown', os: 'Unknown', device: 'desktop' };
  }

  const ua = navigator.userAgent;
  let browser = 'Unknown';
  if (/Edg\//i.test(ua)) browser = 'Edge';
  else if (/Chrome\//i.test(ua) && !/Chromium\//i.test(ua)) browser = 'Chrome';
  else if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) browser = 'Safari';
  else if (/Firefox\//i.test(ua)) browser = 'Firefox';
  else if (/Opera|OPR\//i.test(ua)) browser = 'Opera';
  else if (/MSIE|Trident/i.test(ua)) browser = 'IE';

  let os = 'Unknown';
  if (/Windows/i.test(ua)) os = 'Windows';
  else if (/Macintosh|Mac OS X/i.test(ua)) os = 'macOS';
  else if (/Android/i.test(ua)) os = 'Android';
  else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
  else if (/Linux/i.test(ua)) os = 'Linux';

  let device: 'mobile' | 'tablet' | 'desktop' = 'desktop';
  if (/iPad|Tablet/i.test(ua)) device = 'tablet';
  else if (/Mobi|Android|iPhone/i.test(ua) || (typeof window !== 'undefined' && window.innerWidth <= 768)) {
    device = 'mobile';
  }

  return { browser, os, device };
}

/**
 * Fires a lightweight beacon to log user activity.
 * Safe to fire anywhere (never throws, non-blocking).
 */
export function trackActivity(params: TrackEventParams): void {
  if (typeof window === 'undefined') return;

  try {
    const visitorId = getVisitorId();
    if (!visitorId) return;

    const currentPath = params.path || (window.location.pathname + window.location.hash);
    const client = detectClientInfo();

    const payload = {
      type: params.type,
      path: currentPath,
      entityId: params.entityId,
      metadata: {
        browser: client.browser,
        os: client.os,
        device: client.device,
        ...params.metadata,
        title: typeof document !== 'undefined' ? document.title : undefined,
        referrer: typeof document !== 'undefined' ? document.referrer : undefined,
        screen: `${window.innerWidth}x${window.innerHeight}`,
      },
      visitorId,
    };

    const body = JSON.stringify(payload);

    // Prefer navigator.sendBeacon when available for guaranteed transmission even during page unloads
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon('/backend/analytics/track', blob);
      return;
    }

    // Fallback to fetch with keepalive
    void fetch('/backend/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
      credentials: 'omit',
    }).catch(() => undefined);
  } catch {
    // Analytics failures must never break the user experience
  }
}

