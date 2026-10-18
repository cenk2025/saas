import { NextResponse } from "next/server"
import { z } from "zod"
import { getTool } from "@/lib/ai/tool-catalog"
import { getWorkspace, supabaseAdmin } from "@/lib/workspace"

const documentSchema = z.object({
    tool: z.string().max(40),
    title: z.string().trim().min(1).max(200),
    input: z.record(z.string(), z.string()).optional(),
    output: z.string().min(1).max(100_000),
})

export async function POST(req: Request) {
    const workspace = await getWorkspace()
    if (!workspace?.company) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const parsed = documentSchema.safeParse(await req.json().catch(() => null))
    if (!parsed.success || !getTool(parsed.data.tool)) {
        return NextResponse.json({ error: "Invalid document" }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin()
        .from("ai_documents")
        .insert({
            company_id: workspace.company.id,
            user_id: workspace.user.id,
            tool: parsed.data.tool,
            title: parsed.data.title,
            input: parsed.data.input ?? {},
            output: parsed.data.output,
        })
        .select("id")
        .single()

    if (error) {
        console.error("Saving document failed:", error)
        return NextResponse.json({ error: "Saving failed" }, { status: 500 })
    }

    return NextResponse.json({ id: data.id })
}
