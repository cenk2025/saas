"use client"

export function StructuredData() {
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Voon Business Intelligence",
        "url": "https://business.voon.fi",
        "logo": "https://business.voon.fi/logo.png",
        "description": "AI-powered business diagnostics and intelligence platform helping companies improve operational efficiency, digital maturity, and innovation capability.",
        "foundingDate": "2024",
        "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "Customer Service",
            "email": "info@voon.fi",
            "availableLanguage": ["English", "Finnish"]
        },
        "sameAs": [
            "https://www.linkedin.com/company/voon",
            "https://twitter.com/voonfi"
        ]
    }

    const softwareSchema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Voon Business Intelligence Platform",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "EUR",
            "description": "14-day free trial"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "127"
        },
        "featureList": [
            "AI-powered business diagnostics",
            "Operational efficiency analysis",
            "Digital maturity assessment",
            "Innovation capability measurement",
            "Risk management evaluation",
            "Automated reporting",
            "Real-time insights",
            "Actionable recommendations"
        ]
    }

    const serviceSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": "Business Intelligence and Analytics",
        "provider": {
            "@type": "Organization",
            "name": "Voon"
        },
        "areaServed": {
            "@type": "Country",
            "name": "Finland"
        },
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Business Intelligence Services",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Company Health Diagnostic",
                        "description": "Comprehensive AI-powered assessment of your company's operational efficiency, digital maturity, innovation capability, and risk management."
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Business Intelligence Dashboard",
                        "description": "Real-time monitoring and analytics of key business metrics and performance indicators."
                    }
                }
            ]
        }
    }

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What is Voon Business Intelligence?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Voon Business Intelligence is an AI-powered platform that provides comprehensive business diagnostics and insights. It analyzes your company's operational efficiency, digital maturity, innovation capability, and risk management to provide actionable recommendations for improvement."
                }
            },
            {
                "@type": "Question",
                "name": "How does the AI business diagnostic work?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Our AI diagnostic uses advanced machine learning algorithms to analyze your responses to a comprehensive questionnaire covering operational processes, digital tools, innovation practices, and risk management. The AI then generates a detailed report with scores, insights, and specific recommendations tailored to your business."
                }
            },
            {
                "@type": "Question",
                "name": "Is there a free trial available?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, we offer a 14-day free trial with full access to all features. No credit card is required to start your trial."
                }
            },
            {
                "@type": "Question",
                "name": "What industries does Voon Business Intelligence serve?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Voon Business Intelligence serves companies across all industries, from SMEs to large enterprises. Our AI-powered diagnostics are particularly valuable for companies undergoing digital transformation or seeking to improve operational efficiency."
                }
            }
        ]
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
        </>
    )
}
