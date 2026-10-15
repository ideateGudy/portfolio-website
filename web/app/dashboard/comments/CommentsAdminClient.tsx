'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { adminApi, type AdminComment, type AdminPost } from '@/lib/dashboard-api';
import { useUIStore } from '@/store/ui';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/format';
import { CheckIcon, CloseIcon, HeartIcon } from '@/components/ui/icons';

function StatusBadge({ status }: { status: AdminComment['status'] }) {
  if (status === 'APPROVED') {
    return (
      <span className="inline-flex items-center rounded-full border border-emerald-600/40 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-xs text-emerald-600 dark:text-emerald-400">
        Approved
      </span>
    );
  }
  if (status === 'REJECTED') {
    return (
      <span className="inline-flex items-center rounded-full border border-red-600/40 bg-red-500/10 px-2.5 py-0.5 font-mono text-xs text-red-600 dark:text-red-400">
        Rejected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full border border-amber-600/40 bg-amber-500/10 px-2.5 py-0.5 font-mono text-xs font-semibold text-amber-600 dark:text-amber-400">
      Pending Review
    </span>
  );
}

export default function CommentsAdminClient() {
  const searchParams = useSearchParams();
  const selectedPostId = searchParams.get('postId') || '';

  const [comments, setComments] = useState<AdminComment[] | null>(null);
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [filterPostId, setFilterPostId] = useState<string>(selectedPostId);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [error, setError] = useState<string | null>(null);

  const openConfirm = useUIStore((s) => s.openConfirm);
  const toast = useUIStore((s) => s.toast);

  const load = useCallback(async () => {
    setError(null);
    try {
      const [allComments, allPosts] = await Promise.all([
        adminApi.posts.listComments(filterPostId || undefined),
        adminApi.posts.list(),
      ]);
      setComments(allComments);
      setPosts(allPosts);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load comments');
      setComments([]);
    }
  }, [filterPostId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleStatusChange(commentId: string, status: 'APPROVED' | 'REJECTED') {
    try {
      await adminApi.posts.updateCommentStatus(commentId, status);
      toast(status === 'APPROVED' ? 'Comment approved & made public' : 'Comment rejected');
      await load();
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Failed to update status');
    }
  }

  function handleDelete(comment: AdminComment) {
    openConfirm({
      title: 'Delete comment',
      description: `Comment by "${comment.authorName}" will be permanently removed.`,
      confirmLabel: 'Delete',
      onConfirm: async () => {
        await adminApi.posts.deleteComment(comment.id);
        toast('Comment deleted');
        await load();
      },
    });
  }

  const filteredComments = (comments || []).filter((c) => {
    if (filterStatus === 'ALL') return true;
    return c.status === filterStatus;
  });

  const pendingCount = (comments || []).filter((c) => c.status === 'PENDING').length;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-fg">Comments Moderation</h1>
          <p className="mt-1 text-sm text-muted">
            Review, approve, or reject comments and replies before they appear publicly.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <span className="rounded-full bg-amber-500/20 px-3 py-1 font-mono text-xs font-semibold text-amber-600 dark:text-amber-400">
              {pendingCount} Pending Approval
            </span>
          )}
          <Link
            href="/dashboard/posts"
            className="inline-flex h-9 items-center rounded-full border border-line px-4 text-xs font-medium text-fg hover:bg-fg/5"
          >
            ← Back to Posts
          </Link>
        </div>
      </div>

      {error && (
        <p role="alert" className="glass mb-4 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      {/* Filters: mobile-first flex-col, sm:flex-row with min-w-0 to prevent card overflow */}
      <div className="glass mb-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4">
        <div className="flex flex-col gap-1 min-w-0 flex-1 max-w-full">
          <label htmlFor="filter-post" className="text-xs font-medium text-muted">Filter by Post</label>
          <select
            id="filter-post"
            value={filterPostId}
            onChange={(e) => setFilterPostId(e.target.value)}
            className="h-10 sm:h-9 w-full max-w-full rounded-lg border border-line bg-transparent px-3 text-xs text-fg focus-visible:outline-accent truncate"
          >
            <option value="" className="bg-bg text-fg">All Posts</option>
            {posts.map((p) => (
              <option key={p.id} value={p.id} className="bg-bg text-fg truncate">
                {p.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1 min-w-0 sm:w-48 max-w-full">
          <label htmlFor="filter-status" className="text-xs font-medium text-muted">Filter by Status</label>
          <select
            id="filter-status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-10 sm:h-9 w-full max-w-full rounded-lg border border-line bg-transparent px-3 text-xs text-fg focus-visible:outline-accent"
          >
            <option value="ALL" className="bg-bg text-fg">All Statuses</option>
            <option value="PENDING" className="bg-bg text-fg">Pending Review</option>
            <option value="APPROVED" className="bg-bg text-fg">Approved</option>
            <option value="REJECTED" className="bg-bg text-fg">Rejected</option>
          </select>
        </div>
      </div>

      <div className="glass overflow-hidden">
        {comments === null ? (
          <p className="px-4 py-8 text-center text-sm text-muted">Loading comments…</p>
        ) : filteredComments.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted">
            No comments found matching your filters.
          </p>
        ) : (
          <div className="flex flex-col divide-y divide-line">
            {filteredComments.map((comment) => (
              <div key={comment.id} className="p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-fg">{comment.authorName}</span>
                      {comment.parentId && (
                        <span className="rounded bg-fg/10 px-1.5 py-0.5 text-[10px] text-muted">
                          Reply
                        </span>
                      )}
                      <StatusBadge status={comment.status} />
                    </div>
                    <p className="mt-0.5 text-xs text-muted">
                      On <span className="font-medium text-fg">{comment.post?.title ?? 'Post'}</span> ·{' '}
                      {formatDate(comment.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {comment.status !== 'APPROVED' && (
                      <Button
                        variant="primary"
                        className="h-8 gap-1 px-3 text-xs"
                        onClick={() => handleStatusChange(comment.id, 'APPROVED')}
                      >
                        <CheckIcon size={13} />
                        Approve
                      </Button>
                    )}
                    {comment.status !== 'REJECTED' && (
                      <Button
                        variant="secondary"
                        className="h-8 gap-1 px-3 text-xs"
                        onClick={() => handleStatusChange(comment.id, 'REJECTED')}
                      >
                        <CloseIcon size={13} />
                        Reject
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      className="h-8 px-2.5 text-xs text-red-600 dark:text-red-400"
                      onClick={() => handleDelete(comment)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>

                <div className="mt-3 rounded-lg bg-fg/5 p-3 text-sm text-fg whitespace-pre-wrap">
                  {comment.content}
                </div>

                <div className="mt-2 flex items-center gap-4 text-xs text-muted">
                  <span className="inline-flex items-center gap-1">
                    <HeartIcon size={12} className="text-red-500" />
                    {comment._count?.likes ?? 0} likes
                  </span>
                  {comment.post && (
                    <a
                      href={`/blog/${comment.post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent underline underline-offset-2 hover:brightness-110"
                    >
                      View live article ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

