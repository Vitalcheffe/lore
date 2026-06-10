'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import {
  FileText,
  UserCheck,
  Shield,
  BookOpen,
  CreditCard,
  Scale,
  RefreshCw,
  Mail,
  ArrowRight,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Ban,
  Globe,
  Lock,
  Server,
  Users,
  KeyRound,
  Activity,
  Database,
  Zap,
  Clock,
  Baby,
  PenLine,
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

function FadeIn({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
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

const tocSections = [
  { id: 'acceptance', number: 1, title: 'Acceptance of Terms', icon: FileText },
  { id: 'description', number: 2, title: 'Description of Service', icon: Zap },
  { id: 'account', number: 3, title: 'Account Registration', icon: UserCheck },
  { id: 'acceptable-use', number: 4, title: 'Acceptable Use', icon: Shield },
  { id: 'user-content', number: 5, title: 'User Content', icon: BookOpen },
  { id: 'intellectual-property', number: 6, title: 'Intellectual Property', icon: BookOpen },
  { id: 'payment', number: 7, title: 'Payment Terms', icon: CreditCard },
  { id: 'termination', number: 8, title: 'Termination', icon: Ban },
  { id: 'disclaimer', number: 9, title: 'Disclaimer of Warranties', icon: AlertTriangle },
  { id: 'limitation', number: 10, title: 'Limitation of Liability', icon: Scale },
  { id: 'indemnification', number: 11, title: 'Indemnification', icon: Shield },
  { id: 'governing-law', number: 12, title: 'Governing Law', icon: Globe },
  { id: 'changes', number: 13, title: 'Changes to Terms', icon: RefreshCw },
  { id: 'contact', number: 14, title: 'Contact Information', icon: Mail },
]

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col mesh-gradient-bg">
      <Navbar />
      <main className="flex-1 pt-16">
        {/* ═══ Hero Section ═══ */}
        <section className="relative py-20 md:py-28 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-emerald-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-emerald-50/80 text-emerald-700 border border-emerald-100/60 mb-6">
                <FileText className="w-3.5 h-3.5" />
                Legal Agreement
              </div>
            </FadeIn>
            <FadeIn delay={0.05}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.1]">
                Terms of{' '}
                <span className="gradient-text">Service</span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="section-subtitle mt-5 max-w-2xl mx-auto">
                By using LORE, you agree to these terms. We&apos;ve written them in clear language
                because you should understand what you&apos;re agreeing to — not just click &ldquo;I agree.&rdquo;
              </p>
            </FadeIn>
            <FadeIn delay={0.15}>
              <p className="text-sm text-gray-400 mt-3">
                Last updated: June 10, 2026 &middot; Effective for all LORE users
              </p>
            </FadeIn>
          </div>
        </section>

        {/* ═══ Content with Sticky Sidebar ═══ */}
        <section className="pb-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* ──── Sticky Table of Contents ──── */}
              <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:w-[240px] shrink-0"
              >
                <div className="lg:sticky lg:top-24">
                  <TermsCard>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Layers className="w-4 h-4 text-emerald-600" />
                        <h2 className="text-sm font-bold text-gray-900">Contents</h2>
                      </div>
                      <nav className="space-y-0.5">
                        {tocSections.map((section) => {
                          const Icon = section.icon
                          return (
                            <a
                              key={section.id}
                              href={`#${section.id}`}
                              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-gray-500 hover:text-emerald-700 hover:bg-emerald-50/50 transition-all group"
                            >
                              <span className="w-5 h-5 rounded-md bg-gray-100 group-hover:bg-emerald-100 flex items-center justify-center text-[10px] font-bold text-gray-400 group-hover:text-emerald-600 transition-colors shrink-0">
                                {section.number}
                              </span>
                              <span className="truncate">{section.title}</span>
                            </a>
                          )
                        })}
                      </nav>
                    </div>
                  </TermsCard>
                </div>
              </motion.aside>

              {/* ──── Main Content ──── */}
              <div className="flex-1 min-w-0 max-w-3xl space-y-8">
                {/* Section 1: Acceptance of Terms */}
                <section id="acceptance">
                  <FadeIn>
                    <div className="glass-card rounded-2xl p-6 md:p-8">
                      <div className="flex items-start gap-4 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <span className="section-label">Section 1</span>
                          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight mt-0.5">Acceptance of Terms</h2>
                        </div>
                      </div>
                      <div className="space-y-4 text-[15px] text-gray-500 leading-relaxed pl-0 md:pl-14">
                        <p>
                          By accessing or using LORE (&ldquo;the Service&rdquo;), you agree to be bound by these Terms of Service
                          (&ldquo;Terms&rdquo;). If you do not agree with any part of these Terms, you must discontinue use of
                          the Service immediately. These Terms constitute a legally binding agreement between you and Lore
                          Technologies, Inc. (&ldquo;LORE&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;).
                          They apply to all users of the Service, including team administrators, team members, and individuals
                          accessing the Service through any means — whether through our web application, API, or any other interface.
                        </p>
                        <p>
                          By using the Service, you represent that you are at least 18 years of age, or if you are under 18, that
                          you have obtained parental or guardian consent to use the Service and agree to be bound by these Terms on
                          their behalf. You also represent that you have the authority to enter into these Terms on behalf of any
                          organization for which you create a team account. Your use of LORE is also governed by our{' '}
                          <Link href="/privacy" className="font-semibold text-emerald-600 hover:text-emerald-500 transition-colors">
                            Privacy Policy
                          </Link>, which explains how we collect, use, and protect your data.
                        </p>
                        <div className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-100/60">
                          <div className="flex items-start gap-2">
                            <FileText className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                            <p className="text-[13px] text-emerald-700">
                              <span className="font-semibold">Related agreements:</span> Your use of LORE is also
                              governed by our{' '}
                              <Link href="/privacy" className="font-semibold text-emerald-600 hover:text-emerald-500 transition-colors">
                                Privacy Policy
                              </Link>.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </FadeIn>
                </section>

                {/* Section 2: Description of Service */}
                <section id="description">
                  <FadeIn>
                    <div className="glass-card rounded-2xl p-6 md:p-8">
                      <div className="flex items-start gap-4 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                          <Zap className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <span className="section-label">Section 2</span>
                          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight mt-0.5">Description of Service</h2>
                        </div>
                      </div>
                      <div className="space-y-4 text-[15px] text-gray-500 leading-relaxed pl-0 md:pl-14">
                        <p>
                          LORE is a team knowledge management platform that transforms how organizations capture, structure, and
                          access their collective knowledge. At its core, LORE provides an intelligent knowledge graph that
                          automatically maps relationships between facts, entities, and episodes — turning scattered information
                          into an interconnected, searchable memory that every team member can rely on.
                        </p>
                        <p>
                          The Service includes several key features: a visual knowledge graph with force-directed, radial, and
                          hierarchical layout options that reveals hidden connections in your team&apos;s data; an AI-powered chat
                          interface that answers questions grounded in your team&apos;s actual knowledge rather than generic training
                          data; a morning digest that delivers personalized daily summaries of knowledge updates and insights
                          relevant to your focus areas; and collaborative tools that enable teams to capture, verify, and evolve
                          their knowledge together in real time. LORE is built on Amazon Aurora DSQL for reliable, encrypted,
                          multi-region data storage.
                        </p>
                        <p>
                          We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time, including
                          the availability of any feature, database, or content, with reasonable notice to users when practicable.
                          We will make reasonable efforts to notify you of material changes to the Service that may affect your use.
                        </p>
                      </div>
                    </div>
                  </FadeIn>
                </section>

                {/* Section 3: Account Registration */}
                <section id="account">
                  <FadeIn>
                    <div className="glass-card rounded-2xl p-6 md:p-8">
                      <div className="flex items-start gap-4 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                          <UserCheck className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <span className="section-label">Section 3</span>
                          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight mt-0.5">Account Registration</h2>
                        </div>
                      </div>
                      <div className="space-y-4 text-[15px] text-gray-500 leading-relaxed pl-0 md:pl-14">
                        <p>
                          To use LORE, you must register for an account by providing your full name, email address, and
                          organization details. You are responsible for maintaining the confidentiality of your account
                          credentials and for all activities that occur under your account. If you suspect unauthorized access,
                          you must notify us immediately at{' '}
                          <a href="mailto:legal@lore.dev" className="text-emerald-600 hover:text-emerald-500 font-medium">
                            legal@lore.dev
                          </a>.
                        </p>
                        <p>
                          Team administrators are responsible for managing team membership, access permissions, and ensuring
                          that invited members are authorized to access the team&apos;s knowledge base. You must provide accurate
                          and complete registration information and keep it updated. We reserve the right to suspend accounts
                          with materially false or misleading registration details. Each user may maintain only one personal
                          account, though they may be a member of multiple teams. You may not transfer your account to another
                          person without our prior written consent.
                        </p>
                      </div>
                    </div>
                  </FadeIn>
                </section>

                {/* Section 4: Acceptable Use */}
                <section id="acceptable-use">
                  <FadeIn>
                    <div className="glass-card rounded-2xl p-6 md:p-8">
                      <div className="flex items-start gap-4 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
                          <Shield className="w-5 h-5 text-rose-600" />
                        </div>
                        <div>
                          <span className="section-label" style={{ color: '#e11d48' }}>Section 4</span>
                          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight mt-0.5">Acceptable Use</h2>
                        </div>
                      </div>
                      <div className="space-y-4 text-[15px] text-gray-500 leading-relaxed pl-0 md:pl-14">
                        <p>
                          LORE is designed for legitimate team knowledge management. By using the Service, you agree{' '}
                          <span className="font-semibold text-gray-700">not</span> to use the Service to violate any applicable
                          law or regulation; store or transmit content that infringes intellectual property rights; attempt
                          unauthorized access to other teams&apos; knowledge bases or LORE&apos;s infrastructure; overwhelm the
                          Service with excessive API calls or automated scraping; reverse engineer, decompile, or attempt to
                          extract the source code of LORE&apos;s proprietary components; or resell or redistribute access to the
                          Service without explicit written permission.
                        </p>
                        <p>
                          Violation of these acceptable use policies may result in warning, temporary suspension, or permanent
                          termination of your account, at our sole discretion. We will make reasonable efforts to notify you
                          before taking action, except in cases involving security threats or illegal activity. We also reserve
                          the right to remove any content that violates these policies without prior notice. If you become aware
                          of any violation of these terms by another user, we encourage you to report it to{' '}
                          <a href="mailto:legal@lore.dev" className="text-emerald-600 hover:text-emerald-500 font-medium">
                            legal@lore.dev
                          </a>.
                        </p>
                      </div>
                    </div>
                  </FadeIn>
                </section>

                {/* Section 5: User Content */}
                <section id="user-content">
                  <FadeIn>
                    <div className="glass-card rounded-2xl p-6 md:p-8">
                      <div className="flex items-start gap-4 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                          <BookOpen className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <span className="section-label">Section 5</span>
                          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight mt-0.5">User Content</h2>
                        </div>
                      </div>
                      <div className="space-y-4 text-[15px] text-gray-500 leading-relaxed pl-0 md:pl-14">
                        <p>
                          &ldquo;User Content&rdquo; means all knowledge data — facts, episodes, entities, relationships,
                          comments, and any other content you and your team store in LORE. You and your team are solely responsible
                          for the User Content you store in the Service. We do not review, moderate, or curate your team&apos;s
                          content, and we make no representations about its accuracy, legality, or appropriateness.
                        </p>
                        <p>
                          By storing content in LORE, you grant us a limited, non-exclusive license solely to store, retrieve,
                          and display your content as part of providing the Service. This license terminates automatically when
                          you delete your data or close your account. You represent and warrant that you have all rights necessary
                          to grant us this license and that your User Content does not violate any applicable law or the rights
                          of any third party. We reserve the right to remove User Content that we believe, in good faith, violates
                          these Terms or applicable law, though we have no obligation to monitor User Content proactively.
                        </p>
                      </div>
                    </div>
                  </FadeIn>
                </section>

                {/* Section 6: Intellectual Property */}
                <section id="intellectual-property">
                  <FadeIn>
                    <div className="glass-card rounded-2xl p-6 md:p-8">
                      <div className="flex items-start gap-4 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                          <BookOpen className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <span className="section-label">Section 6</span>
                          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight mt-0.5">Intellectual Property</h2>
                        </div>
                      </div>
                      <div className="space-y-4 text-[15px] text-gray-500 leading-relaxed pl-0 md:pl-14">
                        <div className="p-5 rounded-xl bg-emerald-50/40 border border-emerald-100/60">
                          <p className="text-lg font-black gradient-text tracking-tight leading-tight">
                            You own your knowledge. We own our platform.
                          </p>
                        </div>
                        <p>
                          All User Content remains your exclusive intellectual property. We claim no ownership, license, or
                          rights to your content beyond what is necessary to provide the Service. The LORE application, its
                          source code, visual design, trademarks, logos, AI models, and documentation are the exclusive property
                          of Lore Technologies, Inc. You may not copy, modify, distribute, or create derivative works from any
                          LORE proprietary materials without explicit written consent.
                        </p>
                        <p>
                          Any feedback, suggestions, or ideas you provide regarding the Service are provided voluntarily, and
                          you agree that we may use such feedback without restriction or obligation to you. However, this
                          provision does not extend to your User Content — only to general feedback about the Service itself.
                          All trademarks, service marks, and trade names displayed on the Service are the property of their
                          respective owners, and their use does not imply endorsement or affiliation.
                        </p>
                      </div>
                    </div>
                  </FadeIn>
                </section>

                {/* Section 7: Payment Terms */}
                <section id="payment">
                  <FadeIn>
                    <div className="glass-card rounded-2xl p-6 md:p-8 border-2 border-emerald-100/60 relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500" />
                      <div className="flex items-start gap-4 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                          <CreditCard className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <span className="section-label">Section 7</span>
                          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight mt-0.5">Payment Terms</h2>
                        </div>
                      </div>
                      <div className="space-y-4 text-[15px] text-gray-500 leading-relaxed pl-0 md:pl-14">
                        <p>
                          LORE offers Free, Pro, and Enterprise subscription plans. Paid plans are billed through Stripe, our
                          payment processing partner. By subscribing to a paid plan, you authorize us to charge the applicable
                          fees to your payment method on a recurring basis — monthly or annually, depending on your selected
                          billing cycle. All fees are quoted in US dollars and are non-refundable except as explicitly stated
                          in these Terms or required by applicable law.
                        </p>
                        <p>
                          We never store your credit card details on our servers — all payment data flows directly through
                          Stripe&apos;s PCI-compliant systems. You may update your payment method or cancel your subscription
                          at any time through the billing portal in your Settings page. Upon cancellation, you will retain
                          access to paid features until the end of your current billing period. We reserve the right to
                          modify our pricing with 30 days&apos; advance notice via email. Price changes will take effect at
                          the start of your next billing cycle. If you disagree with a price change, you may cancel your
                          subscription before the new pricing takes effect.
                        </p>
                      </div>
                    </div>
                  </FadeIn>
                </section>

                {/* Section 8: Termination */}
                <section id="termination">
                  <FadeIn>
                    <div className="glass-card rounded-2xl p-6 md:p-8">
                      <div className="flex items-start gap-4 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
                          <Ban className="w-5 h-5 text-rose-600" />
                        </div>
                        <div>
                          <span className="section-label" style={{ color: '#e11d48' }}>Section 8</span>
                          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight mt-0.5">Termination</h2>
                        </div>
                      </div>
                      <div className="space-y-4 text-[15px] text-gray-500 leading-relaxed pl-0 md:pl-14">
                        <p>
                          You may terminate your account at any time by contacting us or using the account deletion feature
                          in Settings. Upon termination, your right to use the Service will immediately cease. We will
                          retain your data for 30 days following termination to allow for potential account recovery, after
                          which all your data will be permanently and irreversibly deleted from our systems.
                        </p>
                        <p>
                          We may terminate or suspend your account immediately, without prior notice or liability, for any
                          reason, including but not limited to a breach of these Terms, conduct that we determine to be
                          harmful to other users or the Service, or as required by law. Upon such termination, your right
                          to use the Service will immediately cease. In the case of paid accounts, we will provide a
                          pro-rated refund for any prepaid but unused portion of your subscription, except in cases of
                          termination due to a breach of these Terms. Provisions of these Terms that by their nature
                          should survive termination shall survive, including ownership provisions, warranty disclaimers,
                          and limitations of liability.
                        </p>
                      </div>
                    </div>
                  </FadeIn>
                </section>

                {/* Section 9: Disclaimer of Warranties */}
                <section id="disclaimer">
                  <FadeIn>
                    <div className="glass-card rounded-2xl p-6 md:p-8">
                      <div className="flex items-start gap-4 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                          <AlertTriangle className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <span className="section-label" style={{ color: '#d97706' }}>Section 9</span>
                          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight mt-0.5">Disclaimer of Warranties</h2>
                        </div>
                      </div>
                      <div className="space-y-4 text-[15px] text-gray-500 leading-relaxed pl-0 md:pl-14">
                        <p>
                          THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTIES OF
                          ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF
                          MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT
                          THE SERVICE WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE, OR THAT THE RESULTS OBTAINED
                          FROM THE USE OF THE SERVICE WILL BE ACCURATE OR RELIABLE.
                        </p>
                        <p>
                          You understand and agree that your use of the Service is at your sole risk. Any material or data
                          downloaded or otherwise obtained through the use of the Service is done at your own discretion and
                          risk, and you will be solely responsible for any damage to your computer system or loss of data that
                          results from the download of any such material. No advice or information, whether oral or written,
                          obtained by you from LORE or through the Service shall create any warranty not expressly stated in
                          these Terms. This disclaimer applies to the fullest extent permitted by applicable law, and any
                          portions that are found to be unenforceable shall be modified to reflect the parties&apos; intent
                          as closely as possible.
                        </p>
                      </div>
                    </div>
                  </FadeIn>
                </section>

                {/* Section 10: Limitation of Liability */}
                <section id="limitation">
                  <FadeIn>
                    <div className="glass-card rounded-2xl p-6 md:p-8">
                      <div className="flex items-start gap-4 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                          <Scale className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <span className="section-label" style={{ color: '#52525b' }}>Section 10</span>
                          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight mt-0.5">Limitation of Liability</h2>
                        </div>
                      </div>
                      <div className="space-y-4 text-[15px] text-gray-500 leading-relaxed pl-0 md:pl-14">
                        <p>
                          To the maximum extent permitted by applicable law, Lore Technologies, Inc. and its officers,
                          directors, employees, and agents shall not be liable for any indirect, incidental, special,
                          consequential, or punitive damages arising from your use of or inability to use the Service;
                          any loss of data, revenue, profits, or business opportunities resulting from Service interruptions,
                          errors, or defects; any claims arising from the knowledge content stored by you or your team;
                          any unauthorized access to your account resulting from your failure to maintain credential security;
                          or any damages exceeding the total amount you paid to LORE in the twelve months preceding the claim.
                        </p>
                        <p>
                          Some jurisdictions do not allow the exclusion of certain warranties or limitation of liability, so
                          some of the above limitations may not apply to you. In such cases, our liability is limited to the
                          fullest extent permitted by applicable law. The limitations and disclaimers in this section do not
                          apply to liability for death or personal injury resulting from negligence, fraud, or any other
                          liability that cannot be excluded or limited by applicable law.
                        </p>
                      </div>
                    </div>
                  </FadeIn>
                </section>

                {/* Section 11: Indemnification */}
                <section id="indemnification">
                  <FadeIn>
                    <div className="glass-card rounded-2xl p-6 md:p-8">
                      <div className="flex items-start gap-4 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                          <Shield className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <span className="section-label">Section 11</span>
                          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight mt-0.5">Indemnification</h2>
                        </div>
                      </div>
                      <div className="space-y-4 text-[15px] text-gray-500 leading-relaxed pl-0 md:pl-14">
                        <p>
                          You agree to defend, indemnify, and hold harmless Lore Technologies, Inc. and its officers,
                          directors, employees, agents, licensors, and suppliers from and against any claims, actions,
                          demands, liabilities, and settlements including legal fees arising from or related to your use
                          of the Service, your violation of these Terms, or your violation of any rights of another party.
                          This indemnification obligation applies regardless of whether the claim arises from your User
                          Content, your use of AI features, or any other interaction with the Service.
                        </p>
                        <p>
                          We reserve the right, at our own expense, to assume the exclusive defense and control of any
                          matter otherwise subject to indemnification by you, and in such case, you agree to cooperate
                          with our defense of such claim. The indemnification obligations under this section shall survive
                          the termination or expiration of these Terms and your use of the Service. If you are required
                          to indemnify us, we will provide you with prompt written notice of any claim, though failure to
                          provide such notice shall not relieve you of your obligations except to the extent you are
                          materially prejudiced by the delay.
                        </p>
                      </div>
                    </div>
                  </FadeIn>
                </section>

                {/* Section 12: Governing Law */}
                <section id="governing-law">
                  <FadeIn>
                    <div className="glass-card rounded-2xl p-6 md:p-8">
                      <div className="flex items-start gap-4 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                          <Globe className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <span className="section-label">Section 12</span>
                          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight mt-0.5">Governing Law</h2>
                        </div>
                      </div>
                      <div className="space-y-4 text-[15px] text-gray-500 leading-relaxed pl-0 md:pl-14">
                        <p>
                          These Terms shall be governed by and construed in accordance with the laws of the State of
                          California, United States, without regard to its conflict of law provisions. Any disputes
                          arising under or in connection with these Terms shall be subject to the exclusive jurisdiction
                          of the state and federal courts located in San Francisco County, California, and you consent
                          to the personal jurisdiction and venue of such courts.
                        </p>
                        <p>
                          If you are accessing the Service from outside the United States, you agree that the laws of
                          the State of California will apply to these Terms, and you consent to the jurisdiction of
                          the California courts. Nothing in these Terms shall be construed as a waiver of any sovereign
                          immunity enjoyed by either party. If any provision of these Terms is found to be unenforceable
                          or invalid, that provision shall be limited or eliminated to the minimum extent necessary so
                          that these Terms shall otherwise remain in full force and effect.
                        </p>
                      </div>
                    </div>
                  </FadeIn>
                </section>

                {/* Section 13: Changes to Terms */}
                <section id="changes">
                  <FadeIn>
                    <div className="glass-card rounded-2xl p-6 md:p-8">
                      <div className="flex items-start gap-4 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                          <RefreshCw className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <span className="section-label">Section 13</span>
                          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight mt-0.5">Changes to Terms</h2>
                        </div>
                      </div>
                      <div className="space-y-4 text-[15px] text-gray-500 leading-relaxed pl-0 md:pl-14">
                        <p>
                          We may update these Terms from time to time to reflect changes in our Service, legal requirements,
                          or best practices. For material changes — those that alter your rights or obligations — we will
                          provide at least 30 days&apos; advance notice via email to the address associated with your account
                          and a prominent notice within the LORE interface. Your continued use of LORE after the effective
                          date of any modifications constitutes your acceptance of the revised Terms.
                        </p>
                        <p>
                          If you disagree with any changes, you must stop using the Service and request deletion of your
                          data before the effective date. We maintain a version history of all Terms changes, and you can
                          request a copy of any previous version by contacting{' '}
                          <a href="mailto:legal@lore.dev" className="text-emerald-600 hover:text-emerald-500 font-medium">
                            legal@lore.dev
                          </a>.
                          Minor updates such as corrections to typos, clarifications, or formatting changes may be made
                          without advance notice, as they do not alter your rights or obligations. We encourage you to
                          review these Terms periodically to stay informed of any updates.
                        </p>
                      </div>
                    </div>
                  </FadeIn>
                </section>

                {/* Section 14: Contact Information */}
                <section id="contact">
                  <FadeIn>
                    <div className="glass-card rounded-2xl p-6 md:p-8 relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500" />
                      <div className="flex items-start gap-4 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                          <Mail className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <span className="section-label">Section 14</span>
                          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight mt-0.5">Contact Information</h2>
                        </div>
                      </div>
                      <div className="space-y-4 text-[15px] text-gray-500 leading-relaxed pl-0 md:pl-14">
                        <p>
                          For any questions, concerns, or notices related to these Terms of Service, please contact
                          our legal team:
                        </p>
                        <div className="p-5 rounded-xl bg-emerald-50/50 border border-emerald-100">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-md shadow-emerald-500/20">
                              <Scale className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 text-[15px]">Legal Team</p>
                              <a
                                href="mailto:legal@lore.dev"
                                className="text-emerald-600 hover:text-emerald-500 font-semibold transition-colors text-[15px]"
                              >
                                legal@lore.dev
                              </a>
                            </div>
                          </div>
                          <p className="text-[13px] text-gray-500 leading-relaxed">
                            For general support inquiries, please reach out through the LORE interface.
                            For legal matters including Terms disputes, intellectual property claims, or
                            data processing requests, please use the legal email above.
                          </p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-3 mt-2">
                          <div className="p-4 rounded-xl bg-gray-50/60 border border-gray-100">
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Mailing Address</p>
                            <p className="text-[13px] text-gray-600 font-medium">
                              Lore Technologies, Inc.
                            </p>
                            <p className="text-[12px] text-gray-400">
                              Attn: Legal Department<br />
                              San Francisco, CA 94105<br />
                              United States
                            </p>
                          </div>
                          <div className="p-4 rounded-xl bg-gray-50/60 border border-gray-100">
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Governing Law</p>
                            <p className="text-[13px] text-gray-600 font-medium">
                              State of California
                            </p>
                            <p className="text-[12px] text-gray-400">
                              These Terms are governed by the laws of the State of California, United States.
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-3 mt-4">
                          <Link
                            href="/privacy"
                            className="btn-secondary text-sm w-full sm:w-auto justify-center"
                          >
                            Read our Privacy Policy
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                          <Link
                            href="/"
                            className="btn-primary text-sm w-full sm:w-auto justify-center"
                          >
                            Back to LORE
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </FadeIn>
                </section>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

function TermsCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white text-card-foreground rounded-xl border border-[#E5E7EB] shadow-sm">
      {children}
    </div>
  )
}
