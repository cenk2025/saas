"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Check, Loader2, Send, X } from "lucide-react"

export interface Recipient {
    email: string
    name: string | null
    company: string
}

export function EmailComposer({ recipients, onClose }: { recipients: Recipient[]; onClose: () => void }) {
    const t = useTranslations("Admin")
    const [subject, setSubject] = useState("")
    const [message, setMessage] = useState("")
    const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle")
    const [result, setResult] = useState<{ sent: number; failed: string[] } | null>(null)

    const send = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus("sending")
        try {
            const res = await fetch("/api/admin/email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ recipients: recipients.map((r) => r.email), subject, message }),
            })
            if (!res.ok) throw new Error()
            const data = await res.json()
            setResult(data)
            setStatus(data.failed.length > 0 ? "error" : "done")
        } catch {
            setResult({ sent: 0, failed: recipients.map((r) => r.email) })
            setStatus("error")
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
            <button type="button" aria-label={t("cancel")} onClick={onClose} className="absolute inset-0 bg-ink/40" />
            <form onSubmit={send} className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-t-2xl bg-card shadow-2xl sm:rounded-2xl">
                <div className="flex items-center justify-between border-b border-border px-6 py-4">
                    <h2 className="font-semibold">{t("composeTitle")}</h2>
                    <button type="button" onClick={onClose} aria-label={t("cancel")} className="rounded-lg p-2 hover:bg-muted">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-4 overflow-y-auto p-6">
                    <div>
                        <p className="label">{t("recipients", { count: recipients.length })}</p>
                        <div className="flex max-h-24 flex-wrap gap-1.5 overflow-y-auto">
                            {recipients.map((r) => (
                                <span key={r.email} className="rounded-full bg-muted px-2.5 py-1 text-xs" title={r.company}>
                                    {r.name ? `${r.name} <${r.email}>` : r.email}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="subject" className="label">{t("subject")}</label>
                        <input id="subject" required maxLength={200} value={subject} onChange={(e) => setSubject(e.target.value)} className="input" />
                    </div>
                    <div>
                        <label htmlFor="message" className="label">{t("message")}</label>
                        <textarea id="message" required rows={9} maxLength={10000} value={message} onChange={(e) => setMessage(e.target.value)} className="input resize-y" />
                        <p className="mt-1.5 text-xs text-muted-foreground">
                            {t("placeholderHint")} <code className="rounded bg-muted px-1">{"{name}"}</code> <code className="rounded bg-muted px-1">{"{company}"}</code>
                        </p>
                    </div>

                    {status === "done" && result && (
                        <p className="flex items-center gap-2 rounded-xl bg-success/10 p-3 text-sm font-medium text-success">
                            <Check className="h-4 w-4" /> {t("sent", { count: result.sent })}
                        </p>
                    )}
                    {status === "error" && result && (
                        <p className="rounded-xl bg-destructive/10 p-3 text-sm font-medium text-destructive">
                            {result.sent > 0 && `${t("sent", { count: result.sent })} `}
                            {t("sendFailed", { emails: result.failed.join(", ") })}
                        </p>
                    )}
                </div>

                <div className="flex justify-end gap-2 border-t border-border px-6 py-4">
                    <button type="button" onClick={onClose} className="btn-secondary">{t("cancel")}</button>
                    <button type="submit" disabled={status === "sending" || status === "done"} className="btn-primary">
                        {status === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        {status === "sending" ? t("sending") : t("send")}
                    </button>
                </div>
            </form>
        </div>
    )
}
