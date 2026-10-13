import 'server-only';
import { cookies } from 'next/headers';
import type { AdminPost } from './dashboard-api';

const API_URL = process.env.API_URL ?? 'http://localhost:4000';

/** Fetch a single post for the admin editor, forwarding the auth cookie. */
export async function getPostForAdmin(id: string): Promise<AdminPost | null> {
  const jar = await cookies();
  const cookieHeader = jar.getAll().map((c) => `${c.name}=${c.value}`).join('; ');
  const res = await fetch(`${API_URL}/admin/posts/${encodeURIComponent(id)}`, {
    headers: cookieHeader ? { cookie: cookieHeader } : undefined,
    cache: 'no-store',
  }).catch(() => null);
  if (!res || !res.ok) return null;
  return (await res.json()) as AdminPost;
}
