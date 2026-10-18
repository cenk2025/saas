"use client"

import { useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { Loader2, Sparkles } from "lucide-react"
import { QUESTIONS } from "@/lib/diagnostic"
import { useRouter } from "@/src/i18n/navigation"

const initialAnswers = () =>
    Object.fromEntries(QUESTIONS.filter((q) => q.type === "range").map((q) => [q.id, 5])) as Record<string, string | number>

export default function DiagnosticPage() {
    const t = useTranslations("Diagnostic")
    const locale = useLocale()
    const router = useRouter()
    const [answers, setAnswers] = useState<Record<string, string | number>>(initialAnswers)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const answered = QUESTIONS.filter((q) => answers[q.id] !== undefined).length
    const complete = answered === QUESTIONS.length

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        try {
            const res = await fetch("/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ answers, locale }),
            })
            const data = await res.json().catch(() => null)
            if (res.ok && data?.reportId) {
                router.push(`/results/${data.reportId}`)
                return
            }
            throw new Error()
        } catch {
            setError(t("failed"))
            setLoading(false)
        }
    }

    return (
        <div className="mx-auto max-w-3xl">
            <div className="mb-8">
                <h1 className="text-2xl font-bold sm:text-3xl">{t("title")}</h1>
                <p className="mt-1.5 text-muted-foreground">{t("subtitle")}</p>
            </div>

            <div className="sticky top-14 z-10 -mx-4 mb-6 bg-background/90 px-4 py-3 backdrop-blur lg:top-0">
                <div className="mb-1.5 flex justify-between text-xs font-medium text-muted-foreground">
                    <span>{t("progress", { done: answered, total: QUESTIONS.length })}</span>
                    <span>{Math.round((answered / QUESTIONS.length) * 100)} %</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-brand-gradient transition-all" style={{ width: `${(answered / QUESTIONS.length) * 100}%` }} />
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {QUESTIONS.map((q, index) => (
                    <fieldset key={q.id} className="card p-5 sm:p-6">
                        <div className="mb-4 flex items-start justify-between gap-4">
                            <legend className="font-medium">
                                <span className="mr-2 text-muted-foreground">{index + 1}.</span>
                                {t(`questions.${q.id}.label`)}
                            </legend>
                            <span className="shrink-0 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                                {t(`categories.${q.category}`)}
                            </span>
                        </div>

                        {q.type === "select" && (
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                {q.options!.map((option) => {
                                    const selected = answers[q.id] === option
                                    return (
                                        <button
                                            key={option}
                                            type="button"
                                            aria-pressed={selected}
                                            onClick={() => setAnswers((a) => ({ ...a, [q.id]: option }))}
                                            className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${selected ? "border-ink bg-ink text-white" : "border-border bg-card hover:border-foreground/30"}`}
                                        >
                                            {t(`questions.${q.id}.options.${option}`)}
                                        </button>
                                    )
                                })}
                            </div>
                        )}

                        {q.type === "range" && (
                            <div>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        min={1}
                                        max={10}
                                        value={Number(answers[q.id])}
                                        onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: Number(e.target.value) }))}
                                        aria-label={t(`questions.${q.id}.label`)}
                                        className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-muted accent-primary"
                                    />
                                    <span className="w-8 text-center font-display text-xl font-bold">{answers[q.id]}</span>
                                </div>
                                <div className="mt-1 flex justify-between pr-12 text-xs text-muted-foreground">
                                    <span>{t("poor")}</span>
                                    <span>{t("excellent")}</span>
                                </div>
                            </div>
                        )}
                    </fieldset>
                ))}

                {error && <p className="rounded-xl bg-destructive/10 p-3 text-sm font-medium text-destructive">{error}</p>}

                <button type="submit" disabled={loading || !complete} className="btn-primary w-full py-3.5 text-base">
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                    {loading ? t("analyzing") : t("submit")}
                </button>
            </form>
        </div>
    )
}
