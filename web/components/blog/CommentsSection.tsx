'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { HeartIcon, MessageSquareIcon, CheckIcon } from '@/components/ui/icons';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { cld, formatDate, formatRelativeTime } from '@/lib/format';
import { postInteractionsApi, type PublicComment } from '@/lib/interactions-api';
import { useAuthStore } from '@/store/auth';
import type { ProfileContent } from '@/lib/content';

export function CommentsSection({
  slug,
  profile,
}: {
  slug: string;
  profile?: ProfileContent;
}) {
  const { user, status, fetchMe } = useAuthStore();
  const isLoggedInAuthor = status === 'authenticated' && !!user;

  const [comments, setComments] = useState<PublicComment[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [authorName, setAuthorName] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Replying state
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyName, setReplyName] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [replySubmitting, setReplySubmitting] = useState(false);

  useEffect(() => {
    if (status === 'idle') {
      void fetchMe();
    }
  }, [status, fetchMe]);

  useEffect(() => {
    let active = true;
    void postInteractionsApi
      .listComments(slug)
      .then((items) => {
        if (active) {
          setComments(items);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [slug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    setFeedback(null);
    setError(null);

    try {
      const res = await postInteractionsApi.createComment(slug, {
        authorName: authorName.trim() || undefined,
        content: content.trim(),
      });
      setContent('');
      if (res.comment) {
        setComments((prev) => [...(prev || []), res.comment]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit comment');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReplySubmit(parentId: string) {
    if (!replyContent.trim()) return;

    setReplySubmitting(true);
    setFeedback(null);
    setError(null);

    try {
      const res = await postInteractionsApi.createComment(slug, {
        authorName: replyName.trim() || undefined,
        content: replyContent.trim(),
        parentId,
      });
      setReplyContent('');
      setReplyingToId(null);
      if (res.comment) {
        setComments((prev) => [...(prev || []), res.comment]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit reply');
    } finally {
      setReplySubmitting(false);
    }
  }

  async function handleToggleCommentLike(commentId: string) {
    setComments((prev) => {
      if (!prev) return prev;
      return prev.map((c) => {
        if (c.id === commentId) {
          const nextLiked = !c.hasLiked;
          return {
            ...c,
            hasLiked: nextLiked,
            likesCount: nextLiked ? c.likesCount + 1 : Math.max(0, c.likesCount - 1),
          };
        }
        return c;
      });
    });

    try {
      const res = await postInteractionsApi.toggleCommentLike(commentId);
      setComments((prev) => {
        if (!prev) return prev;
        return prev.map((c) =>
          c.id === commentId ? { ...c, hasLiked: res.liked, likesCount: res.likesCount } : c
        );
      });
    } catch {
      // Revert if error
      setComments((prev) => {
        if (!prev) return prev;
        return prev.map((c) => {
          if (c.id === commentId) {
            const nextLiked = !c.hasLiked;
            return {
              ...c,
              hasLiked: nextLiked,
              likesCount: nextLiked ? c.likesCount + 1 : Math.max(0, c.likesCount - 1),
            };
          }
          return c;
        });
      });
    }
  }

  // Separate root comments and replies
  const rootComments = (comments || []).filter((c) => !c.parentId);
  const repliesByParentId = new Map<string, PublicComment[]>();
  (comments || []).forEach((c) => {
    if (c.parentId) {
      const list = repliesByParentId.get(c.parentId) || [];
      list.push(c);
      repliesByParentId.set(c.parentId, list);
    }
  });

  return (
    <section id="comments-section" aria-label="Comments" className="mt-12 scroll-mt-24">
      <div className="flex items-center justify-between border-b border-line pb-4">
        <h2 className="flex items-center gap-2 text-xl font-bold text-fg">
          <MessageSquareIcon size={20} className="text-accent" />
          Comments & Discussion
          <span className="font-mono text-sm font-normal text-muted">
            ({comments?.length ?? 0})
          </span>
        </h2>
      </div>

      {/* Submission feedback */}
      {feedback && (
        <div role="status" className="mt-4 rounded-xl border border-emerald-600/40 bg-emerald-500/10 p-4 text-sm text-emerald-600 dark:text-emerald-400">
          <p className="font-medium">Thank you for sharing your thoughts!</p>
          <p className="mt-0.5 text-xs text-muted">{feedback}</p>
        </div>
      )}

      {error && (
        <div role="alert" className="mt-4 rounded-xl border border-red-600/40 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* New comment form */}
      <form onSubmit={handleSubmit} className="glass mt-6 flex flex-col gap-3.5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold text-fg">Leave a Comment</p>
          {isLoggedInAuthor && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-medium text-accent">
              <CheckIcon size={12} />
              Posting as Site Author ({profile?.name || user?.email})
            </span>
          )}
        </div>

        {isLoggedInAuthor ? (
          <div className="flex items-center gap-2.5 rounded-lg border border-accent/30 bg-accent/5 p-2.5 text-xs text-muted">
            {profile?.avatarUrl ? (
              <Image
                src={cld(profile.avatarUrl, 64) || profile.avatarUrl}
                alt={profile.name}
                width={32}
                height={32}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <span className="grid h-8 w-8 place-items-center rounded-full bg-accent font-mono text-xs font-bold text-accent-fg">
                {(profile?.name || 'A').slice(0, 2).toUpperCase()}
              </span>
            )}
            <div>
              <p className="font-semibold text-fg">{profile?.name || 'Site Author'}</p>
              <p className="text-[11px] text-muted">{profile?.role || 'Author'}</p>
            </div>
          </div>
        ) : (
          <>
            <p className="text-xs text-muted">
              All guests are welcome. You can provide your name or leave it blank to post as <span className="font-mono text-fg">Anonymous</span>.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                placeholder="Your name (optional — defaults to Anonymous)"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                disabled={submitting}
              />
            </div>
          </>
        )}

        <Textarea
          placeholder={
            isLoggedInAuthor
              ? 'Share your thoughts, reply to readers, or provide updates...'
              : 'Share your thoughts, ask a question, or discuss this article...'
          }
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          required
          disabled={submitting}
        />

        <div className="flex items-center justify-end">
          <Button type="submit" variant="primary" disabled={submitting || !content.trim()} className="h-10 px-5 text-sm">
            {submitting ? 'Submitting…' : 'Post Comment'}
          </Button>
        </div>
      </form>

      {/* Comments list */}
      <div className="mt-8 flex flex-col gap-5">
        {loading ? (
          <p className="py-6 text-center text-sm text-muted">Loading comments…</p>
        ) : rootComments.length === 0 ? (
          <div className="glass rounded-xl p-8 text-center text-sm text-muted">
            <p>No comments yet.</p>
            <p className="mt-1 text-xs">Be the first to share your thoughts!</p>
          </div>
        ) : (
          rootComments.map((comment) => {
            const replies = repliesByParentId.get(comment.id) || [];
            const isReplying = replyingToId === comment.id;
            const isCommentAuthor = !!comment.isAuthor;

            return (
              <div
                key={comment.id}
                className={`glass flex flex-col gap-3 p-4 sm:p-5 ${
                  isCommentAuthor ? 'border-accent/40 bg-accent/2' : ''
                }`}
              >
                {/* Header row: Author + Badge + Role + Date on left, Likes + Reply on right */}
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                  <div className="flex min-w-0 items-center gap-2.5">
                    {comment.authorAvatar ? (
                      <Image
                        src={cld(comment.authorAvatar, 64) || comment.authorAvatar}
                        alt={comment.authorName}
                        width={32}
                        height={32}
                        className="h-8 w-8 shrink-0 rounded-full object-cover ring-1 ring-accent/30"
                      />
                    ) : (
                      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full font-mono text-xs font-bold ${
                        isCommentAuthor
                          ? 'bg-accent text-accent-fg'
                          : 'bg-accent/15 text-accent'
                      }`}>
                        {comment.authorName.slice(0, 2).toUpperCase()}
                      </span>
                    )}

                    <div className="flex flex-col min-w-0">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <span className="font-semibold text-sm text-fg truncate">{comment.authorName}</span>
                        {isCommentAuthor && (
                          <span className="inline-flex items-center rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold text-accent uppercase tracking-wider">
                            Author
                          </span>
                        )}
                        <time
                          dateTime={comment.createdAt}
                          title={formatDate(comment.createdAt)}
                          className="text-xs text-muted whitespace-nowrap"
                        >
                          · {formatRelativeTime(comment.createdAt)}
                        </time>
                      </div>
                      {comment.authorRole && (
                        <span className="text-[11px] text-muted truncate">
                          {comment.authorRole}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5 ml-auto sm:ml-0">
                    <button
                      type="button"
                      onClick={() => handleToggleCommentLike(comment.id)}
                      className={`group flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs transition-colors ${
                        comment.hasLiked
                          ? 'bg-red-500/15 text-red-500 font-semibold'
                          : 'hover:bg-fg/5 text-muted hover:text-fg'
                      }`}
                      aria-label="Like comment"
                    >
                      <HeartIcon
                        size={13}
                        className={`transition-transform duration-200 group-hover:scale-110 ${
                          comment.hasLiked ? 'fill-red-500 text-red-500' : ''
                        }`}
                      />
                      <span>{comment.likesCount}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setReplyingToId(isReplying ? null : comment.id)}
                      className="rounded-full border border-line/60 px-3 py-1 text-xs text-muted transition-colors hover:bg-fg/5 hover:text-fg"
                    >
                      {isReplying ? 'Cancel' : 'Reply'}
                    </button>
                  </div>
                </div>

                <p className="text-sm text-fg whitespace-pre-wrap leading-relaxed wrap-break-word">
                  {comment.content}
                </p>

                {/* Reply Form */}
                {isReplying && (
                  <div className="mt-2 ml-2 sm:ml-4 border-l-2 border-accent pl-3 sm:pl-4 pt-2">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <p className="text-xs font-semibold text-fg">Replying to {comment.authorName}</p>
                      {isLoggedInAuthor && (
                        <span className="text-[11px] text-accent font-medium">
                          Replying as Author
                        </span>
                      )}
                    </div>

                    <div className="mt-2 grid gap-2">
                      {!isLoggedInAuthor && (
                        <Input
                          placeholder="Your name (optional)"
                          value={replyName}
                          onChange={(e) => setReplyName(e.target.value)}
                          disabled={replySubmitting}
                        />
                      )}
                      <Textarea
                        placeholder="Write your reply..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        rows={2}
                        disabled={replySubmitting}
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          className="h-8 px-3 text-xs"
                          onClick={() => setReplyingToId(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          className="h-8 px-3 text-xs"
                          disabled={replySubmitting || !replyContent.trim()}
                          onClick={() => handleReplySubmit(comment.id)}
                        >
                          {replySubmitting ? 'Posting…' : 'Submit Reply'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Nested Replies */}
                {replies.length > 0 && (
                  <div className="mt-3 ml-2 sm:ml-4 flex flex-col gap-3 border-l-2 border-line pl-3 sm:pl-4">
                    {replies.map((reply) => {
                      const isReplyAuthor = !!reply.isAuthor;

                      return (
                        <div
                          key={reply.id}
                          className={`flex flex-col gap-2 rounded-lg p-3 ${
                            isReplyAuthor ? 'bg-accent/10 border border-accent/25' : 'bg-fg/5'
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                            <div className="flex min-w-0 items-center gap-2">
                              {reply.authorAvatar ? (
                                <Image
                                  src={cld(reply.authorAvatar, 48) || reply.authorAvatar}
                                  alt={reply.authorName}
                                  width={24}
                                  height={24}
                                  className="h-6 w-6 shrink-0 rounded-full object-cover ring-1 ring-accent/30"
                                />
                              ) : (
                                <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full font-mono text-[10px] font-bold ${
                                  isReplyAuthor ? 'bg-accent text-accent-fg' : 'bg-accent/15 text-accent'
                                }`}>
                                  {reply.authorName.slice(0, 2).toUpperCase()}
                                </span>
                              )}

                              <div className="flex flex-col min-w-0">
                                <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                                  <span className="font-semibold text-xs text-fg truncate">{reply.authorName}</span>
                                  {isReplyAuthor && (
                                    <span className="inline-flex items-center rounded-full bg-accent/20 px-1.5 py-0.2 text-[9px] font-semibold text-accent uppercase tracking-wider">
                                      Author
                                    </span>
                                  )}
                                  <time
                                    dateTime={reply.createdAt}
                                    title={formatDate(reply.createdAt)}
                                    className="text-[11px] text-muted whitespace-nowrap"
                                  >
                                    · {formatRelativeTime(reply.createdAt)}
                                  </time>
                                </div>
                                {reply.authorRole && (
                                  <span className="text-[10px] text-muted truncate">
                                    {reply.authorRole}
                                  </span>
                                )}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleToggleCommentLike(reply.id)}
                              className={`group flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs transition-colors ml-auto sm:ml-0 ${
                                reply.hasLiked
                                  ? 'bg-red-500/15 text-red-500 font-semibold'
                                  : 'hover:bg-fg/5 text-muted hover:text-fg'
                              }`}
                            >
                              <HeartIcon
                                size={11}
                                className={`transition-transform duration-200 group-hover:scale-110 ${
                                  reply.hasLiked ? 'fill-red-500 text-red-500' : ''
                                }`}
                              />
                              <span>{reply.likesCount}</span>
                            </button>
                          </div>
                          <p className="text-xs text-fg whitespace-pre-wrap leading-relaxed wrap-break-word">
                            {reply.content}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

