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
            stripeCurrentPeriodEnd: undefined,
            stripeCustomerId: undefined,
            stripeSubscriptionId: undefined,
        }
    }

    const isPro =
        user.company.stripePriceId &&
        user.company.stripeCurrentPeriodEnd?.getTime()! + 86_400_000 > Date.now()

    const plan = isPro
        ? PLANS.find((plan) => plan.stripePriceId === user.company!.stripePriceId)
        : PLANS[0] // Default to Free

    return {
        ...user.company,
        ...plan,
        stripeCustomerId: user.company.stripeCustomerId,
        stripeSubscriptionId: user.company.stripeSubscriptionId,
        stripeCurrentPeriodEnd: user.company.stripeCurrentPeriodEnd?.getTime(),
        isPro: !!isPro,
    }
}
