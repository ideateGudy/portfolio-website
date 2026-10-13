import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const API_URL = process.env.API_URL ?? 'http://localhost:4000';
const ALLOWED_TAGS = new Set(['posts', 'projects', 'content']);

/**
 * On-demand cache refresh after dashboard mutations (PRD §3). Protected by
 * verifying the admin session against the API (forwards the httpOnly cookie),
 * so there's no secret to leak to the browser.
 */
export async function POST(request: Request) {
  const jar = await cookies();
  const cookieHeader = jar
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');

  const me = await fetch(`${API_URL}/auth/me`, {
    headers: cookieHeader ? { cookie: cookieHeader } : undefined,
    cache: 'no-store',
  }).catch(() => null);
  if (!me || !me.ok) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
  }

  const tags = (body && typeof body === 'object' && 'tags' in body
    ? (body as { tags: unknown }).tags
    : []) as unknown;
  const valid = Array.isArray(tags)
    ? tags.filter((t): t is string => typeof t === 'string' && ALLOWED_TAGS.has(t))
    : [];

  for (const tag of valid) revalidateTag(tag, { expire: 0 });
  return NextResponse.json({ revalidated: true, tags: valid });
}
