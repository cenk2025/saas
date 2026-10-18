import { NextResponse } from "next/server"
import { getTranslations } from "next-intl/server"
import { getTool } from "@/lib/ai/tool-catalog"
import { TOOL_PROMPTS, baseSystemPrompt, formatToolInput } from "@/lib/ai/tool-prompts"
import { getOpenAI, languageName, streamCompletion, streamText } from "@/lib/ai/client"
import { companyContext, getWorkspace } from "@/lib/workspace"
import { routing } from "@/src/i18n/navigation"

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const tool = getTool(slug)
    if (!tool) return NextResponse.json({ error: "Unknown tool" }, { status: 404 })

    const workspace = await getWorkspace()
    if (!workspace) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json().catch(() => null)
    const rawValues: Record<string, unknown> = body?.values ?? {}
    const locale = routing.locales.includes(body?.locale) ? body.locale : routing.defaultLocale

    // Keep only known fields and validate them against the catalog
    const values: Record<string, string> = {}
    for (const field of tool.fields) {
        const value = typeof rawValues[field.id] === "string" ? (rawValues[field.id] as string).trim() : ""
        if (field.required && !value) {
            return NextResponse.json({ error: `Missing field: ${field.id}` }, { status: 400 })
        }
        if (field.maxLength && value.length > field.maxLength) {
            return NextResponse.json({ error: `Field too long: ${field.id}` }, { status: 400 })
        }
        if (value && field.options && !field.options.includes(value)) {
            return NextResponse.json({ error: `Invalid option: ${field.id}` }, { status: 400 })
        }
        values[field.id] = value
    }

    const openai = getOpenAI()
    if (!openai) {
        const t = await getTranslations({ locale, namespace: "Workspace" })
        return streamText(`${t("demoNotice")}\n\n${formatToolInput(values)}`)
    }

    try {
        return await streamCompletion(openai, [
            {
                role: "system",
                content: `${baseSystemPrompt(languageName(locale), companyContext(workspace.company))}\n\n${TOOL_PROMPTS[tool.slug]}`,
            },
            { role: "user", content: formatToolInput(values) },
        ])
    } catch (error) {
        console.error(`Tool ${slug} failed:`, error)
        return NextResponse.json({ error: "AI request failed" }, { status: 502 })
    }
}
