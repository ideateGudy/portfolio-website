'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApi, type AdminPost } from '@/lib/dashboard-api';
import { useUIStore } from '@/store/ui';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/format';

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
    void load();
  }, [load]);

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
          <div className="scroll-x overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs tracking-wide text-muted uppercase">
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Status</th>
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
                    <td className="px-4 py-3 text-muted">{formatDate(post.publishedAt) || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
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
        )}
      </div>
    </div>
  );
}
