import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthenticatedUserId } from '@/lib/auth-helpers'

// POST /api/stripe/checkout — Create a Stripe Checkout session
export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(req)
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { priceId, plan } = await req.json()

    if (!priceId || !plan) {
      return NextResponse.json({ error: 'priceId and plan are required' }, { status: 400 })
    }

    const user = await db.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Try real Stripe integration
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY

    if (stripeSecretKey) {
      // ── Real Stripe API ──
      const Stripe = (await import('stripe')).default
      const stripe = new Stripe(stripeSecretKey, { apiVersion: '2024-12-18.acacia' })

      // Get or create Stripe customer
      let customerId = user.stripeCustomerId

      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.name || undefined,
          metadata: { userId: user.id },
        })
        customerId = customer.id

        await db.user.update({
          where: { id: userId },
          data: { stripeCustomerId: customerId },
        })
      }

      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/app?upgraded=true&plan=${plan}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pricing`,
        metadata: { plan, userId: user.id },
      })

      return NextResponse.json({
        url: session.url,
        sessionId: session.id,
      })
    }

    // ── No Stripe key: demo mode with real DB update ──
    // For demo/hackathon: upgrade the user's plan directly
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        plan,
        stripePriceId: priceId,
        stripeCurrentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
    })

    return NextResponse.json({
      url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/app?upgraded=true&plan=${plan}`,
      sessionId: `cs_demo_${Date.now()}`,
      demoMode: true,
      plan: updatedUser.plan,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    console.error('Stripe checkout error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
