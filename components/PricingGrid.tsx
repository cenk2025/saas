import { Check } from "lucide-react"
import { useTranslations } from "next-intl"
import { PLANS, SubscriptionPlan } from "@/config/subscriptions"

// Usable from both server and client components
export function PricingGrid({ currentId, renderAction }: {
    currentId?: string
    renderAction: (plan: SubscriptionPlan) => React.ReactNode
}) {
    const t = useTranslations("Plans")
    const tl = useTranslations("Landing")

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PLANS.map((plan) => {
                const highlighted = plan.id === "business"
                const current = plan.id === currentId
                return (
                    <div
                        key={plan.id}
                        className={`relative flex flex-col rounded-2xl border bg-card p-6 ${highlighted ? "border-primary/40 shadow-lg shadow-brand-pink/10" : "border-border"} ${current ? "ring-2 ring-primary" : ""}`}
                    >
                        {(highlighted || current) && (
                            <span className={`absolute -top-3 left-6 rounded-full px-2.5 py-0.5 text-xs font-semibold ${current ? "bg-ink text-white" : "bg-brand-gradient text-white"}`}>
                                {current ? t("current") : tl("popular")}
                            </span>
                        )}
                        <h3 className="text-lg font-bold">{t(`${plan.id}.name`)}</h3>
                        <p className="mt-1 min-h-10 text-sm text-muted-foreground">{t(`${plan.id}.description`)}</p>
                        <div className="my-5 flex items-baseline gap-1">
                            {plan.contactSales && <span className="text-sm text-muted-foreground">{tl("from")}</span>}
                            <span className="font-display text-4xl font-bold tracking-tight">{plan.price} €</span>
                            <span className="text-sm text-muted-foreground">{tl("perMonth")}</span>
                        </div>
                        <ul className="mb-6 flex-1 space-y-2.5">
                            {(t.raw(`${plan.id}.features`) as string[]).map((feature) => (
                                <li key={feature} className="flex items-start gap-2 text-sm">
                                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        {renderAction(plan)}
                    </div>
                )
            })}
        </div>
    )
}
