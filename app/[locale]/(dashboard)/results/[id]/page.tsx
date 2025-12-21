import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createClient } from "@supabase/supabase-js"
import { redirect } from "next/navigation"
import { DownloadReportButton } from "@/components/DownloadReportButton"
import Link from "next/link"
import { TrendingUp, AlertTriangle, Lightbulb, ArrowRight, CheckCircle2, XCircle, Activity } from "lucide-react"
import { DataChart } from "@/components/DashboardCharts"

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function ResultsPage({
    params
}: {
    params: Promise<{ id: string }> | { id: string }
}) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) redirect("/login")

    // Await params if it's a Promise (Next.js 15+)
    const resolvedParams = await Promise.resolve(params)
    const reportId = resolvedParams.id

    console.log('Fetching report with ID:', reportId)

    // Fetch report
    const { data: report, error } = await supabase
        .from('diagnostic_reports')
        .select('*')
        .eq('id', reportId)
        .single()

    console.log('Report data:', report)
    console.log('Report error:', error)

    if (error || !report) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <h2 className="text-2xl font-bold">Report Not Found</h2>
                <p className="text-muted-foreground mt-2">
                    Error: {error?.message || 'Report does not exist'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                    Report ID: {reportId}
                </p>
                <Link href="/dashboard" className="mt-4 text-primary hover:underline">
                    Go to Dashboard
                </Link>
            </div>
        )
    }

    // Parse category scores
    const categoryData = Object.entries(report.category_scores as Record<string, number>).map(([key, value]) => ({
        subject: key,
        A: value,
        fullMark: 100
    }))

    // Get score color
    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-600 bg-green-100 border-green-300"
        if (score >= 60) return "text-yellow-600 bg-yellow-100 border-yellow-300"
        return "text-red-600 bg-red-100 border-red-300"
    }

    const scoreColor = getScoreColor(report.score)

    return (
        <div className="max-w-6xl mx-auto space-y-8 px-4">
            {/* Header with Score */}
            <div className="text-center space-y-4 py-8">
                <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full border-8 ${scoreColor}`}>
                    <div className="text-center">
                        <div className="text-5xl font-bold">{report.score}</div>
                        <div className="text-xs font-medium">/ 100</div>
                    </div>
                </div>
                <h1 className="text-4xl font-bold">Your Business Health Report</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    {report.summary}
                </p>
                <div className="flex items-center justify-center gap-4 pt-4">
                    <DownloadReportButton report={report} />
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center px-6 py-3 border border-border rounded-lg font-medium hover:bg-muted transition-all"
                    >
                        View Dashboard
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </div>
            </div>

            {/* Category Breakdown */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Radar Chart */}
                <div className="col-span-2 p-6 rounded-xl border bg-card shadow-sm">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Activity className="h-5 w-5 text-blue-500" />
                        Category Performance
                    </h3>
                    <div className="h-[400px]">
                        <DataChart data={categoryData} type="radar" dataKey="A" />
                    </div>
                </div>

                {/* Strengths */}
                <div className="p-6 rounded-xl border bg-card shadow-sm">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="h-5 w-5" />
                        Strengths
                    </h3>
                    <ul className="space-y-3">
                        {(report.weaknesses as string[]).slice(0, 3).map((strength, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{strength}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Weaknesses */}
                <div className="p-6 rounded-xl border bg-card shadow-sm">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-5 w-5" />
                        Areas for Improvement
                    </h3>
                    <ul className="space-y-3">
                        {(report.weaknesses as string[]).map((weakness, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{weakness}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Recommendations */}
            <div className="p-8 rounded-xl border bg-gradient-to-br from-primary/5 to-primary/10 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-primary/10 rounded-full">
                        <Lightbulb className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-semibold">AI-Powered Recommendations</h3>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    {(report.recommendations as string[]).map((rec, i) => (
                        <div key={i} className="p-4 bg-background rounded-lg border shadow-sm">
                            <div className="flex items-start gap-3">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm flex-shrink-0">
                                    {i + 1}
                                </div>
                                <p className="text-sm leading-relaxed">{rec}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Category Details */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Object.entries(report.category_scores as Record<string, number>).map(([category, score]) => (
                    <div key={category} className="p-6 rounded-xl border bg-card shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-sm">{category}</h4>
                            <span className={`text-2xl font-bold ${getScoreColor(score).split(' ')[0]}`}>
                                {score}
                            </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                            <div
                                className={`h-2 rounded-full ${score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                style={{ width: `${score}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Next Steps */}
            <div className="text-center py-8 space-y-4">
                <h3 className="text-2xl font-bold">Ready to Take Action?</h3>
                <p className="text-muted-foreground">
                    Schedule a consultation with our experts to discuss your results
                </p>
                <div className="flex items-center justify-center gap-4">
                    <Link
                        href="/test"
                        className="inline-flex items-center px-6 py-3 border border-border rounded-lg font-medium hover:bg-muted transition-all"
                    >
                        Take Another Test
                    </Link>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all"
                    >
                        View Dashboard
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </div>
            </div>
        </div>
    )
}
