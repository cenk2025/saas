import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/app/globals.css'
import { Navbar } from '@/components/Navbar'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ClarityAI - AI-Powered Business Insights',
  description: 'See your company clearly with AI-driven analysis.',
}

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
        <NextIntlClientProvider messages={messages}>
          <div className="min-h-full flex flex-col">
            <Navbar />
            <main className="flex-1 flex flex-col">
              {children}
            </main>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
