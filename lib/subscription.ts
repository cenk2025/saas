import { prisma } from "@/lib/prisma"
import { PLANS } from "@/config/subscriptions"

export async function getUserSubscriptionPlan(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { company: true },
    })

    if (!user || !user.company) {
        return {
            ...PLANS[0],
            isPro: false,
            stripeCurrentPeriodEnd: null,
            stripeCustomerId: null,
            stripePriceId: null,
            stripeSubscriptionId: null,
        }
    }

    const isPro =
        user.company.stripePriceId &&
        user.company.stripeCurrentPeriodEnd?.getTime()! + 86_400_000 > Date.now()

    const plan = isPro
        ? PLANS.find((plan) => plan.stripePriceId === user.company!.stripePriceId)
        : PLANS[0] // Default to Free

    return {
        ...plan,
        ...user.company,
        stripeCurrentPeriodEnd: user.company.stripeCurrentPeriodEnd?.getTime(),
        isPro: !!isPro,
    }
}
