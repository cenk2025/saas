import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createClient } from "@supabase/supabase-js"
import { redirect } from "next/navigation"
import { Download } from "lucide-react"

// Initialize Supabase client with service role key
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function AdminPage() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) redirect("/login")

    // Fetch user from Supabase
    const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('email', session.user.email)
        .single()

    if (user?.role !== 'ADMIN') {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                <h1 className="text-4xl font-bold text-destructive">403</h1>
                <p className="text-xl text-muted-foreground mt-2">Access Forbidden</p>
            </div>
        )
    }

    // Check if user is super admin (can see all companies)
    const isSuperAdmin = user.email === 'info@voon.fi'

    // Fetch companies based on user type
    let companiesQuery = supabase
        .from('companies')
        .select(`
            *,
            diagnostic_reports!inner (
                id,
                score,
                created_at
            ),
            users (
                id,
                email,
                name,
                role
            )
        `)

    // If not super admin, filter by user's company
    if (!isSuperAdmin && user.company_id) {
        companiesQuery = companiesQuery.eq('id', user.company_id)
    }

    const { data: allCompanies, error: companiesError } = await companiesQuery.order('created_at', { ascending: false })

    // Sort diagnostic_reports for each company to get latest first
    const companiesWithLatestReport = allCompanies?.map(company => ({
        ...company,
        diagnostic_reports: (company.diagnostic_reports as any[])?.sort((a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ) || []
    })) || []

    // Get company name for page title
    const companyName = allCompanies?.[0]?.name || 'Company'

    // Get all users from all companies
    const allUsers = companiesWithLatestReport.flatMap(company =>
        (company.users || []).map((user: any) => ({
            ...user,
            companyName: company.name,
            companyId: company.id
        }))
    )

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">
                        {isSuperAdmin ? 'Platform Admin' : `${companyName} Dashboard`}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {isSuperAdmin ? 'Manage all companies and users' : 'Manage your company'}
                    </p>
                </div>
                <div className="flex gap-2">
                    {/* CSV Export Placeholder */}
                    <button className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-muted text-sm font-medium">
                        <Download className="h-4 w-4" />
                        Export All Data (CSV)
                    </button>
                </div>
            </div>

            {/* Companies Table */}
            <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b bg-muted/30">
                    <h2 className="text-lg font-semibold">Companies Overview</h2>
                </div>
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
                        <tr>
                            <th className="px-6 py-4">Company Name</th>
                            <th className="px-6 py-4">Users</th>
                            <th className="px-6 py-4">Last Assessment</th>
                            <th className="px-6 py-4">Score</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {companiesWithLatestReport.map((c: any) => {
                            const lastReport = c.diagnostic_reports?.[0]
                            return (
                                <tr key={c.id} className="hover:bg-muted/10 transition-colors">
                                    <td className="px-6 py-4 font-semibold">{c.name}</td>
                                    <td className="px-6 py-4">{c.users?.length || 0} Users</td>
                                    <td className="px-6 py-4">
                                        {lastReport
                                            ? new Date(lastReport.created_at).toLocaleDateString()
                                            : "Never"}
                                    </td>
                                    <td className="px-6 py-4">
                                        {lastReport ? (
                                            <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${lastReport.score > 80 ? 'bg-emerald-100 text-emerald-800' :
                                                lastReport.score > 50 ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                {lastReport.score}
                                            </span>
                                        ) : "-"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs px-2 py-1 rounded-full border bg-background">Active</span>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {/* Users Table */}
            <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b bg-muted/30">
                    <h2 className="text-lg font-semibold">All Users ({allUsers.length})</h2>
                </div>
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Company</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {allUsers.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                    No users found
                                </td>
                            </tr>
                        ) : (
                            allUsers.map((user: any) => (
                                <tr key={user.id} className="hover:bg-muted/10 transition-colors">
                                    <td className="px-6 py-4 font-medium">{user.name || 'N/A'}</td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs px-2 py-1 rounded-full bg-muted">
                                            {user.companyName}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                                            user.role === 'MANAGER' ? 'bg-blue-100 text-blue-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                            {user.role || 'USER'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs px-2 py-1 rounded-full border bg-green-50 text-green-700 border-green-200">
                                            Active
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
