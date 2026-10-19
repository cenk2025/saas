import { Resend } from "resend"

// RESEND_FORM is accepted too, as a common misspelling of the variable name in Vercel.
export const FROM_ADDRESS = process.env.RESEND_FROM || process.env.RESEND_FORM || "Voon Business <onboarding@resend.dev>"
export const TEAM_ADDRESS = "info@voon.fi"

export function getResend(): Resend | null {
    return process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
}

export const escapeHtml = (value: string) =>
    value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!)

export const withBreaks = (value: string) => escapeHtml(value).replace(/\n/g, "<br>")

/** Branded email frame; `title` and `body` must already be HTML-safe. */
export function emailLayout(title: string, body: string) {
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
</html>`
}

/** Labelled value block; `value` must already be HTML-safe. */
export const emailField = (label: string, value: string) =>
    `<div style="margin-bottom:16px">
       <div style="font-size:12px;font-weight:bold;color:#66616c;text-transform:uppercase;letter-spacing:0.5px">${label}</div>
       <div style="margin-top:4px;padding:10px 12px;background:#fafafa;border-left:3px solid #f2409f;border-radius:6px">${value}</div>
     </div>`
