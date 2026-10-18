"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Loader2 } from "lucide-react"
import { AuthShell, FormMessage } from "@/components/AuthShell"
import { Link, useRouter } from "@/src/i18n/navigation"

const COUNTRIES = ["FI", "SE", "NO", "DK", "EE", "DE", "OTHER"] as const

export default function RegisterPage() {
    const t = useTranslations("Auth")
    const router = useRouter()
    const [formData, setFormData] = useState({
        companyName: "",
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        country: "FI",
        acceptTerms: false,
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (formData.password.length < 8) return setError(t("passwordShort"))
        if (formData.password !== formData.confirmPassword) return setError(t("passwordMismatch"))
        if (!formData.acceptTerms) return setError(t("termsRequired"))

        setLoading(true)
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })
            const data = await res.json()

            if (!res.ok) {
                setError(data.error || t("registerFailed"))
                setLoading(false)
                return
            }
            router.push("/login?registered=true")
        } catch {
            setError(t("unexpected"))
            setLoading(false)
        }
    }

    return (
        <AuthShell
            wide
            title={t("registerTitle")}
            subtitle={t("registerSubtitle")}
            footer={<>{t("haveAccount")} <Link href="/login" className="font-semibold text-primary hover:underline">{t("signIn")}</Link></>}
        >
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor="companyName" className="label">{t("companyName")}</label>
                        <input id="companyName" name="companyName" required autoComplete="organization" value={formData.companyName} onChange={handleChange} className="input" />
                    </div>
                    <div>
                        <label htmlFor="country" className="label">{t("country")}</label>
                        <select id="country" name="country" required value={formData.country} onChange={handleChange} className="input">
                            {COUNTRIES.map((code) => (
                                <option key={code} value={code}>{t(`countries.${code}`)}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="fullName" className="label">{t("fullName")}</label>
                        <input id="fullName" name="fullName" required autoComplete="name" value={formData.fullName} onChange={handleChange} className="input" />
                    </div>
                    <div>
                        <label htmlFor="phone" className="label">{t("phone")}</label>
                        <input id="phone" name="phone" type="tel" autoComplete="tel" value={formData.phone} onChange={handleChange} className="input" />
                    </div>
                </div>
                <div>
                    <label htmlFor="email" className="label">{t("email")}</label>
                    <input id="email" name="email" type="email" required autoComplete="email" value={formData.email} onChange={handleChange} className="input" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor="password" className="label">{t("password")}</label>
                        <input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" value={formData.password} onChange={handleChange} className="input" />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="label">{t("confirmPassword")}</label>
                        <input id="confirmPassword" name="confirmPassword" type="password" required autoComplete="new-password" value={formData.confirmPassword} onChange={handleChange} className="input" />
                    </div>
                </div>
                <label className="flex items-start gap-3 text-sm text-muted-foreground">
                    <input type="checkbox" name="acceptTerms" checked={formData.acceptTerms} onChange={handleChange} className="mt-0.5 h-4 w-4 accent-primary" />
                    {t("acceptTerms")}
                </label>
                {error && <FormMessage tone="error">{error}</FormMessage>}
                <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {t("createWorkspace")}
                </button>
            </form>
        </AuthShell>
    )
}
