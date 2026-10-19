import { getFormatter, getTranslations } from "next-intl/server"
import { ArrowLeft, Phone } from "lucide-react"
import { EmailButton } from "@/components/admin/EmailButton"
import { loadCompanies, requirePlatformAdmin } from "@/lib/admin"
import { Link } from "@/src/i18n/navigation"

const PROFILE_FIELDS = ["industry", "size", "location", "website", "description", "customers", "goals"] as const

export default async function AdminCompanyPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const t = await getTranslations("Admin")
    const tc = await getTranslations("Company")
    const ta = await getTranslations("App")
    const format = await getFormatter()

    if (!(await requirePlatformAdmin())) {
        return <div className="card mx-auto max-w-lg p-10 text-center text-muted-foreground">{t("forbidden")}</div>
    }

    const company = (await loadCompanies()).find((c) => c.id === id)
    if (!company) {
        return <div className="card mx-auto max-w-lg p-10 text-center text-muted-foreground">{t("noResults")}</div>
    }

    const date = (value: string | null) => (value ? format.dateTime(new Date(value), { dateStyle: "medium", timeStyle: "short" }) : t("never"))
    const recipients = company.users.map((u) => ({ email: u.email, name: u.name, company: company.name }))

    return (
        <div className="space-y-6">
            <Link href="/admin" className="btn-ghost -ml-3"><ArrowLeft className="h-4 w-4" /> {t("back")}</Link>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold sm:text-3xl">{company.name}</h1>
                    <p className="mt-1 text-muted-foreground">
                        {t("columns.created")}: {date(company.createdAt)} · {t("usage", { reports: company.reports, documents: company.documents })}
                        {company.latestScore !== null && ` · ${t("score")}: ${company.latestScore}`}
                    </p>
                </div>
                {recipients.length > 0 && <EmailButton recipients={recipients} label={t("emailCompany")} />}
            </div>

            <div className="grid gap-6 lg:grid-cols-5">
                <section className="card p-6 lg:col-span-3">
                    <h2 className="font-semibold">{t("people")}</h2>
                    {company.users.length === 0 ? (
                        <p className="mt-4 text-sm text-muted-foreground">{t("noUsers")}</p>
                    ) : (
                        <ul className="mt-4 divide-y divide-border">
                            {company.users.map((u) => (
                                <li key={u.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="min-w-0">
                                        <p className="font-medium">{u.name || u.email} <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{ta(`roles.${u.role}`)}</span></p>
                                        <a href={`mailto:${u.email}`} className="text-sm text-primary hover:underline">{u.email}</a>
                                        {u.phone && (
                                            <a href={`tel:${u.phone}`} className="ml-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                                                <Phone className="h-3.5 w-3.5" /> {u.phone}
                                            </a>
                                        )}
                                        <p className="text-xs text-muted-foreground">{t("lastSignIn")}: {date(u.lastSignInAt)}</p>
                                    </div>
                                    <EmailButton recipients={[{ email: u.email, name: u.name, company: company.name }]} label={t("emailPerson")} variant="secondary" />
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                <section className="card p-6 lg:col-span-2">
                    <h2 className="font-semibold">{t("profile")}</h2>
                    <dl className="mt-4 space-y-3 text-sm">
                        <div>
                            <dt className="text-xs font-medium text-muted-foreground">{tc("country")}</dt>
                            <dd>{company.country || t("notProvided")}</dd>
                        </div>
                        {PROFILE_FIELDS.map((field) => (
                            <div key={field}>
                                <dt className="text-xs font-medium text-muted-foreground">{tc(field)}</dt>
                                <dd className="whitespace-pre-line">
                                    {field === "website" && company.profile.website ? (
                                        <a href={company.profile.website.startsWith("http") ? company.profile.website : `https://${company.profile.website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{company.profile.website}</a>
                                    ) : field === "size" && company.profile.size ? (
                                        tc(`sizes.${company.profile.size}`)
                                    ) : (
                                        company.profile[field] || t("notProvided")
                                    )}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </section>
            </div>
        </div>
    )
}
