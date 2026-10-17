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

    const payload = {
      type: params.type,
      path: currentPath,
      entityId: params.entityId,
      metadata: {
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
