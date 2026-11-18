import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
    // The Turnstile site key is public (it is in the page HTML), so it is inlined into the client build.
    env: {
        TURNSTILE_SITE_KEY: process.env.TURNSTILE_SITE_KEY || '',
    },
};

export default withNextIntl(nextConfig);
