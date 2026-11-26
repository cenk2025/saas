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
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PLANS.map((plan) => {
                const highlighted = plan.id === "business"
                const current = plan.id === currentId
                return (
                    <div
                        key={plan.id}
                        className={`card relative flex flex-col p-7 ${highlighted ? "shadow-[0_24px_60px_-24px_rgba(253,53,93,0.45)]" : ""} ${current ? "ring-2 ring-primary" : ""}`}
                    >
                        {(highlighted || current) && (
                            <span className={`mb-3 self-start text-[15px] font-semibold ${current ? "text-foreground" : "text-primary"}`}>
                                {current ? t("current") : tl("popular")}
                            </span>
                        )}
                        <h3 className="text-[21px] font-semibold">{t(`${plan.id}.name`)}</h3>
                        <p className="mt-1 min-h-12 text-[15px] text-muted-foreground">{t(`${plan.id}.description`)}</p>
                        <div className="my-6 flex items-baseline gap-1">
                            {plan.contactSales && <span className="text-[15px] text-muted-foreground">{tl("from")}</span>}
                            <span className="text-[40px] font-semibold tracking-[-0.03em]">{plan.price} €</span>
                            <span className="text-[15px] text-muted-foreground">{tl("perMonth")}</span>
                        </div>
                        <ul className="mb-7 flex-1 space-y-3">
                            {(t.raw(`${plan.id}.features`) as string[]).map((feature) => (
                                <li key={feature} className="flex items-start gap-2.5 text-[15px]">
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
