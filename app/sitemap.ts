import { MetadataRoute } from 'next'
import { routing } from '@/src/i18n/navigation'
import { localeLanguages, siteConfig } from '@/lib/seo'

// Login and registration are noindex; the public health check is a landing page in its own right.
const PUBLIC_PATHS = ['', '/test']

export default function sitemap(): MetadataRoute.Sitemap {
    return PUBLIC_PATHS.flatMap((path) =>
        routing.locales.map((locale) => ({
            url: `${siteConfig.url}/${locale}${path}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: path === '' ? 1 : 0.6,
            alternates: {
                languages: localeLanguages(path),
            },
        }))
    )
}
