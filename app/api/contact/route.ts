import { NextResponse } from 'next/server';
import { getTranslations } from 'next-intl/server';
import { Resend } from 'resend';
import { z } from 'zod';
import { NEED_OPTIONS } from '@/lib/contact';
import { routing } from '@/src/i18n/navigation';

// Same setup as voon.fi: RESEND_FROM must be an address on a domain verified in Resend
// (e.g. "Voon Business <info@voon.fi>"); the sandbox fallback is likely to land in spam.
// RESEND_FORM is accepted too, as a common misspelling of the variable name in Vercel.
const FROM_ADDRESS = process.env.RESEND_FROM || process.env.RESEND_FORM || 'Voon Business <onboarding@resend.dev>';
const TEAM_ADDRESS = 'info@voon.fi';

const contactSchema = z.object({
    name: z.string().trim().min(1).max(200),
    email: z.email().max(320),
    company: z.string().trim().max(200).optional().default(''),
    need: z.enum(NEED_OPTIONS),
    message: z.string().trim().min(1).max(5000),
    locale: z.string().optional(),
    // Honeypot: real users never see or fill this field
    website: z.string().max(500).optional(),
});

const escapeHtml = (value: string) =>
    value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const withBreaks = (value: string) => escapeHtml(value).replace(/\n/g, '<br>');

function layout(title: string, body: string) {
    return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:24px 12px;background:#f3f2f4;font-family:Arial,Helvetica,sans-serif;color:#16131a;line-height:1.6">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e8e6ea">
    <div style="height:6px;background:linear-gradient(100deg,#ffa970 0%,#f2409f 100%)"></div>
    <div style="padding:32px">
      <p style="margin:0 0 4px;font-size:12px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;color:#66616c">Voon Business</p>
      <h1 style="margin:0 0 24px;font-size:22px">${title}</h1>
      ${body}
    </div>
    <div style="padding:20px 32px;background:#fafafa;border-top:1px solid #e8e6ea;font-size:12px;color:#66616c">
      VOON IQ · Jyväskylä · <a href="https://business.voon.fi" style="color:#e23d96">business.voon.fi</a> · <a href="mailto:${TEAM_ADDRESS}" style="color:#e23d96">${TEAM_ADDRESS}</a>
    </div>
  </div>
</body>
</html>`;
}

const field = (label: string, value: string) =>
    `<div style="margin-bottom:16px">
       <div style="font-size:12px;font-weight:bold;color:#66616c;text-transform:uppercase;letter-spacing:0.5px">${label}</div>
       <div style="margin-top:4px;padding:10px 12px;background:#fafafa;border-left:3px solid #f2409f;border-radius:6px">${value}</div>
     </div>`;

export async function POST(req: Request) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        console.error('RESEND_API_KEY is not configured');
        return NextResponse.json({ error: 'Contact form is not configured' }, { status: 500 });
    }

    const parsed = contactSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
        return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
    }

    const { name, email, company, need, message, website } = parsed.data;
    // Pretend success to bots that filled the honeypot
    if (website) return NextResponse.json({ success: true });

    const locale = routing.locales.find((l) => l === parsed.data.locale) ?? routing.defaultLocale;
    const resend = new Resend(apiKey);
    const tTeam = await getTranslations({ locale: 'fi', namespace: 'contact' });
    const t = await getTranslations({ locale, namespace: 'contact' });

    // 1. Notification to the team (always in Finnish)
    const { data, error } = await resend.emails.send({
        from: FROM_ADDRESS,
        to: TEAM_ADDRESS,
        replyTo: email,
        subject: `Business-yhteydenotto: ${company || name} – ${tTeam(`needOptions.${need}`)}`,
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
