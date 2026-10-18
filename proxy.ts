import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/navigation';

export default createMiddleware(routing);

export const config = {
    // Match everything except API routes, Next internals and static files
    matcher: ['/((?!api|_next|.*\\..*).*)']
};
