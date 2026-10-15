// Client-side interactions client for public blog posts:
// records unique views, toggles likes, and handles comments & replies.

export type PublicComment = {
  id: string;
  parentId: string | null;
  authorName: string;
  content: string;
  createdAt: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  likesCount: number;
  repliesCount: number;
  hasLiked: boolean;
};

export type PostInteractions = {
  viewsCount: number;
  likesCount: number;
  hasLiked: boolean;
};

/** Get or generate a persistent visitor ID (anonymous UUID) stored in localStorage */
export function getVisitorId(): string {
  if (typeof window === 'undefined') return '';
  const KEY = 'portfolio_visitor_id';
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = 'v_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    try {
      localStorage.setItem(KEY, id);
    } catch {
      // storage unavailable
    }
  }
  return id;
}

export const postInteractionsApi = {
  getInteractions: async (slug: string): Promise<PostInteractions> => {
    const visitorId = getVisitorId();
    const res = await fetch(`/backend/posts/${encodeURIComponent(slug)}/interactions?visitorId=${encodeURIComponent(visitorId)}`);
    if (!res.ok) throw new Error('Failed to fetch interactions');
    return res.json();
  },

  recordView: async (slug: string): Promise<{ uniqueViews: number }> => {
    const visitorId = getVisitorId();
    const res = await fetch(`/backend/posts/${encodeURIComponent(slug)}/view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitorId }),
    });
    if (!res.ok) throw new Error('Failed to record view');
    return res.json();
  },

  togglePostLike: async (slug: string): Promise<{ liked: boolean; likesCount: number }> => {
    const visitorId = getVisitorId();
    const res = await fetch(`/backend/posts/${encodeURIComponent(slug)}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitorId }),
    });
    if (!res.ok) throw new Error('Failed to toggle like');
    return res.json();
  },

  listComments: async (slug: string): Promise<PublicComment[]> => {
    const visitorId = getVisitorId();
    const res = await fetch(`/backend/posts/${encodeURIComponent(slug)}/comments?visitorId=${encodeURIComponent(visitorId)}`);
    if (!res.ok) throw new Error('Failed to load comments');
    return res.json();
  },

  createComment: async (
    slug: string,
    data: { authorName?: string; content: string; parentId?: string }
  ): Promise<{ message: string; comment: PublicComment }> => {
    const visitorId = getVisitorId();
    const res = await fetch(`/backend/posts/${encodeURIComponent(slug)}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, visitorId }),
    });
    const json = await res.json().catch(() => null);
    if (!res.ok) {
      throw new Error(json?.message || 'Failed to submit comment');
    }
    return json;
  },

  toggleCommentLike: async (commentId: string): Promise<{ liked: boolean; likesCount: number }> => {
    const visitorId = getVisitorId();
    const res = await fetch(`/backend/posts/comments/${encodeURIComponent(commentId)}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitorId }),
    });
    if (!res.ok) throw new Error('Failed to like comment');
    return res.json();
  },
};

