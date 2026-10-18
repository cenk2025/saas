"use client"

import { useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { ArrowLeft, Loader2, MailCheck } from "lucide-react"
import { AuthShell, FormMessage } from "@/components/AuthShell"
import { Link } from "@/src/i18n/navigation"

export default function ForgotPasswordPage() {
    const t = useTranslations("Auth")
    const locale = useLocale()
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)
        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, locale }),
            })
            if (!res.ok) throw new Error()
            setSent(true)
        } catch {
            setError(t("unexpected"))
        } finally {
            setLoading(false)
        }
    }

    const back = (
        <Link href="/login" className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" /> {t("backToLogin")}
        </Link>
    )

    if (sent) {
        return (
            <AuthShell title={t("checkEmail")} footer={back}>
                <div className="flex flex-col items-center gap-4 text-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
                        <MailCheck className="h-7 w-7 text-success" />
                    </span>
                    <p className="text-muted-foreground">{t("checkEmailText", { email })}</p>
                </div>
            </AuthShell>
        )
    }

    return (
        <AuthShell title={t("forgotTitle")} subtitle={t("forgotSubtitle")} footer={back}>
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email" className="label">{t("email")}</label>
                    <input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
                </div>
                {error && <FormMessage tone="error">{error}</FormMessage>}
                <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {t("sendLink")}
                </button>
            </form>
        </AuthShell>
    )
}
