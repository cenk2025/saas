import { NextResponse } from "next/server"
import { getWorkspace, supabaseAdmin } from "@/lib/workspace"

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const workspace = await getWorkspace()
    if (!workspace?.company) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { error } = await supabaseAdmin()
        .from("ai_documents")
        .delete()
        .eq("id", id)
        .eq("company_id", workspace.company.id)

    if (error) return NextResponse.json({ error: "Delete failed" }, { status: 500 })
    return NextResponse.json({ success: true })
}
