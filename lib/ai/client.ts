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
    /** Tried in order until one answers; the first is the preferred model */
    models: string[]
}

// Models on NVIDIA's free tier come and go, and some are gated per account, so we
// fall back through several instead of depending on one. Fast instruct models first.
const NVIDIA_FALLBACK_MODELS = [
    "deepseek-ai/deepseek-v4.1-flash",
    "google/gemma-4-31b-it",
    "mistralai/mistral-large-2-instruct",
    "z-ai/glm-5.3-flash",
    "moonshotai/kimi-k2.6",
]

// The model that last answered, reused so later requests skip models that failed
let workingNvidiaModel: string | null = null

/**
 * OpenAI when OPENAI_API_KEY is set, otherwise NVIDIA NIM (OpenAI-compatible,
 * free tier at build.nvidia.com) when NVIDIA_API_KEY is set, otherwise null (demo mode).
 * NVIDIA's free tier is slow and rate-limited; each model gets one SDK retry and
 * the next model is tried when one is unavailable (see createWithFallback).
 */
export function getAI(): AIProvider | null {
    if (process.env.OPENAI_API_KEY) {
        return {
            name: "openai",
            client: new OpenAI({ apiKey: process.env.OPENAI_API_KEY }),
            models: [process.env.OPENAI_MODEL || "gpt-4o-mini"],
        }
    }
    if (process.env.NVIDIA_API_KEY) {
        return {
            name: "nvidia",
            client: new OpenAI({
                apiKey: process.env.NVIDIA_API_KEY,
                baseURL: process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1",
                timeout: 40_000,
                maxRetries: 1,
            }),
            models: [...new Set([
                workingNvidiaModel,
                process.env.NVIDIA_CHAT_MODEL,
                ...NVIDIA_FALLBACK_MODELS,
            ].filter((m): m is string => Boolean(m)))],
        }
    }
    return null
}

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string }

const STREAM_HEADERS = {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
}

// Stop trying further models after this long so the route stays within maxDuration
const FALLBACK_BUDGET_MS = 85_000

/**
 * Runs `request` with each model in turn until one succeeds. A wrong key (401)
 * fails at once; any other error (model gated/removed, rate limit, timeout)
 * moves on to the next model.
 */
async function createWithFallback<T>(ai: AIProvider, request: (model: string) => Promise<T>): Promise<T> {
    const started = Date.now()
    let lastError: unknown
    for (const model of ai.models) {
        if (Date.now() - started > FALLBACK_BUDGET_MS) break
        try {
            const result = await request(model)
            if (ai.name === "nvidia") workingNvidiaModel = model
            return result
        } catch (error) {
            lastError = error
            const status = error instanceof OpenAI.APIError ? error.status : undefined
            console.error(`AI model ${model} failed (${status ?? (error as Error).name}):`, (error as Error).message)
            if (status === 401) break
            if (model === workingNvidiaModel) workingNvidiaModel = null
        }
    }
    throw lastError
}

/** Streams a chat completion back to the browser as plain text. */
export async function streamCompletion(
    ai: AIProvider,
    messages: ChatMessage[],
    temperature = 0.6
): Promise<Response> {
    // Headers arrive before the first token, so a failing model is detected here and the next one tried
    const completion = await createWithFallback(ai, (model) =>
        ai.client.chat.completions.create({ model, messages, temperature, stream: true })
    )

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
    const completion = await createWithFallback(ai, (model) =>
        ai.client.chat.completions.create({
            model,
            messages,
            temperature,
            ...(ai.name === "openai" ? { response_format: { type: "json_object" as const } } : {}),
        })
    )

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
