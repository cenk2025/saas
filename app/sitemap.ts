import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://business.voon.fi'

    const routes = [
        '',
        '/fi',
        '/en',
        '/fi/login',
        '/en/login',
        '/fi/register',
        '/en/register',
    ]

    return routes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' || route === '/fi' || route === '/en' ? 1 : 0.8,
    }))
}
