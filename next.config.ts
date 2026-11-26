import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
    // The Turnstile site key is public (it is in the page HTML), so it is inlined into the client build.
    env: {
        TURNSTILE_SITE_KEY: process.env.TURNSTILE_SITE_KEY || '',
    },
    // The root must redirect permanently. The next-intl proxy answered it with a 307 (temporary)
    // redirect, so Google kept "/" as the canonical URL and reported /fi as a duplicate without a
    // user-selected canonical. Config redirects run before the proxy, so this one wins. Visitors
    // who want Swedish or English switch language on the Finnish page.
    async redirects() {
        return [{ source: '/', destination: '/fi', permanent: true }];
    },
};

export default withNextIntl(nextConfig);
