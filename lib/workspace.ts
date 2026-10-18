import { getServerSession } from "next-auth"
import { createClient, SupabaseClient } from "@supabase/supabase-js"
import { authOptions } from "@/lib/auth"

export interface CompanyProfile {
    industry?: string
    size?: string
    location?: string
    website?: string
    description?: string
    customers?: string
    goals?: string
}

export interface WorkspaceCompany {
    id: string
    name: string
    country?: string | null
    profile?: CompanyProfile | null
}

export interface WorkspaceUser {
    id: string
    email: string
    name: string | null
    role: string
    company_id: string | null
}

let adminClient: SupabaseClient | null = null

/** Server-side Supabase client with the service role key. Never import from client components. */
export function supabaseAdmin(): SupabaseClient {
    if (!adminClient) {
        adminClient = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            { auth: { persistSession: false, autoRefreshToken: false } }
        )
    }
    return adminClient
}

/** Resolves the signed-in user and their company, or null when not signed in. */
export async function getWorkspace(): Promise<{ user: WorkspaceUser; company: WorkspaceCompany | null } | null> {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return null

    const supabase = supabaseAdmin()
    const { data: user } = await supabase
        .from("users")
        .select("id, email, name, role, company_id")
        .eq("email", session.user.email)
        .single()

    if (!user) return null

    let company: WorkspaceCompany | null = null
    if (user.company_id) {
        const { data } = await supabase.from("companies").select("*").eq("id", user.company_id).single()
        company = data ?? null
    }

    return { user, company }
}

/** Plain-text company description that is prepended to every AI request. */
export function companyContext(company: WorkspaceCompany | null): string {
    if (!company) return "No company profile is available."

    const profile = company.profile ?? {}
    const lines = [
        `Company name: ${company.name}`,
        company.country && `Country: ${company.country}`,
        profile.industry && `Industry: ${profile.industry}`,
        profile.size && `Size: ${profile.size}`,
        profile.location && `Location: ${profile.location}`,
        profile.website && `Website: ${profile.website}`,
        profile.description && `What the company does: ${profile.description}`,
        profile.customers && `Customers: ${profile.customers}`,
        profile.goals && `Current goals: ${profile.goals}`,
    ].filter(Boolean)

    return lines.join("\n")
}
