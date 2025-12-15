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

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { company: true }
        })

        if (!user || !user.company?.stripeCustomerId) {
            return new NextResponse("No billing account found", { status: 400 })
        }

        const sessionStripe = await stripe.billingPortal.sessions.create({
            customer: user.company.stripeCustomerId,
            return_url: `${process.env.NEXTAUTH_URL}/billing`,
        })

        return NextResponse.json({ url: sessionStripe.url })

    } catch (error) {
        console.error("Stripe Portal Error:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
