import { NextResponse } from "next/server"
import { z } from "zod"
import { getWorkspace, supabaseAdmin } from "@/lib/workspace"

const text = (max: number) => z.string().trim().max(max).optional().default("")

const companySchema = z.object({
    name: z.string().trim().min(1).max(200),
    country: text(100),
    profile: z.object({
        industry: text(200),
        size: text(50),
        location: text(200),
        website: text(300),
        description: text(3000),
        customers: text(1500),
        goals: text(1500),
    }),
})

export async function PUT(req: Request) {
    const workspace = await getWorkspace()
    if (!workspace?.company) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    if (workspace.user.role === "EMPLOYEE") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const parsed = companySchema.safeParse(await req.json().catch(() => null))
    if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 })

    const { error } = await supabaseAdmin()
        .from("companies")
        .update({ name: parsed.data.name, country: parsed.data.country, profile: parsed.data.profile })
        .eq("id", workspace.company.id)

    if (error) {
        console.error("Updating company failed:", error)
        return NextResponse.json({ error: "Saving failed" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}
