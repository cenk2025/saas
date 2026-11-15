import { NextResponse } from "next/server"
import { ANALYSIS_SYSTEM_PROMPT } from "@/lib/ai/prompt"
import { completeJson, getAI, languageName } from "@/lib/ai/client"
import { QUESTIONS } from "@/lib/diagnostic"
import { companyContext, getWorkspace, supabaseAdmin } from "@/lib/workspace"
import { routing } from "@/src/i18n/navigation"
import en from "@/messages/en.json"

interface AnalysisResult {
    score: number
    summary: string
    strengths?: string[]
    weaknesses: string[]
    recommendations: string[]
    categoryScores: Record<string, number>
}

// The free NVIDIA tier can take ~30 s per answer
export const maxDuration = 120

// Visitors who are not signed in can take the test too. Their results are not saved, and each
// address gets a few analyses per hour so the public page cannot run up AI costs. The counter lives
// in the function instance's memory: a soft limit, enough to stop casual repeat use.
const ANON_LIMIT = 5
const ANON_WINDOW_MS = 60 * 60 * 1000
const anonHits = new Map<string, number[]>()

function anonAllowed(ip: string): boolean {
    const now = Date.now()
    const recent = (anonHits.get(ip) ?? []).filter((t) => now - t < ANON_WINDOW_MS)
    if (recent.length >= ANON_LIMIT) {
        anonHits.set(ip, recent)
        return false
    }
    recent.push(now)
    anonHits.set(ip, recent)
    if (anonHits.size > 5000) anonHits.clear()
    return true
}

const OPTION_LABELS = en.Diagnostic.questions as Record<string, { options?: Record<string, string> }>

/** How an answer reads to the model: "6/10" for scales, the English label (not the internal id) for choices. */
function answerText(id: string, value: string | number | undefined): string {
    if (value === undefined) return "no answer"
    if (typeof value === "number") return `${value}/10`
    return OPTION_LABELS[id]?.options?.[value] ?? value
}

/** Keep only answers to known questions, with values the question allows. */
function cleanAnswers(raw: unknown): Record<string, string | number> {
    const input = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>
    const out: Record<string, string | number> = {}
    for (const q of QUESTIONS) {
        const v = input[q.id]
        if (q.type === "range" && typeof v === "number" && v >= 1 && v <= 10) out[q.id] = Math.round(v)
        if (q.type === "select" && typeof v === "string" && q.options?.includes(v)) out[q.id] = v
    }
    return out
}

export async function POST(req: Request) {
    try {
        const workspace = await getWorkspace()
        if (workspace && !workspace.company) return new NextResponse("User not associated with a company", { status: 400 })
        if (!workspace) {
            const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
            if (!anonAllowed(ip)) return new NextResponse("Too many requests", { status: 429 })
        }

        const body = await req.json()
        const answers = cleanAnswers(body?.answers)
        const locale = routing.locales.includes(body?.locale) ? body.locale : routing.defaultLocale

        // Pair each answer with the English question so the model sees full context
        const answered = QUESTIONS.map((q) => `- ${q.prompt} → ${answerText(q.id, answers[q.id])}`).join("\n")
        const context = workspace?.company ? companyContext(workspace.company) : "Not provided (anonymous visitor on the public test page)."
        // The answers are in English, so the output language is repeated last; otherwise parts of
        // the report (seen: weaknesses) come back in English.
        const userPrompt = `Company context:\n${context}\n\nAnswers to the business health check:\n${answered}\n\nWrite every text value (summary, strengths, weaknesses, recommendations) in ${languageName(locale)}.`

        let analysisResult: AnalysisResult
        const ai = getAI()

        if (ai) {
            analysisResult = (await completeJson(ai, [
                {
                    role: "system",
                    content: `${ANALYSIS_SYSTEM_PROMPT}\nWrite summary, strengths, weaknesses and recommendations in ${languageName(locale)}. Keep the categoryScores keys exactly as shown in English.`,
                },
                { role: "user", content: userPrompt },
            ])) as AnalysisResult
        } else {
            // Mock data for development (when no API key is set)
            await new Promise((resolve) => setTimeout(resolve, 1500))
            analysisResult = {
                score: Math.floor(Math.random() * 30) + 60,
                summary: "Demo: the company shows solid operational discipline but trails in digital tools and AI adoption.",
                strengths: ["Clear operational processes", "High risk awareness", "Committed team"],
                weaknesses: ["Siloed digital tools", "Little use of AI and automation", "Slow feedback loops"],
                recommendations: [
                    "Map the three most time-consuming manual workflows and automate one of them this quarter.",
                    "Connect sales, invoicing and reporting data into one view for weekly decisions.",
                    "Run a one-day AI pilot with the team using a secure AI assistant.",
                ],
                categoryScores: {
                    "Operational Efficiency": Math.floor(Math.random() * 20) + 70,
                    "Digital Maturity": Math.floor(Math.random() * 20) + 50,
                    "Innovation Capability": Math.floor(Math.random() * 20) + 40,
                    "Financial Health": Math.floor(Math.random() * 20) + 70,
                    "Risk Management": Math.floor(Math.random() * 20) + 60,
                },
            }
        }

        // Visitors get the result back directly; nothing is stored.
        if (!workspace?.company) return NextResponse.json({ success: true, result: analysisResult })

        const { data: report, error: reportError } = await supabaseAdmin()
            .from("diagnostic_reports")
            .insert({
                company_id: workspace.company.id,
                user_id: workspace.user.id,
                score: analysisResult.score,
                summary: analysisResult.summary,
                weaknesses: analysisResult.weaknesses,
                recommendations: analysisResult.recommendations,
                category_scores: analysisResult.categoryScores,
                raw_answers: answers,
                ai_response: analysisResult,
            })
            .select()
            .single()

        if (reportError) {
            console.error("Database Error:", reportError)
            return new NextResponse("Failed to save report", { status: 500 })
        }

        return NextResponse.json({ success: true, reportId: report.id })
    } catch (error) {
        console.error("Analysis Error:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
