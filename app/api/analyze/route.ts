import { NextResponse } from "next/server"
import { ANALYSIS_SYSTEM_PROMPT } from "@/lib/ai/prompt"
import { completeJson, getAI, languageName } from "@/lib/ai/client"
import { QUESTIONS } from "@/lib/diagnostic"
import { companyContext, getWorkspace, supabaseAdmin } from "@/lib/workspace"
import { routing } from "@/src/i18n/navigation"

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

export async function POST(req: Request) {
    try {
        const workspace = await getWorkspace()
        if (!workspace) return new NextResponse("Unauthorized", { status: 401 })
        if (!workspace.company) return new NextResponse("User not associated with a company", { status: 400 })

        const body = await req.json()
        const answers: Record<string, string | number> = body?.answers ?? {}
        const locale = routing.locales.includes(body?.locale) ? body.locale : routing.defaultLocale

        // Pair each answer with the English question so the model sees full context
        const answered = QUESTIONS.map((q) => `- ${q.prompt} → ${answers[q.id] ?? "no answer"}`).join("\n")
        const userPrompt = `Company context:\n${companyContext(workspace.company)}\n\nAnswers to the business health check:\n${answered}`

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
