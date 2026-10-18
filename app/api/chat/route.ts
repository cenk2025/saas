import { NextResponse } from "next/server"
import { getTranslations } from "next-intl/server"
import { baseSystemPrompt } from "@/lib/ai/tool-prompts"
import { ChatMessage, getOpenAI, languageName, streamCompletion, streamText } from "@/lib/ai/client"
import { companyContext, getWorkspace, supabaseAdmin } from "@/lib/workspace"
import { routing } from "@/src/i18n/navigation"

const MAX_HISTORY = 20
const MAX_MESSAGE_LENGTH = 8000

export async function POST(req: Request) {
    const workspace = await getWorkspace()
    if (!workspace) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json().catch(() => null)
    const locale = routing.locales.includes(body?.locale) ? body.locale : routing.defaultLocale

    // Only accept user/assistant turns from the browser; the system prompt is built here
    const history: ChatMessage[] = (Array.isArray(body?.messages) ? body.messages : [])
        .filter((m: ChatMessage) => (m?.role === "user" || m?.role === "assistant") && typeof m.content === "string")
        .slice(-MAX_HISTORY)
        .map((m: ChatMessage) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_LENGTH) }))

    if (history.length === 0 || history[history.length - 1].role !== "user") {
        return NextResponse.json({ error: "No question" }, { status: 400 })
    }

    let reportContext = "The company has not run the business health check yet."
    if (workspace.company) {
        const { data: report } = await supabaseAdmin()
            .from("diagnostic_reports")
            .select("score, summary, weaknesses, recommendations, category_scores, created_at")
            .eq("company_id", workspace.company.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle()

        if (report) {
            reportContext = `Latest business health check (${new Date(report.created_at).toLocaleDateString("fi-FI")}):
Score: ${report.score}/100
Summary: ${report.summary}
Category scores: ${JSON.stringify(report.category_scores ?? {})}
Weaknesses: ${(report.weaknesses ?? []).join("; ")}
Recommendations: ${(report.recommendations ?? []).join("; ")}`
        }
    }

    const openai = getOpenAI()
    if (!openai) {
        const t = await getTranslations({ locale, namespace: "Workspace" })
        return streamText(t("demoChat"))
    }

    const system = `${baseSystemPrompt(languageName(locale), companyContext(workspace.company))}

${reportContext}

You are the company's AI business advisor. Answer questions about strategy, sales, marketing, operations, finance, HR, AI adoption and regulations. Keep answers focused (usually under 250 words) and end with a concrete next step when it makes sense. If a question needs a professional (lawyer, accountant), say so.`

    try {
        return await streamCompletion(openai, [{ role: "system", content: system }, ...history], 0.7)
    } catch (error) {
        console.error("Chat failed:", error)
        return NextResponse.json({ error: "AI request failed" }, { status: 502 })
    }
}
