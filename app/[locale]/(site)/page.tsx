import { Check, Eye, Lock, Scale } from 'lucide-react'
import Image from 'next/image'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import ContactForm from '@/components/ContactForm'
import { PricingGrid } from '@/components/PricingGrid'
import { Reveal } from '@/components/Reveal'
import { ScoreRing } from '@/components/ScoreRing'
import { ToolIcon } from '@/components/ToolIcon'
import { ECOSYSTEM } from '@/lib/ecosystem'
import { TOOLS } from '@/lib/ai/tool-catalog'
import { Link } from '@/src/i18n/navigation'

/*
 * VOON IQ design system (Apple-inspired): neutral canvas (white / #f5f5f7 / black), the VOON
 * gradient as the only accent, Inter only, one message per section, depth from layers and
 * soft shadows rather than borders, real photography (Canva-generated, Nordic and calm).
 */
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('Landing')
  const tt = await getTranslations('Tools')
  const te = await getTranslations('Ecosystem')
  const tp = await getTranslations('Plans')

  return (
    <div className="flex flex-col">
      {/* Hero: one message, one CTA, one photo */}
      <section className="overflow-hidden pt-16 sm:pt-24">
        <div className="container-apple animate-fade-up text-center">
          <p className="eyebrow">{t('eyebrow')}</p>
          <h1 className="t-hero mx-auto mt-4 max-w-4xl">
            {t('title')} <span className="text-brand-gradient">{t('titleAccent')}</span>
          </h1>
          <p className="t-sub mx-auto mt-6 max-w-2xl">{t('heroSub')}</p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-5">
            <Link href="/register" className="btn-primary">
              {t('ctaPrimary')}
            </Link>
            <Link href="/test" className="link-more">
              {t('ctaSecondary')} <span aria-hidden>›</span>
            </Link>
          </div>
        </div>

        <div className="container-wide mt-14 sm:mt-20">
          <div className="relative overflow-hidden rounded-[34px] shadow-[0_40px_100px_-40px_rgba(0,0,0,0.35)]">
            <Image
              src="/images/hero-yrittaja.jpg"
              alt=""
              width={2400}
              height={1350}
              priority
              sizes="(min-width: 1280px) 1280px, 100vw"
              className="aspect-[4/3] w-full object-cover object-[70%_center] sm:aspect-[16/9]"
            />
            <HeroGlass
              task={t('previewTask')}
              taskStatus={t('previewTaskStatus')}
              savedLabel={t('previewSaved')}
              hours={t('previewHours')}
            />
          </div>
          <ul className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-2 text-[15px] text-muted-foreground">
            {[t('trust1'), t('trust2'), t('trust3')].map((item) => (
              <li key={item} className="inline-flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" aria-hidden /> {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Problem + stats */}
      <section className="section mt-16 bg-alt sm:mt-24">
        <div className="container-apple">
          <Reveal className="max-w-3xl">
            <h2 className="t-headline">{t('problemTitle')}.</h2>
            <p className="t-sub mt-6">{t('problemText')}</p>
          </Reveal>
          <dl className="mt-16 grid gap-10 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Reveal key={i} delay={i * 100} className="flex flex-col-reverse">
                <dt className="mt-3 text-[19px] font-medium">{t(`stat${i}Label`)}</dt>
                <dd className="text-brand-gradient text-[clamp(3.5rem,2.5rem+3vw,5.5rem)] font-semibold leading-none tracking-[-0.04em]">
                  {t(`stat${i}`)}
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* Tools */}
      <section id="tools" className="section scroll-mt-16">
        <div className="container-wide">
          <Reveal className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="eyebrow">{t('toolsEyebrow')}</p>
              <h2 className="t-headline mt-3">{t('toolsTitle')}.</h2>
              <p className="t-sub mt-6">{t('toolsSubtitle')}</p>
            </div>
            <Image
              src="/images/verstas.jpg"
              alt=""
              width={2000}
              height={1500}
              sizes="(min-width: 1024px) 620px, 100vw"
              className="aspect-[4/3] w-full rounded-[34px] object-cover"
            />
          </Reveal>

          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((tool, i) => (
              <Reveal key={tool.slug} delay={(i % 3) * 80}>
                <div className="card h-full p-7 transition duration-300 hover:-translate-y-1">
                  <ToolIcon slug={tool.slug} className="h-7 w-7 text-primary" />
                  <p className="mt-6 text-[14px] font-medium text-muted-foreground">{tt(`categories.${tool.category}`)}</p>
                  <h3 className="mt-1 text-[21px] font-semibold leading-tight">{tt(`${tool.slug}.name`)}</h3>
                  <p className="mt-2 text-[17px] leading-relaxed text-muted-foreground">{tt(`${tool.slug}.description`)}</p>
                </div>
              </Reveal>
            ))}
            <Reveal className="sm:col-span-2">
              <div className="flex h-full flex-col justify-between gap-8 rounded-[28px] bg-ink p-8 text-[#f5f5f7] sm:flex-row sm:items-end">
                <div>
                  <Image src="/brand/voon-logo-white.png" alt="VOON IQ" width={1662} height={470} className="h-7 w-auto" />
                  <h3 className="mt-6 text-[28px] font-semibold leading-tight tracking-[-0.02em]">{t('ctaTitle')}.</h3>
                  <p className="mt-2 text-[17px] text-[#a1a1a6]">{t('ctaText')}</p>
                </div>
                <Link href="/register" className="btn-primary shrink-0 self-start sm:self-auto">
                  {t('ctaPrimary')}
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="section scroll-mt-16 bg-alt">
        <div className="container-wide grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <Image
              src="/images/tiimi.jpg"
              alt=""
              width={2000}
              height={1500}
              sizes="(min-width: 1024px) 620px, 100vw"
              className="aspect-[4/3] w-full rounded-[34px] object-cover"
            />
          </Reveal>
          <div>
            <Reveal>
              <p className="eyebrow">{t('howEyebrow')}</p>
              <h2 className="t-title mt-3">{t('howTitle')}.</h2>
            </Reveal>
            <ol className="mt-10 space-y-9">
              {[1, 2, 3].map((i) => (
                <Reveal key={i} delay={i * 100}>
                  <li className="flex gap-6">
                    <span className="text-brand-gradient w-12 shrink-0 text-[44px] font-semibold leading-none tracking-[-0.04em]">{i}</span>
                    <div>
                      <h3 className="text-[21px] font-semibold">{t(`step${i}Title`)}</h3>
                      <p className="mt-1.5 text-[17px] leading-relaxed text-muted-foreground">{t(`step${i}Text`)}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Health check */}
      <section className="section">
        <div className="container-apple grid items-center gap-14 lg:grid-cols-2">
          <Reveal className="order-2 lg:order-1">
            <HealthPreview />
          </Reveal>
          <Reveal className="order-1 lg:order-2">
            <p className="eyebrow">{t('healthEyebrow')}</p>
            <h2 className="t-title mt-3">{t('healthTitle')}.</h2>
            <p className="t-sub mt-5">{t('healthText')}</p>
            <ul className="mt-8 space-y-4">
              {[t('healthPoint1'), t('healthPoint2'), t('healthPoint3')].map((point) => (
                <li key={point} className="flex items-start gap-3 text-[17px]">
                  <span className="check-dot mt-0.5"><Check className="h-3.5 w-3.5" aria-hidden /></span> {point}
                </li>
              ))}
            </ul>
            <Link href="/test" className="btn-primary mt-10">
              {t('healthCta')}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Responsible AI: black section, calm Nordic photo */}
      <section className="section bg-ink text-[#f5f5f7]">
        <div className="container-wide grid items-center gap-14 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <Reveal>
              <p className="text-[17px] font-semibold text-[#ff5a7f]">{t('trustEyebrow')}</p>
              <h2 className="t-headline mt-3">{t('trustTitle')}</h2>
            </Reveal>
            <div className="mt-12 space-y-10">
              {[
                { icon: Lock, title: t('trust1Title'), text: t('trust1Text') },
                { icon: Eye, title: t('trust2Title'), text: t('trust2Text') },
                { icon: Scale, title: t('trust3Title'), text: t('trust3Text') },
              ].map(({ icon: Icon, title, text }, i) => (
                <Reveal key={title} delay={i * 100} className="flex gap-5">
                  <Icon className="mt-1 h-6 w-6 shrink-0 text-[#ff5a7f]" aria-hidden />
                  <div>
                    <h3 className="text-[21px] font-semibold">{title}</h3>
                    <p className="mt-1.5 text-[17px] leading-relaxed text-[#a1a1a6]">{text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <Reveal>
            <Image
              src="/images/jarvi.jpg"
              alt=""
              width={2400}
              height={3394}
              sizes="(min-width: 1024px) 560px, 100vw"
              className="aspect-[4/5] w-full rounded-[34px] object-cover"
            />
          </Reveal>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="section scroll-mt-16 bg-alt">
        <div className="container-wide">
          <SectionHeader eyebrow={t('pricingEyebrow')} title={t('pricingTitle')} subtitle={t('pricingSubtitle')} />
          <Reveal className="mt-14">
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
          </Reveal>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="section">
        <Reveal className="container-apple text-center">
          <h2 className="t-headline mx-auto max-w-3xl">{t('ctaTitle')}.</h2>
          <p className="t-sub mt-5">{t('ctaText')}</p>
          <Link href="/register" className="btn-primary mt-9">
            {t('ctaPrimary')}
          </Link>
        </Reveal>
      </section>

      {/* Ecosystem */}
      <section className="section bg-alt">
        <div className="container-wide">
          <SectionHeader eyebrow={t('ecosystemEyebrow')} title={t('ecosystemTitle')} subtitle={t('ecosystemText')} />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {ECOSYSTEM.map((service, i) => (
              <Reveal key={service.key} delay={i * 80}>
                <a href={service.url} className="card group flex h-full flex-col p-7 transition duration-300 hover:-translate-y-1">
                  <span className="text-[19px] font-semibold">{new URL(service.url).host}</span>
                  <p className="mt-2 flex-1 text-[17px] leading-relaxed text-muted-foreground">{te(service.key)}</p>
                  <span className="mt-5 text-[17px] font-medium text-primary group-hover:underline">
                    {new URL(service.url).host.split('.')[0]} <span aria-hidden>›</span>
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container-apple max-w-3xl">
          <h2 className="t-title text-center">{t('faqTitle')}</h2>
          <div className="mt-12 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <details key={i} className="group rounded-[22px] bg-alt px-6 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 text-[19px] font-semibold">
                  {t(`faq${i}q`)}
                  <span className="text-[28px] font-light leading-none text-muted-foreground transition group-open:rotate-45" aria-hidden>+</span>
                </summary>
                <p className="pb-6 text-[17px] leading-relaxed text-muted-foreground">{t(`faq${i}a`)}</p>
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
    <Reveal className="mx-auto max-w-3xl text-center">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="t-headline mt-3">{title}.</h2>
      {subtitle && <p className="t-sub mt-5">{subtitle}</p>}
    </Reveal>
  )
}

/** Glass card over the hero photo: a finished task and the time saved. */
function HeroGlass({ task, taskStatus, savedLabel, hours }: {
  task: string
  taskStatus: string
  savedLabel: string
  hours: string
}) {
  return (
    <div aria-hidden className="glass absolute bottom-4 left-4 hidden w-[min(380px,calc(100%-2rem))] rounded-[26px] p-6 sm:bottom-8 sm:left-8 sm:block">
      <p className="text-[15px] font-medium text-[#3a3a3c]">{savedLabel}</p>
      <p className="text-brand-gradient mt-1 text-[48px] font-semibold leading-none tracking-[-0.04em]">{hours}</p>
      <div className="mt-5 flex items-center gap-3 rounded-2xl bg-white/70 px-4 py-3">
        <ToolIcon slug="quote" className="h-5 w-5 shrink-0 text-primary" />
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold">{task}</p>
          <p className="text-[14px] font-medium text-[#1d7a46]">{taskStatus}</p>
        </div>
      </div>
    </div>
  )
}

function HealthPreview() {
  const bars = [82, 61, 48, 77, 66]
  return (
    <div aria-hidden className="card p-8">
      <div className="flex items-center gap-8">
        <ScoreRing score={67} size={132} />
        <div className="flex-1 space-y-3.5">
          {bars.map((value, i) => (
            <div key={i} className="h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-brand-gradient" style={{ width: `${value}%` }} />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 space-y-2.5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 rounded-2xl bg-alt p-4">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-[14px] font-semibold text-white">{i}</span>
            <span className="h-2 flex-1 rounded-full bg-black/10" style={{ maxWidth: `${90 - i * 15}%` }} />
          </div>
        ))}
      </div>
    </div>
  )
}
