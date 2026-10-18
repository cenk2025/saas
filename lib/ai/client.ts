import OpenAI from "openai"

export const AI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini"

const LANGUAGE_NAMES: Record<string, string> = {
    fi: "Finnish",
    sv: "Swedish",
    en: "English",
}

export function languageName(locale: string | undefined): string {
    return LANGUAGE_NAMES[locale ?? ""] ?? LANGUAGE_NAMES.fi
}

export function getOpenAI(): OpenAI | null {
    const apiKey = process.env.OPENAI_API_KEY
    return apiKey ? new OpenAI({ apiKey }) : null
}

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string }

const STREAM_HEADERS = {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
}

/** Streams a chat completion back to the browser as plain text. */
export async function streamCompletion(
    openai: OpenAI,
    messages: ChatMessage[],
    temperature = 0.6
): Promise<Response> {
    const completion = await openai.chat.completions.create({
        model: AI_MODEL,
        messages,
        temperature,
        stream: true,
    })

    const encoder = new TextEncoder()
    const body = new ReadableStream<Uint8Array>({
        async start(controller) {
            try {
                for await (const chunk of completion) {
                    const delta = chunk.choices[0]?.delta?.content
                    if (delta) controller.enqueue(encoder.encode(delta))
                }
            } catch (error) {
                console.error("AI stream error:", error)
                controller.enqueue(encoder.encode("\n\n⚠️"))
            } finally {
                controller.close()
            }
        },
    })

    return new Response(body, { headers: STREAM_HEADERS })
}

/** Streams a canned text word by word, used when no AI key is configured. */
export function streamText(text: string): Response {
    const encoder = new TextEncoder()
    const parts = text.split(/(\s+)/)
    const body = new ReadableStream<Uint8Array>({
        async start(controller) {
            for (const part of parts) {
                controller.enqueue(encoder.encode(part))
                await new Promise((resolve) => setTimeout(resolve, 12))
            }
            controller.close()
        },
    })
    return new Response(body, { headers: STREAM_HEADERS })
}
