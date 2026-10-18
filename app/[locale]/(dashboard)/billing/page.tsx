import { getServerSession } from "next-auth"
import { getTranslations } from "next-intl/server"
import { PageHeader } from "@/components/app/PageHeader"
import { authOptions } from "@/lib/auth"
import { getUserSubscriptionPlan } from "@/lib/subscription"
import { BillingForm } from "./billing-form"

export default async function BillingPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return null

  const t = await getTranslations("Plans")
  const subscriptionPlan = await getUserSubscriptionPlan(session.user.id).catch(() => null)
  const planId = subscriptionPlan?.id ?? "free"

  return (
    <div>
      <PageHeader title={t("billingTitle")} subtitle={t("billingSubtitle", { plan: t(`${planId}.name`) })} />
      <BillingForm currentId={planId} />
    </div>
  )
}
