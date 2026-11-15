"use client"

import { useTranslations } from "next-intl"
import { ArrowRight, CheckCircle2, CircleAlert } from "lucide-react"
import { ScoreRing } from "@/components/ScoreRing"
import { SCORE_CATEGORY_SLUGS } from "@/lib/diagnostic"
import { Link } from "@/src/i18n/navigation"

export interface DiagnosticResult {
    score: number
    summary: string
    strengths?: string[]
    weaknesses: string[]
    recommendations: string[]
    categoryScores: Record<string, number>
}

/** The health-check result for a visitor who is not signed in: shown once, not saved. */
export function PublicResult({ result, onRetake }: { result: DiagnosticResult; onRetake: () => void }) {
    const t = useTranslations("Results")
    const td = useTranslations("Diagnostic")
    const categoryLabel = (key: string) => (SCORE_CATEGORY_SLUGS[key] ? td(`scoreCategories.${SCORE_CATEGORY_SLUGS[key]}`) : key)
    const scores = Object.entries(result.categoryScores ?? {})
    const strengths = result.strengths ?? []

    return (
        <div className="space-y-6">
            <section className="card flex flex-col items-center gap-6 p-6 text-center sm:p-8 md:flex-row md:text-left">
                <ScoreRing score={result.score} size={150} />
                <div className="flex-1">
                    <h1 className="text-2xl font-bold sm:text-3xl">{t("title")}</h1>
                    <p className="mt-3 text-lg leading-relaxed text-muted-foreground">{result.summary}</p>
                </div>
            </section>

            <div className="grid gap-6 lg:grid-cols-2">
                <section className="card min-w-0 p-6">
                    <h2 className="font-semibold">{t("categoryTitle")}</h2>
                    <ul className="mt-4 space-y-3">
                        {scores.map(([key, value]) => (
                            <li key={key}>
                                <div className="mb-1 flex justify-between text-sm">
                                    <span>{categoryLabel(key)}</span>
                                    <span className="font-semibold">{value}</span>
                                </div>
                                <div className="h-2 overflow-hidden rounded-full bg-muted">
                                    <div className="h-full rounded-full bg-brand-gradient" style={{ width: `${value}%` }} />
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>

                <div className="flex flex-col gap-6">
                    {strengths.length > 0 && (
                        <section className="card p-6">
                            <h2 className="flex items-center gap-2 font-semibold"><CheckCircle2 className="h-5 w-5 text-success" /> {t("strengths")}</h2>
                            <ul className="mt-4 space-y-2.5">
                                {strengths.map((item, i) => <li key={i} className="text-sm leading-relaxed">{item}</li>)}
                            </ul>
                        </section>
                    )}
                    <section className="card p-6">
                        <h2 className="flex items-center gap-2 font-semibold"><CircleAlert className="h-5 w-5 text-warning" /> {t("weaknesses")}</h2>
                        <ul className="mt-4 space-y-2.5">
                            {result.weaknesses.map((item, i) => <li key={i} className="text-sm leading-relaxed">{item}</li>)}
                        </ul>
                    </section>
                </div>
            </div>

            <section className="card p-6">
                <h2 className="font-semibold">{t("recommendations")}</h2>
                <ol className="mt-4 grid gap-3 md:grid-cols-3">
                    {result.recommendations.map((rec, i) => (
                        <li key={i} className="rounded-xl border border-border p-4">
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-gradient text-sm font-bold text-white">{i + 1}</span>
                            <p className="mt-3 text-sm leading-relaxed">{rec}</p>
                        </li>
                    ))}
                </ol>
            </section>

            <section className="flex flex-col gap-4 rounded-2xl bg-ink p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8">
                <p className="max-w-xl text-sm leading-relaxed text-white/80">{td("publicNote")}</p>
                <div className="flex shrink-0 flex-wrap gap-2">
                    <Link href="/register" className="btn-primary">{td("createAccount")} <ArrowRight className="h-4 w-4" /></Link>
                    <button type="button" onClick={onRetake} className="inline-flex items-center rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold hover:bg-white/10">
                        {td("retake")}
                    </button>
                </div>
            </section>
        </div>
    )
}
