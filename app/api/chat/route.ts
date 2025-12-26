import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import OpenAI from "openai"

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { messages } = await req.json()

        // Get user and their company's latest report from Supabase
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('id, company_id')
            .eq('email', session.user.email)
            .single()

        if (userError || !user?.company_id) {
            return NextResponse.json({
                role: "assistant",
                content: "I couldn't find your user profile. Please make sure you're properly registered."
            })
        }

        // Get the latest diagnostic report for the user's company
        const { data: latestReport, error: reportError } = await supabase
            .from('diagnostic_reports')
            .select('*')
            .eq('company_id', user.company_id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

        if (reportError || !latestReport) {
            return NextResponse.json({
                role: "assistant",
                content: "I don't see any diagnostic reports for your company yet. Please run a diagnostic test first so I can understand your business context."
            })
        }

        const context = `
      Company Analysis Context:
      Score: ${latestReport.score}/100
      Summary: ${latestReport.summary}
      Key Weaknesses: ${latestReport.weaknesses.join(", ")}
      Recommendations: ${latestReport.recommendations.join(", ")}
    `

        const systemMessage = {
            role: "system",
            content: `You are an expert AI Business Advisor. You help companies understand their diagnostic results.
      Use the following context about the company to answer their questions:
      ${context}
      
      Be professional, encouraging, and specific. If asked about something not in the report, use general business knowledge but mention the report didn't cover it specifically.`
        }

        const apiKey = process.env.OPENAI_API_KEY;

        if (apiKey) {
            const openai = new OpenAI({
                apiKey
            })

            const completion = await openai.chat.completions.create({
                messages: [systemMessage, ...messages],
                model: "gpt-4o-mini",
                temperature: 0.7
            })

            return NextResponse.json(completion.choices[0].message)
        } else {
            // Mock response for development (when no API key is set)
            await new Promise(resolve => setTimeout(resolve, 1000))
            // Simple mock logic
            const lastUserMsg = messages[messages.length - 1].content.toLowerCase()
            let content = "I can help explain your report. What would you like to know?"

            if (lastUserMsg.includes("score")) {
                content = `Your score of ${latestReport.score} reflects a solid foundation but highlights room for growth, especially in ${latestReport.weaknesses[0]}.`
            } else if (lastUserMsg.includes("innovation") || lastUserMsg.includes("weak")) {
                content = "Innovation scored lower due to lack of budget and slow feedback loops. I recommend starting with small, low-risk experiments."
            }

            return NextResponse.json({ role: "assistant", content })
        }
    } catch (error) {
        console.error(error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
