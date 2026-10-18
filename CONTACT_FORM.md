# Contact form

The contact form on the landing page (`components/ContactForm.tsx`) posts to
`app/api/contact/route.ts`, which sends email with [Resend](https://resend.com) –
the same setup as voon.fi.

Fields: name, email, company (optional), "what do you need help with" and message.
A hidden honeypot field filters simple spam bots.

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

Without `RESEND_FROM` the shared sandbox sender `onboarding@resend.dev` is used, which
only delivers to the Resend account owner and is likely to land in spam.
