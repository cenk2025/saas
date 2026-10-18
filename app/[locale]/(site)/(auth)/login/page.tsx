"use client"

import { Suspense, useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter as useNextRouter, useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { Loader2 } from "lucide-react"
import { AuthShell, FormMessage } from "@/components/AuthShell"
import { Link, useRouter } from "@/src/i18n/navigation"

export default function LoginPage() {
    return (
        <Suspense>
            <LoginForm />
        </Suspense>
    )
}

function LoginForm() {
    const t = useTranslations("Auth")
    const router = useRouter()
    const nextRouter = useNextRouter()
    const searchParams = useSearchParams()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const notice = searchParams.get("registered") ? t("registered") : searchParams.get("reset") ? t("passwordUpdated") : ""

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const res = await signIn("credentials", { email, password, redirect: false })
            if (res?.error) {
                setError(t("invalid"))
                setLoading(false)
                return
            }
            const callbackUrl = searchParams.get("callbackUrl")
            // Only follow same-site callback paths
            if (callbackUrl?.startsWith("/") && !callbackUrl.startsWith("//")) nextRouter.push(callbackUrl)
            else router.push("/dashboard")
            router.refresh()
        } catch {
            setError(t("unexpected"))
            setLoading(false)
        }
    }

    return (
        <AuthShell
            title={t("loginTitle")}
            subtitle={t("loginSubtitle")}
            footer={<>{t("noAccount")} <Link href="/register" className="font-semibold text-primary hover:underline">{t("createAccount")}</Link></>}
        >
            <form className="space-y-4" onSubmit={handleSubmit}>
                {notice && <FormMessage tone="success">{notice}</FormMessage>}
                <div>
                    <label htmlFor="email" className="label">{t("email")}</label>
                    <input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input" placeholder="nimi@yritys.fi" />
                </div>
                <div>
                    <div className="flex items-center justify-between">
                        <label htmlFor="password" className="label">{t("password")}</label>
                        <Link href="/forgot-password" className="mb-1.5 text-sm font-medium text-primary hover:underline">{t("forgot")}</Link>
                    </div>
                    <input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input" />
                </div>
                {error && <FormMessage tone="error">{error}</FormMessage>}
                <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {t("signIn")}
                </button>
            </form>
        </AuthShell>
    )
}
