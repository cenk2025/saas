import { Link } from '@/src/i18n/navigation'
import { ArrowRight, BarChart3, CheckCircle2, ShieldCheck } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import ContactForm from '@/components/ContactForm'

export default async function Home() {
  const t = await getTranslations('Landing')

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center py-24 px-6 text-center bg-gradient-to-b from-background via-muted/20 to-background">
        <div className="max-w-4xl space-y-8">
          <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
            {t('tagline')}
          </div>
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-foreground">
            {t('title').split('With')[0]} <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              {t('title').split('Clarity')[0].split('With')[1] || 'With Perfect Clarity'}
            </span>
          </h1>
          {/* Simply rendering title might be safer if splitting is brittle */}
          {/* Use simple rendering for now to avoid errors if translation changes structure */}
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
          <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/test"
              className="inline-flex h-14 items-center justify-center rounded-full bg-primary px-8 text-lg font-semibold text-primary-foreground shadow-lg hover:bg-primary/90 transition-all hover:scale-105"
            >
              {t('ctaTest')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex h-14 items-center justify-center rounded-full border border-input bg-background/50 backdrop-blur px-8 text-lg font-semibold hover:bg-muted transition-all"
            >
              {t('ctaDemo')}
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-muted/30">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-all">
            <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">{t('features.deep')}</h3>
            <p className="text-muted-foreground">
              {t('features.deepDesc')}
            </p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-all">
            <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">{t('features.insights')}</h3>
            <p className="text-muted-foreground">
              {t('features.insightsDesc')}
            </p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-all">
            <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center text-purple-600">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">{t('features.secure')}</h3>
            <p className="text-muted-foreground">
              {t('features.secureDesc')}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <ContactForm />
    </div>
  )
}
