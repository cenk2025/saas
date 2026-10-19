"use client"

import { useMemo, useState } from "react"
import { useFormatter, useTranslations } from "next-intl"
import { Download, Mail, Search } from "lucide-react"
import type { AdminCompany } from "@/lib/admin"
import { Link } from "@/src/i18n/navigation"
import { EmailComposer, Recipient } from "./EmailComposer"

export function CompanyTable({ companies }: { companies: AdminCompany[] }) {
    const t = useTranslations("Admin")
    const format = useFormatter()
    const [query, setQuery] = useState("")
    const [selected, setSelected] = useState<Set<string>>(new Set())
    const [composing, setComposing] = useState(false)

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()
        if (!q) return companies
        return companies.filter((c) =>
            [c.name, c.profile.industry, c.profile.location, ...c.users.flatMap((u) => [u.name, u.email])]
                .some((value) => value?.toLowerCase().includes(q))
        )
    }, [companies, query])

    const allSelected = filtered.length > 0 && filtered.every((c) => selected.has(c.id))
    const toggle = (id: string) =>
        setSelected((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    const toggleAll = () => setSelected(allSelected ? new Set() : new Set(filtered.map((c) => c.id)))

    const recipients: Recipient[] = companies
        .filter((c) => selected.has(c.id))
        .flatMap((c) => c.users.map((u) => ({ email: u.email, name: u.name, company: c.name })))

    const date = (value: string | null) => (value ? format.dateTime(new Date(value), { dateStyle: "medium" }) : t("never"))

    return (
        <div className="card overflow-hidden">
            <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative sm:w-80">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("search")} aria-label={t("search")} className="input pl-9" />
                </div>
                <div className="flex flex-wrap gap-2">
                    <a href="/api/admin/export" download className="btn-secondary"><Download className="h-4 w-4" /> {t("exportCsv")}</a>
                    <button type="button" disabled={recipients.length === 0} onClick={() => setComposing(true)} className="btn-primary">
                        <Mail className="h-4 w-4" /> {t("emailSelected", { count: recipients.length })}
                    </button>
                </div>
            </div>

            {companies.length === 0 ? (
                <p className="p-10 text-center text-muted-foreground">{t("noCompanies")}</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/60 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            <tr>
                                <th className="w-10 px-4 py-3">
                                    <input type="checkbox" checked={allSelected} onChange={toggleAll} aria-label={t("selectAll")} className="h-4 w-4 accent-primary" />
                                </th>
                                <th className="px-4 py-3">{t("columns.company")}</th>
                                <th className="px-4 py-3">{t("columns.contact")}</th>
                                <th className="px-4 py-3">{t("columns.usage")}</th>
                                <th className="px-4 py-3">{t("columns.lastActive")}</th>
                                <th className="px-4 py-3">{t("columns.created")}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filtered.map((c) => {
                                const contact = c.users.find((u) => u.role === "ADMIN") ?? c.users[0]
                                return (
                                    <tr key={c.id} className={selected.has(c.id) ? "bg-accent/50" : "hover:bg-muted/40"}>
                                        <td className="px-4 py-3">
                                            <input type="checkbox" checked={selected.has(c.id)} onChange={() => toggle(c.id)} aria-label={c.name} className="h-4 w-4 accent-primary" />
                                        </td>
                                        <td className="px-4 py-3">
                                            <Link href={`/admin/companies/${c.id}`} className="font-semibold hover:text-primary">{c.name}</Link>
                                            <p className="text-xs text-muted-foreground">
                                                {[c.profile.industry, c.profile.location || c.country].filter(Boolean).join(" · ") || "–"}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3">
                                            {contact ? (
                                                <>
                                                    <p>{contact.name || "–"}</p>
                                                    <a href={`mailto:${contact.email}`} className="text-xs text-primary hover:underline">{contact.email}</a>
                                                    {contact.phone && <p className="text-xs text-muted-foreground">{contact.phone}</p>}
                                                </>
                                            ) : "–"}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                                            {t("usage", { reports: c.reports, documents: c.documents })}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{date(c.lastActivity)}</td>
                                        <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{date(c.createdAt)}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    {filtered.length === 0 && <p className="p-10 text-center text-muted-foreground">{t("noResults")}</p>}
                </div>
            )}

            {composing && <EmailComposer recipients={recipients} onClose={() => setComposing(false)} />}
        </div>
    )
}
