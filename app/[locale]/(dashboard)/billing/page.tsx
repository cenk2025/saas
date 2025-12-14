import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getUserSubscriptionPlan } from "@/lib/subscription"
import { BillingForm } from "./billing-form"

export default async function BillingPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect("/login")

  const subscriptionPlan = await getUserSubscriptionPlan(session.user.id)

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Subscription Plans</h1>
        <p className="text-muted-foreground mt-2">
          You are currently on the <strong>{subscriptionPlan?.name || "Free"}</strong> plan.
        </p>
      </div>

      <BillingForm subscriptionPlan={subscriptionPlan} />
    </div>
  )
}
