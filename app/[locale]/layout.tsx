import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import '@/app/globals.css'
import CookieConsent from '@/components/CookieConsent'
import { StructuredData } from '@/components/StructuredData'
import { buildMetadata } from '@/lib/seo'
import { routing } from '@/src/i18n/navigation'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta', weight: ['600', '700', '800'] })

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Meta' })
  return buildMetadata({ locale, title: t('title'), description: t('description') })
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'Meta' })

  return (
    <html lang={locale} className={`${inter.variable} ${jakarta.variable} h-full`}>
      <body suppressHydrationWarning className="min-h-full bg-background font-sans text-foreground antialiased">
        <StructuredData description={t('description')} />
        <NextIntlClientProvider>
          {children}
          <CookieConsent />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
