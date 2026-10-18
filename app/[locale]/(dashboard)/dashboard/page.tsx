import { getFormatter, getTranslations } from "next-intl/server"
import { ArrowRight, Building2, FileText, MessageSquareText, TrendingDown, TrendingUp } from "lucide-react"
import { PageHeader } from "@/components/app/PageHeader"
import { DataChart } from "@/components/DashboardCharts"
import { ScoreRing } from "@/components/ScoreRing"
import { ToolIcon } from "@/components/ToolIcon"
import { ECOSYSTEM } from "@/lib/ecosystem"
import { getWorkspace, supabaseAdmin } from "@/lib/workspace"
import { Link } from "@/src/i18n/navigation"

const QUICK_TOOLS = ["quote", "email", "social", "meeting", "automation", "funding"]

export default async function DashboardPage() {
    const workspace = await getWorkspace()
    if (!workspace?.company) return null
    const { user, company } = workspace

    const t = await getTranslations("Dashboard")
    const tt = await getTranslations("Tools")
    const te = await getTranslations("Ecosystem")
    const format = await getFormatter()

    const supabase = supabaseAdmin()
    const [{ data: reports }, { data: documents }] = await Promise.all([
        supabase
            .from("diagnostic_reports")
            .select("id, score, recommendations, created_at")
            .eq("company_id", company.id)
            .order("created_at", { ascending: true }),
        supabase
            .from("ai_documents")
            .select("id, tool, title, created_at")
            .eq("company_id", company.id)
            .order("created_at", { ascending: false })
            .limit(5),
    ])

    const reportList = reports ?? []
    const latest = reportList.at(-1)
    const previous = reportList.at(-2)
    const change = latest && previous ? latest.score - previous.score : null
    const trend = reportList.map((r) => ({
        date: format.dateTime(new Date(r.created_at), { day: "numeric", month: "short" }),
        score: r.score,
    }))
    const profileIncomplete = !company.profile?.description
    const firstName = (user.name || user.email).split(/[\s@]/)[0]

    return (
        <div className="space-y-8">
            <PageHeader title={t("greeting", { name: firstName })} subtitle={t("subtitle")} />

            {profileIncomplete && (
                <div className="flex flex-col gap-4 rounded-2xl border border-primary/20 bg-accent p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                        <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                        <div>
                            <p className="font-semibold">{t("profileTitle")}</p>
                            <p className="text-sm text-muted-foreground">{t("profileText")}</p>
                        </div>
                    </div>
                    <Link href="/company" className="btn-primary shrink-0">{t("profileCta")}</Link>
                </div>
            )}

            {/* Quick tools */}
            <section>
                <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{t("quickTitle")}</h2>
                    <Link href="/tools" className="text-sm font-medium text-primary hover:underline">{t("allTools")}</Link>
                </div>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
                    {QUICK_TOOLS.map((slug) => (
                        <Link key={slug} href={`/tools/${slug}`} className="card group flex flex-col gap-3 p-4 transition hover:border-primary/40 hover:shadow-md hover:shadow-black/5">
                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-primary">
                                <ToolIcon slug={slug} className="h-[18px] w-[18px]" />
                            </span>
                            <span className="text-sm font-semibold leading-snug">{tt(`${slug}.name`)}</span>
                        </Link>
                    ))}
                </div>
            </section>

            <div className="grid gap-6 lg:grid-cols-5">
                {/* Business health */}
                <section className="card min-w-0 p-6 lg:col-span-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <h2 className="font-semibold">{t("healthTitle")}</h2>
                        {latest && (
                            <div className="-mr-3 flex gap-1">
                                <Link href={`/results/${latest.id}`} className="btn-ghost">{t("viewReport")}</Link>
                                <Link href="/test" className="btn-ghost">{t("runAgain")}</Link>
                            </div>
                        )}
                    </div>

                    {latest ? (
                        <div className="mt-4 grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
                            <div className="flex flex-col items-center gap-2">
                                <ScoreRing score={latest.score} size={128} />
                                {change !== null && (
                                    <span className={`inline-flex items-center gap-1 text-xs font-semibold ${change >= 0 ? "text-success" : "text-destructive"}`}>
                                        {change >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                                        {t("change", { value: change > 0 ? `+${change}` : String(change) })}
                                    </span>
                                )}
                            </div>
                            <div className="h-44 min-w-0">
                                {trend.length > 1 ? (
                                    <DataChart data={trend} type="line" />
                                ) : (
                                    <ol className="space-y-2">
                                        {(latest.recommendations ?? []).slice(0, 3).map((rec: string, i: number) => (
                                            <li key={i} className="flex gap-3 text-sm">
                                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink text-[11px] font-bold text-white">{i + 1}</span>
                                                <span className="line-clamp-2">{rec}</span>
                                            </li>
                                        ))}
                                    </ol>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="mt-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                            <ScoreRing score={0} size={96} label="–" />
                            <div>
                                <p className="text-sm text-muted-foreground">{t("healthEmpty")}</p>
                                <Link href="/test" className="btn-primary mt-4">{t("healthCta")} <ArrowRight className="h-4 w-4" /></Link>
                            </div>
                        </div>
                    )}

                    {latest && trend.length > 1 && (
                        <div className="mt-6 border-t border-border pt-5">
                            <h3 className="mb-3 text-sm font-semibold">{t("recommendations")}</h3>
                            <ol className="space-y-2">
                                {(latest.recommendations ?? []).slice(0, 3).map((rec: string, i: number) => (
                                    <li key={i} className="flex gap-3 text-sm">
                                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink text-[11px] font-bold text-white">{i + 1}</span>
                                        {rec}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    )}
                </section>

                <div className="flex min-w-0 flex-col gap-6 lg:col-span-2">
                    {/* Advisor */}
                    <section className="relative overflow-hidden rounded-2xl bg-ink p-6 text-white">
                        <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-gradient opacity-30 blur-2xl" />
                        <MessageSquareText className="relative h-6 w-6 text-brand-orange" />
                        <h2 className="relative mt-3 font-semibold">{t("advisorTitle")}</h2>
                        <p className="relative mt-1 text-sm text-white/70">{t("advisorText")}</p>
                        <Link href="/advisor" className="btn-primary relative mt-5">{t("advisorCta")} <ArrowRight className="h-4 w-4" /></Link>
                    </section>

                    {/* Recent documents */}
                    <section className="card flex-1 p-6">
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="font-semibold">{t("recentTitle")}</h2>
                            <Link href="/library" aria-label={t("recentTitle")} className="text-primary"><ArrowRight className="h-4 w-4" /></Link>
                        </div>
                        {documents && documents.length > 0 ? (
                            <ul className="-mx-2">
                                {documents.map((doc) => (
                                    <li key={doc.id}>
                                        <Link href={`/library/${doc.id}`} className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-muted">
                                            <ToolIcon slug={doc.tool} className="h-4 w-4 shrink-0 text-primary" />
                                            <span className="min-w-0 flex-1 truncate text-sm">{doc.title}</span>
                                            <span className="shrink-0 text-xs text-muted-foreground">
                                                {format.relativeTime(new Date(doc.created_at), new Date())}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="flex items-start gap-3 text-sm text-muted-foreground">
                                <FileText className="h-5 w-5 shrink-0 text-brand-gray" />
                                {t("recentEmpty")}
                            </div>
                        )}
                    </section>
                </div>
            </div>

            {/* Ecosystem */}
            <section>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">{t("ecosystemTitle")}</h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {ECOSYSTEM.map((service) => (
                        <a key={service.key} href={service.url} className="card p-4 text-sm transition hover:border-primary/40">
                            <span className="font-semibold">{new URL(service.url).host}</span>
                            <p className="mt-1 text-muted-foreground">{te(service.key)}</p>
                        </a>
                    ))}
                </div>
            </section>
        </div>
    )
}
