import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createClient } from "@supabase/supabase-js"
import { DownloadReportButton } from "@/components/DownloadReportButton"
import Link from "next/link"
import { redirect } from "next/navigation"
import { TrendingUp, AlertTriangle, Lightbulb, ArrowRight, Activity, Shield, Zap } from "lucide-react"
import { KPICard } from "@/components/KPICard"
import { DataChart } from "@/components/DashboardCharts"

// Initialize Supabase client with service role key for server-side queries
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function DashboardPage() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return null

    // Fetch user from Supabase
    const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', session.user.email)
        .single()

    if (userError || !user) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <h2 className="text-2xl font-bold">User Not Found</h2>
                <p className="text-muted-foreground mt-2">Please contact your administrator.</p>
            </div>
        )
    }

    // Note: ADMIN users can view their own dashboard
    // They can also access /admin for company management

    // Fetch company from Supabase
    const { data: company, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', user.company_id)
        .single()

    if (!company || companyError) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <h2 className="text-2xl font-bold">No Company Assigned</h2>
                <p className="text-muted-foreground mt-2">Please contact your administrator.</p>
            </div>
        )
    }

    // Fetch diagnostic reports for the company
    const { data: reports, error: reportsError } = await supabase
        .from('diagnostic_reports')
        .select('*')
        .eq('company_id', company.id)
        .order('created_at', { ascending: true })

    const reportsList = reports || []
    const latestReport = reportsList[reportsList.length - 1]
    const previousReport = reportsList[reportsList.length - 2]

    const chartData = reportsList.map((r: any) => ({
        date: new Date(r.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        score: r.score
    }))

    // Parse category scores safely
    let categoryData: any[] = []
    if (latestReport?.category_scores) {
        const scores = latestReport.category_scores as Record<string, number>
        categoryData = Object.keys(scores).map(key => ({
            subject: key,
            A: scores[key],
            fullMark: 100
        }))
    }

    // Risk Analysis Data (Mock based on Weaknesses count)
    const riskData = [
        { name: 'Operational', value: latestReport?.weaknesses.length * 15 || 20 },
        { name: 'Digital', value: 45 },
        { name: 'Compliance', value: 30 },
        { name: 'Financial', value: 25 },
        { name: 'Strategic', value: 55 },
    ].sort((a, b) => b.value - a.value)



    return (
        <div className="space-y-8 max-w-7xl mx-auto px-2">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Executive Dashboard</h1>
                    <p className="text-muted-foreground">{company.name} • {new Date().toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                    {latestReport && <DownloadReportButton report={latestReport} />}
                    <Link href="/test" className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all shadow-sm">
                        Run Diagnostics <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </div>
            </div>

            {!latestReport ? (
                <div className="p-12 border border-dashed rounded-xl bg-muted/20 text-center space-y-4">
                    <h3 className="text-xl font-semibold">No analysis generated yet</h3>
                    <Link href="/test" className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium">Start Assessment</Link>
                </div>
            ) : (
                <>
                    {/* KPI Cards Row */}
                    <div className="grid gap-6 md:grid-cols-4">
                        <KPICard
                            title="Overall Readiness"
                            value={latestReport.score}
                            change={previousReport ? latestReport.score - previousReport.score : 0}
                            trend={!previousReport ? 'neutral' : (latestReport.score >= previousReport.score ? 'up' : 'down')}
                            subtext="out of 100"
                        />
                        <KPICard title="Risks Identified" value={latestReport.weaknesses.length} trend="down" change={-12} subtext="Critical vulnerabilities" />
                        <KPICard title="Strategic Actions" value={latestReport.recommendations.length} trend="neutral" subtext="Pending implementation" />
                        <KPICard title="Data Maturity" value={categoryData.find(c => c.subject.includes("Digital"))?.A || "-"} trend="up" change={5} subtext="Percentile rank" />
                    </div>

                    <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-7">
                        {/* Main Radar Chart */}
                        <div className="col-span-3 lg:col-span-3 p-6 rounded-xl border bg-card shadow-sm h-[400px]">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Activity className="h-5 w-5 text-blue-500" /> Organizational Balance
                            </h3>
                            {categoryData.length > 0 ? (
                                <DataChart data={categoryData} type="radar" dataKey="A" />
                            ) : (
                                <div className="h-full flex items-center justify-center text-muted-foreground">Run new test to see detailed breakdown</div>
                            )}
                        </div>

                        {/* Trend Line Chart */}
                        <div className="col-span-3 lg:col-span-4 p-6 rounded-xl border bg-card shadow-sm h-[400px]">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-green-500" /> Historical Performance
                            </h3>
                            <DataChart data={chartData} type="line" color="#10b981" />
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Risk Analysis Bar Chart */}
                        <div className="p-6 rounded-xl border bg-card shadow-sm h-[350px]">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Shield className="h-5 w-5 text-red-500" /> Risk Exposure (Heat Map Proxy)
                            </h3>
                            <DataChart data={riskData} type="bar" dataKey="value" color="#ef4444" />
                        </div>

                        {/* AI Insight Box */}
                        <div className="p-6 rounded-xl border bg-card shadow-sm relative overflow-hidden flex flex-col justify-center">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Lightbulb className="h-40 w-40" />
                            </div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
                                    <Lightbulb className="h-5 w-5 text-yellow-600" />
                                </div>
                                <h3 className="font-semibold text-lg">AI Strategic Insight</h3>
                            </div>
                            <p className="text-lg leading-relaxed text-foreground/90 relative z-10 italic">
                                "{latestReport.summary}"
                            </p>
                            <div className="mt-6 flex flex-wrap gap-2">
                                {latestReport.recommendations.slice(0, 2).map((rec: string, i: number) => (
                                    <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        <Zap className="w-3 h-3 mr-1" /> Recommendation
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
