'use client';

import { useEffect, useState } from 'react';
import { EyeIcon, HeartIcon, MessageSquareIcon } from '@/components/ui/icons';
import { postInteractionsApi, type PostInteractions } from '@/lib/interactions-api';

export function PostEngagementBar({ slug }: { slug: string }) {
  const [data, setData] = useState<PostInteractions | null>(null);
  const [liking, setLiking] = useState(false);

  useEffect(() => {
    let active = true;
    // Record view & load interactions once on mount
    void postInteractionsApi.recordView(slug).catch(() => undefined);
    void postInteractionsApi
      .getInteractions(slug)
      .then((res) => {
        if (active) setData(res);
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, [slug]);

  async function handleToggleLike() {
    if (liking) return;
    setLiking(true);
    // Optimistic update
    setData((prev) => {
      if (!prev) return prev;
      const nextLiked = !prev.hasLiked;
      return {
        ...prev,
        hasLiked: nextLiked,
        likesCount: nextLiked ? prev.likesCount + 1 : Math.max(0, prev.likesCount - 1),
      };
    });

    try {
      const res = await postInteractionsApi.togglePostLike(slug);
      setData((prev) => (prev ? { ...prev, hasLiked: res.liked, likesCount: res.likesCount } : null));
    } catch {
      // Revert if error
      setData((prev) => {
        if (!prev) return prev;
        const revertLiked = !prev.hasLiked;
        return {
          ...prev,
          hasLiked: revertLiked,
          likesCount: revertLiked ? prev.likesCount + 1 : Math.max(0, prev.likesCount - 1),
        };
      });
    } finally {
      setLiking(false);
    }
  }

  function scrollToComments() {
    const el = document.getElementById('comments-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3 py-3 border-y border-line text-xs font-mono text-muted">
      <div className="flex items-center gap-1.5" title="Unique readers">
        <EyeIcon size={15} className="text-accent" />
        <span className="font-semibold text-fg">{data ? data.viewsCount : '—'}</span>
        <span>views</span>
      </div>

      <span className="text-line">·</span>

      <button
        type="button"
        onClick={handleToggleLike}
        disabled={liking}
        aria-label="Like post"
        className={`group flex items-center gap-1.5 rounded-full px-2.5 py-1 transition-colors ${
          data?.hasLiked
            ? 'bg-red-500/15 text-red-500 font-semibold'
            : 'hover:bg-fg/5 text-muted hover:text-fg'
        }`}
      >
        <HeartIcon
          size={15}
          className={`transition-transform duration-200 group-hover:scale-110 ${
            data?.hasLiked ? 'fill-red-500 text-red-500' : ''
          }`}
        />
        <span>{data ? data.likesCount : '0'}</span>
        <span>{data?.likesCount === 1 ? 'like' : 'likes'}</span>
      </button>

      <span className="text-line">·</span>

      <button
        type="button"
        onClick={scrollToComments}
        className="flex items-center gap-1.5 rounded-full px-2.5 py-1 transition-colors hover:bg-fg/5 text-muted hover:text-fg"
      >
        <MessageSquareIcon size={15} className="text-accent" />
        <span>Comments</span>
      </button>
    </div>
  );
}

