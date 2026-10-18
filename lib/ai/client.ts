import OpenAI from "openai"

const LANGUAGE_NAMES: Record<string, string> = {
    fi: "Finnish",
    sv: "Swedish",
    en: "English",
}

export function languageName(locale: string | undefined): string {
    return LANGUAGE_NAMES[locale ?? ""] ?? LANGUAGE_NAMES.fi
}

export interface AIProvider {
    name: "openai" | "nvidia"
    client: OpenAI
    model: string
}

/**
 * OpenAI when OPENAI_API_KEY is set, otherwise NVIDIA NIM (OpenAI-compatible,
 * free tier at build.nvidia.com) when NVIDIA_API_KEY is set, otherwise null (demo mode).
 * NVIDIA's free tier is slow (~20-30 s per answer) and rate-limited, so it gets a
 * longer timeout and more retries; the SDK retries 429/5xx with backoff.
 */
export function getAI(): AIProvider | null {
    if (process.env.OPENAI_API_KEY) {
        return {
            name: "openai",
            client: new OpenAI({ apiKey: process.env.OPENAI_API_KEY }),
            model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        }
    }
    if (process.env.NVIDIA_API_KEY) {
        return {
            name: "nvidia",
            client: new OpenAI({
                apiKey: process.env.NVIDIA_API_KEY,
                baseURL: process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1",
                timeout: 100_000,
                maxRetries: 3,
            }),
            model: process.env.NVIDIA_CHAT_MODEL || "moonshotai/kimi-k3",
        }
    }
    return null
}

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string }

const STREAM_HEADERS = {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
}

/** Streams a chat completion back to the browser as plain text. */
export async function streamCompletion(
    ai: AIProvider,
    messages: ChatMessage[],
    temperature = 0.6
): Promise<Response> {
    const completion = await ai.client.chat.completions.create({
        model: ai.model,
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

/**
 * Asks for a JSON object. OpenAI gets JSON mode; other providers are prompted
 * for bare JSON and the answer is parsed tolerantly (fences and stray text removed).
 */
export async function completeJson(ai: AIProvider, messages: ChatMessage[], temperature = 0.5): Promise<unknown> {
    const completion = await ai.client.chat.completions.create({
        model: ai.model,
        messages,
        temperature,
        ...(ai.name === "openai" ? { response_format: { type: "json_object" as const } } : {}),
    })

    const content = completion.choices[0]?.message?.content
    if (!content) throw new Error("No content from AI")

    const start = content.indexOf("{")
    const end = content.lastIndexOf("}")
    if (start === -1 || end <= start) throw new Error("AI answer contained no JSON object")
    return JSON.parse(content.slice(start, end + 1))
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
