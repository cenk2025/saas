import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import OpenAI from "openai"
import { ANALYSIS_SYSTEM_PROMPT } from "@/lib/ai/prompt"

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user.email) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { company: true }
        })

        if (!user?.companyId) {
            // For demo purposes, create a company if none exists?
            // Or return error. User asked for "Companies fill out...".
            // If user just signed up (if sign up existed), they might not have company.
            // But our seed creates them.
            return new NextResponse("User not associated with a company", { status: 400 })
        }

        const { answers } = await req.json()

        const userPrompt = `Here are the company's answers to the diagnostic test:\n${JSON.stringify(answers, null, 2)}`

        let analysisResult;

        if (process.env.OPENAI_API_KEY) {
            const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
            const completion = await openai.chat.completions.create({
                messages: [
                    { role: "system", content: ANALYSIS_SYSTEM_PROMPT },
                    { role: "user", content: userPrompt }
                ],
                model: "gpt-4-turbo-preview",
                response_format: { type: "json_object" }
            })

            const content = completion.choices[0].message.content
            if (!content) throw new Error("No content from AI")
            analysisResult = JSON.parse(content)
        } else {
            // Mock Data
            await new Promise(resolve => setTimeout(resolve, 2000))
            analysisResult = {
                score: Math.floor(Math.random() * 30) + 60, // 60-90
                summary: "The company shows strong operational discipline but trails in digital transformation metrics. Innovation is stifled by a lack of dedicated budget.",
                strengths: ["Clear operational processes", "High risk awareness", "Strong leadership alignment"],
                weaknesses: ["Siloed digital tools", "Insufficient R&D spending", "Slow feedback loops"],
                recommendations: [
                    "Implement a unified data platform to break down silos.",
                    "Allocate at least 5% of revenue to an innovation fund.",
                    "Establish a cross-functional digital transformation task force."
                ],
                categoryScores: {
                    "Operational Efficiency": Math.floor(Math.random() * 20) + 70,
                    "Digital Maturity": Math.floor(Math.random() * 20) + 50,
                    "Innovation Capability": Math.floor(Math.random() * 20) + 40,
                    "Financial Health": Math.floor(Math.random() * 20) + 80,
                    "Risk Management": Math.floor(Math.random() * 20) + 60
                }
            }
        }

        // Save to DB
        const report = await prisma.diagnosticReport.create({
            data: {
                companyId: user.companyId,
                score: analysisResult.score,
                summary: analysisResult.summary,
                weaknesses: analysisResult.weaknesses,
                recommendations: analysisResult.recommendations,
                categoryScores: analysisResult.categoryScores,
                rawAnswers: answers,
                aiResponse: analysisResult
            }
        })

        return NextResponse.json({ success: true, reportId: report.id })
    } catch (error) {
        console.error("Analysis Error:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
