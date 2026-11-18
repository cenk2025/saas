import { NextResponse } from 'next/server';
import { getTranslations } from 'next-intl/server';
import { z } from 'zod';
import { NEED_OPTIONS } from '@/lib/contact';
import { emailField as field, emailLayout as layout, escapeHtml, FROM_ADDRESS, getResend, TEAM_ADDRESS, withBreaks } from '@/lib/email';
import { routing } from '@/src/i18n/navigation';

const contactSchema = z.object({
    name: z.string().trim().min(1).max(200),
    email: z.email().max(320),
    company: z.string().trim().max(200).optional().default(''),
    need: z.enum(NEED_OPTIONS),
    message: z.string().trim().min(1).max(5000),
    locale: z.string().optional(),
    // Honeypot: real users never see or fill this field
    website: z.string().max(500).optional(),
    // When the form appeared in the browser (ms since epoch)
    startedAt: z.number().optional(),
    turnstileToken: z.string().max(2048).nullish(),
});

// Bot protection: honeypot, a minimum fill time, a per-IP rate limit and Cloudflare Turnstile.
const MIN_FILL_MS = 3_000;
const MAX_FILL_MS = 24 * 60 * 60 * 1000;
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
// In-memory, so it is per server instance: a speed bump against floods, not a hard guarantee.
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
    const now = Date.now();
    const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
    recent.push(now);
    hits.set(ip, recent);
    if (hits.size > 5_000) {
        for (const [key, times] of hits) {
            if (times.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(key);
        }
    }
    return recent.length > RATE_LIMIT;
}

// When TURNSTILE_SECRET_KEY is unset the check is skipped, so the form keeps working until the keys are added.
async function turnstileOk(token: string | null | undefined, ip: string): Promise<boolean> {
    const secret = process.env.TURNSTILE_SECRET_KEY;
    if (!secret) return true;
    if (!token) return false;
    try {
        const form = new URLSearchParams({ secret, response: token });
        if (ip !== 'unknown') form.set('remoteip', ip);
        const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            body: form,
            signal: AbortSignal.timeout(5_000),
        });
        const result = (await res.json()) as { success?: boolean; 'error-codes'?: string[] };
        if (!result.success) console.warn('Turnstile rejected', result['error-codes']);
        return result.success === true;
    } catch (error) {
        console.error('Turnstile verification failed:', error);
        return false;
    }
}

export async function POST(req: Request) {
    const resend = getResend();
    if (!resend) {
        console.error('RESEND_API_KEY is not configured');
        return NextResponse.json({ error: 'Contact form is not configured' }, { status: 500 });
    }

    const parsed = contactSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
        return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
    }

    const { name, email, company, need, message, website, startedAt, turnstileToken } = parsed.data;
    // Pretend success to bots that filled the honeypot
    if (website) return NextResponse.json({ success: true });

    // Too fast, or no timestamp at all (scripts posting straight to the API)
    const elapsed = Date.now() - Number(startedAt);
    if (!Number.isFinite(elapsed) || elapsed < MIN_FILL_MS || elapsed > MAX_FILL_MS) {
        return NextResponse.json({ error: 'Please try again' }, { status: 400 });
    }

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || req.headers.get('x-real-ip') || 'unknown';
    if (rateLimited(ip)) {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    if (!(await turnstileOk(turnstileToken, ip))) {
        return NextResponse.json({ error: 'Verification failed' }, { status: 403 });
    }

    const locale = routing.locales.find((l) => l === parsed.data.locale) ?? routing.defaultLocale;
    const tTeam = await getTranslations({ locale: 'fi', namespace: 'contact' });
    const t = await getTranslations({ locale, namespace: 'contact' });

    // 1. Notification to the team (always in Finnish)
    const { data, error } = await resend.emails.send({
        from: FROM_ADDRESS,
        to: TEAM_ADDRESS,
        replyTo: email,
        subject: `Business-yhteydenotto: ${(company || name).replace(/[\r\n]+/g, ' ')} – ${tTeam(`needOptions.${need}`)}`,
        html: layout(
            'Uusi yhteydenotto business.voon.fi:stä',
            [
                field(tTeam('company'), escapeHtml(company || '–')),
                field(tTeam('name'), escapeHtml(name)),
                field(tTeam('email'), `<a href="mailto:${escapeHtml(email)}" style="color:#e23d96">${escapeHtml(email)}</a>`),
                field(tTeam('need'), escapeHtml(tTeam(`needOptions.${need}`))),
                field(tTeam('message'), withBreaks(message)),
                `<p style="margin:24px 0 0;font-size:13px;color:#66616c">Kieli: ${locale.toUpperCase()} · ${new Date().toLocaleString('fi-FI', { timeZone: 'Europe/Helsinki' })}</p>`,
            ].join('')
        ),
    });

    if (error) {
        console.error('Resend error:', error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    // 2. Confirmation to the sender in their own language
    const { error: replyError } = await resend.emails.send({
        from: FROM_ADDRESS,
        to: email,
        replyTo: TEAM_ADDRESS,
        subject: t('autoReplySubject'),
        html: layout(
            escapeHtml(t('autoReplyGreeting', { name })),
            [
                `<p style="margin:0 0 16px">${escapeHtml(t('autoReplyText'))}</p>`,
                field(t('need'), escapeHtml(t(`needOptions.${need}`))),
                field(t('message'), withBreaks(message)),
                `<p style="margin:24px 0 0">${escapeHtml(t('autoReplyOutro'))}</p>`,
                `<p style="margin:24px 0 0"><a href="https://business.voon.fi/${locale}" style="display:inline-block;padding:12px 24px;border-radius:999px;background:#e23d96;background-image:linear-gradient(100deg,#ffa970 0%,#f2409f 100%);color:#ffffff;font-weight:bold;text-decoration:none">business.voon.fi</a></p>`,
            ].join('')
        ),
    });

    // The team notification already went out, so a failed auto-reply must not fail the request
    if (replyError) console.error('Resend auto-reply error:', replyError);

    return NextResponse.json({ success: true, messageId: data?.id });
}
