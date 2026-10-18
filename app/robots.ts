import { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/seo'

const PRIVATE = ['/api/', '/*/dashboard', '/*/tools', '/*/advisor', '/*/test', '/*/results', '/*/library', '/*/company', '/*/billing', '/*/admin', '/*/reset-password']

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [{ userAgent: '*', allow: '/', disallow: PRIVATE }],
        sitemap: `${siteConfig.url}/sitemap.xml`,
    }
}
