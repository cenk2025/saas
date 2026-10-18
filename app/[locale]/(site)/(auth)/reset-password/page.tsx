"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { Loader2 } from "lucide-react"
import { AuthShell, FormMessage } from "@/components/AuthShell"
import { supabase } from "@/lib/supabase"
import { Link, useRouter } from "@/src/i18n/navigation"

// Landing page for the Supabase recovery link: the client picks up the
// recovery session from the URL fragment, then the user sets a new password.
export default function ResetPasswordPage() {
    const t = useTranslations("Auth")
    const router = useRouter()
    const [status, setStatus] = useState<"checking" | "ready" | "invalid">("checking")
    const [password, setPassword] = useState("")
    const [confirm, setConfirm] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        const { data } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) setStatus("ready")
        })
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) setStatus("ready")
        })
        const timeout = setTimeout(() => setStatus((s) => (s === "checking" ? "invalid" : s)), 3000)
        return () => {
            data.subscription.unsubscribe()
            clearTimeout(timeout)
        }
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        if (password.length < 8) return setError(t("passwordShort"))
        if (password !== confirm) return setError(t("passwordMismatch"))

        setLoading(true)
        const { error: updateError } = await supabase.auth.updateUser({ password })
        if (updateError) {
            setError(t("unexpected"))
            setLoading(false)
            return
        }
        await supabase.auth.signOut()
        router.push("/login?reset=1")
    }

    return (
        <AuthShell title={t("resetTitle")}>
            {status === "checking" && <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />}
            {status === "invalid" && (
                <div className="space-y-4 text-center">
                    <FormMessage tone="error">{t("resetInvalid")}</FormMessage>
                    <Link href="/forgot-password" className="btn-secondary">{t("sendLink")}</Link>
                </div>
            )}
            {status === "ready" && (
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="password" className="label">{t("newPassword")}</label>
                        <input id="password" type="password" required minLength={8} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" />
                    </div>
                    <div>
                        <label htmlFor="confirm" className="label">{t("confirmPassword")}</label>
                        <input id="confirm" type="password" required autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="input" />
                    </div>
                    {error && <FormMessage tone="error">{error}</FormMessage>}
                    <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                        {t("savePassword")}
                    </button>
                </form>
            )}
        </AuthShell>
    )
}
