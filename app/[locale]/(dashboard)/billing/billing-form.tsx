"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Loader2 } from "lucide-react"
import { PricingGrid } from "@/components/PricingGrid"
import { Link } from "@/src/i18n/navigation"

export function BillingForm({ currentId }: { currentId: string }) {
    const t = useTranslations("Plans")
    const [loading, setLoading] = useState<string | null>(null)
    const [error, setError] = useState("")

    const post = async (url: string, key: string, body?: object) => {
        setLoading(key)
        setError("")
        try {
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: body ? JSON.stringify(body) : undefined,
            })
            const data = await res.json()
            if (data.url) {
                window.location.href = data.url
                return
            }
            throw new Error()
        } catch {
            setError(t("checkoutError"))
            setLoading(null)
        }
    }

    return (
        <div className="space-y-6">
            {error && <p className="rounded-xl bg-destructive/10 p-3 text-sm font-medium text-destructive">{error}</p>}
            <PricingGrid
                currentId={currentId}
                renderAction={(plan) => {
                    if (plan.id === currentId) {
                        return plan.id === "free" ? (
                            <span className="btn-secondary w-full cursor-default opacity-70">{t("current")}</span>
                        ) : (
                            <button type="button" onClick={() => post("/api/billing/portal", "manage")} disabled={!!loading} className="btn-secondary w-full">
                                {loading === "manage" && <Loader2 className="h-4 w-4 animate-spin" />}
                                {t("manage")}
                            </button>
                        )
                    }
                    if (plan.contactSales) {
                        return <Link href="/#contact" className="btn-secondary w-full">{t("contactUs")}</Link>
                    }
                    if (plan.id === "free") {
                        return <span className="btn-secondary w-full cursor-default opacity-70">{t("downgrade")}</span>
                    }
                    return (
                        <button
                            type="button"
                            onClick={() => post("/api/billing/checkout", plan.id, { priceId: plan.stripePriceId })}
                            disabled={!!loading || !plan.stripePriceId}
                            className="btn-primary w-full"
                        >
                            {loading === plan.id && <Loader2 className="h-4 w-4 animate-spin" />}
                            {t("choose")}
                        </button>
                    )
                }}
            />
        </div>
    )
}
