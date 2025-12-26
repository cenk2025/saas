"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Loader2 } from "lucide-react"

export default function AdvisorPage() {
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
        { role: 'assistant', content: "Hello! I'm your AI Business Advisor. I've analyzed your latest company report. How can I help you improve your score today?" }
    ])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const bottomRef = useRef<HTMLDivElement>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || loading) return

        const userMsg = { role: 'user' as const, content: input }
        console.log('🔵 Adding user message:', userMsg)
        setMessages(prev => {
            const newMessages = [...prev, userMsg]
            console.log('🔵 Messages after user msg:', newMessages)
            return newMessages
        })
        setInput("")
        setLoading(true)

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: [...messages, userMsg] }) // In real app, might just send new msg or limited history
            })

            if (!res.ok) throw new Error("Failed to fetch")

            const data = await res.json()
            console.log('🟢 API Response:', data)
            setMessages(prev => {
                const newMessages = [...prev, data]
                console.log('🟢 Messages after API response:', newMessages)
                return newMessages
            })
        } catch (err) {
            console.error('🔴 Error:', err)
            setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting right now. Please try again." }])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    return (
        <div className="flex flex-col flex-1 max-w-4xl mx-auto border rounded-xl bg-card shadow-sm overflow-hidden my-4">
            {/* Header */}
            <div className="p-4 border-b bg-muted/30 flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                    <Bot className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h1 className="font-semibold">AI Business Advisor</h1>
                    <p className="text-xs text-muted-foreground">Ask questions about your diagnostic report</p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10">
                {messages.map((m, i) => (
                    <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {m.role === 'assistant' && (
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <Bot className="h-4 w-4 text-primary" />
                            </div>
                        )}
                        <div className={`p-4 rounded-2xl max-w-[80%] text-sm leading-relaxed ${m.role === 'user'
                            ? 'bg-primary text-primary-foreground rounded-tr-none'
                            : 'bg-card border shadow-sm rounded-tl-none'
                            }`}>
                            {m.content}
                        </div>
                        {m.role === 'user' && (
                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                                <User className="h-4 w-4 text-muted-foreground" />
                            </div>
                        )}
                    </div>
                ))}
                {loading && (
                    <div className="flex gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <Bot className="h-4 w-4 text-primary" />
                        </div>
                        <div className="p-4 rounded-2xl bg-card border shadow-sm rounded-tl-none flex items-center">
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-card">
                <form onSubmit={handleSubmit} className="flex gap-4">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask for advice..."
                        className="flex-1 rounded-full border border-input bg-background px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="rounded-full bg-primary p-2 text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50"
                    >
                        <Send className="h-5 w-5" />
                    </button>
                </form>
            </div>
        </div>
    )
}
