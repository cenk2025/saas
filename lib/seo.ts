import { Metadata } from 'next'
import { routing } from '@/src/i18n/navigation'

export const siteConfig = {
    name: 'Voon Business',
    url: 'https://business.voon.fi',
}

const OG_LOCALES: Record<string, string> = { fi: 'fi_FI', sv: 'sv_FI', en: 'en_US' }

/** Locale-aware metadata with canonical and hreflang alternates. `path` excludes the locale prefix. */
export function buildMetadata({
    locale,
    title,
    description,
    path = '',
    noIndex = false,
}: {
    locale: string
    title: string
    description: string
    path?: string
    noIndex?: boolean
}): Metadata {
    const url = `${siteConfig.url}/${locale}${path}`

    return {
        metadataBase: new URL(siteConfig.url),
        title,
        description,
        applicationName: siteConfig.name,
        authors: [{ name: 'VOON IQ', url: 'https://voon.fi' }],
        alternates: {
            canonical: url,
            languages: Object.fromEntries(
                routing.locales.map((l) => [l, `${siteConfig.url}/${l}${path}`])
            ),
        },
        openGraph: {
            type: 'website',
            locale: OG_LOCALES[locale] ?? 'fi_FI',
            url,
            title,
            description,
            siteName: siteConfig.name,
        },
        twitter: { card: 'summary_large_image', title, description },
        robots: { index: !noIndex, follow: !noIndex },
        icons: { icon: '/icon-192.png', apple: '/apple-touch-icon.png' },
    }
}
