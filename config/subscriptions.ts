// Plan names, descriptions and features are translated in messages/*.json under "Plans.<id>".
export interface SubscriptionPlan {
    id: "free" | "pro" | "business" | "enterprise"
    stripePriceId: string
    price: number
    /** Shown as "from X €" and handled through sales instead of Stripe checkout */
    contactSales?: boolean
    maxReportsPerMonth: number
}

export const PLANS: SubscriptionPlan[] = [
    { id: "free", stripePriceId: "", price: 0, maxReportsPerMonth: 1 },
    { id: "pro", stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO ?? "", price: 39, maxReportsPerMonth: 999 },
    { id: "business", stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_BUSINESS ?? "", price: 99, maxReportsPerMonth: 9999 },
    { id: "enterprise", stripePriceId: "", price: 900, contactSales: true, maxReportsPerMonth: 9999 },
]
