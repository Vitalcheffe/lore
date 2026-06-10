'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'
import {
  ArrowRight,
  Brain,
  Network,
  Sparkles,
  Check,
  ChevronDown,
  Zap,
  Shield,
  Users,
  BarChart3,
  Database,
  MessageSquare,
  Search,
  Sun,
  BookOpen,
  Cloud,
  Server,
  GitBranch,
  Link2,
  Eye,
  Activity,
  Key,
  Lock,
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

// ─── FadeIn on scroll ──────────────────────────────────────
function FadeIn({ children, className = '', delay = 0, duration = 0.5 }: { children: React.ReactNode; className?: string; delay?: number; duration?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── Animated Counter ──────────────────────────────────────
function AnimatedCounter({ target, suffix = '', prefix = '', duration = 2 }: { target: number; suffix?: string; prefix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const motionVal = useMotionValue(0)
  const rounded = useTransform(motionVal, (latest) => {
    if (target >= 1000) return Math.round(latest).toLocaleString()
    if (Number.isInteger(target)) return Math.round(latest).toString()
    return latest.toFixed(1)
  })
  const [display, setDisplay] = useState('0')

  useEffect(() => {
    if (isInView) {
      const controls = animate(motionVal, target, { duration, ease: [0.25, 0.46, 0.45, 0.94] })
      return controls.stop
    }
  }, [isInView, motionVal, target, duration])

  useEffect(() => {
    const unsubscribe = rounded.on('change', (v) => setDisplay(v))
    return unsubscribe
  }, [rounded])

  return <span ref={ref}>{prefix}{display}{suffix}</span>
}

// ─── Knowledge Graph SVG ──────────────────────────────────────
function KnowledgeGraphSVG() {
  return (
    <svg viewBox="0 0 400 300" className="w-full h-auto" fill="none">
      {/* Edges */}
      <line x1="80" y1="80" x2="200" y2="150" stroke="#D1FAE5" strokeWidth="2" />
      <line x1="200" y1="150" x2="320" y2="90" stroke="#D1FAE5" strokeWidth="2" />
      <line x1="200" y1="150" x2="130" y2="240" stroke="#D1FAE5" strokeWidth="2" />
      <line x1="200" y1="150" x2="290" y2="230" stroke="#D1FAE5" strokeWidth="2" />
      <line x1="80" y1="80" x2="130" y2="240" stroke="#A7F3D0" strokeWidth="1.5" />
      <line x1="320" y1="90" x2="290" y2="230" stroke="#A7F3D0" strokeWidth="1.5" />
      <line x1="80" y1="80" x2="50" y2="170" stroke="#D1FAE5" strokeWidth="1.5" />
      <line x1="320" y1="90" x2="370" y2="170" stroke="#D1FAE5" strokeWidth="1.5" />
      {/* Animated pulse dots on edges */}
      <circle r="3" fill="#10B981">
        <animateMotion dur="3s" repeatCount="indefinite" path="M80,80 L200,150" />
      </circle>
      <circle r="3" fill="#10B981">
        <animateMotion dur="4s" repeatCount="indefinite" path="M200,150 L320,90" />
      </circle>
      <circle r="3" fill="#0D9488">
        <animateMotion dur="3.5s" repeatCount="indefinite" path="M200,150 L290,230" />
      </circle>
      {/* Nodes */}
      <circle cx="80" cy="80" r="18" fill="#10B981" opacity="0.9" />
      <circle cx="200" cy="150" r="24" fill="#059669" opacity="0.95" />
      <circle cx="320" cy="90" r="15" fill="#34D399" opacity="0.8" />
      <circle cx="130" cy="240" r="16" fill="#0D9488" opacity="0.85" />
      <circle cx="290" cy="230" r="13" fill="#14B8A6" opacity="0.75" />
      <circle cx="50" cy="170" r="10" fill="#6EE7B7" opacity="0.7" />
      <circle cx="370" cy="170" r="10" fill="#6EE7B7" opacity="0.7" />
      {/* Node labels */}
      <text x="80" y="84" textAnchor="middle" fill="white" fontSize="9" fontWeight="600">API</text>
      <text x="200" y="154" textAnchor="middle" fill="white" fontSize="10" fontWeight="700">Core</text>
      <text x="320" y="94" textAnchor="middle" fill="white" fontSize="8" fontWeight="600">Auth</text>
      <text x="130" y="244" textAnchor="middle" fill="white" fontSize="8" fontWeight="600">Data</text>
      <text x="290" y="234" textAnchor="middle" fill="white" fontSize="7" fontWeight="600">AI</text>
    </svg>
  )
}

// ─── Mini Feature SVG Previews ──────────────────────────────
function GraphMiniSVG() {
  return (
    <svg viewBox="0 0 120 80" className="w-full h-auto" fill="none">
      <line x1="30" y1="25" x2="60" y2="45" stroke="#A7F3D0" strokeWidth="1.5" />
      <line x1="60" y1="45" x2="95" y2="30" stroke="#A7F3D0" strokeWidth="1.5" />
      <line x1="60" y1="45" x2="45" y2="65" stroke="#A7F3D0" strokeWidth="1.5" />
      <line x1="60" y1="45" x2="90" y2="60" stroke="#A7F3D0" strokeWidth="1.5" />
      <circle cx="30" cy="25" r="7" fill="#10B981" opacity="0.9" />
      <circle cx="60" cy="45" r="9" fill="#059669" />
      <circle cx="95" cy="30" r="6" fill="#34D399" opacity="0.8" />
      <circle cx="45" cy="65" r="6" fill="#0D9488" opacity="0.8" />
      <circle cx="90" cy="60" r="5" fill="#14B8A6" opacity="0.7" />
    </svg>
  )
}

function DigestMiniSVG() {
  return (
    <svg viewBox="0 0 120 80" className="w-full h-auto" fill="none">
      <rect x="10" y="10" width="100" height="60" rx="6" fill="#ECFDF5" stroke="#A7F3D0" strokeWidth="1" />
      <rect x="18" y="20" width="50" height="4" rx="2" fill="#059669" opacity="0.6" />
      <rect x="18" y="30" width="70" height="3" rx="1.5" fill="#D1FAE5" />
      <rect x="18" y="38" width="55" height="3" rx="1.5" fill="#D1FAE5" />
      <rect x="18" y="46" width="65" height="3" rx="1.5" fill="#D1FAE5" />
      <circle cx="95" cy="25" r="8" fill="#10B981" opacity="0.3" />
      <Sun x="89" y="19" width="12" height="12" fill="#059669" opacity="0.7" />
    </svg>
  )
}

function ChatMiniSVG() {
  return (
    <svg viewBox="0 0 120 80" className="w-full h-auto" fill="none">
      <rect x="8" y="8" width="60" height="22" rx="8" fill="#059669" opacity="0.15" />
      <rect x="14" y="16" width="35" height="3" rx="1.5" fill="#059669" opacity="0.5" />
      <rect x="52" y="38" width="60" height="28" rx="8" fill="#ECFDF5" stroke="#A7F3D0" strokeWidth="1" />
      <rect x="58" y="46" width="40" height="3" rx="1.5" fill="#A7F3D0" />
      <rect x="58" y="53" width="30" height="3" rx="1.5" fill="#D1FAE5" />
    </svg>
  )
}

function MemoryMiniSVG() {
  return (
    <svg viewBox="0 0 120 80" className="w-full h-auto" fill="none">
      <rect x="15" y="10" width="90" height="60" rx="6" fill="#ECFDF5" stroke="#A7F3D0" strokeWidth="1" />
      <rect x="22" y="18" width="30" height="35" rx="4" fill="#D1FAE5" />
      <rect x="26" y="23" width="22" height="3" rx="1.5" fill="#059669" opacity="0.4" />
      <rect x="26" y="30" width="18" height="2" rx="1" fill="#A7F3D0" />
      <rect x="26" y="35" width="20" height="2" rx="1" fill="#A7F3D0" />
      <rect x="26" y="40" width="16" height="2" rx="1" fill="#A7F3D0" />
      <rect x="58" y="18" width="40" height="14" rx="4" fill="#D1FAE5" />
      <rect x="62" y="23" width="25" height="3" rx="1.5" fill="#059669" opacity="0.4" />
      <rect x="58" y="38" width="40" height="14" rx="4" fill="#D1FAE5" />
      <rect x="62" y="43" width="20" height="3" rx="1.5" fill="#059669" opacity="0.4" />
      <rect x="58" y="58" width="40" height="6" rx="3" fill="#10B981" opacity="0.2" />
    </svg>
  )
}

// ═══════════════════════════════════════════════════════════════
// FEATURE DATA
// ═══════════════════════════════════════════════════════════════
const features = [
  {
    icon: Network,
    title: 'Knowledge Graph',
    subtitle: 'See every connection',
    desc: 'Visualize how every piece of knowledge connects. Dependencies, relationships, and impact — mapped instantly in an interactive graph that evolves with your team.',
    color: '#059669',
    bgColor: 'rgba(5,150,105,0.08)',
    svgPreview: <GraphMiniSVG />,
  },
  {
    icon: Sun,
    title: 'Morning Digest',
    subtitle: 'Start every day with clarity',
    desc: 'Wake up to a personalized briefing on what changed, what\'s relevant, and what needs your attention. Never miss a critical update again.',
    color: '#0D9488',
    bgColor: 'rgba(13,148,136,0.08)',
    svgPreview: <DigestMiniSVG />,
  },
  {
    icon: MessageSquare,
    title: 'AI Chat',
    subtitle: 'Ask anything about your knowledge',
    desc: 'Ask in natural language. Lore finds the answer from your team\'s collective memory — with sources and confidence scores.',
    color: '#10B981',
    bgColor: 'rgba(16,185,129,0.08)',
    svgPreview: <ChatMiniSVG />,
  },
  {
    icon: BookOpen,
    title: 'Structured Memory',
    subtitle: 'Never lose a thought',
    desc: 'Every fact, decision, and context is captured and organized automatically. No more "where did we decide that?"',
    color: '#047857',
    bgColor: 'rgba(4,120,87,0.08)',
    svgPreview: <MemoryMiniSVG />,
  },
]

// ═══════════════════════════════════════════════════════════════
// HOW IT WORKS DATA
// ═══════════════════════════════════════════════════════════════
const steps = [
  {
    step: '01',
    icon: Link2,
    title: 'Connect Your Knowledge',
    desc: 'Integrate with Slack, Notion, GitHub, and more. Lore listens to your team\'s conversations, documents, and decisions — zero friction, zero config.',
    color: '#10B981',
    bgColor: 'rgba(16,185,129,0.08)',
  },
  {
    step: '02',
    icon: Network,
    title: 'Watch It Connect',
    desc: 'Raw information becomes structured knowledge. Relationships are mapped, entities are linked, and context is preserved in a living knowledge graph.',
    color: '#059669',
    bgColor: 'rgba(5,150,105,0.08)',
  },
  {
    step: '03',
    icon: Sparkles,
    title: 'Ask Anything',
    desc: 'Ask in natural language and get instant answers from your team\'s memory — complete with sources and confidence scores. AI-powered recall that understands context.',
    color: '#0D9488',
    bgColor: 'rgba(13,148,136,0.08)',
  },
]

// ═══════════════════════════════════════════════════════════════
// STATS DATA
// ═══════════════════════════════════════════════════════════════
const stats = [
  { value: 500, suffix: '+', label: 'Teams', icon: Users },
  { value: 10000, suffix: '+', label: 'Knowledge Nodes', icon: Network },
  { value: 99.9, suffix: '%', label: 'Uptime', icon: Shield },
]

// ═══════════════════════════════════════════════════════════════
// PROBLEM PAIN POINTS
// ═══════════════════════════════════════════════════════════════
const painPoints = [
  {
    icon: MessageSquare,
    title: 'Miscommunication costs',
    desc: 'Teams waste 3.6 hours per week searching for information that should be instant. Critical decisions buried in Slack threads, never surfaced again.',
    stat: '3.6 hrs',
    statLabel: 'wasted per week searching',
  },
  {
    icon: Search,
    title: 'Lost knowledge',
    desc: '42% of organizational knowledge is undocumented. When key people leave, their context walks out the door with them.',
    stat: '42%',
    statLabel: 'of knowledge is undocumented',
  },
  {
    icon: Database,
    title: 'Siloed information',
    desc: '67% of wiki content is outdated. Knowledge scattered across tools that don\'t talk to each other creates a fractured team memory.',
    stat: '67%',
    statLabel: 'of wiki content is outdated',
  },
]

// ═══════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════
export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* ═══════════════════════════════════════════════════════════
          ANNOUNCEMENT BAR
          ═══════════════════════════════════════════════════════════ */}
      <div className="announcement-bar pt-[64px]">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>Built on AWS Aurora DSQL — $160K Hackathon</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[calc(100vh-7rem)] flex items-center hero-glow overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.04] pointer-events-none"
          style={{ background: 'radial-gradient(circle, #10B981, transparent 70%)' }}
        />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-[0.03] pointer-events-none"
          style={{ background: 'radial-gradient(circle, #0D9488, transparent 70%)' }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left column - Text */}
            <div className="space-y-8">
              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight leading-[1.08] text-[#0F172A]"
              >
                Your Team&apos;s Memory,{' '}
                <span className="gradient-text-hero">Alive.</span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="text-lg sm:text-xl text-[#475569] leading-relaxed max-w-xl"
              >
                Lore gives your team a shared memory that&apos;s structured, always consistent, and available everywhere. Powered by Aurora DSQL&apos;s multi-region architecture.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link href="/signup" className="btn-primary text-[15px] h-12 px-8 justify-center">
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/#how-it-works" className="btn-secondary text-[15px] h-12 px-8 justify-center">
                  Watch Demo
                  <ChevronDown className="w-4 h-4" />
                </Link>
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.55 }}
                className="flex flex-wrap gap-6 pt-2"
              >
                {[
                  { text: 'Multi-region consistent', icon: Shield },
                  { text: 'Real-time sync', icon: Zap },
                  { text: 'Zero config', icon: Cloud },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2 text-[13px] text-[#475569] font-medium">
                    <Check className="w-4 h-4 text-emerald-500" strokeWidth={3} />
                    {item.text}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right column - Product mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex justify-center lg:justify-end"
            >
              <div className="w-full max-w-md animate-float">
                <div className="mockup-window shadow-2xl">
                  {/* Title bar */}
                  <div className="mockup-titlebar">
                    <div className="mockup-dot bg-red-400" />
                    <div className="mockup-dot bg-yellow-400" />
                    <div className="mockup-dot bg-green-400" />
                    <span className="text-xs text-gray-400 ml-2 font-medium">Lore — Knowledge Graph</span>
                  </div>
                  {/* Knowledge Graph Preview */}
                  <div className="p-5 bg-gradient-to-br from-gray-50 to-white">
                    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-[10px] font-bold tracking-wider uppercase text-gray-400">Knowledge Graph</p>
                        <span className="text-[9px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Live</span>
                      </div>
                      <KnowledgeGraphSVG />
                    </div>
                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-3 mt-4">
                      {[
                        { label: 'Nodes', value: '1,203', color: '#059669' },
                        { label: 'Edges', value: '3,847', color: '#0D9488' },
                        { label: 'Queries', value: '489', color: '#10B981' },
                      ].map((stat) => (
                        <div key={stat.label} className="bg-white rounded-xl p-3 border border-gray-100 text-center shadow-sm">
                          <p className="text-lg font-bold" style={{ color: stat.color }}>{stat.value}</p>
                          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          TRUSTED BY — STATS
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-16 border-y border-gray-100 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-8 md:gap-12 max-w-3xl mx-auto">
            {stats.map((stat, i) => (
              <FadeIn key={stat.label} delay={i * 0.08}>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: 'rgba(5,150,105,0.08)' }}>
                    <stat.icon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] mb-1" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs font-semibold tracking-wider uppercase text-[#475569]">
                    {stat.label}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          PROBLEM SECTION
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <FadeIn>
              <p className="section-label mb-6">The Problem</p>
            </FadeIn>
            <FadeIn delay={0.06}>
              <h2 className="section-title mb-6">
                Inconsistent memory is <span className="gradient-text">misinformation.</span>
              </h2>
            </FadeIn>
            <FadeIn delay={0.12}>
              <p className="section-subtitle">
                When your team&apos;s knowledge lives in Slack threads, Notion pages, and someone&apos;s head — it&apos;s not memory. It&apos;s chaos.
              </p>
            </FadeIn>
          </div>

          {/* Pain point cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            {painPoints.map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.08}>
                <div className="feature-card text-center">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-5"
                    style={{ background: 'rgba(239,68,68,0.08)' }}>
                    <item.icon className="w-5 h-5 text-red-500" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A] mb-2">{item.title}</h3>
                  <p className="text-sm text-[#475569] leading-relaxed mb-4">{item.desc}</p>
                  <div className="pt-3 border-t border-gray-100">
                    <span className="text-2xl font-bold text-red-500">{item.stat}</span>
                    <span className="block text-xs text-gray-400 mt-1">{item.statLabel}</span>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FEATURES
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-[#F9FAFB]" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <FadeIn>
              <p className="section-label mb-6">Features</p>
            </FadeIn>
            <FadeIn delay={0.06}>
              <h2 className="section-title mb-6">
                Everything your team needs to <span className="gradient-text">never forget.</span>
              </h2>
            </FadeIn>
            <FadeIn delay={0.12}>
              <p className="section-subtitle">
                From automatic capture to AI-powered recall, Lore handles the entire lifecycle of team knowledge.
              </p>
            </FadeIn>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <FadeIn key={feature.title} delay={i * 0.08}>
                <div className="feature-card h-full">
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: feature.bgColor }}
                    >
                      <feature.icon className="w-5 h-5" style={{ color: feature.color }} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#0F172A]">{feature.title}</h3>
                      <p className="text-sm font-medium" style={{ color: feature.color }}>{feature.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-sm text-[#475569] leading-relaxed mb-4">{feature.desc}</p>
                  <div className="rounded-xl bg-[#F9FAFB] border border-gray-100 p-3 mt-2">
                    {feature.svgPreview}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          HOW IT WORKS
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <FadeIn>
              <p className="section-label mb-6">How It Works</p>
            </FadeIn>
            <FadeIn delay={0.06}>
              <h2 className="section-title mb-6">
                Three steps to <span className="gradient-text">perfect memory.</span>
              </h2>
            </FadeIn>
            <FadeIn delay={0.12}>
              <p className="section-subtitle">
                Getting started with Lore takes minutes, not months. Connect your tools, and Lore starts building your team&apos;s memory immediately.
              </p>
            </FadeIn>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <FadeIn key={step.step} delay={i * 0.1}>
                <div className="feature-card text-center relative">
                  {/* Step number */}
                  <span className="absolute top-4 right-4 text-xs font-mono text-gray-300 font-bold">{step.step}</span>
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6"
                    style={{ background: step.bgColor }}
                  >
                    <step.icon className="w-6 h-6" style={{ color: step.color }} />
                  </div>
                  <h3 className="text-xl font-bold text-[#0F172A] mb-3">{step.title}</h3>
                  <p className="text-sm text-[#475569] leading-relaxed">{step.desc}</p>
                  {/* Connector line (only between steps on desktop) */}
                  {i < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 border-t-2 border-dashed border-emerald-200" />
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          ARCHITECTURE SECTION
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Diagram */}
            <FadeIn>
              <div className="mockup-window">
                <div className="mockup-titlebar">
                  <div className="mockup-dot bg-red-400" />
                  <div className="mockup-dot bg-yellow-400" />
                  <div className="mockup-dot bg-green-400" />
                  <span className="text-xs text-gray-400 ml-2 font-medium">Architecture — Aurora DSQL</span>
                </div>
                <div className="p-6 bg-white">
                  <svg viewBox="0 0 400 220" className="w-full h-auto" fill="none">
                    {/* Client Layer */}
                    <rect x="10" y="10" width="380" height="45" rx="8" fill="#ECFDF5" stroke="#A7F3D0" strokeWidth="1" />
                    <text x="200" y="28" textAnchor="middle" fill="#059669" fontSize="11" fontWeight="600">Client Layer</text>
                    <text x="80" y="42" textAnchor="middle" fill="#475569" fontSize="9">Web App</text>
                    <text x="200" y="42" textAnchor="middle" fill="#475569" fontSize="9">Mobile</text>
                    <text x="320" y="42" textAnchor="middle" fill="#475569" fontSize="9">API</text>

                    {/* Arrow */}
                    <line x1="200" y1="55" x2="200" y2="75" stroke="#A7F3D0" strokeWidth="2" />
                    <polygon points="195,73 200,80 205,73" fill="#A7F3D0" />

                    {/* Next.js API */}
                    <rect x="130" y="80" width="140" height="35" rx="8" fill="#F0FDF4" stroke="#10B981" strokeWidth="1.5" />
                    <text x="200" y="102" textAnchor="middle" fill="#059669" fontSize="11" fontWeight="600">Next.js API Layer</text>

                    {/* Arrow */}
                    <line x1="200" y1="115" x2="200" y2="135" stroke="#A7F3D0" strokeWidth="2" />
                    <polygon points="195,133 200,140 205,133" fill="#A7F3D0" />

                    {/* Aurora DSQL */}
                    <rect x="60" y="140" width="280" height="40" rx="10" fill="#059669" opacity="0.1" stroke="#059669" strokeWidth="2" />
                    <text x="200" y="163" textAnchor="middle" fill="#059669" fontSize="13" fontWeight="700">Aurora DSQL</text>
                    <text x="200" y="175" textAnchor="middle" fill="#047857" fontSize="8">Multi-Region · Serializable Isolation</text>

                    {/* Regions */}
                    <rect x="60" y="190" width="90" height="25" rx="6" fill="#ECFDF5" stroke="#A7F3D0" strokeWidth="1" />
                    <text x="105" y="206" textAnchor="middle" fill="#059669" fontSize="9" fontWeight="500">US-East-1</text>
                    <rect x="155" y="190" width="90" height="25" rx="6" fill="#ECFDF5" stroke="#A7F3D0" strokeWidth="1" />
                    <text x="200" y="206" textAnchor="middle" fill="#059669" fontSize="9" fontWeight="500">EU-West-1</text>
                    <rect x="250" y="190" width="90" height="25" rx="6" fill="#ECFDF5" stroke="#A7F3D0" strokeWidth="1" />
                    <text x="295" y="206" textAnchor="middle" fill="#059669" fontSize="9" fontWeight="500">AP-South-1</text>

                    {/* Connection lines from DSQL to regions */}
                    <line x1="140" y1="180" x2="105" y2="190" stroke="#A7F3D0" strokeWidth="1" />
                    <line x1="200" y1="180" x2="200" y2="190" stroke="#A7F3D0" strokeWidth="1" />
                    <line x1="260" y1="180" x2="295" y2="190" stroke="#A7F3D0" strokeWidth="1" />
                  </svg>
                </div>
              </div>
            </FadeIn>

            {/* Text */}
            <div className="space-y-6">
              <FadeIn>
                <p className="section-label">Architecture</p>
              </FadeIn>
              <FadeIn delay={0.06}>
                <h2 className="section-title">
                  Built on <span className="gradient-text">Aurora DSQL.</span>
                </h2>
              </FadeIn>
              <FadeIn delay={0.12}>
                <p className="text-lg text-[#475569] leading-relaxed">
                  Aurora DSQL provides serializable isolation across multiple regions — meaning your team&apos;s memory is identical everywhere. No stale caches, no conflicts, no data drift. Consistency is non-negotiable.
                </p>
              </FadeIn>
              <FadeIn delay={0.18}>
                <div className="space-y-4 pt-2">
                  {[
                    { icon: Shield, text: 'Serializable isolation — every read sees the latest write' },
                    { icon: Zap, text: '<50ms read latency with multi-region replication' },
                    { icon: Server, text: 'Zero conflicts — distributed SQL done right' },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                        <item.icon className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-sm text-[#475569] font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          TRUST / SECURITY BADGES
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-12 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
              {[
                { icon: Shield, label: 'SOC 2 Compliant' },
                { icon: Lock, label: 'GDPR Ready' },
                { icon: Activity, label: '99.9% Uptime' },
                { icon: Key, label: '256-bit Encryption' },
              ].map((badge) => (
                <div key={badge.label} className="flex items-center gap-2 text-gray-400">
                  <badge.icon className="w-4 h-4" />
                  <span className="text-xs font-medium tracking-wide uppercase">{badge.label}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CTA SECTION
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 emerald-section relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-10" />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <FadeIn>
            <p className="text-xs font-bold tracking-widest uppercase text-white/60 mb-6">Ready to start?</p>
          </FadeIn>
          <FadeIn delay={0.06}>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              Give your team the memory it deserves.
            </h2>
          </FadeIn>
          <FadeIn delay={0.12}>
            <p className="text-lg text-white/70 leading-relaxed mb-10 max-w-xl mx-auto">
              Stop losing knowledge. Start building a shared memory that grows with your team. Free to start, no credit card required.
            </p>
          </FadeIn>
          <FadeIn delay={0.18}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="inline-flex items-center justify-center gap-2 h-12 px-8 text-[15px] font-semibold bg-white text-emerald-700 rounded-xl shadow-lg hover:bg-gray-50 transition-colors">
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/#how-it-works" className="inline-flex items-center justify-center gap-2 h-12 px-8 text-[15px] font-semibold bg-white/10 text-white border border-white/20 rounded-xl hover:bg-white/20 transition-colors">
                Learn More
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  )
}
