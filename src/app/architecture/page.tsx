'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import {
  Database,
  Brain,
  Shield,
  Zap,
  Globe,
  Server,
  Layers,
  ArrowRight,
  GitBranch,
  Cpu,
  CheckCircle2,
  Terminal,
  Binary,
  Activity,
  Code2,
  Cloud,
  MonitorSmartphone,
  MoveRight,
  ChevronRight,
  Github,
  ShieldCheck,
  Atom,
  Clock,
  FileCheck,
  Key,
  Gauge,
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

// ─── FadeIn Animation Component ─────────────────────────
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

// ─── Section Wrapper ─────────────────────────────────────
function Section({ id, children, className = '' }: { id?: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`py-20 md:py-28 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  )
}

// ─── Architecture Flow Node ──────────────────────────────
function ArchNode({
  label,
  sublabel,
  icon: Icon,
  color,
  isActive = false,
}: {
  label: string
  sublabel: string
  icon: React.ElementType
  color: string
  isActive?: boolean
}) {
  return (
    <div
      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-300 ${
        isActive
          ? 'border-transparent shadow-lg scale-105'
          : 'border-gray-200/60 bg-white shadow-sm hover:shadow-md hover:border-gray-300/60'
      }`}
      style={isActive ? { background: `linear-gradient(135deg, ${color}10, ${color}05)`, borderColor: `${color}30` } : {}}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: `${color}12` }}
      >
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      <div className="text-center">
        <div className="text-sm font-bold text-gray-900 tracking-tight">{label}</div>
        <div className="text-[11px] text-gray-400 mt-0.5">{sublabel}</div>
      </div>
    </div>
  )
}

// ─── Connector Arrow ─────────────────────────────────────
function ConnectorArrow() {
  return (
    <div className="hidden md:flex items-center justify-center px-1">
      <MoveRight className="w-5 h-5 text-gray-300" />
    </div>
  )
}

// ─── Vertical Connector ──────────────────────────────────
function VerticalConnector() {
  return (
    <div className="flex flex-col items-center py-1">
      <div className="w-px h-6 bg-gradient-to-b from-gray-200 to-gray-300" />
      <ChevronRight className="w-3 h-3 text-gray-300 rotate-90" />
    </div>
  )
}

// ─── DSQL Benefit Card ───────────────────────────────────
function DSQLBenefitCard({
  icon: Icon,
  title,
  description,
  color,
}: {
  icon: React.ElementType
  title: string
  description: string
  color: string
}) {
  return (
    <div className="feature-card">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}10` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <h4 className="text-sm font-bold text-gray-900">{title}</h4>
      </div>
      <p className="text-[13px] text-gray-500 leading-relaxed">{description}</p>
    </div>
  )
}

// ─── Data Flow Step ──────────────────────────────────────
function DataFlowStep({
  step,
  title,
  description,
  icon: Icon,
  color,
  isLast = false,
}: {
  step: number
  title: string
  description: string
  icon: React.ElementType
  color: string
  isLast?: boolean
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${color}10` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        {!isLast && (
          <div className="w-px flex-1 bg-gradient-to-b from-emerald-200 to-emerald-100 my-2" />
        )}
      </div>
      <div className="pb-8">
        <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider mb-1">
          Step {step}
        </div>
        <h4 className="text-sm font-bold text-gray-900 mb-1">{title}</h4>
        <p className="text-[13px] text-gray-500 leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

// ─── Tech Stack Icon Card ────────────────────────────────
function TechIconCard({
  name,
  icon: Icon,
  category,
  color,
}: {
  name: string
  icon: React.ElementType
  category: string
  color: string
}) {
  return (
    <div className="feature-card flex flex-col items-center text-center gap-3 group">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
        style={{ backgroundColor: `${color}10` }}
      >
        <Icon className="w-7 h-7" style={{ color }} />
      </div>
      <div>
        <h4 className="text-sm font-bold text-gray-900 tracking-tight">{name}</h4>
        <p className="text-[11px] text-gray-400 mt-0.5">{category}</p>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════
//  MAIN PAGE COMPONENT
// ══════════════════════════════════════════════════════════

export default function ArchitecturePage() {
  return (
    <div className="min-h-screen flex flex-col mesh-gradient-bg">
      <Navbar />
      <main className="flex-1 pt-16">

        {/* ═══ 1. HERO ═══ */}
        <section className="py-20 md:py-32 relative overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(5,150,105,0.08), transparent 70%)' }} />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.06), transparent 70%)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.05), transparent 70%)' }} />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-semibold mb-6 bg-emerald-50 text-emerald-700 border border-emerald-100">
                <Cpu className="w-3.5 h-3.5" />
                Technical Architecture
              </div>
            </FadeIn>

            <FadeIn delay={0.05}>
              <h1 className="section-title">
                Built for{' '}
                <span className="gradient-text">Consistency</span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.1}>
              <p className="section-subtitle mt-6 max-w-3xl mx-auto">
                LORE is engineered on a distributed SQL foundation that guarantees serializable isolation
                across every region. No merge conflicts, no eventual consistency surprises, no stale reads.
                Your team&apos;s knowledge is always correct, always current, always consistent.
              </p>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
                <Link href="/app" className="btn-primary">
                  Explore the Product
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="#overview" className="btn-secondary">
                  View Architecture
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </FadeIn>

            {/* Quick Stats */}
            <FadeIn delay={0.2}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14 max-w-3xl mx-auto">
                {[
                  { value: '<50ms', label: 'Avg Query Latency', icon: Zap, color: '#059669' },
                  { value: '99.99%', label: 'Uptime SLA', icon: Activity, color: '#10B981' },
                  { value: '3+', label: 'Active Regions', icon: Globe, color: '#0D9488' },
                  { value: '0', label: 'Merge Conflicts', icon: Shield, color: '#EF4444' },
                ].map((stat) => {
                  const Icon = stat.icon
                  return (
                    <div key={stat.label} className="glass-card rounded-xl p-4 text-center">
                      <Icon className="w-5 h-5 mx-auto mb-2" style={{ color: stat.color }} />
                      <div className="text-2xl font-extrabold text-gray-900 tracking-tight">{stat.value}</div>
                      <div className="text-[11px] text-gray-400 font-medium mt-0.5">{stat.label}</div>
                    </div>
                  )
                })}
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ═══ 2. ARCHITECTURE DIAGRAM ═══ */}
        <Section id="overview" className="bg-white/50">
          <FadeIn>
            <div className="text-center mb-14">
              <div className="section-label mb-3">System Overview</div>
              <h2 className="section-title">Architecture Diagram</h2>
              <p className="section-subtitle mt-4 max-w-2xl mx-auto">
                A vertically-integrated stack where every layer is designed for consistency, from the distributed
                SQL database at the foundation to the real-time WebSocket connections at the edge.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="glass-card rounded-3xl p-6 md:p-10 shadow-lg overflow-hidden relative">
              <div className="absolute inset-0 dot-pattern opacity-40 pointer-events-none" />

              <div className="relative z-10 space-y-8">
                {/* Client Layer */}
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-4 text-center">Client Layer</div>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <ArchNode label="Web App" sublabel="Next.js 16 + React 19" icon={MonitorSmartphone} color="#059669" />
                    <ArchNode label="Mobile" sublabel="Responsive PWA" icon={MonitorSmartphone} color="#10B981" />
                    <ArchNode label="API" sublabel="REST + WebSocket" icon={Terminal} color="#0D9488" />
                  </div>
                </div>

                <VerticalConnector />

                {/* API Layer */}
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-4 text-center">API Layer</div>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 md:gap-0">
                    <ArchNode label="Next.js Routes" sublabel="App Router + RSC" icon={Code2} color="#059669" />
                    <ConnectorArrow />
                    <ArchNode label="Auth" sublabel="NextAuth.js v4" icon={Key} color="#10B981" />
                    <ConnectorArrow />
                    <ArchNode label="Rate Limiting" sublabel="Token Bucket" icon={Gauge} color="#0D9488" />
                  </div>
                </div>

                <VerticalConnector />

                {/* Business Logic Layer */}
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-4 text-center">Business Logic</div>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 md:gap-0">
                    <ArchNode label="Knowledge Engine" sublabel="Graph + CRUD" icon={Atom} color="#059669" />
                    <ConnectorArrow />
                    <ArchNode label="AI Engine" sublabel="BART + Embeddings" icon={Brain} color="#10B981" />
                    <ConnectorArrow />
                    <ArchNode label="Digest Engine" sublabel="Scheduler + Summaries" icon={Clock} color="#0D9488" />
                  </div>
                </div>

                <VerticalConnector />

                {/* Data Layer */}
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-4 text-center">Data Layer</div>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 md:gap-0">
                    <ArchNode label="Aurora DSQL" sublabel="Multi-Region Distributed SQL" icon={Database} color="#059669" isActive />
                  </div>
                </div>

                <VerticalConnector />

                {/* Infrastructure Layer */}
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-4 text-center">Infrastructure</div>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 md:gap-0">
                    <ArchNode label="AWS" sublabel="Multi-Region" icon={Cloud} color="#F59E0B" />
                    <ConnectorArrow />
                    <ArchNode label="Stripe" sublabel="Payments & Billing" icon={FileCheck} color="#059669" />
                    <ConnectorArrow />
                    <ArchNode label="Vercel" sublabel="Edge + Hosting" icon={Globe} color="#10B981" />
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </Section>

        {/* ═══ 3. WHY AURORA DSQL ═══ */}
        <Section id="aurora-dsql">
          <FadeIn>
            <div className="text-center mb-14">
              <div className="section-label mb-3">The Backbone</div>
              <h2 className="section-title">
                Why <span className="gradient-text">Aurora DSQL</span>
              </h2>
              <p className="section-subtitle mt-4 max-w-2xl mx-auto">
                Aurora DSQL is the foundation that makes LORE possible — providing serializable isolation
                across multiple AWS regions without the performance penalties of traditional distributed transactions.
              </p>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: 'Serializable Isolation',
                description: 'The highest isolation level in SQL. Every transaction executes as if it were the only one, even with hundreds of concurrent writes across regions.',
                color: '#059669',
              },
              {
                icon: Globe,
                title: 'Multi-Region Replication',
                description: 'Active-active replication across 3+ AWS regions. Writes in any region are immediately visible everywhere with serializable consistency.',
                color: '#10B981',
              },
              {
                icon: GitBranch,
                title: 'Zero Conflicts',
                description: 'Concurrent writes to the same entity are serialized automatically. No merge conflicts, no manual resolution, no data loss.',
                color: '#0D9488',
              },
              {
                icon: Database,
                title: 'SQL Compatibility',
                description: 'Fully PostgreSQL-compatible. Standard SQL for all operations, no proprietary query languages, no lock-in. Prisma ORM maps directly to DSQL.',
                color: '#059669',
              },
              {
                icon: Zap,
                title: 'Serverless Scaling',
                description: 'Automatically scales from zero to thousands of concurrent connections. No capacity planning, no provisioning, pay only for what you use.',
                color: '#10B981',
              },
              {
                icon: Clock,
                title: 'Sub-50ms Reads',
                description: 'Single-digit-millisecond read latency from any region. Your team gets instant responses regardless of where they are in the world.',
                color: '#0D9488',
              },
            ].map((benefit) => (
              <FadeIn key={benefit.title} delay={0.05}>
                <DSQLBenefitCard
                  icon={benefit.icon}
                  title={benefit.title}
                  description={benefit.description}
                  color={benefit.color}
                />
              </FadeIn>
            ))}
          </div>

          {/* Consistency Guarantee */}
          <FadeIn delay={0.2}>
            <div className="mt-10 glass-card rounded-2xl p-6 md:p-8 relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(5,150,105,0.3), transparent 70%)' }} />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-bold text-emerald-700 uppercase tracking-wide">Consistency Guarantee</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    'Every read sees the latest committed write',
                    'Concurrent transactions are fully serialized',
                    'No stale reads, no dirty reads, no phantom reads',
                    'Cross-region consistency in <200ms',
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-[13px] text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </Section>

        {/* ═══ 4. DATA FLOW ═══ */}
        <Section id="data-flow" className="bg-white/50">
          <FadeIn>
            <div className="text-center mb-14">
              <div className="section-label mb-3">How Data Moves</div>
              <h2 className="section-title">
                Data <span className="gradient-text">Flow</span>
              </h2>
              <p className="section-subtitle mt-4 max-w-2xl mx-auto">
                From the moment a user adds knowledge to the instant it appears in a Morning Digest,
                every step is designed for consistency and reliability.
              </p>
            </div>
          </FadeIn>

          <div className="max-w-2xl mx-auto">
            {[
              {
                step: 1,
                title: 'User adds knowledge',
                description: 'A team member creates or updates a knowledge entry through the web or mobile interface.',
                icon: MonitorSmartphone,
                color: '#059669',
              },
              {
                step: 2,
                title: 'API validates & processes',
                description: 'Next.js API Routes validate the input, apply business rules, and prepare the data for storage.',
                icon: Server,
                color: '#10B981',
              },
              {
                step: 3,
                title: 'Aurora DSQL stores consistently',
                description: 'The data is written to Aurora DSQL with serializable isolation, guaranteeing consistency across all regions.',
                icon: Database,
                color: '#0D9488',
              },
              {
                step: 4,
                title: 'AI engine links & enriches',
                description: 'BART-large-MNLI classifies the entry, embeddings are generated for semantic search, and relationships are automatically linked in the knowledge graph.',
                icon: Brain,
                color: '#059669',
              },
              {
                step: 5,
                title: 'Morning Digest delivers insights',
                description: 'The Digest Engine compiles relevant updates, connections, and insights, delivering them to each team member based on their role and interests.',
                icon: Clock,
                color: '#10B981',
              },
            ].map((item, i, arr) => (
              <FadeIn key={item.step} delay={i * 0.08}>
                <DataFlowStep
                  step={item.step}
                  title={item.title}
                  description={item.description}
                  icon={item.icon}
                  color={item.color}
                  isLast={i === arr.length - 1}
                />
              </FadeIn>
            ))}
          </div>
        </Section>

        {/* ═══ 5. TECH STACK ═══ */}
        <Section id="tech-stack">
          <FadeIn>
            <div className="text-center mb-14">
              <div className="section-label mb-3">Under the Hood</div>
              <h2 className="section-title">
                Tech <span className="gradient-text">Stack</span>
              </h2>
              <p className="section-subtitle mt-4 max-w-2xl mx-auto">
                Every technology choice serves a single purpose: making your team&apos;s knowledge as reliable as it deserves to be.
              </p>
            </div>
          </FadeIn>

          {/* Frontend */}
          <FadeIn delay={0.05}>
            <div className="mb-8">
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 mb-4 text-center">Frontend</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <TechIconCard name="Next.js 16" icon={Code2} category="Framework" color="#059669" />
                <TechIconCard name="React 19" icon={Atom} category="UI Library" color="#10B981" />
                <TechIconCard name="Tailwind CSS" icon={Layers} category="Styling" color="#0D9488" />
                <TechIconCard name="Framer Motion" icon={Zap} category="Animation" color="#059669" />
              </div>
            </div>
          </FadeIn>

          {/* Backend */}
          <FadeIn delay={0.1}>
            <div className="mb-8">
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 mb-4 text-center">Backend</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <TechIconCard name="Next.js API Routes" icon={Server} category="Server" color="#059669" />
                <TechIconCard name="Prisma ORM" icon={Database} category="Database Client" color="#10B981" />
                <TechIconCard name="z-ai-web-dev-sdk" icon={Brain} category="AI SDK" color="#0D9488" />
              </div>
            </div>
          </FadeIn>

          {/* Database */}
          <FadeIn delay={0.15}>
            <div className="mb-8">
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 mb-4 text-center">Database</div>
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 max-w-md mx-auto">
                <TechIconCard name="Aurora DSQL" icon={Database} category="Production" color="#059669" />
                <TechIconCard name="SQLite" icon={Binary} category="Development" color="#10B981" />
              </div>
            </div>
          </FadeIn>

          {/* Infrastructure */}
          <FadeIn delay={0.2}>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 mb-4 text-center">Infrastructure</div>
              <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
                <TechIconCard name="AWS" icon={Cloud} category="Cloud" color="#F59E0B" />
                <TechIconCard name="Vercel" icon={Globe} category="Hosting" color="#059669" />
                <TechIconCard name="Stripe" icon={FileCheck} category="Payments" color="#10B981" />
              </div>
            </div>
          </FadeIn>
        </Section>

        {/* ═══ 6. OPEN SOURCE ═══ */}
        <Section id="open-source" className="bg-white/50">
          <FadeIn>
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 mb-6">
                <Github className="w-4 h-4" />
                Open Source
              </div>
              <h2 className="section-title mb-4">
                LORE is <span className="gradient-text">open source</span>
              </h2>
              <p className="section-subtitle max-w-2xl mx-auto mb-8">
                We believe the best knowledge tools should be transparent and auditable. LORE&apos;s
                core is open source, so you can inspect every line of code, self-host if you prefer,
                and contribute to making team memory better for everyone.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  <Github className="w-4 h-4" />
                  View on GitHub
                </a>
                <Link href="/app" className="btn-secondary">
                  Try the Demo
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </FadeIn>
        </Section>
      </main>

      <Footer />
    </div>
  )
}
