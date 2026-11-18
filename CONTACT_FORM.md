# Contact form

The contact form on the landing page (`components/ContactForm.tsx`) posts to
`app/api/contact/route.ts`, which sends email with [Resend](https://resend.com) –
the same setup as voon.fi.

Fields: name, email, company (optional), "what do you need help with" and message.
Bot protection:

- a hidden honeypot field (filled in → fake success, nothing is sent)
- a minimum fill time of 3 seconds (the browser sends when the form appeared)
- at most 5 messages per IP address in 10 minutes (in memory, per server instance)
- [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) above the submit button,
  verified on the server before any email is sent (403 when the token is missing or rejected).
  The script loads only when the form nears the viewport. Without the keys the check is skipped.

## What gets sent

1. **Team notification** to info@voon.fi (in Finnish), with `replyTo` set to the sender.
2. **Confirmation** to the sender in the language they used on the site (fi / sv / en).
   If only this one fails, the request still succeeds.

User input is HTML-escaped before it is put into the emails.

## Environment variables (Vercel)

| Variable | Example |
|---|---|
| `RESEND_API_KEY` | `re_...` |
| `RESEND_FROM` | `Voon Business <info@voon.fi>` – must be on a domain verified in Resend |
| `TURNSTILE_SITE_KEY` | Turnstile widget's site key (public, passed to the browser by `next.config.ts`) |
| `TURNSTILE_SECRET_KEY` | Turnstile widget's secret key (server only) |

Set both Turnstile keys for Production and Preview. The widget's hostnames in Cloudflare must
include `business.voon.fi` (and a preview hostname if you test on Vercel previews).

Without `RESEND_FROM` the shared sandbox sender `onboarding@resend.dev` is used, which
only delivers to the Resend account owner and is likely to land in spam.
