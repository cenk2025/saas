import { ArrowRight, CheckCircle2, Eye, Lock, Scale, Sparkles } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import ContactForm from '@/components/ContactForm'
import { PricingGrid } from '@/components/PricingGrid'
import { ScoreRing } from '@/components/ScoreRing'
import { ToolIcon } from '@/components/ToolIcon'
import { ECOSYSTEM } from '@/lib/ecosystem'
import { TOOLS } from '@/lib/ai/tool-catalog'
import { Link } from '@/src/i18n/navigation'

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('Landing')
  const tt = await getTranslations('Tools')
  const te = await getTranslations('Ecosystem')
  const tp = await getTranslations('Plans')

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-brand-gradient opacity-[0.10] blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:pt-24">
          <div className="animate-fade-up">
            <span className="eyebrow">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> {t('eyebrow')}
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] sm:text-6xl">
              {t('title')}
              <br />
              <span className="text-brand-gradient">{t('titleAccent')}</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">{t('subtitle')}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/register" className="btn-primary px-7 py-3.5 text-base">
                {t('ctaPrimary')} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/test" className="btn-secondary px-7 py-3.5 text-base">
                {t('ctaSecondary')}
              </Link>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {[t('trust1'), t('trust2'), t('trust3')].map((item) => (
                <li key={item} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-success" /> {item}
                </li>
              ))}
            </ul>
          </div>

          <HeroPreview
            greeting={t('previewGreeting')}
            scoreLabel={t('previewScore')}
            task={t('previewTask')}
            taskStatus={t('previewTaskStatus')}
            savedLabel={t('previewSaved')}
            hours={t('previewHours')}
            tools={TOOLS.slice(0, 6).map((tool) => ({ slug: tool.slug, name: tt(`${tool.slug}.name`) }))}
          />
        </div>
      </section>

      {/* Problem + stats */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl font-bold">{t('problemTitle')}</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{t('problemText')}</p>
          </div>
          <dl className="grid grid-cols-3 gap-3 sm:gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl bg-muted/70 p-4 sm:p-5">
                <dt className="sr-only">{t(`stat${i}Label`)}</dt>
                <dd className="font-display text-2xl font-extrabold sm:text-3xl">{t(`stat${i}`)}</dd>
                <dd className="mt-1 text-xs text-muted-foreground sm:text-sm">{t(`stat${i}Label`)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Tools */}
      <section id="tools" className="scroll-mt-20">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHeader eyebrow={t('toolsEyebrow')} title={t('toolsTitle')} subtitle={t('toolsSubtitle')} />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((tool) => (
              <div key={tool.slug} className="card p-6 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                    <ToolIcon slug={tool.slug} className="h-5 w-5" />
                  </span>
                  <span className="text-right text-xs font-medium text-muted-foreground">{tt(`categories.${tool.category}`)}</span>
                </div>
                <h3 className="mt-5 font-semibold">{tt(`${tool.slug}.name`)}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{tt(`${tool.slug}.description`)}</p>
              </div>
            ))}
            <div className="flex flex-col justify-between rounded-2xl bg-ink p-6 text-white sm:col-span-2 lg:col-span-2">
              <div>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                  <Sparkles className="h-5 w-5 text-brand-orange" />
                </span>
                <h3 className="mt-5 text-xl font-semibold">{t('ctaTitle')}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/70">{t('ctaText')}</p>
              </div>
              <Link href="/register" className="btn-primary mt-6 self-start">
                {t('ctaPrimary')} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="scroll-mt-20 border-y border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHeader eyebrow={t('howEyebrow')} title={t('howTitle')} />
          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <li key={i} className="rounded-2xl border border-border p-6">
                <span className="font-display text-5xl font-extrabold text-brand-gray">0{i}</span>
                <h3 className="mt-4 text-lg font-semibold">{t(`step${i}Title`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(`step${i}Text`)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Health check */}
      <section>
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <HealthPreview />
          </div>
          <div className="order-1 lg:order-2">
            <span className="eyebrow">{t('healthEyebrow')}</span>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">{t('healthTitle')}</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{t('healthText')}</p>
            <ul className="mt-6 space-y-3">
              {[t('healthPoint1'), t('healthPoint2'), t('healthPoint3')].map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" /> {point}
                </li>
              ))}
            </ul>
            <Link href="/test" className="btn-primary mt-8">
              {t('healthCta')} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Responsible AI */}
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-orange">{t('trustEyebrow')}</span>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">{t('trustTitle')}</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { icon: Lock, title: t('trust1Title'), text: t('trust1Text') },
              { icon: Eye, title: t('trust2Title'), text: t('trust2Text') },
              { icon: Scale, title: t('trust3Title'), text: t('trust3Text') },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <Icon className="h-6 w-6 text-brand-pink" />
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="scroll-mt-20">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHeader eyebrow={t('pricingEyebrow')} title={t('pricingTitle')} subtitle={t('pricingSubtitle')} />
          <div className="mt-12">
            <PricingGrid
              renderAction={(plan) => (
                <Link
                  href={plan.contactSales ? '/#contact' : '/register'}
                  className={plan.id === 'business' ? 'btn-primary w-full' : 'btn-secondary w-full'}
                >
                  {plan.contactSales ? tp('contactUs') : t('ctaPrimary')}
                </Link>
              )}
            />
          </div>
        </div>
      </section>

      {/* Ecosystem */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHeader eyebrow={t('ecosystemEyebrow')} title={t('ecosystemTitle')} subtitle={t('ecosystemText')} />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ECOSYSTEM.map((service) => (
              <a key={service.key} href={service.url} className="card group p-5 transition hover:border-primary/40">
                <span className="text-sm font-semibold">{new URL(service.url).host}</span>
                <p className="mt-1.5 text-sm text-muted-foreground">{te(service.key)}</p>
                <ArrowRight className="mt-4 h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section>
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
          <h2 className="text-center text-3xl font-bold">{t('faqTitle')}</h2>
          <div className="mt-10 divide-y divide-border rounded-2xl border border-border bg-card">
            {[1, 2, 3, 4].map((i) => (
              <details key={i} className="group p-5 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                  {t(`faq${i}q`)}
                  <span className="text-xl leading-none text-muted-foreground transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t(`faq${i}a`)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <ContactForm />
    </div>
  )
}

function SectionHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="mt-4 text-3xl font-bold sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>}
    </div>
  )
}

function HeroPreview({ greeting, scoreLabel, task, taskStatus, savedLabel, hours, tools }: {
  greeting: string
  scoreLabel: string
  task: string
  taskStatus: string
  savedLabel: string
  hours: string
  tools: { slug: string; name: string }[]
}) {
  return (
    <div aria-hidden className="animate-fade-up [animation-delay:150ms]">
      <div className="card overflow-hidden shadow-2xl shadow-black/10">
        <div className="flex items-center gap-1.5 border-b border-border bg-muted/50 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-brand-gray/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-brand-gray/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-brand-gray/70" />
        </div>
        <div className="space-y-4 p-5">
          <p className="font-display text-lg font-bold">{greeting} 👋</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 rounded-xl border border-border p-3">
              <ScoreRing score={74} size={60} />
              <span className="text-xs font-medium text-muted-foreground">{scoreLabel}</span>
            </div>
            <div className="flex flex-col justify-center rounded-xl border border-border p-3">
              <span className="text-xs font-medium text-muted-foreground">{savedLabel}</span>
              <span className="mt-1 font-display text-2xl font-bold">{hours}</span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-xl bg-accent px-4 py-3">
            <span className="flex items-center gap-2 text-sm font-medium">
              <ToolIcon slug="quote" className="h-4 w-4 shrink-0 text-primary" /> {task}
            </span>
            <span className="shrink-0 rounded-full bg-card px-2 py-0.5 text-xs font-semibold text-success">{taskStatus}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {tools.map((tool) => (
              <div key={tool.slug} className="flex flex-col items-start gap-2 rounded-xl border border-border p-3">
                <ToolIcon slug={tool.slug} className="h-4 w-4 text-primary" />
                <span className="line-clamp-1 text-[11px] font-medium">{tool.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function HealthPreview() {
  const bars = [82, 61, 48, 77, 66]
  return (
    <div aria-hidden className="card p-6 shadow-xl shadow-black/5">
      <div className="flex items-center gap-6">
        <ScoreRing score={67} size={120} />
        <div className="flex-1 space-y-3">
          {bars.map((value, i) => (
            <div key={i} className="h-2.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-brand-gradient" style={{ width: `${value}%` }} />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl border border-border p-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">{i}</span>
            <span className="h-2 flex-1 rounded-full bg-muted" style={{ maxWidth: `${90 - i * 15}%` }} />
          </div>
        ))}
      </div>
    </div>
  )
}
