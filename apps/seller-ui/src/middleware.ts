import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 0. Check authentication status
    const accessToken = request.cookies.get('seller_access_token');
    const refreshToken = request.cookies.get('seller_refresh_token');
    const isAuthenticated = !!(accessToken || refreshToken);

    // 1. Redirections for shortcuts
    if (pathname === '/login') {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    if (pathname === '/signup' || pathname === '/register') {
        return NextResponse.redirect(new URL('/auth/signup', request.url));
    }
    if (pathname === '/forgot-password') {
        return NextResponse.redirect(new URL('/auth/forgot-password', request.url));
    }

    // 2. Handle Root Path /
    if (pathname === '/') {
        if (isAuthenticated) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        } else {
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }
    }

    // 3. Protect /dashboard routes
    if (pathname.startsWith('/dashboard')) {
        if (!isAuthenticated) {
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }
    }

    // 4. Redirect Authenticated Users AWAY from Auth Pages
    if (pathname.startsWith('/auth') && isAuthenticated) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
