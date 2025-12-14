import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Role } from "@prisma/client"
import { redirect } from "next/navigation"
import { Download } from "lucide-react"

export default async function AdminPage() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) redirect("/login")

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })

    if (user?.role !== Role.ADMIN) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                <h1 className="text-4xl font-bold text-destructive">403</h1>
                <p className="text-xl text-muted-foreground mt-2">Access Forbidden</p>
            </div>
        )
    }

    const allCompanies = await prisma.company.findMany({
        include: {
            reports: { take: 1, orderBy: { createdAt: 'desc' } },
            users: true
        }
    })

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Admin Portal</h1>
                <div className="flex gap-2">
                    {/* CSV Export Placeholder */}
                    <button className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-muted text-sm font-medium">
                        <Download className="h-4 w-4" />
                        Export All Data (CSV)
                    </button>
                </div>
            </div>

            <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
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
                        {allCompanies.map((c) => {
                            const lastReport = c.reports[0]
                            return (
                                <tr key={c.id} className="hover:bg-muted/10 transition-colors">
                                    <td className="px-6 py-4 font-semibold">{c.name}</td>
                                    <td className="px-6 py-4">{c.users.length} Users</td>
                                    <td className="px-6 py-4">
                                        {lastReport
                                            ? new Date(lastReport.createdAt).toLocaleDateString()
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
        </div>
    )
}
