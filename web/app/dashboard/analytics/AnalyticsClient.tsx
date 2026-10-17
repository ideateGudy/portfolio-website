'use client';

import { useEffect, useState } from 'react';
import { adminApi, type AnalyticsOverview } from '@/lib/dashboard-api';
import { formatDate, formatRelativeTime } from '@/lib/format';
import { EyeIcon, ActivityIcon, ArrowUpRightIcon, SparkIcon } from '@/components/ui/icons';

const EVENT_TYPE_LABELS: Record<string, { label: string; color: string }> = {
  PAGE_VIEW: { label: 'Page View', color: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' },
  RESUME_CLICK: { label: 'Résumé Click', color: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30' },
  PROJECT_CLICK: { label: 'Project Click', color: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30' },
  CONTACT_CLICK: { label: 'Contact Click', color: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30' },
  SOCIAL_CLICK: { label: 'Social Link', color: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30' },
  LIKE: { label: 'Like', color: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30' },
  COMMENT: { label: 'Comment', color: 'bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30' },
};

export default function AnalyticsClient() {
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-fg">Site Activity & Analytics</h1>
          <p className="mt-1 text-sm text-muted">Real-time visitor interactions, page traffic, and engagement.</p>
        </div>

        {/* Range picker */}
        <div className="flex items-center gap-1.5 rounded-full border border-line bg-surface p-1 text-xs font-medium">
          {[7, 14, 30].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => {
                setLoading(true);
                setDays(d);
              }}
              className={`rounded-full px-3 py-1 transition-colors ${
                days === d
                  ? 'bg-accent text-accent-fg font-semibold'
                  : 'text-muted hover:text-fg'
              }`}
            >
              Last {d} days
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div role="alert" className="glass p-4 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Top Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass flex flex-col justify-between p-5">
          <div className="flex items-center justify-between text-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Page Views</span>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/10 text-emerald-500">
              <EyeIcon size={16} />
            </span>
          </div>
          <p className="mt-4 font-mono text-3xl font-bold text-fg">
            {loading ? '…' : data?.summary.pageViews.toLocaleString() ?? '0'}
          </p>
          <span className="mt-1 text-xs text-muted">Across all pages and articles</span>
        </div>

        <div className="glass flex flex-col justify-between p-5">
          <div className="flex items-center justify-between text-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">Unique Visitors</span>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent/10 text-accent">
              <ActivityIcon size={16} />
            </span>
          </div>
          <p className="mt-4 font-mono text-3xl font-bold text-fg">
            {loading ? '…' : data?.summary.uniqueVisitors.toLocaleString() ?? '0'}
          </p>
          <span className="mt-1 text-xs text-muted">Distinct browsers tracked</span>
        </div>

        <div className="glass flex flex-col justify-between p-5">
          <div className="flex items-center justify-between text-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">Résumé Clicks</span>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-amber-500/10 text-amber-500">
              <ArrowUpRightIcon size={16} />
            </span>
          </div>
          <p className="mt-4 font-mono text-3xl font-bold text-fg">
            {loading ? '…' : data?.summary.resumeClicks.toLocaleString() ?? '0'}
          </p>
          <span className="mt-1 text-xs text-muted">Potential employers & recruiters</span>
        </div>

        <div className="glass flex flex-col justify-between p-5">
          <div className="flex items-center justify-between text-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Interactions</span>
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-purple-500/10 text-purple-500">
              <SparkIcon size={16} />
            </span>
          </div>
          <p className="mt-4 font-mono text-3xl font-bold text-fg">
            {loading ? '…' : data?.summary.totalEvents.toLocaleString() ?? '0'}
          </p>
          <span className="mt-1 text-xs text-muted">Total activities captured</span>
        </div>
      </div>

      {/* Activity Timeline Bar Chart */}
      <div className="glass p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
          <h2 className="text-base font-semibold text-fg">Traffic & Interaction Velocity</h2>
          <div className="flex items-center gap-4 text-xs font-mono text-muted">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-accent" /> Page Views
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-amber-500" /> Actions & Clicks
            </span>
          </div>
        </div>

        {loading ? (
          <p className="py-12 text-center text-sm text-muted">Loading activity graph…</p>
        ) : !data?.timeline || data.timeline.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted">No activity records found in this range.</p>
        ) : (
          (() => {
            const maxVal = Math.max(
              ...data.timeline.map((t) => Math.max(t.views, t.actions)),
              5
            );

            return (
              <div className="scroll-x overflow-x-auto pt-4 pb-2">
                <div className="flex h-44 min-w-[580px] items-end gap-2 px-1">
                  {data.timeline.map((point) => {
                    const viewsPercent = Math.round((point.views / maxVal) * 100);
                    const actionsPercent = Math.round((point.actions / maxVal) * 100);
                    const dayLabel = point.date.slice(5); // MM-DD

                    return (
                      <div
                        key={point.date}
                        className="group flex flex-1 flex-col items-center gap-1.5"
                        title={`${point.date}\n${point.views} views · ${point.actions} actions · ${point.visitors} visitors`}
                      >
                        <div className="flex h-32 w-full items-end justify-center gap-1">
                          {/* Views bar */}
                          <div
                            style={{ height: `${Math.max(viewsPercent, 4)}%` }}
                            className="w-full max-w-[12px] rounded-t-sm bg-accent/70 transition-all group-hover:bg-accent"
                          />
                          {/* Actions bar */}
                          <div
                            style={{ height: `${Math.max(actionsPercent, 4)}%` }}
                            className="w-full max-w-[12px] rounded-t-sm bg-amber-500/70 transition-all group-hover:bg-amber-500"
                          />
                        </div>
                        <span className="font-mono text-[10px] text-muted whitespace-nowrap">
                          {dayLabel}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()
        )}
      </div>

      {/* Breakdown: Popular Pages & Event Types */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Popular Paths */}
        <div className="glass p-5 sm:p-6">
          <h2 className="mb-4 text-base font-semibold text-fg">Top Visited Pages & Anchors</h2>
          {loading ? (
            <p className="py-6 text-center text-sm text-muted">Loading…</p>
          ) : !data?.eventsByPath || data.eventsByPath.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted">No page hits logged yet.</p>
          ) : (
            <div className="flex flex-col divide-y divide-line">
              {data.eventsByPath.map((item) => (
                <div key={item.path} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="font-mono text-xs text-fg truncate pr-3">{item.path || '/'}</span>
                  <span className="font-mono text-xs font-semibold text-accent shrink-0">
                    {item.count} {item.count === 1 ? 'hit' : 'hits'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Types */}
        <div className="glass p-5 sm:p-6">
          <h2 className="mb-4 text-base font-semibold text-fg">Activity by Event Category</h2>
          {loading ? (
            <p className="py-6 text-center text-sm text-muted">Loading…</p>
          ) : !data?.eventsByType || data.eventsByType.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted">No activity events logged yet.</p>
          ) : (
            <div className="flex flex-col divide-y divide-line">
              {data.eventsByType.map((item) => {
                const badge = EVENT_TYPE_LABELS[item.type] || {
                  label: item.type,
                  color: 'bg-fg/5 text-fg border-line',
                };
                return (
                  <div key={item.type} className="flex items-center justify-between py-2.5 text-sm">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-xs font-medium ${badge.color}`}>
                      {badge.label}
                    </span>
                    <span className="font-mono text-xs font-semibold text-fg shrink-0">
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
            <p className="text-xs text-muted">Real-time chronologically tracked visitor actions.</p>
          </div>
          <span className="inline-flex items-center gap-1.5 font-mono text-xs text-emerald-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Live
          </span>
        </div>

        {loading ? (
          <p className="py-8 text-center text-sm text-muted">Loading activity stream…</p>
        ) : !data?.recentFeed || data.recentFeed.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">No visitor activity captured yet.</p>
        ) : (
          <div className="flex flex-col divide-y divide-line">
            {data.recentFeed.map((event) => {
              const badge = EVENT_TYPE_LABELS[event.type] || {
                label: event.type,
                color: 'bg-fg/5 text-fg border-line',
              };

              return (
                <div key={event.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[11px] font-semibold ${badge.color}`}>
                      {badge.label}
                    </span>
                    <span className="font-mono text-xs text-fg font-medium">{event.path}</span>
                    {event.entityId && (
                      <span className="font-mono text-[11px] text-muted">
                        ({event.entityId})
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted font-mono">
                    <span title={`Visitor ${event.visitorId}`}>ID: {event.visitorId}</span>
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

