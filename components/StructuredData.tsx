import { siteConfig } from "@/lib/seo"

export function StructuredData({ description }: { description: string }) {
    const schema = [
        {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "VOON IQ",
            url: "https://voon.fi",
            logo: `${siteConfig.url}/logo.png`,
            email: "info@voon.fi",
            address: { "@type": "PostalAddress", addressLocality: "Jyväskylä", addressCountry: "FI" },
        },
        {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: siteConfig.name,
            url: siteConfig.url,
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            description,
            inLanguage: ["fi", "sv", "en"],
            offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
        },
    ]

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    )
}
