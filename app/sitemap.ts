import { MetadataRoute } from 'next'
import { routing } from '@/src/i18n/navigation'
import { siteConfig } from '@/lib/seo'

const PUBLIC_PATHS = ['', '/register', '/login']

export default function sitemap(): MetadataRoute.Sitemap {
    return PUBLIC_PATHS.flatMap((path) =>
        routing.locales.map((locale) => ({
            url: `${siteConfig.url}/${locale}${path}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: path === '' ? 1 : 0.6,
            alternates: {
                languages: Object.fromEntries(routing.locales.map((l) => [l, `${siteConfig.url}/${l}${path}`])),
            },
        }))
    )
}
