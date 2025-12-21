import { Metadata } from 'next'

const siteConfig = {
    name: 'Voon Business Intelligence',
    description: 'AI-powered business diagnostics and intelligence platform. Get instant insights into your company\'s health, identify weaknesses, and receive actionable recommendations to improve operational efficiency, digital maturity, and innovation capability.',
    url: 'https://business.voon.fi',
    ogImage: 'https://business.voon.fi/og-image.png',
    keywords: [
        // Core Business Intelligence
        'business intelligence',
        'business diagnostics',
        'company health assessment',
        'business analytics platform',
        'enterprise intelligence',

        // AI-Powered Features
        'AI business analysis',
        'artificial intelligence business tools',
        'AI-powered diagnostics',
        'machine learning business insights',
        'AI business consultant',

        // Specific Capabilities
        'operational efficiency analysis',
        'digital transformation assessment',
        'innovation capability measurement',
        'business risk management',
        'company performance metrics',

        // Target Audience
        'SME business tools',
        'enterprise analytics',
        'business management software',
        'executive dashboard',
        'business intelligence Finland',

        // Use Cases
        'business health check',
        'company diagnostic test',
        'business improvement recommendations',
        'strategic business insights',
        'data-driven business decisions',

        // Technology
        'SaaS business intelligence',
        'cloud business analytics',
        'real-time business metrics',
        'automated business reporting',
    ],
    authors: [
        {
            name: 'Voon',
            url: 'https://voon.fi',
        },
    ],
    creator: 'Voon',
    publisher: 'Voon',
    category: 'Business Intelligence',
}

export function generateMetadata({
    title,
    description,
    image,
    noIndex = false,
    keywords = [],
}: {
    title?: string
    description?: string
    image?: string
    noIndex?: boolean
    keywords?: string[]
} = {}): Metadata {
    const metaTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name
    const metaDescription = description || siteConfig.description
    const metaImage = image || siteConfig.ogImage
    const allKeywords = [...siteConfig.keywords, ...keywords]

    return {
        title: metaTitle,
        description: metaDescription,
        keywords: allKeywords,
        authors: siteConfig.authors,
        creator: siteConfig.creator,
        publisher: siteConfig.publisher,
        category: siteConfig.category,

        // Open Graph
        openGraph: {
            type: 'website',
            locale: 'en_US',
            url: siteConfig.url,
            title: metaTitle,
            description: metaDescription,
            siteName: siteConfig.name,
            images: [
                {
                    url: metaImage,
                    width: 1200,
                    height: 630,
                    alt: metaTitle,
                },
            ],
        },

        // Twitter
        twitter: {
            card: 'summary_large_image',
            title: metaTitle,
            description: metaDescription,
            images: [metaImage],
            creator: '@voonfi',
        },

        // Robots
        robots: {
            index: !noIndex,
            follow: !noIndex,
            googleBot: {
                index: !noIndex,
                follow: !noIndex,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },

        // Verification
        verification: {
            google: 'your-google-verification-code',
            // yandex: 'your-yandex-verification-code',
            // bing: 'your-bing-verification-code',
        },

        // Alternate languages
        alternates: {
            canonical: siteConfig.url,
            languages: {
                'en': `${siteConfig.url}/en`,
                'fi': `${siteConfig.url}/fi`,
            },
        },
    }
}

export { siteConfig }
