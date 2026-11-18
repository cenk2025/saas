'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { CheckCircle2, Loader2, Mail, Send } from 'lucide-react';
import { NEED_OPTIONS } from '@/lib/contact';
import { Turnstile } from '@/components/Turnstile';

// TURNSTILE_SITE_KEY in Vercel, inlined by next.config.ts. Without it the form works as before
// (honeypot, timing and rate limit only).
const TURNSTILE_SITE_KEY = process.env.TURNSTILE_SITE_KEY;

const EMPTY_FORM = { name: '', email: '', company: '', need: 'demo', message: '', website: '' };

export default function ContactForm() {
    const t = useTranslations('contact');
    const locale = useLocale();
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
    // A new widget after each send, since a token works only once
    const [turnstileKey, setTurnstileKey] = useState(0);
    // When the form appeared; the server rejects submissions sent faster than a person can type
    const startedAt = useRef(0);
    useEffect(() => {
        startedAt.current = Date.now();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, locale, startedAt: startedAt.current, turnstileToken }),
            });
            if (!response.ok) throw new Error('Failed to send message');

            setStatus('success');
            setFormData(EMPTY_FORM);
        } catch {
            setStatus('error');
        } finally {
            setTurnstileKey((k) => k + 1);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <section id="contact" className="scroll-mt-20">
            <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1.3fr]">
                <div>
                    <h2 className="text-3xl font-bold sm:text-4xl">{t('title')}</h2>
                    <p className="mt-4 text-lg text-muted-foreground">{t('subtitle')}</p>
                    <p className="mt-8 text-sm text-muted-foreground">{t('alternativeContact')}</p>
                    <a href="mailto:info@voon.fi" className="mt-1 inline-flex items-center gap-2 text-lg font-semibold hover:text-primary">
                        <Mail className="h-5 w-5" /> info@voon.fi
                    </a>
                </div>

                <form onSubmit={handleSubmit} className="card space-y-4 p-6 sm:p-8">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label htmlFor="name" className="label">{t('name')} *</label>
                            <input id="name" name="name" required value={formData.name} onChange={handleChange} className="input" placeholder={t('namePlaceholder')} />
                        </div>
                        <div>
                            <label htmlFor="email" className="label">{t('email')} *</label>
                            <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} className="input" placeholder={t('emailPlaceholder')} />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="company" className="label">{t('company')}</label>
                        <input id="company" name="company" value={formData.company} onChange={handleChange} className="input" placeholder={t('companyPlaceholder')} />
                    </div>
                    <div>
                        <span id="need-label" className="label">{t('need')} *</span>
                        <div role="radiogroup" aria-labelledby="need-label" className="flex flex-wrap gap-2">
                            {NEED_OPTIONS.map((option) => {
                                const selected = formData.need === option;
                                return (
                                    <button
                                        key={option}
                                        type="button"
                                        role="radio"
                                        aria-checked={selected}
                                        onClick={() => setFormData((prev) => ({ ...prev, need: option }))}
                                        className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${selected ? 'border-ink bg-ink text-white' : 'border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground'}`}
                                    >
                                        {t(`needOptions.${option}`)}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="message" className="label">{t('message')} *</label>
                        <textarea id="message" name="message" required rows={5} value={formData.message} onChange={handleChange} className="input resize-none" placeholder={t('messagePlaceholder')} />
                    </div>

                    {/* Honeypot for spam bots, hidden from people and assistive tech */}
                    <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={formData.website} onChange={handleChange} className="hidden" />

                    {status === 'success' && (
                        <p className="flex items-center gap-2 rounded-xl bg-success/10 p-3 text-sm font-medium text-success">
                            <CheckCircle2 className="h-4 w-4" /> {t('success')}
                        </p>
                    )}
                    {status === 'error' && (
                        <p className="rounded-xl bg-destructive/10 p-3 text-sm font-medium text-destructive">{t('error')}</p>
                    )}

                    {TURNSTILE_SITE_KEY && (
                        <Turnstile key={turnstileKey} siteKey={TURNSTILE_SITE_KEY} language={locale} theme="light" onToken={setTurnstileToken} />
                    )}

                    <button type="submit" disabled={status === 'loading' || (!!TURNSTILE_SITE_KEY && !turnstileToken)} className="btn-primary w-full py-3">
                        {status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        {status === 'loading' ? t('sending') : t('submit')}
                    </button>
                </form>
            </div>
        </section>
    );
}
