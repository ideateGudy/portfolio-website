'use client';

import { useEffect, useState } from 'react';
import { adminApi, type AnalyticsOverview } from '@/lib/dashboard-api';
import { formatDate, formatRelativeTime } from '@/lib/format';
import {
  EyeIcon,
  ActivityIcon,
  ArrowUpRightIcon,
  SparkIcon,
  GlobeIcon,
  LaptopIcon,
  SmartphoneIcon,
} from '@/components/ui/icons';

const EVENT_TYPE_LABELS: Record<string, { label: string; desc: string; color: string }> = {
  PAGE_VIEW: {
    label: 'Page View',
    desc: 'Loaded a page or article',
    color: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
  },
  RESUME_CLICK: {
    label: 'Résumé Opened',
    desc: 'Clicked View/Download Resume',
    color: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
  },
  PROJECT_CLICK: {
    label: 'Project Viewed',
    desc: 'Followed project demo or repo link',
    color: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
  },
  CONTACT_CLICK: {
    label: 'Contact Started',
    desc: 'Opened message modal or clicked email',
    color: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
  },
  SOCIAL_CLICK: {
    label: 'Social Profile',
    desc: 'Clicked GitHub, LinkedIn, or X',
    color: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
  },
  LIKE: {
    label: 'Post Liked',
    desc: 'Gave a heart to an article',
    color: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30',
  },
  COMMENT: {
    label: 'Comment Posted',
    desc: 'Submitted comment on an article',
    color: 'bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30',
  },
};

function formatFriendlyPath(path: string): { title: string; subtitle: string } {
  if (!path || path === '/') {
    return { title: 'Home Portfolio', subtitle: 'Main landing page' };
  }
  if (path === '/blog') {
    return { title: 'Blog Index', subtitle: 'All published articles' };
  }
  if (path.startsWith('/blog/')) {
    const slug = path.replace('/blog/', '').replace(/#.*$/, '');
    const cleanTitle = slug
      .split('-')
      .map((w) => (w.length > 0 ? w[0].toUpperCase() + w.slice(1) : ''))
      .join(' ');
    return { title: cleanTitle || 'Blog Article', subtitle: path };
  }
  if (path.startsWith('#') || path.includes('#')) {
    const section = path.split('#')[1] || '';
    return {
      title: `${section.charAt(0).toUpperCase() + section.slice(1)} Section`,
      subtitle: `Navigated to anchor ${path}`,
    };
  }
  return { title: path, subtitle: 'Site page' };
}

export default function AnalyticsClient() {
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);
  const [error, setError] = useState<string | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<{
    date: string;
    views: number;
    actions: number;
    visitors: number;
  } | null>(null);

  useEffect(() => {
    let active = true;
    void adminApi.analytics
      .getOverview(days)
      .then((res) => {
        if (active) {
          setData(res);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (active) {
          setError(e instanceof Error ? e.message : 'Failed to load analytics');
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [days]);

  // Aggregate totals for the active timeline period
  const periodViews = data?.timeline.reduce((acc, t) => acc + t.views, 0) ?? 0;
  const periodActions = data?.timeline.reduce((acc, t) => acc + t.actions, 0) ?? 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-fg">Visitor Insights & Analytics</h1>
          <p className="mt-1 text-sm text-muted">
            Readable breakdown of who is visiting your portfolio, what browser they use, and how they interact.
          </p>
        </div>

        {/* Range picker */}
        <div className="flex items-center gap-1 rounded-full border border-line bg-surface p-1 text-xs font-medium">
          {[7, 14, 30].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => {
                setLoading(true);
                setDays(d);
              }}
              className={`rounded-full px-3.5 py-1.5 transition-colors cursor-pointer ${
                days === d
                  ? 'bg-accent text-accent-fg font-semibold shadow-xs'
                  : 'text-muted hover:text-fg'
              }`}
            >
              Past {d} Days
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div role="alert" className="glass p-4 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Top 4 Essential KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass flex flex-col justify-between p-5">
          <div className="flex items-center justify-between text-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Page Views</span>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/10 text-emerald-500">
              <EyeIcon size={16} />
            </span>
          </div>
          <div className="mt-4">
            <p className="font-mono text-3xl font-bold text-fg">
              {loading ? '…' : (data?.summary.pageViews ?? 0).toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-muted">
              {loading ? '…' : `${periodViews.toLocaleString()} views in past ${days}d`}
            </p>
          </div>
        </div>

        <div className="glass flex flex-col justify-between p-5">
          <div className="flex items-center justify-between text-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">Unique Visitors</span>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent/10 text-accent">
              <ActivityIcon size={16} />
            </span>
          </div>
          <div className="mt-4">
            <p className="font-mono text-3xl font-bold text-fg">
              {loading ? '…' : (data?.summary.uniqueVisitors ?? 0).toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-muted">Unique browser sessions tracked</p>
          </div>
        </div>

        <div className="glass flex flex-col justify-between p-5">
          <div className="flex items-center justify-between text-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">Résumé Clicks</span>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-amber-500/10 text-amber-500">
              <ArrowUpRightIcon size={16} />
            </span>
          </div>
          <div className="mt-4">
            <p className="font-mono text-3xl font-bold text-fg">
              {loading ? '…' : (data?.summary.resumeClicks ?? 0).toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-muted">Recruiter & client interest signals</p>
          </div>
        </div>

        <div className="glass flex flex-col justify-between p-5">
          <div className="flex items-center justify-between text-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">Key Interactions</span>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-purple-500/10 text-purple-500">
              <SparkIcon size={16} />
            </span>
          </div>
          <div className="mt-4">
            <p className="font-mono text-3xl font-bold text-fg">
              {loading ? '…' : (data?.summary.totalEvents ?? 0).toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-muted">
              {loading ? '…' : `${periodActions.toLocaleString()} actions in past ${days}d`}
            </p>
          </div>
        </div>
      </div>

      {/* Traffic & Interaction Velocity Chart */}
      <div className="glass p-5 sm:p-6">
        <div className="flex flex-col gap-4 border-b border-line pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-fg">Daily Visitor Traffic & Interactions</h2>
            <p className="text-xs text-muted">
              Day-by-day activity trend. Hover over any bar to inspect specific date metrics.
            </p>
          </div>

          <div className="flex items-center gap-5 text-xs font-medium">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-xs bg-emerald-500" />
              <span className="text-fg">Page Views</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-xs bg-amber-500" />
              <span className="text-fg">Actions & Clicks</span>
            </div>
          </div>
        </div>

        {/* Live Hover Readout Box */}
        <div className="my-3 min-h-[28px] rounded-lg bg-fg/[0.03] px-3 py-1.5 text-xs text-muted flex items-center justify-between">
          {hoveredPoint ? (
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-semibold text-fg">{hoveredPoint.date}</span>
              <span>·</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                {hoveredPoint.views} page {hoveredPoint.views === 1 ? 'view' : 'views'}
              </span>
              <span>·</span>
              <span className="text-amber-600 dark:text-amber-400 font-medium">
                {hoveredPoint.actions} interactive {hoveredPoint.actions === 1 ? 'action' : 'actions'}
              </span>
              <span>·</span>
              <span className="text-fg font-medium">
                {hoveredPoint.visitors} unique {hoveredPoint.visitors === 1 ? 'visitor' : 'visitors'}
              </span>
            </div>
          ) : (
            <span className="italic text-muted">
              Tip: Hover across dates to view day-specific stats
            </span>
          )}
        </div>

        {loading ? (
          <p className="py-14 text-center text-sm text-muted">Loading chart…</p>
        ) : !data?.timeline || data.timeline.length === 0 ? (
          <p className="py-14 text-center text-sm text-muted">No activity records found in this range.</p>
        ) : (
          (() => {
            const maxVal = Math.max(
              ...data.timeline.map((t) => Math.max(t.views, t.actions)),
              6
            );

            return (
              <div className="relative pt-4">
                {/* Horizontal guide lines */}
                <div className="pointer-events-none absolute inset-x-0 top-4 bottom-8 flex flex-col justify-between opacity-15">
                  <div className="border-b border-fg" />
                  <div className="border-b border-fg" />
                  <div className="border-b border-fg" />
                </div>

                <div className="scroll-x overflow-x-auto pb-2">
                  <div className="flex h-52 min-w-[620px] items-end gap-1.5 px-2">
                    {data.timeline.map((point) => {
                      const viewsPercent = Math.round((point.views / maxVal) * 100);
                      const actionsPercent = Math.round((point.actions / maxVal) * 100);
                      const isHovered = hoveredPoint?.date === point.date;
                      const dayLabel = point.date.slice(5); // MM-DD

                      return (
                        <div
                          key={point.date}
                          onMouseEnter={() => setHoveredPoint(point)}
                          onMouseLeave={() => setHoveredPoint(null)}
                          className={`group flex flex-1 flex-col items-center gap-2 rounded-md p-1 transition-colors cursor-pointer ${
                            isHovered ? 'bg-fg/5' : 'hover:bg-fg/[0.02]'
                          }`}
                        >
                          <div className="flex h-36 w-full items-end justify-center gap-1.5">
                            {/* Page Views Bar */}
                            <div
                              style={{ height: `${Math.max(viewsPercent, point.views > 0 ? 8 : 2)}%` }}
                              className={`w-full max-w-[14px] rounded-t-xs transition-all ${
                                point.views > 0
                                  ? 'bg-emerald-500 group-hover:brightness-110'
                                  : 'bg-emerald-500/15'
                              }`}
                            />
                            {/* Actions Bar */}
                            <div
                              style={{ height: `${Math.max(actionsPercent, point.actions > 0 ? 8 : 2)}%` }}
                              className={`w-full max-w-[14px] rounded-t-xs transition-all ${
                                point.actions > 0
                                  ? 'bg-amber-500 group-hover:brightness-110'
                                  : 'bg-amber-500/15'
                              }`}
                            />
                          </div>
                          <span
                            className={`font-mono text-[10px] whitespace-nowrap transition-colors ${
                              isHovered ? 'font-bold text-fg' : 'text-muted'
                            }`}
                          >
                            {dayLabel}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })()
        )}
      </div>

      {/* Technology & Environment Breakdown */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Browsers Used */}
        <div className="glass p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <GlobeIcon size={18} className="text-accent" />
            <h2 className="text-base font-semibold text-fg">Browsers Used by Visitors</h2>
          </div>
          {loading ? (
            <p className="py-6 text-center text-sm text-muted">Loading…</p>
          ) : !data?.browsers || data.browsers.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted">
              Browser telemetry will appear here as new visitors browse the site.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {data.browsers.map((b) => {
                const total = data.browsers?.reduce((acc, curr) => acc + curr.count, 0) || 1;
                const pct = Math.round((b.count / total) * 100);
                return (
                  <div key={b.name} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-fg">{b.name}</span>
                      <span className="font-mono text-muted">
                        {b.count} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-fg/5 overflow-hidden">
                      <div
                        style={{ width: `${pct}%` }}
                        className="h-full rounded-full bg-accent"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Devices & Systems */}
        <div className="glass p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <LaptopIcon size={18} className="text-emerald-500" />
            <h2 className="text-base font-semibold text-fg">Devices & Operating Systems</h2>
          </div>
          {loading ? (
            <p className="py-6 text-center text-sm text-muted">Loading…</p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted block mb-2">
                  Device Category
                </span>
                {(!data?.devices || data.devices.length === 0) ? (
                  <p className="text-xs text-muted">No data yet</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {data.devices.map((d) => (
                      <div key={d.name} className="flex items-center justify-between text-xs">
                        <span className="capitalize text-fg flex items-center gap-1.5">
                          {d.name === 'mobile' ? <SmartphoneIcon size={13} /> : <LaptopIcon size={13} />}
                          {d.name}
                        </span>
                        <span className="font-mono text-muted">{d.count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted block mb-2">
                  Platform / OS
                </span>
                {(!data?.operatingSystems || data.operatingSystems.length === 0) ? (
                  <p className="text-xs text-muted">No data yet</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {data.operatingSystems.slice(0, 4).map((o) => (
                      <div key={o.name} className="flex items-center justify-between text-xs">
                        <span className="text-fg">{o.name}</span>
                        <span className="font-mono text-muted">{o.count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pages & Action Breakdown */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Popular Paths */}
        <div className="glass p-5 sm:p-6">
          <h2 className="mb-1 text-base font-semibold text-fg">Top Visited Pages & Sections</h2>
          <p className="mb-4 text-xs text-muted">Which pages and portfolio sections get the most attention.</p>

          {loading ? (
            <p className="py-6 text-center text-sm text-muted">Loading…</p>
          ) : !data?.eventsByPath || data.eventsByPath.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted">No page hits logged yet.</p>
          ) : (
            <div className="flex flex-col divide-y divide-line">
              {data.eventsByPath.map((item) => {
                const friendly = formatFriendlyPath(item.path);
                return (
                  <div key={item.path} className="flex items-center justify-between py-2.5">
                    <div className="flex flex-col min-w-0 pr-3">
                      <span className="text-sm font-medium text-fg truncate">{friendly.title}</span>
                      <span className="font-mono text-[11px] text-muted truncate">{friendly.subtitle}</span>
                    </div>
                    <span className="rounded-full bg-accent/10 px-2.5 py-0.5 font-mono text-xs font-semibold text-accent shrink-0">
                      {item.count} {item.count === 1 ? 'view' : 'views'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Action Types */}
        <div className="glass p-5 sm:p-6">
          <h2 className="mb-1 text-base font-semibold text-fg">Interactions by Category</h2>
          <p className="mb-4 text-xs text-muted">What users do when browsing your portfolio.</p>

          {loading ? (
            <p className="py-6 text-center text-sm text-muted">Loading…</p>
          ) : !data?.eventsByType || data.eventsByType.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted">No activity events logged yet.</p>
          ) : (
            <div className="flex flex-col divide-y divide-line">
              {data.eventsByType.map((item) => {
                const info = EVENT_TYPE_LABELS[item.type] || {
                  label: item.type,
                  desc: 'Interaction event',
                  color: 'bg-fg/5 text-fg border-line',
                };
                return (
                  <div key={item.type} className="flex items-center justify-between py-2.5">
                    <div className="flex flex-col min-w-0 pr-3">
                      <span className="text-sm font-medium text-fg">{info.label}</span>
                      <span className="text-xs text-muted">{info.desc}</span>
                    </div>
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-xs font-bold ${info.color}`}>
                      {item.count}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Live Visitor Activity Stream */}
      <div className="glass p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between border-b border-line pb-3">
          <div>
            <h2 className="text-base font-semibold text-fg">Live Activity Stream</h2>
            <p className="text-xs text-muted">Real-time chronologically tracked visitor actions with clear context.</p>
          </div>
          <span className="inline-flex items-center gap-1.5 font-mono text-xs text-emerald-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Live Feed
          </span>
        </div>

        {loading ? (
          <p className="py-8 text-center text-sm text-muted">Loading activity stream…</p>
        ) : !data?.recentFeed || data.recentFeed.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">No visitor activity captured yet.</p>
        ) : (
          <div className="flex flex-col divide-y divide-line">
            {data.recentFeed.map((event) => {
              const info = EVENT_TYPE_LABELS[event.type] || {
                label: event.type,
                desc: '',
                color: 'bg-fg/5 text-fg border-line',
              };
              const friendly = formatFriendlyPath(event.path);
              const meta = event.metadata && typeof event.metadata === 'object' ? (event.metadata as Record<string, unknown>) : null;
              const browserLabel = typeof meta?.browser === 'string' ? meta.browser : null;
              const deviceLabel = typeof meta?.device === 'string' ? meta.device : null;

              return (
                <div
                  key={event.id}
                  className="flex flex-col gap-1.5 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex flex-wrap items-center gap-2 min-w-0">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-semibold ${info.color}`}
                    >
                      {info.label}
                    </span>
                    <span className="text-sm font-medium text-fg">
                      {friendly.title}
                    </span>
                    {event.entityId && (
                      <span className="rounded bg-fg/5 px-1.5 py-0.5 font-mono text-xs text-muted">
                        {event.entityId}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted font-mono sm:shrink-0">
                    {browserLabel && (
                      <span className="inline-flex items-center gap-1 rounded bg-fg/5 px-2 py-0.5 text-[11px] text-fg">
                        {browserLabel}
                        {deviceLabel ? ` · ${deviceLabel}` : ''}
                      </span>
                    )}
                    <span title={`Visitor Session ID: ${event.visitorId}`}>
                      Visitor #{event.visitorId}
                    </span>
                    <span>·</span>
                    <time dateTime={event.createdAt} title={formatDate(event.createdAt)}>
                      {formatRelativeTime(event.createdAt)}
                    </time>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
