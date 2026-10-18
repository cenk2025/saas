import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { z } from "zod"
import { routing } from "@/src/i18n/navigation"

const schema = z.object({ email: z.email(), locale: z.string().optional() })

export async function POST(req: Request) {
    const parsed = schema.safeParse(await req.json().catch(() => null))
    if (!parsed.success) return NextResponse.json({ error: "Invalid email" }, { status: 400 })

    const locale = routing.locales.find((l) => l === parsed.data.locale) ?? routing.defaultLocale
    const origin = process.env.NEXTAUTH_URL || new URL(req.url).origin

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
    const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
        redirectTo: `${origin}/${locale}/reset-password`,
    })

    // Do not reveal whether the address exists
    if (error) console.error("Password reset failed:", error.message)
    return NextResponse.json({ success: true })
}
