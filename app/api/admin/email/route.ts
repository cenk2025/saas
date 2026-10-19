import { NextResponse } from "next/server"
import { z } from "zod"
import { requirePlatformAdmin } from "@/lib/admin"
import { emailLayout, escapeHtml, FROM_ADDRESS, getResend, TEAM_ADDRESS, withBreaks } from "@/lib/email"
import { supabaseAdmin } from "@/lib/workspace"

const schema = z.object({
    recipients: z.array(z.email()).min(1).max(500),
    subject: z.string().trim().min(1).max(200),
    message: z.string().trim().min(1).max(10_000),
})

const BATCH_SIZE = 100 // Resend batch limit

export async function POST(req: Request) {
    const admin = await requirePlatformAdmin()
    if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const resend = getResend()
    if (!resend) return NextResponse.json({ error: "RESEND_API_KEY is not configured" }, { status: 500 })

    const parsed = schema.safeParse(await req.json().catch(() => null))
    if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 })

    // Only registered users can be emailed, so this route can't be used to mail arbitrary addresses
    const wanted = [...new Set(parsed.data.recipients)]
    const { data: users, error } = await supabaseAdmin()
        .from("users")
        .select("email, name, companies(name)")
        .in("email", wanted)
    if (error) return NextResponse.json({ error: "Could not load recipients" }, { status: 500 })

    const emails = (users ?? []).map((user) => {
        const company = (user.companies as unknown as { name: string } | null)?.name ?? ""
        // {name} and {company} placeholders are filled per recipient
        const fill = (text: string) => text.replaceAll("{name}", user.name || "").replaceAll("{company}", company)
        return {
            from: FROM_ADDRESS,
            to: user.email,
            replyTo: TEAM_ADDRESS,
            subject: fill(parsed.data.subject),
            html: emailLayout(escapeHtml(fill(parsed.data.subject)), `<div style="font-size:15px">${withBreaks(fill(parsed.data.message))}</div>`),
            text: fill(parsed.data.message),
        }
    })

    let sent = 0
    const failed: string[] = []
    for (let i = 0; i < emails.length; i += BATCH_SIZE) {
        const batch = emails.slice(i, i + BATCH_SIZE)
        const { error: sendError } = await resend.batch.send(batch)
        if (sendError) {
            console.error("Admin email batch failed:", sendError)
            failed.push(...batch.map((e) => e.to))
        } else {
            sent += batch.length
        }
    }

    console.log(`Admin ${admin} emailed ${sent} user(s), ${failed.length} failed`)
    return NextResponse.json({ sent, failed, skipped: wanted.length - emails.length })
}
