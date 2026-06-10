'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  Check,
  ArrowRight,
  Zap,
  Crown,
  Building2,
  Sparkles,
  ChevronDown,
  Shield,
  Lock,
  Star,
  HelpCircle,
  Mail,
  Brain,
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

// ─── FADE-IN ANIMATION ────────────────────────────────────
function FadeIn({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── PRICING TIERS ────────────────────────────────────────
const tiers = [
  {
    name: 'Starter',
    monthlyPrice: 0,
    annualPrice: 0,
    period: '/month',
    description: 'For individuals getting started',
    badge: null,
    icon: Zap,
    featured: false,
    cta: 'Get Started Free',
    ctaHref: '/signup',
    features: [
      'Up to 50 knowledge nodes',
      '1 user',
      'Morning Digest (basic)',
      'AI Chat (10 queries/day)',
      'Community support',
    ],
  },
  {
    name: 'Pro',
    monthlyPrice: 29,
    annualPrice: 23,
    period: '/user/month',
    description: 'For growing teams',
    badge: 'Most Popular',
    icon: Crown,
    featured: true,
    cta: 'Start Free Trial',
    ctaHref: '#checkout',
    features: [
      'Unlimited knowledge nodes',
      'Up to 25 users',
      'Morning Digest (advanced)',
      'AI Chat (unlimited)',
      'Priority support',
      'Custom integrations',
      'Team analytics',
    ],
  },
  {
    name: 'Enterprise',
    monthlyPrice: null,
    annualPrice: null,
    period: '',
    description: 'For large organizations',
    badge: null,
    icon: Building2,
    featured: false,
    cta: 'Contact Sales',
    ctaHref: '/contact',
    features: [
      'Everything in Pro',
      'Unlimited users',
      'SSO / SAML',
      'Dedicated support',
      'Custom AI training',
      'SLA guarantee',
      'On-premise option',
    ],
  },
]

// ─── FAQ DATA ─────────────────────────────────────────────
const faqs = [
  {
    question: 'Is there a free trial for Pro?',
    answer:
      'Yes! Every Pro plan comes with a 14-day free trial. No credit card required to start. You get full access to all Pro features during the trial period, and you can downgrade to Starter anytime if it\'s not the right fit.',
  },
  {
    question: 'Can I switch plans anytime?',
    answer:
      'Absolutely. You can upgrade from Starter to Pro instantly, and the change takes effect immediately. When upgrading, you\'ll be charged a prorated amount for the remainder of your billing cycle. Downgrades take effect at the end of your current billing period. There are no cancellation fees.',
  },
  {
    question: 'How does the knowledge graph work?',
    answer:
      'LORE connects every piece of knowledge your team creates into a structured graph. Entities (people, projects, processes) are linked through typed relationships, making it easy to find not just the answer but the entire context around it. AI automatically classifies and links entries, so your graph grows organically as your team adds knowledge.',
  },
  {
    question: 'Is my data secure?',
    answer:
      'Security is foundational to LORE. All data is encrypted at rest and in transit using AES-256 and TLS 1.3. Enterprise customers get SSO/SAML integration, custom data residency options, audit logs, and the ability to deploy on-premise. We comply with SOC 2 Type II standards and undergo regular third-party security audits.',
  },
  {
    question: 'What happens when I hit node limits?',
    answer:
      'On the Starter plan, you\'ll receive a notification when you approach your 50-node limit. You can upgrade to Pro at any time to unlock unlimited nodes. We never delete your data — you\'ll simply be prompted to upgrade or manage your existing content. Existing nodes remain fully accessible.',
  },
  {
    question: 'Do you offer discounts for startups?',
    answer:
      'Yes! We offer a 50% discount on Pro plans for qualifying startups in their first year. We also offer special pricing for educational institutions and non-profits. Contact our sales team to learn more about eligibility and get set up.',
  },
]

// ─── FAQ ITEM COMPONENT ───────────────────────────────────
function FAQItem({
  question,
  answer,
  index,
}: {
  question: string
  answer: string
  index: number
}) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="glass-card overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-emerald-50/30 transition-colors"
        aria-expanded={open}
      >
        <span className="text-[15px] font-semibold text-gray-900 pr-4">{question}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="px-6 pb-6 pt-0">
              <div className="border-t border-gray-100/60 pt-4">
                <p className="text-[14px] text-gray-500 leading-relaxed">{answer}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── PRICING PAGE ─────────────────────────────────────────
export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)

  const handleCheckout = async (tier: string) => {
    if (tier === 'Pro') {
      setLoading(tier)
      try {
        const res = await fetch('/api/stripe/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            priceId: isAnnual ? 'price_pro_annual' : 'price_pro_monthly',
            plan: 'pro',
          }),
        })
        const data = await res.json()
        if (data.url) {
          window.location.assign(data.url)
        }
      } catch {
        setLoading(null)
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col mesh-gradient-bg">
      <Navbar />

      <main className="flex-1">
        {/* ═══════════ HERO ═══════════ */}
        <section className="pt-28 pb-8 md:pt-36 md:pb-12 relative overflow-hidden">
          {/* Decorative background orbs */}
          <div
            className="absolute top-20 -left-40 w-80 h-80 rounded-full opacity-[0.06] pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, rgba(5,150,105,0.5), transparent 60%)',
            }}
          />
          <div
            className="absolute bottom-0 -right-40 w-96 h-96 rounded-full opacity-[0.04] pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, rgba(16,185,129,0.4), transparent 60%)',
            }}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="section-label inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50/80 border border-emerald-100/60 backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5" />
                Pricing
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="section-title mt-6"
            >
              Simple,{' '}
              <span className="gradient-text">transparent</span>
              <br className="hidden sm:block" /> pricing
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="section-subtitle mt-6 max-w-2xl mx-auto"
            >
              Start free. Scale as your team grows. No hidden fees, no surprises.
            </motion.p>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="flex flex-wrap items-center justify-center gap-3 mt-8"
            >
              {[
                { icon: Shield, text: 'SOC 2 Type II', color: '#059669' },
                { icon: Lock, text: 'Encryption at rest', color: '#047857' },
                { icon: Star, text: 'No credit card required', color: '#10B981' },
                { icon: Brain, text: 'AI-powered', color: '#059669' },
              ].map((badge) => {
                const BIcon = badge.icon
                return (
                  <div
                    key={badge.text}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60 border border-gray-100/60 backdrop-blur-sm"
                  >
                    <BIcon className="w-3.5 h-3.5" style={{ color: badge.color }} />
                    <span className="text-[11px] font-semibold text-gray-600">
                      {badge.text}
                    </span>
                  </div>
                )
              })}
            </motion.div>
          </div>
        </section>

        {/* ═══════════ BILLING TOGGLE + PRICING CARDS ═══════════ */}
        <section className="py-8 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Billing Toggle */}
            <FadeIn className="flex items-center justify-center gap-4 mb-12">
              <span
                className={`text-[14px] font-semibold transition-colors duration-300 ${
                  !isAnnual ? 'text-gray-900' : 'text-gray-400'
                }`}
              >
                Monthly
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className="relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:ring-offset-2 focus:ring-offset-transparent"
                style={{
                  backgroundColor: isAnnual ? '#059669' : '#e5e7eb',
                }}
                aria-label={`Switch to ${isAnnual ? 'monthly' : 'annual'} billing`}
                role="switch"
                aria-checked={isAnnual}
              >
                <motion.div
                  className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md"
                  animate={{ x: isAnnual ? 28 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
              <span
                className={`text-[14px] font-semibold transition-colors duration-300 ${
                  isAnnual ? 'text-gray-900' : 'text-gray-400'
                }`}
              >
                Annual
              </span>
              <AnimatePresence>
                {isAnnual && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8, x: -8 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: -8 }}
                    transition={{ duration: 0.25 }}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                  >
                    <Sparkles className="w-3 h-3" />
                    Save 20%
                  </motion.span>
                )}
              </AnimatePresence>
            </FadeIn>

            {/* Pricing Cards */}
            <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 items-start max-w-6xl mx-auto">
              {tiers.map((tier, i) => {
                const Icon = tier.icon
                const displayPrice = tier.monthlyPrice === null
                  ? 'Custom'
                  : isAnnual
                    ? `$${tier.annualPrice}`
                    : `$${tier.monthlyPrice}`

                return (
                  <FadeIn key={tier.name} delay={i * 0.1}>
                    <div
                      className={`pricing-card relative flex flex-col h-full ${
                        tier.featured ? 'pricing-card-featured' : ''
                      }`}
                    >
                      {/* Badge */}
                      {tier.badge && (
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-bold bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20">
                            <Star className="w-3 h-3" />
                            {tier.badge}
                          </span>
                        </div>
                      )}

                      {/* Header */}
                      <div className="pt-2 pb-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              tier.featured
                                ? 'bg-emerald-50'
                                : 'bg-gray-50'
                            }`}
                          >
                            <Icon
                              className={`w-5 h-5 ${
                                tier.featured
                                  ? 'text-emerald-600'
                                  : 'text-gray-500'
                              }`}
                            />
                          </div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {tier.name}
                          </h3>
                        </div>

                        <div className="flex items-baseline gap-1 mb-2">
                          {displayPrice === 'Custom' ? (
                            <span className="text-4xl font-extrabold text-gray-900">
                              Contact us
                            </span>
                          ) : (
                            <>
                              <span className="text-4xl font-extrabold text-gray-900">
                                {displayPrice}
                              </span>
                              <span className="text-[15px] text-gray-500 font-medium">
                                {tier.monthlyPrice === 0 ? '/month' : tier.period}
                              </span>
                            </>
                          )}
                        </div>

                        <p className="text-[14px] text-gray-500 leading-relaxed">
                          {tier.description}
                        </p>
                      </div>

                      {/* Divider */}
                      <div className="divider mb-6" />

                      {/* Features */}
                      <ul className="space-y-3 flex-1 mb-8">
                        {tier.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-center gap-3"
                          >
                            <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3 text-emerald-600" />
                            </div>
                            <span className="text-[14px] text-gray-700">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* CTA */}
                      {tier.name === 'Pro' ? (
                        <button
                          onClick={() => handleCheckout(tier.name)}
                          disabled={loading === tier.name}
                          className="btn-teal w-full justify-center text-center h-12 disabled:opacity-60"
                        >
                          {loading === tier.name ? (
                            <span className="inline-flex items-center gap-2">
                              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              Processing...
                            </span>
                          ) : (
                            <>
                              {tier.cta}
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      ) : (
                        <Link
                          href={tier.ctaHref}
                          className={`${tier.featured ? 'btn-teal' : 'btn-secondary'} w-full justify-center text-center h-12`}
                        >
                          {tier.cta}
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </FadeIn>
                )
              })}
            </div>

            {/* Subtext under cards */}
            <FadeIn className="text-center mt-8">
              <p className="text-[13px] text-gray-400">
                All plans include a 14-day free trial. No credit card required to start.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* ═══════════ FAQ SECTION ═══════════ */}
        <section className="py-16 md:py-24 bg-white/50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-12">
              <span className="section-label">FAQ</span>
              <h2 className="section-title mt-4">
                Questions? <span className="gradient-text">Answers.</span>
              </h2>
              <p className="section-subtitle mt-4">
                Everything you need to know about LORE pricing and plans.
              </p>
            </FadeIn>

            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <FAQItem
                  key={faq.question}
                  question={faq.question}
                  answer={faq.answer}
                  index={i}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ BOTTOM CTA SECTION ═══════════ */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="emerald-section rounded-3xl overflow-hidden relative">
                {/* Decorative elements */}
                <div
                  className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(255,255,255,0.3), transparent 60%)',
                  }}
                />
                <div
                  className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10 pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(16,185,129,0.4), transparent 60%)',
                  }}
                />

                <div className="relative z-10 px-8 py-16 md:px-16 md:py-20 text-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-6">
                      <Brain className="w-4 h-4 text-white/80" />
                      <span className="text-[12px] font-bold text-white/80 uppercase tracking-wider">
                        Get Started Today
                      </span>
                    </div>
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.1]"
                  >
                    Start building your team&apos;s
                    <br />
                    memory today
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-lg text-white/80 mt-6 max-w-xl mx-auto leading-relaxed"
                  >
                    Join thousands of teams already using LORE to turn scattered
                    information into structured, actionable knowledge.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
                  >
                    <Link
                      href="/signup"
                      className="inline-flex items-center gap-2 h-12 px-8 rounded-xl text-[15px] font-semibold bg-white text-emerald-700 border border-white/20 hover:bg-white/90 transition-all shadow-lg"
                    >
                      Start Free Trial
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 h-12 px-8 rounded-xl text-[15px] font-semibold bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all"
                    >
                      <Mail className="w-4 h-4" />
                      Talk to Sales
                    </Link>
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-[13px] text-white/50 mt-6"
                  >
                    Free 14-day trial · No credit card required · Cancel anytime
                  </motion.p>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
