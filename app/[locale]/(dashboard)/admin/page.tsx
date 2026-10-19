import { getTranslations } from "next-intl/server"
import { CompanyTable } from "@/components/admin/CompanyTable"
import { PageHeader } from "@/components/app/PageHeader"
import { loadCompanies, requirePlatformAdmin, summarizeCompanies } from "@/lib/admin"

export default async function AdminPage() {
    const t = await getTranslations("Admin")
    if (!(await requirePlatformAdmin())) {
        return <div className="card mx-auto max-w-lg p-10 text-center text-muted-foreground">{t("forbidden")}</div>
    }

    const companies = await loadCompanies()
    const summary = summarizeCompanies(companies)
    const stats = (Object.keys(summary) as (keyof typeof summary)[]).map((key) => ({ label: t(`stats.${key}`), value: summary[key] }))

    return (
        <div className="space-y-6">
            <PageHeader title={t("title")} subtitle={t("subtitle")} />
            <dl className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="card p-4">
                        <dt className="text-xs font-medium text-muted-foreground">{stat.label}</dt>
                        <dd className="mt-1 font-display text-2xl font-bold">{stat.value}</dd>
                    </div>
                ))}
            </dl>
            <CompanyTable companies={companies} />
        </div>
    )
}
