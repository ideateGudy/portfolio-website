// Client-side API client for the dashboard. All calls go through the
// same-origin /backend/* rewrite so the httpOnly JWT cookie is sent (PRD §8).
// Errors surface the API's JSON `message` (our global exception filter).
async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/backend${path}`, {
    credentials: 'include',
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  });
  const data = res.headers.get('content-type')?.includes('application/json')
    ? await res.json().catch(() => null)
    : null;
  if (!res.ok) {
    const message = (data && typeof data === 'object' && 'message' in data
      ? String((data as { message: unknown }).message)
      : null) ?? `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data as T;
}

/** Ask Next to revalidate cached public pages after a mutation (PRD §3). */
async function revalidate(tags: string[]) {
  await fetch('/api/revalidate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tags }),
  }).catch(() => undefined);
}

export type AdminPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverUrl: string | null;
  coverAlt: string | null;
  tags: string[];
  status: 'DRAFT' | 'PUBLISHED';
  publishedAt: string | null;
  readingTime: number;
  canonicalUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminProject = {
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

export const adminApi = {
  auth: {
    changePassword: (currentPassword: string, newPassword: string) =>
      req<{ ok: boolean; message: string }>('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
      }),
  },
  posts: {
    list: () => req<AdminPost[]>('/admin/posts'),
    get: (id: string) => req<AdminPost>(`/admin/posts/${id}`),
    create: (body: unknown) =>
      req<AdminPost>('/admin/posts', { method: 'POST', body: JSON.stringify(body) }).then((p) => {
        void revalidate(['posts']);
        return p;
      }),
    update: (id: string, body: unknown) =>
      req<AdminPost>(`/admin/posts/${id}`, { method: 'PATCH', body: JSON.stringify(body) }).then((p) => {
        void revalidate(['posts']);
        return p;
      }),
    remove: (id: string) =>
      req<{ ok: boolean }>(`/admin/posts/${id}`, { method: 'DELETE' }).then((r) => {
        void revalidate(['posts']);
        return r;
      }),
  },
  projects: {
    list: () => req<AdminProject[]>('/admin/projects'),
    create: (body: unknown) =>
      req<AdminProject>('/admin/projects', { method: 'POST', body: JSON.stringify(body) }).then((p) => {
        void revalidate(['projects']);
        return p;
      }),
    update: (id: string, body: unknown) =>
      req<AdminProject>(`/admin/projects/${id}`, { method: 'PATCH', body: JSON.stringify(body) }).then((p) => {
        void revalidate(['projects']);
        return p;
      }),
    reorder: (ids: string[]) =>
      req<AdminProject[]>('/admin/projects/reorder', {
        method: 'POST',
        body: JSON.stringify({ ids }),
      }).then((r) => {
        void revalidate(['projects']);
        return r;
      }),
    remove: (id: string) =>
      req<{ ok: boolean }>(`/admin/projects/${id}`, { method: 'DELETE' }).then((r) => {
        void revalidate(['projects']);
        return r;
      }),
  },
  content: {
    getAll: () => req<Record<string, unknown>>('/content'),
    set: (key: string, value: unknown) =>
      req<unknown>(`/admin/content/${key}`, { method: 'PUT', body: JSON.stringify({ value }) }).then((r) => {
        void revalidate(['content']);
        return r;
      }),
  },
  upload: async (file: File, folder: string) => {
    const form = new FormData();
    form.append('folder', folder); // must precede the file part (see API note)
    form.append('file', file);
    const res = await fetch('/backend/admin/uploads', { method: 'POST', credentials: 'include', body: form });
    const data = (await res.json().catch(() => null)) as
      | { url: string; publicId: string; width: number; height: number }
      | { message?: string }
      | null;
    if (!res.ok) throw new Error((data as { message?: string })?.message ?? 'Upload failed');
    return data as { url: string; publicId: string; width: number; height: number };
  },
};
