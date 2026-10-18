"use client"

import { useEffect, useRef, useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { ArrowUp, Bot, Loader2, RotateCcw } from "lucide-react"
import { Markdown } from "@/components/Markdown"
import { readTextStream } from "@/lib/stream"

type Message = { role: "user" | "assistant"; content: string }

export default function AdvisorPage() {
    const t = useTranslations("Advisor")
    const tw = useTranslations("Workspace")
    const locale = useLocale()
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const bottomRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
    }, [messages])

    const send = async (text: string) => {
        const question = text.trim()
        if (!question || loading) return

        const history: Message[] = [...messages, { role: "user", content: question }]
        setMessages([...history, { role: "assistant", content: "" }])
        setInput("")
        setLoading(true)

        const setAnswer = (content: string) =>
            setMessages((prev) => [...prev.slice(0, -1), { role: "assistant", content }])

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: history, locale }),
            })
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            await readTextStream(res, setAnswer)
        } catch {
            setAnswer(tw("error"))
        } finally {
            setLoading(false)
            inputRef.current?.focus()
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            send(input)
        }
    }

    return (
        <div className="flex h-[calc(100vh-7.5rem)] flex-col lg:h-[calc(100vh-5rem)]">
            <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">{t("title")}</h1>
                    <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
                </div>
                {messages.length > 0 && (
                    <button type="button" onClick={() => setMessages([])} disabled={loading} className="btn-secondary">
                        <RotateCcw className="h-4 w-4" /> <span className="hidden sm:inline">{t("newChat")}</span>
                    </button>
                )}
            </div>

            <div className="card flex min-h-0 flex-1 flex-col overflow-hidden">
                <div className="flex-1 space-y-6 overflow-y-auto p-4 sm:p-6">
                    <div className="flex gap-3">
                        <BotAvatar />
                        <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-muted px-4 py-3 text-[15px] leading-relaxed">{t("welcome")}</div>
                    </div>

                    {messages.length === 0 && (
                        <div className="pl-11">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("suggestionsTitle")}</p>
                            <div className="grid gap-2 sm:grid-cols-2">
                                {(t.raw("suggestions") as string[]).map((suggestion) => (
                                    <button
                                        key={suggestion}
                                        type="button"
                                        onClick={() => send(suggestion)}
                                        className="rounded-xl border border-border bg-card p-3 text-left text-sm transition hover:border-primary/40 hover:bg-accent"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {messages.map((message, i) =>
                        message.role === "user" ? (
                            <div key={i} className="flex justify-end">
                                <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-tr-sm bg-ink px-4 py-3 text-[15px] leading-relaxed text-white">
                                    {message.content}
                                </div>
                            </div>
                        ) : (
                            <div key={i} className="flex gap-3">
                                <BotAvatar />
                                <div className="min-w-0 max-w-[85%] rounded-2xl rounded-tl-sm bg-muted px-4 py-3">
                                    {message.content ? (
                                        <Markdown>{message.content}</Markdown>
                                    ) : (
                                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                    )}
                                </div>
                            </div>
                        )
                    )}
                    <div ref={bottomRef} />
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        send(input)
                    }}
                    className="border-t border-border p-3 sm:p-4"
                >
                    <div className="flex items-end gap-2 rounded-2xl border border-input bg-card p-2 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">
                        <textarea
                            ref={inputRef}
                            rows={1}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={t("placeholder")}
                            aria-label={t("placeholder")}
                            maxLength={8000}
                            className="max-h-40 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-[15px] focus:outline-none"
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            aria-label={t("send")}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white transition disabled:opacity-40"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-5 w-5" />}
                        </button>
                    </div>
                    <p className="mt-2 text-center text-xs text-muted-foreground">{tw("aiDisclaimer")}</p>
                </form>
            </div>
        </div>
    )
}

function BotAvatar() {
    return (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-white">
            <Bot className="h-4 w-4" />
        </span>
    )
}
