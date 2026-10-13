// Server-side API client (PRD §3): public pages fetch Nest via API_URL,
// browser/dashboard calls go through the /backend/* rewrite.
const API_URL = process.env.API_URL ?? 'http://localhost:4000';

export type Project = {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  imageAlt: string | null;
  tech: string[];
  liveUrl: string | null;
  repoUrl: string | null;
  order: number;
  visible: boolean;
};

export type PostListItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverUrl: string | null;
  coverAlt: string | null;
  tags: string[];
  status: 'DRAFT' | 'PUBLISHED';
  publishedAt: string | null;
  readingTime: number;
  canonicalUrl: string | null;
  updatedAt: string;
};

async function get<T>(path: string, tags?: string[]): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      next: { revalidate: 60, tags },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export function getContent(): Promise<Record<string, unknown> | null> {
  return get<Record<string, unknown>>('/content', ['content']);
}

export function getProjects(): Promise<Project[] | null> {
  return get<Project[]>('/projects', ['projects']);
}

export type PostsPage = {
  items: PostListItem[];
  total: number;
  page: number;
  limit: number;
};

export type PostFull = PostListItem & {
  content: string;
  createdAt: string;
};

export function getLatestPosts(limit = 3): Promise<{ items: PostListItem[] } | null> {
  return get<{ items: PostListItem[] }>(`/posts?limit=${limit}`, ['posts']);
}

/** Paginated published posts for /blog (PRD §5.2): tag filter + ?page=. */
export function getPosts(tag?: string, page = 1, limit = 9): Promise<PostsPage | null> {
  const params = new URLSearchParams({
    page: String(Math.max(1, page)),
    limit: String(Math.min(50, Math.max(1, limit))),
  });
  if (tag) params.set('tag', tag);
  return get<PostsPage>(`/posts?${params.toString()}`, ['posts']);
}

/** One published post by slug for /blog/[slug] (PRD §5.3). Null → notFound(). */
export function getPost(slug: string): Promise<PostFull | null> {
  return get<PostFull>(`/posts/${encodeURIComponent(slug)}`, ['posts']);
}
