'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApi, type AdminPost } from '@/lib/dashboard-api';
import { useUIStore } from '@/store/ui';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/format';
import { EyeIcon, HeartIcon, MessageSquareIcon } from '@/components/ui/icons';

function StatusPill({ status }: { status: AdminPost['status'] }) {
  const published = status === 'PUBLISHED';
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-xs ${
        published
          ? 'border-emerald-600/40 text-emerald-600 dark:text-emerald-400'
          : 'border-line text-muted'
      }`}
    >
      {published ? 'Published' : 'Draft'}
    </span>
  );
}

export default function PostsAdminClient() {
  const [posts, setPosts] = useState<AdminPost[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const openConfirm = useUIStore((s) => s.openConfirm);
  const toast = useUIStore((s) => s.toast);

  const load = useCallback(async () => {
    setError(null);
    try {
      setPosts(await adminApi.posts.list());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load posts');
      setPosts([]);
    }
  }, []);

  useEffect(() => {
    let active = true;
    void adminApi.posts
      .list()
      .then((data) => {
        if (active) setPosts(data);
      })
      .catch((e) => {
        if (active) {
          setError(e instanceof Error ? e.message : 'Failed to load posts');
          setPosts([]);
        }
      });
    return () => {
      active = false;
    };
  }, []);


  function onDelete(post: AdminPost) {
    openConfirm({
      title: 'Delete post',
      description: `“${post.title}” will be permanently removed.`,
      confirmLabel: 'Delete',
      onConfirm: async () => {
        await adminApi.posts.remove(post.id);
        toast('Post deleted');
        await load();
      },
    });
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-fg">Posts</h1>
          <p className="mt-1 text-sm text-muted">Write, edit and publish your articles.</p>
        </div>
        <Link
          href="/dashboard/posts/new"
          className="inline-flex h-11 items-center rounded-full bg-accent px-5 text-sm font-medium text-accent-fg hover:brightness-110"
        >
          New post
        </Link>
      </div>

      {error && (
        <p role="alert" className="glass mb-4 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      <div className="glass overflow-hidden">
        {posts === null ? (
          <p className="px-4 py-8 text-center text-sm text-muted">Loading…</p>
        ) : posts.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted">
            No posts yet. Create your first one.
          </p>
        ) : (
          <>
            {/* Mobile-first card list (visible on < md screens) */}
            <div className="flex flex-col divide-y divide-line md:hidden">
              {posts.map((post) => (
                <div key={post.id} className="flex flex-col gap-3 p-4">
                  {/* Title and Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm text-fg leading-snug">{post.title}</p>
                      <p className="mt-0.5 font-mono text-xs text-muted truncate">/{post.slug}</p>
                    </div>
                    <div className="shrink-0">
                      <StatusPill status={post.status} />
                    </div>
                  </div>

                  {/* Engagement badges */}
                  <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted">
                    <span className="inline-flex items-center gap-1 rounded-md bg-fg/5 px-2 py-0.5 text-fg" title="Unique views">
                      <EyeIcon size={12} className="text-accent" />
                      <span>{post.uniqueViews ?? 0}</span> views
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-fg/5 px-2 py-0.5 text-fg" title="Likes">
                      <HeartIcon size={12} className="text-red-500" />
                      <span>{post.likesCount ?? 0}</span>
                    </span>
                    <Link
                      href={`/dashboard/comments?postId=${post.id}`}
                      className="inline-flex items-center gap-1 rounded-md bg-fg/5 px-2 py-0.5 text-fg transition hover:bg-accent/10 hover:text-accent"
                      title="Comments"
                    >
                      <MessageSquareIcon size={12} className="text-accent" />
                      <span>{post.commentsCount ?? 0}</span>
                      {(post.pendingCommentsCount ?? 0) > 0 && (
                        <span className="ml-1 rounded-full bg-amber-500/20 px-1.5 py-0.2 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                          {post.pendingCommentsCount} pending
                        </span>
                      )}
                    </Link>
                  </div>

                  {/* Date and Action buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-line/40">
                    <span className="text-xs text-muted">
                      {formatDate(post.publishedAt) || 'Draft'}
                    </span>

                    <div className="flex flex-wrap items-center gap-1.5 ml-auto">
                      <Link
                        href={`/dashboard/comments?postId=${post.id}`}
                        className="rounded-full border border-line px-2.5 py-1 text-xs text-fg hover:bg-fg/5"
                      >
                        Comments
                      </Link>
                      {post.status === 'PUBLISHED' && (
                        <a
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full px-2.5 py-1 text-xs text-muted hover:bg-fg/5 hover:text-fg"
                        >
                          View ↗
                        </a>
                      )}
                      <Link
                        href={`/dashboard/posts/${post.id}/edit`}
                        className="rounded-full border border-line px-2.5 py-1 text-xs text-fg hover:bg-fg/5"
                      >
                        Edit
                      </Link>
                      <Button
                        variant="ghost"
                        className="h-7 px-2 text-xs text-red-600 dark:text-red-400"
                        onClick={() => onDelete(post)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop / tablet table (hidden on small screens, visible on md+) */}
            <div className="hidden md:block scroll-x overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead>
                  <tr className="border-b border-line text-xs tracking-wide text-muted uppercase">
                    <th className="px-4 py-3 font-medium">Title</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Engagement</th>
                    <th className="px-4 py-3 font-medium">Published</th>
                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id} className="border-b border-line last:border-0">
                      <td className="px-4 py-3">
                        <span className="font-medium text-fg">{post.title}</span>
                        <span className="mt-0.5 block font-mono text-xs text-muted">/{post.slug}</span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusPill status={post.status} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted">
                          <span className="inline-flex items-center gap-1 rounded-md bg-fg/5 px-2 py-0.5 text-fg" title="Unique views">
                            <EyeIcon size={13} className="text-accent" />
                            <span>{post.uniqueViews ?? 0}</span> views
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-md bg-fg/5 px-2 py-0.5 text-fg" title="Likes">
                            <HeartIcon size={13} className="text-red-500" />
                            <span>{post.likesCount ?? 0}</span>
                          </span>
                          <Link
                            href={`/dashboard/comments?postId=${post.id}`}
                            className="inline-flex items-center gap-1 rounded-md bg-fg/5 px-2 py-0.5 text-fg transition hover:bg-accent/10 hover:text-accent"
                            title="Comments"
                          >
                            <MessageSquareIcon size={13} className="text-accent" />
                            <span>{post.commentsCount ?? 0}</span>
                            {(post.pendingCommentsCount ?? 0) > 0 && (
                              <span className="ml-1 rounded-full bg-amber-500/20 px-1.5 py-0.2 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                                {post.pendingCommentsCount} pending
                              </span>
                            )}
                          </Link>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted">{formatDate(post.publishedAt) || '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/dashboard/comments?postId=${post.id}`}
                            className="rounded-full border border-line px-3 py-1.5 text-xs text-fg hover:bg-fg/5"
                            title="Manage comments"
                          >
                            Comments
                          </Link>
                          {post.status === 'PUBLISHED' && (
                            <a
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-full px-3 py-1.5 text-xs text-muted hover:bg-fg/5 hover:text-fg"
                            >
                              View
                            </a>
                          )}
                          <Link
                            href={`/dashboard/posts/${post.id}/edit`}
                            className="rounded-full border border-line px-3 py-1.5 text-xs text-fg hover:bg-fg/5"
                          >
                            Edit
                          </Link>
                          <Button
                            variant="ghost"
                            className="h-8 px-3 text-xs text-red-600 dark:text-red-400"
                            onClick={() => onDelete(post)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
