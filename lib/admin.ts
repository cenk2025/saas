import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/workspace"

// Platform admins see every company. This is separate from the per-company ADMIN
// role that every new sign-up gets. Override with PLATFORM_ADMIN_EMAILS (comma separated).
const DEFAULT_PLATFORM_ADMINS = ["cenk.yakinlar@hotmail.com", "info@voon.fi"]

export function isPlatformAdmin(email: string | null | undefined): boolean {
    if (!email) return false
    const admins = (process.env.PLATFORM_ADMIN_EMAILS?.split(",") ?? DEFAULT_PLATFORM_ADMINS)
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean)
    return admins.includes(email.trim().toLowerCase())
}

/** The signed-in platform admin's email, or null. Use as the guard in admin pages and routes. */
export async function requirePlatformAdmin(): Promise<string | null> {
    const session = await getServerSession(authOptions)
    const email = session?.user?.email
    return isPlatformAdmin(email) ? email! : null
}

export interface AdminUser {
    id: string
    email: string
    name: string | null
    role: string
    phone: string | null
    createdAt: string
    lastSignInAt: string | null
}

export interface AdminCompany {
    id: string
    name: string
    country: string | null
    profile: Record<string, string>
    createdAt: string
    users: AdminUser[]
    reports: number
    latestScore: number | null
    documents: number
    lastActivity: string | null
}

const latest = (...dates: (string | null | undefined)[]) =>
    dates.filter((d): d is string => Boolean(d)).sort().at(-1) ?? null

/** Every company with its users, usage counts and last activity, newest companies first. */
export async function loadCompanies(): Promise<AdminCompany[]> {
    const supabase = supabaseAdmin()
    const [companies, users, reports, documents, authUsers] = await Promise.all([
        supabase.from("companies").select("id, name, country, profile, created_at").order("created_at", { ascending: false }),
        supabase.from("users").select("id, email, name, role, company_id, created_at"),
        supabase.from("diagnostic_reports").select("company_id, score, created_at").order("created_at", { ascending: true }),
        supabase.from("ai_documents").select("company_id, created_at"),
        supabase.auth.admin.listUsers({ perPage: 1000 }),
    ])

    // Phone and last sign-in live on the Supabase Auth user
    const authById = new Map((authUsers.data?.users ?? []).map((u) => [u.id, u]))

    return (companies.data ?? []).map((company) => {
        const companyReports = (reports.data ?? []).filter((r) => r.company_id === company.id)
        const companyDocs = (documents.data ?? []).filter((d) => d.company_id === company.id)
        const companyUsers: AdminUser[] = (users.data ?? [])
            .filter((u) => u.company_id === company.id)
            .map((u) => {
                const auth = authById.get(u.id)
                return {
                    id: u.id,
                    email: u.email,
                    name: u.name,
                    role: u.role,
                    phone: (auth?.user_metadata?.phone as string | undefined) || auth?.phone || null,
                    createdAt: u.created_at,
                    lastSignInAt: auth?.last_sign_in_at ?? null,
                }
            })

        return {
            id: company.id,
            name: company.name,
            country: company.country,
            profile: company.profile ?? {},
            createdAt: company.created_at,
            users: companyUsers,
            reports: companyReports.length,
            latestScore: companyReports.at(-1)?.score ?? null,
            documents: companyDocs.length,
            lastActivity: latest(
                ...companyUsers.map((u) => u.lastSignInAt),
                companyReports.at(-1)?.created_at,
                ...companyDocs.map((d) => d.created_at)
            ),
        }
    })
}

const DAY = 24 * 60 * 60 * 1000

/** Headline numbers for the admin overview. */
export function summarizeCompanies(companies: AdminCompany[]) {
    const now = Date.now()
    return {
        companies: companies.length,
        users: companies.reduce((sum, c) => sum + c.users.length, 0),
        newThisMonth: companies.filter((c) => now - Date.parse(c.createdAt) < 30 * DAY).length,
        activeThisWeek: companies.filter((c) => c.lastActivity && now - Date.parse(c.lastActivity) < 7 * DAY).length,
        reports: companies.reduce((sum, c) => sum + c.reports, 0),
        documents: companies.reduce((sum, c) => sum + c.documents, 0),
    }
}
