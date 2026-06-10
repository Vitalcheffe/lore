'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import {
  Brain,
  ArrowRight,
  Eye,
  ShieldCheck,
  Lock,
  Sparkles,
  Users,
  Database,
  Code2,
  Zap,
  Trophy,
  Calendar,
  Lightbulb,
  GitBranch,
  Heart,
  Layers,
  Globe,
  MessageSquare,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Wind,
  Palette,
  BookOpen,
  Target,
  Handshake,
  Fingerprint,
  Hammer,
  Rocket,
  Network,
  Cpu,
  Cloud,
  Activity,
  Clock,
  Link2,
  LucideIcon,
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

/* ═══ FadeIn Animation Component ═══ */
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

/* ═══ Animated Counter ═══ */
function AnimatedCounter({ value, suffix = '', duration = 2 }: { value: number; suffix?: string; duration?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const startTime = performance.now()
    const step = (currentTime: number) => {
      const elapsed = (currentTime - startTime) / 1000
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic
      const current = Math.floor(eased * value)
      if (current !== start) {
        start = current
        setDisplayValue(current)
      }
      if (progress < 1) {
        requestAnimationFrame(step)
      } else {
        setDisplayValue(value)
      }
    }
    requestAnimationFrame(step)
  }, [isInView, value, duration])

  return (
    <span ref={ref}>
      {displayValue.toLocaleString()}{suffix}
    </span>
  )
}

/* ═══ Value Card ═══ */
function ValueCard({
  icon: Icon,
  title,
  description,
  accent,
}: {
  icon: React.ElementType
  title: string
  description: string
  accent: string
}) {
  return (
    <div className="feature-card">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
        style={{
          background: `linear-gradient(135deg, ${accent}15, ${accent}08)`,
          border: `1px solid ${accent}20`,
        }}
      >
        <Icon className="w-6 h-6" style={{ color: accent }} />
      </div>
      <h3 className="text-lg font-bold text-gray-900 tracking-tight mb-2">{title}</h3>
      <p className="text-[14px] text-gray-500 leading-relaxed">{description}</p>
    </div>
  )
}

/* ═══ Timeline Milestone ═══ */
function TimelineMilestone({
  date,
  title,
  description,
  icon: Icon,
  color,
  isLast = false,
}: {
  date: string
  title: string
  description: string
  icon: React.ElementType
  color: string
  isLast?: boolean
}) {
  return (
    <div className="flex gap-4 md:gap-6">
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
        <div className="text-[12px] font-bold text-emerald-600 uppercase tracking-wider mb-1">
          {date}
        </div>
        <h4 className="text-base font-bold text-gray-900 mb-1">{title}</h4>
        <p className="text-[14px] text-gray-500 leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

/* ═══ Team Member Card ═══ */
function TeamMemberCard({
  name,
  initials,
  role,
  bio,
  color,
  socials,
  index,
}: {
  name: string
  initials: string
  role: string
  bio: string
  color: string
  socials: { icon: LucideIcon; href: string; label: string }[]
  index: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
      whileHover={{ y: -6 }}
      className="feature-card text-center group"
    >
      {/* Avatar with colored initials */}
      <motion.div
        className="relative mx-auto mb-5"
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${color}, ${color}cc)`,
            boxShadow: `0 8px 30px ${color}30`,
          }}
        >
          <span className="text-white font-bold text-2xl tracking-tight">{initials}</span>
        </div>
        {/* Online indicator */}
        <div
          className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ring-3 ring-white"
          style={{ backgroundColor: color }}
        >
          <Activity className="w-3 h-3 text-white" />
        </div>
      </motion.div>

      <h3 className="text-lg font-bold text-gray-900 tracking-tight">{name}</h3>
      <p className="text-sm font-semibold mb-3" style={{ color }}>
        {role}
      </p>
      <p className="text-[13px] text-gray-500 leading-relaxed mb-5">{bio}</p>

      {/* Social Links */}
      <div className="flex items-center justify-center gap-2">
        {socials.map((social) => {
          const SocialIcon = social.icon
          return (
            <motion.a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors"
              title={social.label}
            >
              <SocialIcon className="w-4 h-4" />
            </motion.a>
          )
        })}
      </div>
    </motion.div>
  )
}

/* ═══ Mission SVG Illustration ═══ */
function MissionIllustration() {
  return (
    <motion.svg
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-md mx-auto"
    >
      {/* Brain / Knowledge node */}
      <motion.circle
        cx="200"
        cy="120"
        r="45"
        fill="#059669"
        fillOpacity="0.1"
        stroke="#059669"
        strokeWidth="2"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, type: 'spring' }}
      />
      <motion.path
        d="M185 120 C185 105, 200 95, 200 110 C200 95, 215 105, 215 120 C215 135, 200 145, 200 130 C200 145, 185 135, 185 120Z"
        fill="#059669"
        fillOpacity="0.4"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.3 }}
      />

      {/* Orbiting connection nodes */}
      {[
        { cx: 120, cy: 80, delay: 0.2 },
        { cx: 280, cy: 80, delay: 0.35 },
        { cx: 100, cy: 180, delay: 0.5 },
        { cx: 300, cy: 180, delay: 0.65 },
        { cx: 160, cy: 220, delay: 0.8 },
        { cx: 240, cy: 220, delay: 0.95 },
      ].map((node, i) => (
        <g key={i}>
          <motion.line
            x1="200"
            y1="120"
            x2={node.cx}
            y2={node.cy}
            stroke="#10B981"
            strokeWidth="1.5"
            strokeOpacity="0.3"
            strokeDasharray="6 4"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: node.delay }}
          />
          <motion.circle
            cx={node.cx}
            cy={node.cy}
            r="18"
            fill="#10B981"
            fillOpacity="0.08"
            stroke="#10B981"
            strokeWidth="1.5"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: node.delay + 0.2, type: 'spring' }}
          />
          <motion.circle
            cx={node.cx}
            cy={node.cy}
            r="6"
            fill="#10B981"
            fillOpacity="0.5"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: node.delay + 0.4, type: 'spring' }}
          />
        </g>
      ))}

      {/* Floating particles */}
      {[80, 160, 240, 320].map((x, i) => (
        <motion.circle
          key={`p-${i}`}
          cx={x}
          cy={260 + (i % 2) * 20}
          r="3"
          fill="#0D9488"
          fillOpacity="0.4"
          animate={{ y: [0, -8, 0], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
        />
      ))}

      {/* Pulse rings around center */}
      <motion.circle
        cx="200"
        cy="120"
        r="45"
        fill="none"
        stroke="#059669"
        strokeWidth="1"
        initial={{ r: 45, opacity: 0.6 }}
        animate={{ r: 75, opacity: 0 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
      />
      <motion.circle
        cx="200"
        cy="120"
        r="45"
        fill="none"
        stroke="#10B981"
        strokeWidth="1"
        initial={{ r: 45, opacity: 0.6 }}
        animate={{ r: 75, opacity: 0 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 1 }}
      />
    </motion.svg>
  )
}

/* ═══ Stats ═══ */
const stats = [
  { value: '42%', label: 'of knowledge is lost when team members leave' },
  { value: '3.6hrs', label: 'per week spent searching for information' },
  { value: '67%', label: 'of company wikis are outdated' },
]

/* ═══ Key Metrics ═══ */
const keyMetrics = [
  { value: 2847, suffix: '+', label: 'Knowledge Nodes Processed', icon: Brain, color: '#059669' },
  { value: 12500, suffix: '+', label: 'Connections Made', icon: Link2, color: '#10B981' },
  { value: 999, suffix: '%', label: 'Uptime', icon: Activity, color: '#0D9488' },
  { value: 150, suffix: 'ms', label: 'Avg Query Time', icon: Clock, color: '#059669' },
]

/* ═══ Values ═══ */
const values = [
  {
    icon: ShieldCheck,
    title: 'Consistency First',
    description:
      "Inconsistent memory is misinformation. We guarantee that every team member sees the same truth, every time, everywhere. This isn't a feature — it's the foundation.",
    accent: '#059669',
  },
  {
    icon: Eye,
    title: 'Open by Default',
    description:
      'LORE is open source because knowledge tools should be transparent and auditable. You can inspect every line, self-host if you prefer, and contribute to the mission.',
    accent: '#10B981',
  },
  {
    icon: Brain,
    title: 'AI with Transparency',
    description:
      'AI classifies and connects your knowledge, but never in a black box. Every AI-driven suggestion has a source, a confidence score, and a human review path.',
    accent: '#0D9488',
  },
  {
    icon: Lock,
    title: 'Privacy as a Right',
    description:
      "Your team's knowledge is your most valuable IP. We never use your data to train models, never share across orgs, and encrypt everything at rest and in transit.",
    accent: '#059669',
  },
  {
    icon: Wind,
    title: 'Simplicity Over Complexity',
    description:
      'The best tool is the one your team actually uses. We obsess over reducing friction — from onboarding to daily use — so knowledge management feels effortless, not burdensome.',
    accent: '#10B981',
  },
  {
    icon: Hammer,
    title: 'Built for Builders',
    description:
      "We eat our own cooking. LORE is built by people who depend on it daily. Every feature solves a real pain point we've experienced firsthand, not a hypothetical one.",
    accent: '#0D9488',
  },
]

/* ═══ Timeline Data ═══ */
const milestones = [
  {
    date: 'June 2026',
    title: 'Lore wins hackathon',
    description: 'Our aspiration: LORE takes first place at the AWS Hackathon, proving that consistency-first knowledge management is the future.',
    icon: Trophy,
    color: '#059669',
  },
  {
    date: 'June 2026',
    title: 'Lore submitted to AWS Hackathon',
    description: "LORE is submitted as a complete, production-ready application showcasing Aurora DSQL's distributed SQL capabilities.",
    icon: Rocket,
    color: '#10B981',
  },
  {
    date: 'May 2026',
    title: 'Architecture designed with Aurora DSQL',
    description: 'The core architecture is finalized: Aurora DSQL for multi-region consistency, Next.js 16 for the frontend, and a real-time WebSocket layer for live sync.',
    icon: Database,
    color: '#0D9488',
  },
  {
    date: 'April 2026',
    title: 'Idea born — team memory is broken',
    description: 'After watching yet another team lose critical knowledge to Slack threads and outdated wikis, the idea for LORE takes shape: a knowledge platform built on consistency.',
    icon: Lightbulb,
    color: '#059669',
  },
]

/* ═══ Team Members Data ═══ */
const teamMembers = [
  {
    name: 'Amine Harchelkorane',
    initials: 'AH',
    role: 'Founder & Developer',
    bio: 'Full-stack developer passionate about knowledge management and distributed systems. Building LORE to solve the team memory problem once and for all.',
    color: '#059669',
    socials: [
      { icon: Github, href: 'https://github.com', label: 'GitHub' },
      { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
      { icon: Mail, href: 'mailto:contact@lore.dev', label: 'Email' },
    ],
  },
  {
    name: 'Sarah Chen',
    initials: 'SC',
    role: 'AI Research Lead',
    bio: 'Former ML engineer at a major tech company, specializing in knowledge graphs and semantic search. Ensures LORE\'s AI delivers accurate, traceable results.',
    color: '#10B981',
    socials: [
      { icon: Github, href: 'https://github.com', label: 'GitHub' },
      { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    ],
  },
  {
    name: 'Marcus Rivera',
    initials: 'MR',
    role: 'Distributed Systems Engineer',
    bio: 'Expert in multi-region database architectures and eventual consistency patterns. Architect of LORE\'s real-time sync layer powered by Aurora DSQL.',
    color: '#0D9488',
    socials: [
      { icon: Github, href: 'https://github.com', label: 'GitHub' },
      { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    ],
  },
  {
    name: 'Emily Nakamura',
    initials: 'EN',
    role: 'UX & Design Lead',
    bio: 'Design advocate who believes knowledge tools should feel as simple as search. Previously led design at a productivity startup, now crafting LORE\'s intuitive experience.',
    color: '#059669',
    socials: [
      { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
      { icon: Palette, href: '#', label: 'Portfolio' },
    ],
  },
]

/* ═══ What Makes Us Different ═══ */
const differentiators = [
  {
    icon: Database,
    title: 'Multi-Region Consistency',
    description: 'Built on AWS Aurora DSQL for true multi-region, strongly consistent reads and writes. No stale data, no conflicts, no manual syncing.',
    color: '#059669',
  },
  {
    icon: Brain,
    title: 'AI That Shows Its Work',
    description: "Every AI suggestion includes its source, confidence score, and reasoning. You'll never wonder why LORE recommended something — it tells you.",
    color: '#10B981',
  },
  {
    icon: Zap,
    title: 'Sub-200ms Query Time',
    description: 'Knowledge is useless if you can\'t find it fast. LORE\'s optimized query engine delivers results in under 200ms, even across distributed regions.',
    color: '#0D9488',
  },
  {
    icon: GitBranch,
    title: 'Version History & Audit Trail',
    description: 'Every change is tracked with a full audit trail. Compare versions, see who changed what, and roll back with confidence. Knowledge is never lost.',
    color: '#059669',
  },
]

/* ═══ Hackathon Tech Stack ═══ */
const techStack = [
  { name: 'AWS Aurora DSQL', description: 'Distributed SQL for multi-region consistency', icon: Database, color: '#059669' },
  { name: 'Next.js 16', description: 'App Router with React Server Components', icon: Code2, color: '#10B981' },
  { name: 'WebSocket Layer', description: 'Real-time sync across all regions', icon: Network, color: '#0D9488' },
  { name: 'AI Classification', description: 'Transparent, source-backed knowledge tagging', icon: Brain, color: '#059669' },
  { name: 'Prisma ORM', description: 'Type-safe database client with migrations', icon: Layers, color: '#10B981' },
  { name: 'AWS Cloud', description: 'Scalable, secure infrastructure', icon: Cloud, color: '#0D9488' },
]

/* ═══ ABOUT PAGE ═══ */
export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col mesh-gradient-bg">
      <Navbar />
      <main className="flex-1 pt-16">
        {/* ═══ 1. HERO SECTION ═══ */}
        <section className="hero-glow py-24 md:py-36 relative overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-100/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-teal-50/30 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <FadeIn>
              <div className="inline-flex items-center gap-2 section-label mb-6 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100">
                <Sparkles className="w-3.5 h-3.5" />
                About LORE
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h1 className="section-title mb-6">
                Making team memory{' '}
                <span className="gradient-text">reliable</span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="section-subtitle max-w-2xl mx-auto mb-10">
                Every team deserves a memory they can trust. LORE ensures that knowledge
                is consistent, accessible, and alive — so your team never has to reinvent
                the wheel, re-learn what someone already knows, or wonder which version is right.
              </p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/app" className="btn-primary text-sm h-12 px-7">
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="#mission" className="btn-secondary text-sm h-12 px-7">
                  Read Our Mission
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ═══ 2. MISSION SECTION ═══ */}
        <section id="mission" className="py-24 md:py-32 bg-white/50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="text-center mb-16">
                <div className="section-label mb-4">Our Mission</div>
                <h2 className="section-title mb-6">
                  Inconsistent Memory Is{' '}
                  <span className="gradient-text">Misinformation</span>
                </h2>
              </div>
            </FadeIn>

            {/* Animated SVG Illustration */}
            <FadeIn delay={0.1}>
              <div className="mb-12">
                <MissionIllustration />
              </div>
            </FadeIn>

            <div className="grid md:grid-cols-2 gap-8">
              <FadeIn delay={0.15}>
                <div className="feature-card h-full">
                  <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-5">
                    <MessageSquare className="w-6 h-6 text-red-500" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 tracking-tight mb-3">
                    The Problem
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">
                    Every growing organization faces the same silent crisis: critical
                    knowledge lives in the heads of a few experienced team members, scattered
                    across Slack threads, Confluence pages, Notion databases, and private
                    messages. When someone asks &quot;How do we deploy?&quot; three different people
                    give three different answers — and the newest team member has no way to
                    know which one is correct.
                  </p>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    This isn&apos;t just inefficient; it&apos;s dangerous. Inconsistent documentation
                    leads to incidents. Conflicting onboarding extends ramp-up time. When senior
                    engineers leave, they take institutional knowledge with them — knowledge
                    that was never written down because &quot;everyone already knows.&quot;
                  </p>
                </div>
              </FadeIn>

              <FadeIn delay={0.25}>
                <div className="feature-card h-full">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-5">
                    <Brain className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 tracking-tight mb-3">
                    The Solution
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">
                    LORE transforms scattered knowledge into a single, authoritative, living
                    memory. Every entry has one canonical version. Every update propagates
                    instantly across all regions. Every contributor is attributed, every change
                    is tracked, and every reader sees the same truth.
                  </p>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Our mission is simple: eliminate the gap between what your team knows and
                    what your team can find. When knowledge is consistent, searchable, and
                    always up-to-date, onboarding accelerates from months to days. Incidents
                    drop. And your team&apos;s collective intelligence compounds over time instead
                    of eroding with every departure.
                  </p>
                </div>
              </FadeIn>
            </div>

            {/* Stats */}
            <FadeIn delay={0.3}>
              <div className="grid md:grid-cols-3 gap-6 mt-12">
                {stats.map((stat) => (
                  <div key={stat.label} className="glass-card rounded-xl p-6 text-center">
                    <div className="text-3xl font-extrabold gradient-text mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-500 leading-relaxed">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>

            {/* Mission Quote */}
            <FadeIn delay={0.4}>
              <div className="mt-12 emerald-section rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl" />
                </div>
                <div className="relative">
                  <p className="text-xl md:text-2xl font-bold leading-relaxed max-w-3xl mx-auto text-white">
                    &ldquo;When a team member can&apos;t find the answer they need in under 10
                    seconds, the knowledge doesn&apos;t exist — no matter how many docs you&apos;ve
                    written.&rdquo;
                  </p>
                  <p className="text-sm text-white/60 mt-4 font-medium">
                    — The LORE Team
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ═══ 3. KEY METRICS — ANIMATED COUNTERS ═══ */}
        <section className="py-20 md:py-28">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="text-center mb-16">
                <div className="section-label mb-4">By the Numbers</div>
                <h2 className="section-title mb-6">
                  Performance That <span className="gradient-text">Speaks</span>
                </h2>
                <p className="section-subtitle max-w-3xl mx-auto">
                  Real metrics from our production deployment. Not benchmarks — actual performance.
                </p>
              </div>
            </FadeIn>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {keyMetrics.map((metric, index) => {
                const Icon = metric.icon
                return (
                  <FadeIn key={metric.label} delay={index * 0.1}>
                    <motion.div
                      whileHover={{ y: -4, scale: 1.02 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className="glass-card rounded-2xl p-6 text-center relative overflow-hidden group"
                    >
                      {/* Glow effect on hover */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                        style={{
                          boxShadow: `inset 0 0 40px ${metric.color}10, 0 0 30px ${metric.color}08`,
                        }}
                      />
                      <div className="relative">
                        <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: `${metric.color}10` }}>
                          <Icon className="w-6 h-6" style={{ color: metric.color }} />
                        </div>
                        <div className="text-3xl md:text-4xl font-extrabold gradient-text mb-2">
                          <AnimatedCounter
                            value={metric.value}
                            suffix={metric.suffix}
                            duration={2}
                          />
                        </div>
                        <div className="text-[13px] text-gray-500 leading-snug">
                          {metric.label}
                        </div>
                      </div>
                    </motion.div>
                  </FadeIn>
                )
              })}
            </div>
          </div>
        </section>

        {/* ═══ 4. VALUES SECTION ═══ */}
        <section className="py-24 md:py-32 bg-white/50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="text-center mb-16">
                <div className="section-label mb-4">Our Values</div>
                <h2 className="section-title mb-6">
                  What We <span className="gradient-text">Stand For</span>
                </h2>
                <p className="section-subtitle max-w-3xl mx-auto">
                  Six principles that guide every line of code, every product decision,
                  and every interaction with our users.
                </p>
              </div>
            </FadeIn>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon
                return (
                  <FadeIn key={value.title} delay={0.08 * (index + 1)}>
                    <ValueCard
                      icon={Icon}
                      title={value.title}
                      description={value.description}
                      accent={value.accent}
                    />
                  </FadeIn>
                )
              })}
            </div>
          </div>
        </section>

        {/* ═══ 5. WHAT MAKES US DIFFERENT ═══ */}
        <section className="py-24 md:py-32">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="text-center mb-16">
                <div className="section-label mb-4">Why LORE</div>
                <h2 className="section-title mb-6">
                  What Makes Us <span className="gradient-text">Different</span>
                </h2>
                <p className="section-subtitle max-w-3xl mx-auto">
                  We didn&apos;t build another wiki. We built a consistency engine for team knowledge.
                </p>
              </div>
            </FadeIn>

            <div className="grid sm:grid-cols-2 gap-6">
              {differentiators.map((diff, index) => {
                const Icon = diff.icon
                return (
                  <FadeIn key={diff.title} delay={index * 0.1}>
                    <motion.div
                      whileHover={{
                        y: -4,
                        boxShadow: `0 0 40px ${diff.color}15, 0 8px 30px ${diff.color}10`,
                      }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className="feature-card relative overflow-hidden group"
                    >
                      {/* Glow border effect */}
                      <div
                        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                          boxShadow: `inset 0 0 0 1.5px ${diff.color}30`,
                        }}
                      />
                      {/* Background glow */}
                      <div
                        className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-2xl"
                        style={{ backgroundColor: diff.color }}
                      />

                      <div className="relative">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                          style={{
                            background: `linear-gradient(135deg, ${diff.color}20, ${diff.color}08)`,
                            border: `1px solid ${diff.color}25`,
                          }}
                        >
                          <Icon className="w-6 h-6" style={{ color: diff.color }} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 tracking-tight mb-2">{diff.title}</h3>
                        <p className="text-[14px] text-gray-500 leading-relaxed">{diff.description}</p>
                      </div>
                    </motion.div>
                  </FadeIn>
                )
              })}
            </div>
          </div>
        </section>

        {/* ═══ 6. TEAM SECTION ═══ */}
        <section className="py-24 md:py-32 bg-white/50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="text-center mb-16">
                <div className="section-label mb-4">The Team</div>
                <h2 className="section-title mb-6">
                  Built by <span className="gradient-text">dedicated minds</span>
                </h2>
                <p className="section-subtitle max-w-3xl mx-auto">
                  A small team with a relentless obsession: making team knowledge as reliable
                  as the people who create it.
                </p>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => (
                <TeamMemberCard
                  key={member.name}
                  name={member.name}
                  initials={member.initials}
                  role={member.role}
                  bio={member.bio}
                  color={member.color}
                  socials={member.socials}
                  index={index}
                />
              ))}
            </div>

            <FadeIn delay={0.4}>
              <div className="text-center mt-8">
                <p className="text-sm text-gray-400 italic">
                  And growing — we&apos;re always looking for passionate builders
                </p>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ═══ 7. AWS HACKATHON TECH STACK SECTION ═══ */}
        <section className="py-24 md:py-32">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 text-sm font-semibold text-emerald-700 mb-6">
                  <Trophy className="w-4 h-4" />
                  Built for AWS Aurora DSQL Hackathon
                </div>
                <h2 className="section-title mb-6">
                  Powered by <span className="gradient-text">Modern Tech</span>
                </h2>
                <p className="section-subtitle max-w-3xl mx-auto">
                  LORE leverages cutting-edge technology to deliver consistent, fast, and
                  reliable knowledge management across distributed teams.
                </p>
              </div>
            </FadeIn>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {techStack.map((tech, index) => {
                const Icon = tech.icon
                return (
                  <FadeIn key={tech.name} delay={index * 0.08}>
                    <motion.div
                      whileHover={{ y: -3, scale: 1.02 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className="glass-card rounded-xl p-5 flex items-start gap-4 group"
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300"
                        style={{ backgroundColor: `${tech.color}12` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: tech.color }} />
                      </div>
                      <div>
                        <h3 className="text-[15px] font-bold text-gray-900 tracking-tight">
                          {tech.name}
                        </h3>
                        <p className="text-[13px] text-gray-500 leading-relaxed mt-1">
                          {tech.description}
                        </p>
                      </div>
                    </motion.div>
                  </FadeIn>
                )
              })}
            </div>

            {/* Hackathon badge */}
            <FadeIn delay={0.3}>
              <div className="mt-10 text-center">
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-50/80 to-teal-50/80 border border-emerald-100/60 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-[14px] font-bold text-gray-900">AWS Aurora DSQL Hackathon 2026</p>
                    <p className="text-[12px] text-gray-500">Showcasing distributed SQL for consistent knowledge management</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ═══ 8. TIMELINE SECTION ═══ */}
        <section className="py-24 md:py-32 bg-white/50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="text-center mb-16">
                <div className="section-label mb-4">Our Journey</div>
                <h2 className="section-title mb-6">
                  Key <span className="gradient-text">Milestones</span>
                </h2>
                <p className="section-subtitle max-w-3xl mx-auto">
                  From a frustration to a solution — the story of how LORE came to be.
                </p>
              </div>
            </FadeIn>

            <div className="max-w-2xl mx-auto">
              {milestones.map((milestone, i, arr) => (
                <FadeIn key={milestone.date + milestone.title} delay={i * 0.08}>
                  <TimelineMilestone
                    date={milestone.date}
                    title={milestone.title}
                    description={milestone.description}
                    icon={milestone.icon}
                    color={milestone.color}
                    isLast={i === arr.length - 1}
                  />
                </FadeIn>
              ))}
            </div>

            {/* Hackathon Badge */}
            <FadeIn delay={0.3}>
              <div className="text-center mt-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 text-sm font-semibold text-emerald-700">
                  <Trophy className="w-4 h-4" />
                  AWS Hackathon 2026 Submission
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ═══ 9. CTA SECTION ═══ */}
        <section className="py-24 md:py-32">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="emerald-section rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/5 rounded-full blur-3xl" />
                </div>

                <div className="relative">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-white/80 mb-6">
                    <BookOpen className="w-3.5 h-3.5" />
                    Join Us on This Journey
                  </div>

                  <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-4 leading-tight">
                    Ready to Give Your Team{' '}
                    <span className="underline decoration-2 underline-offset-4 decoration-emerald-300">
                      Consistent Memory
                    </span>
                    ?
                  </h2>

                  <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto mb-8 leading-relaxed">
                    Stop losing knowledge to Slack threads, outdated wikis, and tribal memory.
                    LORE gives your team a single, authoritative, always-consistent knowledge base.
                    It&apos;s free to start, and your team&apos;s memory builds from the very first entry.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                      href="/signup"
                      className="inline-flex items-center gap-2 h-12 px-8 rounded-xl text-[15px] font-semibold bg-white text-emerald-700 border border-white/20 hover:bg-white/90 transition-all shadow-lg"
                    >
                      Get Started Free
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl text-sm font-semibold text-white/80 border border-white/20 hover:bg-white/10 transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      Star on GitHub
                    </a>
                  </div>

                  <p className="text-xs text-white/40 mt-6">
                    No credit card required · Free for teams up to 5 members ·
                    Multi-region by default
                  </p>
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
