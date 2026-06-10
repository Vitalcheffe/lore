import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthenticatedUserId } from '@/lib/auth-helpers'

// POST /api/stripe/portal — Create a Stripe Customer Portal session
export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(req)
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const user = await db.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY

    if (stripeSecretKey && user.stripeCustomerId) {
      // ── Real Stripe Customer Portal ──
      const Stripe = (await import('stripe')).default
      const stripe = new Stripe(stripeSecretKey, { apiVersion: '2024-12-18.acacia' })

      const session = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/app/settings`,
      })

      return NextResponse.json({ url: session.url })
    }

    // ── No Stripe customer or no keys: return settings page ──
    return NextResponse.json({
      url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/app/settings?billing=true`,
      demoMode: true,
    })
  } catch (error: any) {
    console.error('Stripe portal error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
