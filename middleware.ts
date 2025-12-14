import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/navigation';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
    // Exclude API routes and static files
    if (
        req.nextUrl.pathname.startsWith('/api') ||
        req.nextUrl.pathname.startsWith('/_next') ||
        req.nextUrl.pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    return intlMiddleware(req);
}

export const config = {
    // Match only internationalized pathnames
    matcher: ['/((?!api|_next|.*\\..*).*)']
};
