import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST /api/stripe/webhook — Handle Stripe webhook events
export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (stripeSecretKey && webhookSecret) {
      // ── Real Stripe webhook verification ──
      const Stripe = (await import('stripe')).default
      const stripe = new Stripe(stripeSecretKey, { apiVersion: '2024-12-18.acacia' })

      const signature = req.headers.get('stripe-signature')
      if (!signature) {
        return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
      }

      let event: any
      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
      } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message)
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
      }

      // Handle event types
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object
          const userId = session.metadata?.userId
          const plan = session.metadata?.plan

          if (userId && plan) {
            // Retrieve the subscription to get correct period end and price info
            let stripePriceId = session.line_items?.data?.[0]?.price?.id || null
            let periodEnd = session.expires_at ? new Date(session.expires_at * 1000) : null

            if (session.subscription) {
              try {
                const subscription = await stripe.subscriptions.retrieve(session.subscription)
                periodEnd = new Date(subscription.current_period_end * 1000)
                stripePriceId = subscription.items?.data?.[0]?.price?.id || stripePriceId
              } catch (err: any) {
                console.error('Failed to retrieve subscription:', err.message)
              }
            }

            await db.user.update({
              where: { id: userId },
              data: {
                plan,
                stripeSubscriptionId: session.subscription,
                stripePriceId,
                stripeCurrentPeriodEnd: periodEnd,
              },
            })
          }
          break
        }

        case 'customer.subscription.deleted': {
          const subscription = event.data.object
          const customerId = subscription.customer

          const user = await db.user.findFirst({
            where: { stripeCustomerId: customerId },
          })

          if (user) {
            await db.user.update({
              where: { id: user.id },
              data: {
                plan: 'free',
                stripeSubscriptionId: null,
                stripePriceId: null,
                stripeCurrentPeriodEnd: null,
              },
            })
          }
          break
        }

        case 'invoice.payment_succeeded': {
          const invoice = event.data.object
          const customerId = invoice.customer

          const user = await db.user.findFirst({
            where: { stripeCustomerId: customerId },
          })

          if (user && invoice.lines?.data?.[0]?.period?.end) {
            await db.user.update({
              where: { id: user.id },
              data: {
                stripeCurrentPeriodEnd: new Date(invoice.lines.data[0].period.end * 1000),
              },
            })
          }
          break
        }

        default:
          console.log(`Unhandled Stripe event type: ${event.type}`)
      }
    } else {
      // No Stripe keys configured — log for development
      console.log('Stripe webhook received but no keys configured. Skipping verification.')
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Stripe webhook error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
