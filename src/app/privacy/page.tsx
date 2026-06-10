'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import {
  Shield,
  Eye,
  Database,
  Users,
  Lock,
  Cookie,
  HardDrive,
  Mail,
  Globe,
  Baby,
  PenLine,
  Layers,
  ArrowRight,
  Server,
  CheckCircle2,
  AlertTriangle,
  KeyRound,
  Fingerprint,
  Network,
  ShieldCheck,
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
  { id: 'introduction', number: 1, title: 'Introduction', icon: Shield },
  { id: 'information-we-collect', number: 2, title: 'Information We Collect', icon: Eye },
  { id: 'how-we-use', number: 3, title: 'How We Use Your Information', icon: Database },
  { id: 'data-storage-security', number: 4, title: 'Data Storage & Security', icon: Lock },
  { id: 'data-sharing', number: 5, title: 'Data Sharing', icon: Users },
  { id: 'your-rights', number: 6, title: 'Your Rights', icon: CheckCircle2 },
  { id: 'data-retention', number: 7, title: 'Data Retention', icon: HardDrive },
  { id: 'cookies', number: 8, title: 'Cookies', icon: Cookie },
  { id: 'third-party', number: 9, title: 'Third-Party Services', icon: Globe },
  { id: 'children', number: 10, title: 'Children\'s Privacy', icon: Baby },
  { id: 'changes', number: 11, title: 'Changes to This Policy', icon: PenLine },
  { id: 'contact', number: 12, title: 'Contact Us', icon: Mail },
]

export default function PrivacyPage() {
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
                <Shield className="w-3.5 h-3.5" />
                Privacy Policy
              </div>
            </FadeIn>
            <FadeIn delay={0.05}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.1]">
                Your Data,{' '}
                <span className="gradient-text">Your Control</span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="section-subtitle mt-5 max-w-2xl mx-auto">
                We built LORE on the principle that your team&apos;s knowledge is yours alone.
                This policy explains what we collect, how we protect it, and the rights you have.
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
                  <Card className="bg-white border-[#E5E7EB] shadow-sm">
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
                              <span>{section.title}</span>
                            </a>
                          )
                        })}
                      </nav>
                    </div>
                  </Card>
                </div>
              </motion.aside>

              {/* ──── Main Content ──── */}
              <div className="flex-1 min-w-0 max-w-3xl space-y-8">
                {/* Section 1: Introduction */}
                <section id="introduction">
                  <FadeIn>
                    <div className="glass-card rounded-2xl p-6 md:p-8">
                      <div className="flex items-start gap-4 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                          <Shield className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <span className="section-label">Section 1</span>
                          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight mt-0.5">Introduction</h2>
                        </div>
                      </div>
                      <div className="space-y-4 text-[15px] text-gray-500 leading-relaxed pl-0 md:pl-14">
                        <p>
                          Lore Technologies, Inc. (&ldquo;LORE&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) operates the LORE
                          knowledge management platform at lore.dev and related services. This Privacy Policy describes how we collect,
                          use, disclose, and safeguard your information when you use our Service. We are committed to protecting your
                          privacy and ensuring that you understand how your data is handled throughout your experience with LORE.
                        </p>
                        <p>
                          By accessing or using LORE, you agree to the collection and use of information in accordance with this policy.
                          If you do not agree with the terms of this Privacy Policy, please do not access the Service. We have designed
                          this document to be clear and accessible — you should understand exactly what happens to your data without
                          needing a law degree to interpret it. This policy applies to all users of LORE, including team administrators,
                          team members, and individual users accessing the platform through any means.
                        </p>
                        <p>
                          We encourage you to read this Privacy Policy carefully and to check this page periodically for changes.
                          We may update this Privacy Policy from time to time, and any changes will be effective immediately upon
                          posting on this page with an updated &ldquo;Last updated&rdquo; date. Your continued use of the Service
                          after any modifications constitutes your acknowledgment of the modifications and your consent to abide by
                          and be bound by the updated Privacy Policy.
                        </p>
                      </div>
                    </div>
                  </FadeIn>
                </section>

                {/* Section 2: Information We Collect */}
                <section id="information-we-collect">
                  <FadeIn>
                    <div className="glass-card rounded-2xl p-6 md:p-8">
                      <div className="flex items-start gap-4 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                          <Eye className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <span className="section-label">Section 2</span>
                          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight mt-0.5">Information We Collect</h2>
                        </div>
                      </div>
                      <div className="space-y-5 text-[15px] text-gray-500 leading-relaxed pl-0 md:pl-14">
                        <p>
                          LORE follows a minimal-collection philosophy. We only gather what is strictly necessary to deliver
                          our team knowledge management service and improve your experience. Below, we describe each category
                          of information we collect and the specific purposes for which it is used.
                        </p>

                        {/* Personal Information */}
                        <div className="p-5 rounded-xl bg-gray-50/60 border border-gray-100">
                          <h3 className="font-bold text-gray-800 text-[15px] mb-2 flex items-center gap-2">
                            <span className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-[11px] font-bold text-emerald-600">2a</span>
                            Personal Information
                          </h3>
                          <p className="text-[14px] text-gray-500 leading-relaxed">
                            When you create a LORE account, we collect your full name, email address, and organization affiliation.
                            This information is essential for authentication, team management, and service communication. We may
                            also collect profile details you choose to provide, such as a username and bio. Your email address serves
                            as your unique account identifier and is used for account verification, password recovery, and important
                            service notifications. We do not require or collect government-issued identification numbers, social
                            security numbers, or financial account details as part of the registration process. If you choose to
                            connect third-party authentication providers (such as Google or GitHub SSO), we receive only the basic
                            profile information those providers share with us — typically your name, email, and avatar.
                          </p>
                        </div>

                        {/* Usage Information */}
                        <div className="p-5 rounded-xl bg-gray-50/60 border border-gray-100">
                          <h3 className="font-bold text-gray-800 text-[15px] mb-2 flex items-center gap-2">
                            <span className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-[11px] font-bold text-emerald-600">2b</span>
                            Usage Information
                          </h3>
                          <p className="text-[14px] text-gray-500 leading-relaxed">
                            When you use LORE, we automatically collect certain usage data, including query counts, feature
                            interaction patterns, session duration, and performance metrics. This information is aggregated and
                            anonymized — it cannot be traced back to any individual user or team. We use this data to monitor
                            service reliability, plan infrastructure capacity, identify and fix bugs, and understand which features
                            are most valuable to our users. Usage information also helps us detect and prevent security threats,
                            such as unauthorized access attempts or abuse of our platform. We do not track individual browsing
                            behavior across sessions for advertising or profiling purposes, and we never sell usage data to
                            third-party analytics companies or data brokers.
                          </p>
                        </div>

                        {/* Knowledge Data */}
                        <div className="p-5 rounded-xl bg-gray-50/60 border border-gray-100">
                          <h3 className="font-bold text-gray-800 text-[15px] mb-2 flex items-center gap-2">
                            <span className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-[11px] font-bold text-emerald-600">2c</span>
                            Knowledge Data
                          </h3>
                          <p className="text-[14px] text-gray-500 leading-relaxed">
                            The core of LORE is your team&apos;s knowledge — facts, episodes, entity-relationship data, and connections
                            that you and your team intentionally store in the platform. This data is stored securely in Aurora DSQL
                            and is only accessible to authorized members of your team. We never read, analyze, or use your knowledge
                            data for any purpose other than serving it back to your team through the LORE interface and AI features
                            you explicitly invoke. Your knowledge data is never used to train AI models, and we do not share it with
                            other teams or external parties. When you use AI-powered features such as the morning digest or knowledge
                            chat, your queries are processed in real-time and are not stored beyond the duration of the session unless
                            you choose to save the results.
                          </p>
                        </div>

                        <div className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-100/60">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                            <p className="text-[13px] text-emerald-700">
                              <span className="font-semibold">What we do NOT collect:</span> Personal browsing history,
                              device fingerprints, advertising identifiers, keystroke patterns, or any information for
                              third-party profiling. Period.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </FadeIn>
                </section>

                {/* Section 3: How We Use Your Information */}
                <section id="how-we-use">
                  <FadeIn>
                    <div className="glass-card rounded-2xl p-6 md:p-8">
                      <div className="flex items-start gap-4 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                          <Database className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <span className="section-label">Section 3</span>
                          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight mt-0.5">How We Use Your Information</h2>
                        </div>
                      </div>
                      <div className="space-y-4 text-[15px] text-gray-500 leading-relaxed pl-0 md:pl-14">
                        <p>
                          We use the information we collect for specific, clearly defined purposes that are directly related to
                          providing and improving the LORE service. We do not use your data for any purpose beyond those described
                          below without obtaining your explicit consent first.
                        </p>
                        <p>
                          Your personal information is used to create and manage your account, authenticate your identity during
                          login, and communicate important service updates. Team association data enables collaboration features
                          and ensures that knowledge is shared only within authorized team boundaries. Usage analytics help us
                          identify performance bottlenecks, prioritize feature development, and maintain service reliability —
                          all in an aggregated, anonymized fashion that protects individual privacy.
                        </p>
                        <p>
                          Knowledge data is processed exclusively to serve your team through LORE&apos;s features, including the
                          knowledge graph visualization, AI-powered search, morning digest generation, and conversational AI
                          interactions. When you invoke an AI feature, your query and relevant knowledge context are processed
                          in real-time to generate a response. These processing events are ephemeral and are not retained for
                          model training or any secondary purpose. We may also use your information to comply with legal
                          obligations, resolve disputes, and enforce our agreements — but only when required by valid legal
                          process and always with a commitment to minimizing disclosure.
                        </p>
                      </div>
                    </div>
                  </FadeIn>
                </section>

                {/* Section 4: Data Storage & Security */}
                <section id="data-storage-security">
                  <FadeIn>
                    <div className="glass-card rounded-2xl p-6 md:p-8 border-2 border-emerald-100/60 relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500" />
                      <div className="flex items-start gap-4 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                          <Lock className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <span className="section-label">Section 4</span>
                          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight mt-0.5">Data Storage & Security</h2>
                        </div>
                      </div>
                      <div className="space-y-5 text-[15px] text-gray-500 leading-relaxed pl-0 md:pl-14">
                        <div className="p-5 rounded-xl bg-emerald-50/50 border border-emerald-100">
                          <p className="text-2xl sm:text-3xl font-black gradient-text tracking-tight leading-tight">
                            Your knowledge lives in Aurora DSQL — encrypted at rest and in transit, always.
                          </p>
                        </div>
                        <p>
                          LORE is built on Amazon Aurora DSQL, a distributed SQL database designed for multi-region
                          active-active workloads. This architecture provides both resilience and strong data isolation
                          guarantees. All data stored in Aurora DSQL is encrypted using AES-256 at the storage layer, and
                          every connection between clients, servers, and the database is protected by TLS 1.3 with forward
                          secrecy. AWS Key Management Service (KMS) manages all encryption keys with automatic rotation
                          and comprehensive audit logging of every key usage event.
                        </p>
                        <p>
                          We implement defense in depth with multiple overlapping layers of protection: VPC isolation ensures
                          Aurora DSQL runs inside a private network with no public endpoints, and database access is restricted
                          to authenticated application servers only. Role-based access control (RBAC) limits who can access
                          what within our organization — no LORE employee can view your team&apos;s knowledge without your explicit
                          permission. Our infrastructure runs on AWS with SOC 2 Type II compliance, automated patching,
                          and continuous vulnerability scanning. In the event of a security incident, we will notify affected
                          users within 72 hours, in compliance with GDPR Article 33.
                        </p>
                      </div>
                    </div>
                  </FadeIn>
                </section>

                {/* Section 5: Data Sharing */}
                <section id="data-sharing">
                  <FadeIn>
                    <div className="glass-card rounded-2xl p-6 md:p-8">
                      <div className="flex items-start gap-4 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
                          <Users className="w-5 h-5 text-rose-600" />
                        </div>
                        <div>
                          <span className="section-label" style={{ color: '#e11d48' }}>Section 5</span>
                          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight mt-0.5">Data Sharing</h2>
                        </div>
                      </div>
                      <div className="space-y-4 text-[15px] text-gray-500 leading-relaxed pl-0 md:pl-14">
                        <div className="p-5 rounded-xl bg-rose-50/40 border border-rose-100/60">
                          <p className="text-xl sm:text-2xl font-black text-rose-700 tracking-tight leading-tight">
                            We never sell your data. We never share your data. Ever.
                          </p>
                        </div>
                        <p>
                          Your team&apos;s knowledge is your competitive advantage, and we treat it with the gravity it deserves.
                          We do not sell, rent, lease, or license your data to any third party under any circumstances. We have
                          no advertising relationships — no ad networks, no data brokers, no audience targeting partnerships.
                          We do not use your team&apos;s knowledge to train AI models, and your data is never used as training
                          data for any system, whether internal or external.
                        </p>
                        <p>
                          Each team&apos;s data is logically isolated in Aurora DSQL. Other LORE teams cannot access your knowledge,
                          and neither can we for casual purposes. The only circumstances under which we may disclose your data
                          are when required by valid legal process — such as a court order, subpoena, or regulatory requirement.
                          In such cases, we will make reasonable efforts to notify you before disclosure, unless legally prohibited
                          from doing so. We also reserve the right to disclose information when we believe in good faith that
                          disclosure is necessary to protect our rights, protect your safety or the safety of others, investigate
                          fraud, or respond to a government request.
                        </p>
                      </div>
                    </div>
                  </FadeIn>
                </section>

                {/* Section 6: Your Rights */}
                <section id="your-rights">
                  <FadeIn>
                    <div className="glass-card rounded-2xl p-6 md:p-8">
                      <div className="flex items-start gap-4 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <span className="section-label">Section 6</span>
                          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight mt-0.5">Your Rights</h2>
                        </div>
                      </div>
                      <div className="space-y-4 text-[15px] text-gray-500 leading-relaxed pl-0 md:pl-14">
                        <p>
                          We believe data sovereignty is non-negotiable. You retain full ownership of your team&apos;s knowledge
                          at all times, and we are committed to upholding your rights under applicable data protection laws
                          including GDPR, CCPA, and other regional regulations. Here are the rights you exercise through LORE:
                        </p>
                        <p>
                          <span className="font-semibold text-gray-700">Right to Access:</span> You may request a complete copy
                          of all personal data we hold about you. We will provide it within 14 business days in a machine-readable
                          format, free of charge. <span className="font-semibold text-gray-700">Right to Deletion:</span> You may
                          request permanent deletion of your team&apos;s data. We will remove all knowledge data, account information,
                          and associated records from Aurora DSQL within 30 days of a verified request. Deletion is irreversible and
                          thorough. <span className="font-semibold text-gray-700">Right to Portability:</span> You can export your
                          entire team knowledge base — facts, episodes, entities, and relationships — at any time in structured
                          JSON format through the Settings page. No lock-in, no data held hostage.
                        </p>
                        <p>
                          To exercise any of these rights, contact us at{' '}
                          <a href="mailto:privacy@lore.dev" className="text-emerald-600 hover:text-emerald-500 font-medium transition-colors">
                            privacy@lore.dev
                          </a>.
                          We will respond to all verified requests within 14 business days.
                        </p>
                      </div>
                    </div>
                  </FadeIn>
                </section>

                {/* Section 7: Data Retention */}
                <section id="data-retention">
                  <FadeIn>
                    <div className="glass-card rounded-2xl p-6 md:p-8">
                      <div className="flex items-start gap-4 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                          <HardDrive className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <span className="section-label">Section 7</span>
                          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight mt-0.5">Data Retention</h2>
                        </div>
                      </div>
                      <div className="space-y-4 text-[15px] text-gray-500 leading-relaxed pl-0 md:pl-14">
                        <p>
                          Your team&apos;s knowledge data is retained for as long as your account is active. We follow specific
                          retention schedules for each data category to ensure we keep only what is necessary and nothing more.
                          Team knowledge — facts, episodes, entities, and relationships — is preserved for the lifetime of your
                          team, and retained for an additional 30 days after a deletion request to allow for recovery in case of
                          accidental deletion. Account information, including your name, email, and team association, is retained
                          for the duration of your account plus 30 days after account closure.
                        </p>
                        <p>
                          Usage analytics are retained for 90 days in aggregated form, after which they are permanently deleted.
                          These are anonymized and aggregated metrics only — no individual user data persists. Server logs, which
                          contain operational information for debugging and security monitoring, are retained for 30 days and then
                          automatically purged. No knowledge content is ever included in server logs. You can configure your
                          preferred data retention period for deleted items in the Settings page, with options ranging from
                          30 days to indefinite retention.
                        </p>
                      </div>
                    </div>
                  </FadeIn>
                </section>

                {/* Section 8: Cookies */}
                <section id="cookies">
                  <FadeIn>
                    <div className="glass-card rounded-2xl p-6 md:p-8">
                      <div className="flex items-start gap-4 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                          <Cookie className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <span className="section-label" style={{ color: '#d97706' }}>Section 8</span>
                          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight mt-0.5">Cookies</h2>
                        </div>
                      </div>
                      <div className="space-y-4 text-[15px] text-gray-500 leading-relaxed pl-0 md:pl-14">
                        <p>
                          LORE uses minimal, essential-only cookies. We do not use tracking cookies, advertising pixels, or
                          third-party analytics scripts. A single, secure, HttpOnly cookie stores your session token — this
                          is strictly required for authentication and cannot be disabled without losing access to the service.
                          A CSRF token cookie protects against cross-site request forgery attacks; this is a security measure,
                          not a tracking mechanism.
                        </p>
                        <p>
                          We do not use Google Analytics, Facebook Pixel, Hotjar, Mixpanel, or any third-party tracking or
                          advertising cookies. Our analytics are first-party, aggregated, and anonymized. If we introduce any
                          non-essential cookies in the future, we will update this section and provide you with the ability to
                          opt out before any such cookies are placed on your device. You can also configure your browser to
                          reject all cookies or to alert you when cookies are being sent, though this may limit certain
                          functionality of the Service.
                        </p>
                      </div>
                    </div>
                  </FadeIn>
                </section>

                {/* Section 9: Third-Party Services */}
                <section id="third-party">
                  <FadeIn>
                    <div className="glass-card rounded-2xl p-6 md:p-8">
                      <div className="flex items-start gap-4 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                          <Globe className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <span className="section-label">Section 9</span>
                          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight mt-0.5">Third-Party Services</h2>
                        </div>
                      </div>
                      <div className="space-y-4 text-[15px] text-gray-500 leading-relaxed pl-0 md:pl-14">
                        <p>
                          LORE integrates with select third-party services to deliver core functionality. Amazon Web Services
                          (AWS) hosts our infrastructure, including Aurora DSQL for data storage and compute resources for
                          application processing. Stripe processes payment information for Pro and Enterprise subscriptions — we
                          never store your credit card details on our servers; all payment data flows directly through Stripe&apos;s
                          PCI-compliant systems. Authentication providers such as Google and GitHub may be used for single sign-on,
                          in which case they handle your credentials directly and share only basic profile information with LORE.
                        </p>
                        <p>
                          We carefully vet all third-party providers and require them to maintain appropriate security certifications
                          and data protection standards. Each third-party service is limited to accessing only the minimum data
                          necessary to perform its designated function. We do not allow third-party services to use your data for
                          their own purposes, and we regularly audit these integrations to ensure compliance with our privacy
                          standards. If we add new third-party integrations in the future, we will update this section and
                          notify you via email before any new data sharing begins.
                        </p>
                      </div>
                    </div>
                  </FadeIn>
                </section>

                {/* Section 10: Children's Privacy */}
                <section id="children">
                  <FadeIn>
                    <div className="glass-card rounded-2xl p-6 md:p-8">
                      <div className="flex items-start gap-4 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                          <Baby className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <span className="section-label" style={{ color: '#d97706' }}>Section 10</span>
                          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight mt-0.5">Children&apos;s Privacy</h2>
                        </div>
                      </div>
                      <div className="space-y-4 text-[15px] text-gray-500 leading-relaxed pl-0 md:pl-14">
                        <p>
                          LORE is a professional knowledge management tool designed for use by businesses, teams, and organizations.
                          Our Service is not directed to children under the age of 16, and we do not knowingly collect personal
                          information from children under 16. If you are a parent or guardian and become aware that a child under 16
                          has provided us with personal information, please contact us immediately at{' '}
                          <a href="mailto:privacy@lore.dev" className="text-emerald-600 hover:text-emerald-500 font-medium transition-colors">
                            privacy@lore.dev
                          </a>{' '}
                          and we will take steps to delete such information from our systems promptly.
                        </p>
                        <p>
                          We comply with the Children&apos;s Online Privacy Protection Act (COPPA) and other applicable children&apos;s
                          privacy laws. In the event that we discover we have collected personal information from a child under 16
                          without verification of parental consent, we will delete that information as quickly as commercially
                          feasible. If we ever decide to make LORE available to users under 16, we will implement appropriate
                          parental consent mechanisms and update this Privacy Policy to reflect those changes before any such
                          collection occurs.
                        </p>
                      </div>
                    </div>
                  </FadeIn>
                </section>

                {/* Section 11: Changes to This Policy */}
                <section id="changes">
                  <FadeIn>
                    <div className="glass-card rounded-2xl p-6 md:p-8">
                      <div className="flex items-start gap-4 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                          <PenLine className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <span className="section-label">Section 11</span>
                          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight mt-0.5">Changes to This Policy</h2>
                        </div>
                      </div>
                      <div className="space-y-4 text-[15px] text-gray-500 leading-relaxed pl-0 md:pl-14">
                        <p>
                          We may update this Privacy Policy from time to time to reflect changes in our data practices, legal
                          requirements, or the evolution of our Service. When we make material changes — those that affect how
                          we collect, use, or share your data — we will provide at least 30 days&apos; advance notice via email
                          to the address associated with your account and a prominent notice within the LORE interface. The
                          &ldquo;Last updated&rdquo; date at the top of this page will always reflect the most recent revision.
                        </p>
                        <p>
                          Your continued use of LORE after the effective date of any modifications constitutes your acceptance
                          of the revised Privacy Policy. If you disagree with any changes, you must stop using the Service and
                          request deletion of your data before the effective date. We maintain a version history of all Privacy
                          Policy changes, and you can request a copy of any previous version by contacting{' '}
                          <a href="mailto:privacy@lore.dev" className="text-emerald-600 hover:text-emerald-500 font-medium transition-colors">
                            privacy@lore.dev
                          </a>.
                          Minor updates — such as corrections to typos, clarifications, or formatting changes — may be made
                          without advance notice, as they do not alter your rights or obligations.
                        </p>
                      </div>
                    </div>
                  </FadeIn>
                </section>

                {/* Section 12: Contact Us */}
                <section id="contact">
                  <FadeIn>
                    <div className="glass-card rounded-2xl p-6 md:p-8 relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500" />
                      <div className="flex items-start gap-4 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                          <Mail className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <span className="section-label">Section 12</span>
                          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight mt-0.5">Contact Us</h2>
                        </div>
                      </div>
                      <div className="space-y-4 text-[15px] text-gray-500 leading-relaxed pl-0 md:pl-14">
                        <p>
                          We take your privacy seriously and are committed to addressing any concerns promptly. If you have
                          questions about this Privacy Policy, wish to exercise your data rights, or need to report a privacy
                          issue, please reach out to our dedicated privacy team:
                        </p>
                        <div className="p-5 rounded-xl bg-emerald-50/50 border border-emerald-100">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-md shadow-emerald-500/20">
                              <Mail className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 text-[15px]">Privacy Team</p>
                              <a
                                href="mailto:privacy@lore.dev"
                                className="text-emerald-600 hover:text-emerald-500 font-semibold transition-colors text-[15px]"
                              >
                                privacy@lore.dev
                              </a>
                            </div>
                          </div>
                          <p className="text-[13px] text-gray-500 leading-relaxed">
                            We aim to respond to all privacy inquiries within 5 business days.
                            For data access, deletion, or export requests, please include your team name
                            and account email for verification.
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-3 mt-4">
                          <Link
                            href="/terms"
                            className="btn-secondary text-sm w-full sm:w-auto justify-center"
                          >
                            Read our Terms of Service
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

// Simple Card component for the sidebar (reuses shadcn style)
function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`bg-card text-card-foreground rounded-xl border py-0 ${className}`}>
      {children}
    </div>
  )
}
