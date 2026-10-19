import { requirePlatformAdmin, loadCompanies } from "@/lib/admin"

const csvCell = (value: unknown) => {
    const text = value === null || value === undefined ? "" : String(value)
    // Quote everything and neutralise spreadsheet formulas
    const safe = /^[=+\-@]/.test(text) ? `'${text}` : text
    return `"${safe.replace(/"/g, '""')}"`
}

/** One row per user, with their company's details, as CSV for Excel. */
export async function GET() {
    if (!(await requirePlatformAdmin())) return new Response("Forbidden", { status: 403 })

    const companies = await loadCompanies()
    const header = ["Company", "Country", "Industry", "Size", "Location", "Website", "Company created", "Name", "Email", "Phone", "Role", "Last sign-in", "Health checks", "Latest score", "AI documents"]
    const rows = companies.flatMap((c) => {
        const base = [c.name, c.country, c.profile.industry, c.profile.size, c.profile.location, c.profile.website, c.createdAt.slice(0, 10)]
        const usage = [c.reports, c.latestScore, c.documents]
        return c.users.length > 0
            ? c.users.map((u) => [...base, u.name, u.email, u.phone, u.role, u.lastSignInAt?.slice(0, 10), ...usage])
            : [[...base, "", "", "", "", "", ...usage]]
    })

    // BOM so Excel opens UTF-8 (ä, ö, å) correctly; semicolon is Excel's default separator in Finland
    const csv = "﻿" + [header, ...rows].map((row) => row.map(csvCell).join(";")).join("\r\n")
    return new Response(csv, {
        headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": `attachment; filename="voon-business-companies-${new Date().toISOString().slice(0, 10)}.csv"`,
        },
    })
}
