"use client"

import { PLANS, SubscriptionPlan } from "@/config/subscriptions"
import { Check, Loader2 } from "lucide-react"
import { useState } from "react"

interface BillingFormProps {
    subscriptionPlan: SubscriptionPlan & {
        stripeCurrentPeriodEnd?: number
        isPro: boolean
    }
}

export function BillingForm({ subscriptionPlan }: BillingFormProps) {
    const [loading, setLoading] = useState<string | null>(null)

    const handleSubscribe = async (priceId: string) => {
        if (!priceId) return
        setLoading(priceId)

        try {
            const res = await fetch("/api/billing/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ priceId })
            })

            const data = await res.json()
            if (data.url) {
                window.location.href = data.url
            } else {
                alert("Failed to create checkout session")
            }
        } catch (error) {
            console.error(error)
            alert("Something went wrong")
        } finally {
            setLoading(null)
        }
    }

    const handleManage = async () => {
        setLoading("manage")
        try {
            const res = await fetch("/api/billing/portal", { method: "POST" })
            const data = await res.json()
            if (data.url) window.location.href = data.url
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(null)
        }
    }

    return (
        <div className="grid md:grid-cols-3 gap-8">
            {PLANS.map((plan) => (
                <div
                    key={plan.id}
                    className={`relative p-8 rounded-2xl border bg-card flex flex-col ${plan.id === subscriptionPlan?.id ? "border-emerald-500 ring-1 ring-emerald-500 shadow-md" :
                            plan.id === 'pro' ? 'border-primary shadow-lg ring-1 ring-primary' : 'shadow-sm'
                        }`}
                >
                    {plan.id === subscriptionPlan?.id && (
                        <div className="absolute -top-4 right-8 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            Current Plan
                        </div>
                    )}

                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <p className="text-muted-foreground text-sm mt-2 h-10">{plan.description}</p>

                    <div className="my-6">
                        <span className="text-4xl font-bold">${plan.price}</span>
                        {plan.price > 0 && <span className="text-muted-foreground">/month</span>}
                    </div>

                    <ul className="space-y-3 mb-8 flex-1">
                        {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm">
                                <Check className="h-4 w-4 text-primary shrink-0" />
                                {feature}
                            </li>
                        ))}
                    </ul>

                    {plan.id === subscriptionPlan?.id ? (
                        <button
                            onClick={handleManage}
                            disabled={!!loading}
                            className="w-full py-2.5 rounded-lg font-semibold bg-muted text-foreground hover:bg-muted/80 transition-all flex items-center justify-center border"
                        >
                            {loading === "manage" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Manage Subscription"}
                        </button>
                    ) : (
                        <button
                            onClick={() => handleSubscribe(plan.stripePriceId)}
                            disabled={!!loading || plan.id === 'free'}
                            className={`w-full py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center ${plan.id === 'free'
                                    ? 'bg-muted text-muted-foreground cursor-default'
                                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                                }`}
                        >
                            {loading === plan.stripePriceId ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                plan.id === 'free' ? 'Downgrade' : 'Upgrade'
                            )}
                        </button>
                    )}
                </div>
            ))}
        </div>
    )
}
