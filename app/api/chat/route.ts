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
            // Enhanced mock response for development (when no API key is set)
            await new Promise(resolve => setTimeout(resolve, 1000))

            const lastUserMsg = messages[messages.length - 1].content.toLowerCase()
            let content = ""

            // Analyze user message and provide contextual responses
            if (lastUserMsg.includes("pisteet") || lastUserMsg.includes("score") || lastUserMsg.includes("tulos")) {
                content = `Yrityksesi sai ${latestReport.score}/100 pistettä diagnostisessa testissä. ${latestReport.summary || 'Tämä on hyvä lähtökohta kehitykselle.'} Erityisesti ${latestReport.weaknesses[0]} vaatii huomiota.`
            } else if (lastUserMsg.includes("heikko") || lastUserMsg.includes("weak") || lastUserMsg.includes("parantaa") || lastUserMsg.includes("improve")) {
                const weaknesses = latestReport.weaknesses.slice(0, 2).join(" ja ")
                content = `Tärkeimmät kehityskohteet ovat: ${weaknesses}. Suosittelen aloittamaan pienillä, vähäriskisillä kokeiluilla näillä alueilla.`
            } else if (lastUserMsg.includes("suositus") || lastUserMsg.includes("recommend") || lastUserMsg.includes("mitä teen") || lastUserMsg.includes("what should")) {
                const recommendations = latestReport.recommendations.slice(0, 2).join(". ")
                content = `Tässä tärkeimmät suositukseni: ${recommendations}. Aloita näistä ja seuraa tuloksia säännöllisesti.`
            } else if (lastUserMsg.includes("raportti") || lastUserMsg.includes("report") || lastUserMsg.includes("analyysi") || lastUserMsg.includes("analysis")) {
                content = `Raporttisi osoittaa, että yrityksesi sai ${latestReport.score}/100 pistettä. ${latestReport.summary || 'Kokonaisuutena yritykselläsi on hyvä perusta.'} Voin auttaa sinua ymmärtämään tuloksia paremmin - kysy vaikka heikkouksista tai suosituksista!`
            } else if (lastUserMsg.includes("miten") || lastUserMsg.includes("how") || lastUserMsg.includes("kuinka")) {
                content = `Paras tapa aloittaa on keskittyä yhteen kehityskohteeseen kerrallaan. Suosittelen aloittamaan tästä: ${latestReport.recommendations[0] || 'Tarkista diagnostiikkaraporttisi suositukset'}. Haluatko tietää lisää tästä?`
            } else if (lastUserMsg.includes("kiitos") || lastUserMsg.includes("thank")) {
                content = "Ole hyvä! Olen täällä auttamassa. Kysy rohkeasti lisää, jos haluat syventää jotain aluetta."
            } else if (lastUserMsg.includes("hei") || lastUserMsg.includes("hello") || lastUserMsg.includes("hi") || lastUserMsg.includes("terve")) {
                content = `Hei! Olen AI-liiketoimintaneuvojasi. Olen analysoinut yrityksesi diagnostiikkaraportin (pisteet: ${latestReport.score}/100). Voin auttaa sinua ymmärtämään tuloksia ja antaa käytännön neuvoja. Mitä haluaisit tietää?`
            } else {
                // Default contextual response
                content = `Ymmärrän kysymyksesi. Yrityksesi diagnostiikkatulos on ${latestReport.score}/100 pistettä. Voin auttaa sinua ymmärtämään tuloksia paremmin. Kysy esimerkiksi: "Mitkä ovat heikkouteni?" tai "Mitä suosittelet?" tai "Miten voin parantaa pisteitäni?"`
            }

            return NextResponse.json({ role: "assistant", content })
        }
    } catch (error) {
        console.error(error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
