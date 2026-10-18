import { getFormatter, getTranslations } from "next-intl/server"
import { ArrowRight, CheckCircle2, CircleAlert, MessageSquareText, Workflow } from "lucide-react"
import { DataChart } from "@/components/DashboardCharts"
import { DownloadReportButton } from "@/components/DownloadReportButton"
import { ScoreRing } from "@/components/ScoreRing"
import { SCORE_CATEGORY_SLUGS } from "@/lib/diagnostic"
import { getWorkspace, supabaseAdmin } from "@/lib/workspace"
import { Link } from "@/src/i18n/navigation"

export default async function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const workspace = await getWorkspace()
    if (!workspace?.company) return null

    const t = await getTranslations("Results")
    const td = await getTranslations("Diagnostic")
    const format = await getFormatter()

    const { data: report } = await supabaseAdmin()
        .from("diagnostic_reports")
        .select("*")
        .eq("id", id)
        .eq("company_id", workspace.company.id)
        .maybeSingle()

    if (!report) {
        return (
            <div className="card mx-auto max-w-lg p-10 text-center">
                <p className="text-muted-foreground">{t("notFound")}</p>
                <Link href="/dashboard" className="btn-secondary mt-6">{t("dashboard")}</Link>
            </div>
        )
    }

    const categoryLabel = (key: string) => (SCORE_CATEGORY_SLUGS[key] ? td(`scoreCategories.${SCORE_CATEGORY_SLUGS[key]}`) : key)
    const scores = Object.entries((report.category_scores ?? {}) as Record<string, number>)
    const radarData = scores.map(([key, value]) => ({ subject: categoryLabel(key), score: value }))
    const strengths: string[] = report.ai_response?.strengths ?? []
    const weaknesses: string[] = report.weaknesses ?? []
    const recommendations: string[] = report.recommendations ?? []

    return (
        <div className="space-y-6">
            {/* Summary */}
            <section className="card flex flex-col items-center gap-6 p-6 text-center sm:p-8 md:flex-row md:text-left">
                <ScoreRing score={report.score} size={150} />
                <div className="flex-1">
                    <p className="text-sm text-muted-foreground">{format.dateTime(new Date(report.created_at), { dateStyle: "long" })}</p>
                    <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{t("title")}</h1>
                    <p className="mt-3 text-lg leading-relaxed text-muted-foreground">{report.summary}</p>
                    <div className="mt-5 flex flex-wrap justify-center gap-2 md:justify-start">
                        <DownloadReportButton
                            report={{ ...report, strengths, categoryScores: scores.map(([key, value]) => [categoryLabel(key), value]) }}
                            labels={{
                                button: t("download"),
                                title: t("title"),
                                summary: td("title"),
                                strengths: t("strengths"),
                                weaknesses: t("weaknesses"),
                                recommendations: t("recommendations"),
                                categories: t("categoryTitle"),
                            }}
                        />
                        <Link href="/dashboard" className="btn-secondary">{t("dashboard")}</Link>
                    </div>
                </div>
            </section>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Scores */}
                <section className="card min-w-0 p-6">
                    <h2 className="font-semibold">{t("categoryTitle")}</h2>
                    <div className="mt-2 hidden h-64 sm:block">
                        <DataChart data={radarData} type="radar" />
                    </div>
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
                            {weaknesses.map((item, i) => <li key={i} className="text-sm leading-relaxed">{item}</li>)}
                        </ul>
                    </section>
                </div>
            </div>

            {/* Recommendations */}
            <section className="card p-6">
                <h2 className="font-semibold">{t("recommendations")}</h2>
                <ol className="mt-4 grid gap-3 md:grid-cols-3">
                    {recommendations.map((rec, i) => (
                        <li key={i} className="rounded-xl border border-border p-4">
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-gradient text-sm font-bold text-white">{i + 1}</span>
                            <p className="mt-3 text-sm leading-relaxed">{rec}</p>
                        </li>
                    ))}
                </ol>
            </section>

            {/* Next steps */}
            <section className="flex flex-col gap-4 rounded-2xl bg-ink p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8">
                <div>
                    <h2 className="text-xl font-semibold">{t("nextTitle")}</h2>
                    <p className="mt-1 text-sm text-white/70">{t("nextText")}</p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                    <Link href="/advisor" className="btn-primary"><MessageSquareText className="h-4 w-4" /> {t("askAdvisor")}</Link>
                    <Link href="/tools/automation" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold hover:bg-white/10">
                        <Workflow className="h-4 w-4" /> {t("findAutomation")} <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </section>
        </div>
    )
}
