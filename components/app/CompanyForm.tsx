"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Check, Loader2 } from "lucide-react"
import { useRouter } from "@/src/i18n/navigation"

const SIZES = ["1", "2-9", "10-49", "50-249", "250+"]
const COUNTRIES = ["FI", "SE", "NO", "DK", "EE", "DE", "OTHER"]

type Profile = Record<"industry" | "size" | "location" | "website" | "description" | "customers" | "goals", string>
interface CompanyData {
    name: string
    country: string
    profile: Profile
}

export function CompanyForm({ initial, readOnly }: { initial: CompanyData; readOnly: boolean }) {
    const t = useTranslations("Company")
    const ta = useTranslations("Auth")
    const router = useRouter()
    const [data, setData] = useState(initial)
    const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")

    const setProfile = (key: keyof Profile, value: string) => {
        setData((d) => ({ ...d, profile: { ...d.profile, [key]: value } }))
        setStatus("idle")
    }

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus("saving")
        const res = await fetch("/api/company", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        }).catch(() => null)
        if (res?.ok) {
            setStatus("saved")
            router.refresh()
        } else {
            setStatus("error")
        }
    }

    const text = (key: keyof Profile, opts: { placeholder?: string; rows?: number } = {}) =>
        opts.rows ? (
            <textarea id={key} rows={opts.rows} disabled={readOnly} value={data.profile[key]} onChange={(e) => setProfile(key, e.target.value)} placeholder={opts.placeholder} className="input resize-y" />
        ) : (
            <input id={key} disabled={readOnly} value={data.profile[key]} onChange={(e) => setProfile(key, e.target.value)} placeholder={opts.placeholder} className="input" />
        )

    return (
        <form onSubmit={submit} className="card space-y-5 p-6 sm:p-8">
            {readOnly && <p className="rounded-xl bg-muted p-3 text-sm text-muted-foreground">{t("readOnly")}</p>}

            <div className="grid gap-5 sm:grid-cols-2">
                <div>
                    <label htmlFor="name" className="label">{t("name")}</label>
                    <input id="name" required disabled={readOnly} value={data.name} onChange={(e) => setData((d) => ({ ...d, name: e.target.value }))} className="input" />
                </div>
                <div>
                    <label htmlFor="country" className="label">{t("country")}</label>
                    <select id="country" disabled={readOnly} value={data.country} onChange={(e) => setData((d) => ({ ...d, country: e.target.value }))} className="input">
                        <option value="">–</option>
                        {COUNTRIES.map((code) => <option key={code} value={code}>{ta(`countries.${code}`)}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="industry" className="label">{t("industry")}</label>
                    {text("industry", { placeholder: t("industryPlaceholder") })}
                </div>
                <div>
                    <label htmlFor="size" className="label">{t("size")}</label>
                    <select id="size" disabled={readOnly} value={data.profile.size} onChange={(e) => setProfile("size", e.target.value)} className="input">
                        <option value="">–</option>
                        {SIZES.map((size) => <option key={size} value={size}>{t(`sizes.${size}`)}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="location" className="label">{t("location")}</label>
                    {text("location", { placeholder: t("locationPlaceholder") })}
                </div>
                <div>
                    <label htmlFor="website" className="label">{t("website")}</label>
                    {text("website", { placeholder: "https://" })}
                </div>
            </div>

            <div>
                <label htmlFor="description" className="label">{t("description")}</label>
                {text("description", { placeholder: t("descriptionPlaceholder"), rows: 4 })}
            </div>
            <div>
                <label htmlFor="customers" className="label">{t("customers")}</label>
                {text("customers", { placeholder: t("customersPlaceholder"), rows: 2 })}
            </div>
            <div>
                <label htmlFor="goals" className="label">{t("goals")}</label>
                {text("goals", { placeholder: t("goalsPlaceholder"), rows: 3 })}
            </div>

            {status === "error" && <p className="rounded-xl bg-destructive/10 p-3 text-sm font-medium text-destructive">{t("saveFailed")}</p>}

            {!readOnly && (
                <div className="flex items-center gap-3">
                    <button type="submit" disabled={status === "saving"} className="btn-primary">
                        {status === "saving" && <Loader2 className="h-4 w-4 animate-spin" />}
                        {t("save")}
                    </button>
                    {status === "saved" && (
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-success">
                            <Check className="h-4 w-4" /> {t("saved")}
                        </span>
                    )}
                </div>
            )}
        </form>
    )
}
