import { NextRequest, NextResponse } from 'next/server';

// Must match AUTH_COOKIE in api/src/auth/jwt-auth.guard.ts (the API is the source of truth).
const AUTH_COOKIE = 'portfolio_token';

/**
 * Guard /dashboard/* (PRD §4): the API is the source of truth, but we redirect
 * obviously-unauthenticated visitors to /login without a round-trip. Presence of
 * the httpOnly cookie is enough here; the API guard rejects forged/expired tokens.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith('/dashboard')) return NextResponse.next();

  const token = req.cookies.get(AUTH_COOKIE)?.value;
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.search = '';
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard', '/dashboard/:path*'],
};
