import { NextRequest, NextResponse } from 'next/server';

// Must match AUTH_COOKIE in api/src/auth/jwt-auth.guard.ts (the API is the source of truth).
const AUTH_COOKIE = 'portfolio_token';

/**
 * Next.js 16+ proxy convention (replaces deprecated middleware).
 * Guard /dashboard/* (PRD §4): redirect unauthenticated visitors to /login.
 */
export function proxy(req: NextRequest) {
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

