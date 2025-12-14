export interface SubscriptionPlan {
    id: string
    name: string
    description: string
    stripePriceId: string
    price: number
    features: string[]
    maxReportsPerMonth: number
}

export const PLANS: SubscriptionPlan[] = [
    {
        id: "free",
        name: "Free",
        description: "Essential analytics for small businesses.",
        stripePriceId: "",
        price: 0,
        features: ["1 Diagnostic Report/month", "Basic AI Insights", "Community Support"],
        maxReportsPerMonth: 1
    },
    {
        id: "pro",
        name: "Pro",
        description: "Advanced insights for growing companies.",
        stripePriceId: "price_1Q...", // Replace with real Stripe Price ID
        price: 49,
        features: ["Unlimited Reports", "Deep AI Recommendations", "Priority Support", "Trend Analysis"],
        maxReportsPerMonth: 999
    },
    {
        id: "enterprise",
        name: "Enterprise",
        description: "Custom solutions for large organizations.",
        stripePriceId: "price_1Q...", // Replace with real Stripe Price ID
        price: 199,
        features: ["Everything in Pro", "Dedicated Account Manager", "Custom Integrations", "SLA"],
        maxReportsPerMonth: 9999
    }
]
