import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) return new NextResponse("Unauthorized", { status: 401 })

        if (!stripe) {
            return new NextResponse("Billing not configured", { status: 503 })
        }

        // Use findFirst for reliability if findUnique logic is tricky with relations, but here email is unique on User.
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { company: true }
        })

        if (!user || !user.company) {
            return new NextResponse("User must belong to a company", { status: 400 })
        }

        const { priceId } = await req.json()
        const company = user.company

        // Create Stripe Customer if not exists
        let customerId = company.stripeCustomerId

        if (!customerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                name: company.name,
                metadata: {
                    companyId: company.id
                }
            })
            customerId = customer.id

            await prisma.company.update({
                where: { id: company.id },
                data: { stripeCustomerId: customerId }
            })
        }

        // Create Checkout Session
        const sessionStripe = await stripe.checkout.sessions.create({
            customer: customerId,
            line_items: [{ price: priceId, quantity: 1 }],
            mode: "subscription",
            success_url: `${process.env.NEXTAUTH_URL}/billing?success=true`,
            cancel_url: `${process.env.NEXTAUTH_URL}/billing?canceled=true`,
            metadata: {
                companyId: company.id
            }
        })

        return NextResponse.json({ url: sessionStripe.url })

    } catch (error) {
        console.error("Stripe Error:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
