import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/app/globals.css'
import { Navbar } from '@/components/Navbar'
import Footer from '@/components/Footer'
import CookieConsent from '@/components/CookieConsent'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { StructuredData } from '@/components/StructuredData'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = generateSEOMetadata({
  title: 'AI-Powered Business Intelligence & Diagnostics Platform',
  description: 'Transform your business with AI-powered diagnostics. Get instant insights into operational efficiency, digital maturity, innovation capability, and risk management. Trusted by companies across Finland and Europe.',
  keywords: [
    'business intelligence platform',
    'AI business diagnostics',
    'company health assessment tool',
    'business analytics SaaS',
    'operational efficiency software',
  ],
})

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const messages = await getMessages()

  return (
    <html lang={locale} className="h-full">
      <body suppressHydrationWarning className={`${inter.className} h-full bg-background text-foreground antialiased`}>
        <StructuredData />
        <NextIntlClientProvider messages={messages}>
          <div className="min-h-full flex flex-col">
            <Navbar />
            <main className="flex-1 flex flex-col">
              {children}
            </main>
            <Footer />
          </div>
          <CookieConsent />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

