'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
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
  Database,
  MessageSquare,
  Sun,
  BookOpen,
  Cloud,
  Server,
  Link2,
  Activity,
  Key,
  Lock,
  X,
  Star,
  Crown,
  Globe,
  Cpu,
  RefreshCw,
  Layers,
  TrendingUp,
  Award,
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

interface GraphNodeData {
  id: string
  label: string
  x: number
  y: number
  r: number
  color: string
  ampX: number
  ampY: number
  spdX: number
  spdY: number
  phX: number
  phY: number
}

interface GraphEdgeData {
  from: string
  to: string
  speed: number
  particles: number
}

// ═══════════════════════════════════════════════════════════════
// GRAPH DATA
// ═══════════════════════════════════════════════════════════════

const GRAPH_NODES: GraphNodeData[] = [
  { id: 'core', label: 'Core', x: 500, y: 260, r: 22, color: '#059669', ampX: 6, ampY: 5, spdX: 0.4, spdY: 0.3, phX: 0, phY: 0 },
  { id: 'api', label: 'API', x: 300, y: 160, r: 14, color: '#10B981', ampX: 8, ampY: 6, spdX: 0.5, spdY: 0.4, phX: 1.2, phY: 0.8 },
  { id: 'auth', label: 'Auth', x: 720, y: 150, r: 12, color: '#34D399', ampX: 7, ampY: 5, spdX: 0.45, spdY: 0.35, phX: 2.1, phY: 1.5 },
  { id: 'data', label: 'Data', x: 340, y: 380, r: 15, color: '#0D9488', ampX: 5, ampY: 7, spdX: 0.35, spdY: 0.45, phX: 0.5, phY: 2.2 },
  { id: 'ai', label: 'AI', x: 700, y: 370, r: 13, color: '#14B8A6', ampX: 6, ampY: 8, spdX: 0.55, spdY: 0.3, phX: 3.0, phY: 0.3 },
  { id: 'slack', label: 'Slack', x: 110, y: 100, r: 10, color: '#6EE7B7', ampX: 9, ampY: 7, spdX: 0.6, spdY: 0.5, phX: 0.8, phY: 1.0 },
  { id: 'github', label: 'GitHub', x: 140, y: 300, r: 10, color: '#6EE7B7', ampX: 8, ampY: 6, spdX: 0.5, spdY: 0.55, phX: 1.5, phY: 2.5 },
  { id: 'notion', label: 'Notion', x: 510, y: 70, r: 11, color: '#A7F3D0', ampX: 7, ampY: 9, spdX: 0.4, spdY: 0.6, phX: 2.3, phY: 0.7 },
  { id: 'docs', label: 'Docs', x: 870, y: 220, r: 10, color: '#6EE7B7', ampX: 6, ampY: 8, spdX: 0.55, spdY: 0.4, phX: 3.2, phY: 1.8 },
  { id: 'search', label: 'Search', x: 840, y: 400, r: 9, color: '#A7F3D0', ampX: 7, ampY: 5, spdX: 0.45, spdY: 0.5, phX: 0.3, phY: 3.0 },
  { id: 'graph', label: 'Graph', x: 500, y: 470, r: 11, color: '#6EE7B7', ampX: 5, ampY: 6, spdX: 0.5, spdY: 0.35, phX: 1.8, phY: 0.2 },
  { id: 'n1', label: '', x: 180, y: 40, r: 5, color: '#D1FAE5', ampX: 10, ampY: 8, spdX: 0.7, spdY: 0.6, phX: 0.2, phY: 1.3 },
  { id: 'n2', label: '', x: 920, y: 80, r: 5, color: '#D1FAE5', ampX: 8, ampY: 10, spdX: 0.6, spdY: 0.7, phX: 1.1, phY: 0.4 },
  { id: 'n3', label: '', x: 80, y: 430, r: 6, color: '#A7F3D0', ampX: 9, ampY: 7, spdX: 0.55, spdY: 0.45, phX: 2.7, phY: 1.9 },
  { id: 'n4', label: '', x: 900, y: 500, r: 5, color: '#D1FAE5', ampX: 7, ampY: 9, spdX: 0.65, spdY: 0.55, phX: 0.9, phY: 2.6 },
  { id: 'n5', label: '', x: 440, y: 520, r: 4, color: '#ECFDF5', ampX: 6, ampY: 5, spdX: 0.5, spdY: 0.6, phX: 3.5, phY: 0.1 },
]

const GRAPH_EDGES: GraphEdgeData[] = [
  { from: 'core', to: 'api', speed: 0.3, particles: 2 },
  { from: 'core', to: 'auth', speed: 0.25, particles: 2 },
  { from: 'core', to: 'data', speed: 0.35, particles: 2 },
  { from: 'core', to: 'ai', speed: 0.3, particles: 2 },
  { from: 'api', to: 'slack', speed: 0.4, particles: 1 },
  { from: 'api', to: 'github', speed: 0.35, particles: 1 },
  { from: 'api', to: 'notion', speed: 0.3, particles: 1 },
  { from: 'auth', to: 'docs', speed: 0.3, particles: 1 },
  { from: 'data', to: 'graph', speed: 0.25, particles: 1 },
  { from: 'ai', to: 'search', speed: 0.35, particles: 1 },
  { from: 'ai', to: 'docs', speed: 0.3, particles: 1 },
  { from: 'slack', to: 'n1', speed: 0.5, particles: 1 },
  { from: 'notion', to: 'n2', speed: 0.45, particles: 1 },
  { from: 'github', to: 'n3', speed: 0.4, particles: 1 },
  { from: 'search', to: 'n4', speed: 0.45, particles: 1 },
  { from: 'graph', to: 'n5', speed: 0.5, particles: 1 },
  { from: 'data', to: 'github', speed: 0.3, particles: 1 },
  { from: 'auth', to: 'notion', speed: 0.35, particles: 1 },
]

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
    glowColor: 'rgba(5,150,105,0.15)',
  },
  {
    icon: Sun,
    title: 'Morning Digest',
    subtitle: 'Start every day with clarity',
    desc: 'Wake up to a personalized briefing on what changed, what\'s relevant, and what needs your attention. Never miss a critical update again.',
    color: '#0D9488',
    glowColor: 'rgba(13,148,136,0.15)',
  },
  {
    icon: MessageSquare,
    title: 'AI Chat',
    subtitle: 'Ask anything about your knowledge',
    desc: 'Ask in natural language. Lore finds the answer from your team\'s collective memory — with sources and confidence scores.',
    color: '#10B981',
    glowColor: 'rgba(16,185,129,0.15)',
  },
  {
    icon: BookOpen,
    title: 'Structured Memory',
    subtitle: 'Never lose a thought',
    desc: 'Every fact, decision, and context is captured and organized automatically. No more "where did we decide that?"',
    color: '#047857',
    glowColor: 'rgba(4,120,87,0.15)',
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
  },
  {
    step: '02',
    icon: Network,
    title: 'Watch It Connect',
    desc: 'Raw information becomes structured knowledge. Relationships are mapped, entities are linked, and context is preserved in a living knowledge graph.',
    color: '#059669',
  },
  {
    step: '03',
    icon: Sparkles,
    title: 'Ask Anything',
    desc: 'Ask in natural language and get instant answers from your team\'s memory — complete with sources and confidence scores.',
    color: '#0D9488',
  },
]

// ═══════════════════════════════════════════════════════════════
// COMPARISON DATA
// ═══════════════════════════════════════════════════════════════

type CellStatus = 'best' | 'partial' | 'none' | 'basic'

interface ComparisonRow {
  feature: string
  icon: React.ElementType
  lore: CellStatus
  obsidian: CellStatus
  notion: CellStatus
  memai: CellStatus
}

const comparisonRows: ComparisonRow[] = [
  { feature: 'Knowledge Graph', icon: Network, lore: 'best', obsidian: 'basic', notion: 'none', memai: 'partial' },
  { feature: 'AI Chat', icon: MessageSquare, lore: 'best', obsidian: 'none', notion: 'partial', memai: 'partial' },
  { feature: 'Smart Digest', icon: Sun, lore: 'best', obsidian: 'none', notion: 'none', memai: 'partial' },
  { feature: 'Team Memory', icon: Users, lore: 'best', obsidian: 'none', notion: 'partial', memai: 'none' },
  { feature: 'Real-time Sync', icon: RefreshCw, lore: 'best', obsidian: 'none', notion: 'partial', memai: 'none' },
]

// ═══════════════════════════════════════════════════════════════
// TESTIMONIALS DATA
// ═══════════════════════════════════════════════════════════════

const testimonials = [
  {
    name: 'Sarah Chen',
    title: 'VP of Engineering',
    company: 'TechFlow',
    initials: 'SC',
    color: '#059669',
    bgColor: '#ECFDF5',
    quote: 'Lore transformed how our distributed team shares knowledge. What used to take 30 minutes of Slack archaeology now takes a 10-second query. It\'s like having a senior engineer who never forgets.',
  },
  {
    name: 'Marcus Williams',
    title: 'Head of Product',
    company: 'DataSync',
    initials: 'MW',
    color: '#0D9488',
    bgColor: '#F0FDFA',
    quote: 'The morning digest alone saves our team 2 hours per day. We start every standup with Lore\'s summary instead of 15 minutes of "what did I miss?" — it\'s become our single source of truth.',
  },
  {
    name: 'Dr. Priya Patel',
    title: 'CTO',
    company: 'NovaStar',
    initials: 'PP',
    color: '#10B981',
    bgColor: '#ECFDF5',
    quote: 'Finally, a knowledge tool that actually understands context. The graph visualization revealed connections between projects we never knew existed. Our decision-making is faster and more informed.',
  },
]

// ═══════════════════════════════════════════════════════════════
// PRICING DATA
// ═══════════════════════════════════════════════════════════════

const pricingTiers = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    desc: 'For individuals and small teams getting started.',
    features: ['Up to 3 users', '1,000 knowledge nodes', 'Basic knowledge graph', 'Community support', '7-day history'],
    cta: 'Get Started Free',
    featured: false,
  },
  {
    name: 'Pro',
    price: '$12',
    period: 'per user / month',
    desc: 'For growing teams that need AI-powered recall.',
    features: ['Unlimited users', '50,000 knowledge nodes', 'AI Chat with sources', 'Smart Morning Digest', 'Priority support', '30-day history', 'All integrations'],
    cta: 'Start Pro Trial',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'tailored pricing',
    desc: 'For organizations that need full control and scale.',
    features: ['Unlimited everything', 'SSO / SAML', 'Custom integrations', 'Dedicated support', 'SLA guarantee', 'Unlimited history', 'On-premise option', 'Audit logs'],
    cta: 'Contact Sales',
    featured: false,
  },
]

// ═══════════════════════════════════════════════════════════════
// MARQUEE COMPANIES
// ═══════════════════════════════════════════════════════════════

const companies = [
  'Acme Corp', 'TechFlow', 'DataSync', 'NovaStar', 'Quantum Labs',
  'SkyBridge', 'Meridian', 'PulseAI', 'Cirrus', 'Helix Systems',
  'Apex Digital', 'Orion Tech', 'Zenith', 'Flux', 'Prism Analytics',
]

// ═══════════════════════════════════════════════════════════════
// HELPER: FadeIn on scroll
// ═══════════════════════════════════════════════════════════════

function FadeIn({
  children,
  className = '',
  delay = 0,
  duration = 0.5,
  direction = 'up',
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  direction?: 'up' | 'down' | 'left' | 'right'
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  const directionMap = {
    up: { y: 30, x: 0 },
    down: { y: -30, x: 0 },
    left: { y: 0, x: 30 },
    right: { y: 0, x: -30 },
  }

  const offset = directionMap[direction]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: offset.x, y: offset.y }}
      transition={{ duration, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════
// HELPER: Animated Counter
// ═══════════════════════════════════════════════════════════════

function AnimatedCounter({
  target,
  suffix = '',
  prefix = '',
  duration = 2,
}: {
  target: number
  suffix?: string
  prefix?: string
  duration?: number
}) {
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
      const controls = animate(motionVal, target, {
        duration,
        ease: [0.25, 0.46, 0.45, 0.94],
      })
      return controls.stop
    }
  }, [isInView, motionVal, target, duration])

  useEffect(() => {
    const unsubscribe = rounded.on('change', (v) => setDisplay(v))
    return unsubscribe
  }, [rounded])

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  )
}

// ═══════════════════════════════════════════════════════════════
// ANIMATED KNOWLEDGE GRAPH BACKGROUND
// ═══════════════════════════════════════════════════════════════

function AnimatedGraphBackground() {
  const [tick, setTick] = useState(0)
  const lastUpdateRef = useRef(0)
  const frameRef = useRef<number>(0)

  useEffect(() => {
    const animateFrame = (time: number) => {
      if (time - lastUpdateRef.current > 33) {
        setTick(time / 1000)
        lastUpdateRef.current = time
      }
      frameRef.current = requestAnimationFrame(animateFrame)
    }
    frameRef.current = requestAnimationFrame(animateFrame)
    return () => cancelAnimationFrame(frameRef.current)
  }, [])

  const nodeMap = useMemo(() => {
    const map = new Map<string, GraphNodeData>()
    GRAPH_NODES.forEach((n) => map.set(n.id, n))
    return map
  }, [])

  const getPos = (node: GraphNodeData, t: number) => ({
    x: node.x + node.ampX * Math.sin(t * node.spdX + node.phX),
    y: node.y + node.ampY * Math.cos(t * node.spdY + node.phY),
  })

  const animatedNodes = useMemo(
    () => GRAPH_NODES.map((n) => ({ ...n, ...getPos(n, tick) })),
    [tick]
  )

  const nodePosMap = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>()
    animatedNodes.forEach((n) => map.set(n.id, { x: n.x, y: n.y }))
    return map
  }, [animatedNodes])

  return (
    <svg
      viewBox="0 0 1000 560"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      <defs>
        <filter id="edgeGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="nodeGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="nodeGradCore">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#059669" stopOpacity="0.7" />
        </radialGradient>
      </defs>

      {/* Edges */}
      {GRAPH_EDGES.map((edge, i) => {
        const from = nodePosMap.get(edge.from)
        const to = nodePosMap.get(edge.to)
        if (!from || !to) return null
        return (
          <line
            key={`e-${i}`}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke="#A7F3D0"
            strokeWidth={1.5}
            opacity={0.35}
            filter="url(#edgeGlow)"
          />
        )
      })}

      {/* Particles flowing along edges */}
      {GRAPH_EDGES.map((edge, i) => {
        const from = nodePosMap.get(edge.from)
        const to = nodePosMap.get(edge.to)
        if (!from || !to) return null

        return Array.from({ length: edge.particles }).map((_, p) => {
          const progress = ((tick * edge.speed + p * 0.5) % 1)
          const px = from.x + (to.x - from.x) * progress
          const py = from.y + (to.y - from.y) * progress
          const opacity = 0.8 - Math.abs(progress - 0.5) * 1.2

          return (
            <circle
              key={`p-${i}-${p}`}
              cx={px}
              cy={py}
              r={2.5}
              fill="#34D399"
              opacity={Math.max(0, opacity)}
              filter="url(#edgeGlow)"
            />
          )
        })
      })}

      {/* Nodes */}
      {animatedNodes.map((node) => (
        <g key={node.id}>
          {/* Outer glow ring */}
          {node.r > 10 && (
            <circle
              cx={node.x}
              cy={node.y}
              r={node.r + 6 + 3 * Math.sin(tick * 1.5 + node.phX)}
              fill="none"
              stroke={node.color}
              strokeWidth={1}
              opacity={0.15 + 0.05 * Math.sin(tick * 2 + node.phY)}
            />
          )}
          {/* Main node */}
          <circle
            cx={node.x}
            cy={node.y}
            r={node.r}
            fill={node.id === 'core' ? 'url(#nodeGradCore)' : node.color}
            opacity={node.r > 10 ? 0.9 : 0.7}
            filter={node.r > 10 ? 'url(#nodeGlow)' : undefined}
          />
          {/* Label */}
          {node.label && (
            <text
              x={node.x}
              y={node.y + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize={node.r > 15 ? 10 : node.r > 10 ? 8 : 6}
              fontWeight={node.r > 15 ? 700 : 600}
              style={{ pointerEvents: 'none' }}
            >
              {node.label}
            </text>
          )}
        </g>
      ))}
    </svg>
  )
}

// ═══════════════════════════════════════════════════════════════
// COMPARISON CELL
// ═══════════════════════════════════════════════════════════════

function ComparisonCell({ status }: { status: CellStatus }) {
  if (status === 'best') {
    return (
      <div className="flex items-center justify-center gap-1.5">
        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
          <Check className="w-3.5 h-3.5 text-emerald-600" strokeWidth={3} />
        </div>
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
          Best
        </span>
      </div>
    )
  }
  if (status === 'partial') {
    return (
      <div className="flex items-center justify-center">
        <div className="w-6 h-6 rounded-full bg-amber-50 flex items-center justify-center">
          <span className="text-[10px] font-bold text-amber-500">~</span>
        </div>
      </div>
    )
  }
  if (status === 'basic') {
    return (
      <div className="flex items-center justify-center">
        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
          <Check className="w-3 h-3 text-gray-400" strokeWidth={3} />
        </div>
      </div>
    )
  }
  return (
    <div className="flex items-center justify-center">
      <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center">
        <X className="w-3 h-3 text-red-400" strokeWidth={3} />
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// MINI FEATURE SVG PREVIEWS
// ═══════════════════════════════════════════════════════════════

function GraphMiniSVG() {
  return (
    <svg viewBox="0 0 120 80" className="w-full h-auto" fill="none">
      <line x1="30" y1="25" x2="60" y2="45" stroke="#A7F3D0" strokeWidth="1.5" />
      <line x1="60" y1="45" x2="95" y2="30" stroke="#A7F3D0" strokeWidth="1.5" />
      <line x1="60" y1="45" x2="45" y2="65" stroke="#A7F3D0" strokeWidth="1.5" />
      <line x1="60" y1="45" x2="90" y2="60" stroke="#A7F3D0" strokeWidth="1.5" />
      <circle r="3" fill="#34D399" opacity="0.8">
        <animateMotion dur="2.5s" repeatCount="indefinite" path="M30,25 L60,45" />
      </circle>
      <circle r="3" fill="#34D399" opacity="0.8">
        <animateMotion dur="3s" repeatCount="indefinite" path="M60,45 L95,30" />
      </circle>
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

const featureSVGs = [<GraphMiniSVG key="g" />, <DigestMiniSVG key="d" />, <ChatMiniSVG key="c" />, <MemoryMiniSVG key="m" />]

// ═══════════════════════════════════════════════════════════════
// ANIMATED CONNECTOR (How It Works)
// ═══════════════════════════════════════════════════════════════

function AnimatedConnector({ isInView, delay = 0 }: { isInView: boolean; delay?: number }) {
  return (
    <svg className="absolute top-1/2 -right-5 w-10 h-1 hidden lg:block" viewBox="0 0 40 4" fill="none">
      <motion.line
        x1="0"
        y1="2"
        x2="40"
        y2="2"
        stroke="#A7F3D0"
        strokeWidth={2}
        strokeDasharray="6 4"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 1.2, delay, ease: [0.25, 0.4, 0.25, 1] }}
      />
    </svg>
  )
}

// ═══════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════

export default function LandingPage() {
  const howItWorksRef = useRef(null)
  const howItWorksInView = useInView(howItWorksRef, { once: true, margin: '-100px' })

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        {/* Animated Graph Background */}
        <div className="absolute inset-0 opacity-[0.35] pointer-events-none">
          <AnimatedGraphBackground />
        </div>

        {/* Gradient overlays for readability */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.7) 40%, rgba(255,255,255,0.3) 70%, rgba(255,255,255,0.5) 100%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)',
          }}
        />

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="max-w-3xl">
            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.4, 0.25, 1] }}
              className="text-5xl sm:text-6xl lg:text-[4.5rem] font-extrabold tracking-tight leading-[1.05] text-[#0F172A]"
            >
              Your Team&apos;s Memory,{' '}
              <span className="gradient-text-hero">Alive.</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.25, 0.4, 0.25, 1] }}
              className="mt-6 text-lg sm:text-xl text-[#475569] leading-relaxed max-w-xl"
            >
              Lore gives your team a shared memory that&apos;s structured, always consistent, and available everywhere. Powered by Aurora DSQL&apos;s multi-region architecture for zero-data-drift knowledge management.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
              className="mt-8 flex flex-col sm:flex-row gap-4"
            >
              <Link href="/signup" className="btn-primary text-[15px] h-12 px-8 justify-center">
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#how-it-works" className="btn-secondary text-[15px] h-12 px-8 justify-center">
                See How It Works
                <ChevronDown className="w-4 h-4" />
              </a>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55, ease: [0.25, 0.4, 0.25, 1] }}
              className="mt-8 flex flex-wrap gap-6"
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

            {/* Floating stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
              className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6"
            >
              {[
                { value: 2847, suffix: '+', label: 'Knowledge Nodes', icon: Network },
                { value: 12500, suffix: '+', label: 'Connections', icon: Link2 },
                { value: 99.9, suffix: '%', label: 'Uptime', icon: Shield },
                { value: 150, suffix: 'ms', label: 'Avg Query', icon: Zap },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + i * 0.1 }}
                  className="group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <stat.icon className="w-4 h-4 text-emerald-500" />
                    <span
                      className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]"
                      style={{ fontVariantNumeric: 'tabular-nums' }}
                    >
                      <AnimatedCounter
                        target={stat.value}
                        suffix={stat.suffix}
                        duration={2.5}
                      />
                    </span>
                  </div>
                  <span className="text-xs font-medium text-[#71717A] tracking-wide uppercase">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SOCIAL PROOF BAR
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-10 border-y border-gray-100 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="text-center text-sm font-medium text-[#71717A] mb-6">
              Trusted by <span className="text-emerald-600 font-bold">2,000+</span> knowledge workers at
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="marquee-track relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-16 z-10" style={{ background: 'linear-gradient(to right, #F9FAFB, transparent)' }} />
              <div className="absolute right-0 top-0 bottom-0 w-16 z-10" style={{ background: 'linear-gradient(to left, #F9FAFB, transparent)' }} />
              <div className="marquee-content">
                {[...companies, ...companies].map((name, i) => (
                  <div
                    key={`${name}-${i}`}
                    className="flex items-center gap-2 mx-8 shrink-0"
                  >
                    <div className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                      <span className="text-[10px] font-bold text-emerald-600">{name[0]}</span>
                    </div>
                    <span className="text-sm font-semibold text-[#A1A1AA] whitespace-nowrap tracking-wide">
                      {name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          COMPARISON SECTION — "Why Lore Wins"
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <FadeIn>
              <p className="section-label mb-6">Why Lore Wins</p>
            </FadeIn>
            <FadeIn delay={0.06}>
              <h2 className="section-title mb-6">
                The only tool built for <span className="gradient-text">team memory.</span>
              </h2>
            </FadeIn>
            <FadeIn delay={0.12}>
              <p className="section-subtitle">
                Others take notes. Lore builds memory — structured, connected, and always consistent across regions.
              </p>
            </FadeIn>
          </div>

          {/* Comparison table */}
          <FadeIn delay={0.15}>
            <div className="overflow-x-auto -mx-4 px-4">
              <table className="w-full min-w-[600px] border-collapse">
                <thead>
                  <tr>
                    <th className="text-left p-4 w-[200px]">
                      <span className="text-xs font-bold tracking-wider uppercase text-[#A1A1AA]">Feature</span>
                    </th>
                    <th className="p-4 text-center">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200">
                        <Brain className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm font-bold text-emerald-700">Lore</span>
                        <span className="text-[10px] font-bold text-emerald-500 bg-emerald-100 px-2 py-0.5 rounded-full">YOU</span>
                      </div>
                    </th>
                    <th className="p-4 text-center">
                      <span className="text-sm font-semibold text-[#71717A]">Obsidian</span>
                    </th>
                    <th className="p-4 text-center">
                      <span className="text-sm font-semibold text-[#71717A]">Notion</span>
                    </th>
                    <th className="p-4 text-center">
                      <span className="text-sm font-semibold text-[#71717A]">Mem.ai</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, i) => (
                    <tr
                      key={row.feature}
                      className={i < comparisonRows.length - 1 ? 'border-b border-gray-100' : ''}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <row.icon className="w-4 h-4 text-emerald-500" />
                          <span className="text-sm font-semibold text-[#0F172A]">{row.feature}</span>
                        </div>
                      </td>
                      <td className="p-4 bg-emerald-50/40">
                        <ComparisonCell status={row.lore} />
                      </td>
                      <td className="p-4 text-center">
                        <ComparisonCell status={row.obsidian} />
                      </td>
                      <td className="p-4 text-center">
                        <ComparisonCell status={row.notion} />
                      </td>
                      <td className="p-4 text-center">
                        <ComparisonCell status={row.memai} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FEATURES SECTION
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
                <motion.div
                  className="feature-card h-full relative overflow-hidden"
                  whileHover={{
                    boxShadow: `0 0 40px ${feature.glowColor}, 0 12px 40px -12px rgba(5,150,105,0.1)`,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Hover glow overlay */}
                  <div
                    className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, ${feature.glowColor}, transparent 70%)`,
                    }}
                  />
                  <div className="relative z-10">
                    <div className="flex items-start gap-4 mb-4">
                      <motion.div
                        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: feature.glowColor }}
                        animate={{
                          rotate: [0, 3, -3, 0],
                          scale: [1, 1.05, 1],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: i * 0.5,
                        }}
                      >
                        <feature.icon className="w-5 h-5" style={{ color: feature.color }} />
                      </motion.div>
                      <div>
                        <h3 className="text-lg font-bold text-[#0F172A]">{feature.title}</h3>
                        <p className="text-sm font-medium" style={{ color: feature.color }}>
                          {feature.subtitle}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-[#475569] leading-relaxed mb-4">{feature.desc}</p>
                    <div className="rounded-xl bg-[#F9FAFB] border border-gray-100 p-3 mt-2">
                      {featureSVGs[i]}
                    </div>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          TESTIMONIALS
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <FadeIn>
              <p className="section-label mb-6">Testimonials</p>
            </FadeIn>
            <FadeIn delay={0.06}>
              <h2 className="section-title mb-6">
                Teams that <span className="gradient-text">remember, win.</span>
              </h2>
            </FadeIn>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => {
              const directions: Array<'left' | 'right' | 'up'> = ['left', 'up', 'right']
              return (
                <FadeIn key={t.name} delay={i * 0.12} direction={directions[i]}>
                  <div className="feature-card h-full flex flex-col">
                    {/* Stars */}
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, si) => (
                        <Star
                          key={si}
                          className="w-4 h-4 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                    {/* Quote */}
                    <p className="text-sm text-[#475569] leading-relaxed flex-1 mb-6">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    {/* Author */}
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: t.bgColor }}
                      >
                        <span
                          className="text-xs font-bold"
                          style={{ color: t.color }}
                        >
                          {t.initials}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#0F172A]">{t.name}</p>
                        <p className="text-xs text-[#71717A]">
                          {t.title}, {t.company}
                        </p>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          HOW IT WORKS
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-[#F9FAFB]" id="how-it-works" ref={howItWorksRef}>
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

          <div className="grid md:grid-cols-3 gap-8 relative">
            {steps.map((step, i) => (
              <FadeIn key={step.step} delay={i * 0.12}>
                <div className="feature-card text-center relative">
                  {/* Step number */}
                  <span className="absolute top-4 right-4 text-xs font-mono text-gray-300 font-bold">
                    {step.step}
                  </span>
                  <motion.div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6"
                    style={{ background: `${step.color}14` }}
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 0.8,
                    }}
                  >
                    <step.icon className="w-6 h-6" style={{ color: step.color }} />
                  </motion.div>
                  <h3 className="text-xl font-bold text-[#0F172A] mb-3">{step.title}</h3>
                  <p className="text-sm text-[#475569] leading-relaxed">{step.desc}</p>
                  {/* Animated connector */}
                  {i < 2 && (
                    <AnimatedConnector
                      isInView={howItWorksInView}
                      delay={0.5 + i * 0.4}
                    />
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
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Diagram */}
            <FadeIn>
              <div className="mockup-window">
                <div className="mockup-titlebar">
                  <div className="mockup-dot bg-red-400" />
                  <div className="mockup-dot bg-yellow-400" />
                  <div className="mockup-dot bg-green-400" />
                  <span className="text-xs text-gray-400 ml-2 font-medium">
                    Architecture — Aurora DSQL
                  </span>
                </div>
                <div className="p-6 bg-white">
                  <svg
                    viewBox="0 0 400 220"
                    className="w-full h-auto"
                    fill="none"
                  >
                    {/* Client Layer */}
                    <rect x="10" y="10" width="380" height="45" rx="8" fill="#ECFDF5" stroke="#A7F3D0" strokeWidth="1" />
                    <text x="200" y="28" textAnchor="middle" fill="#059669" fontSize="11" fontWeight="600">
                      Client Layer
                    </text>
                    <text x="80" y="42" textAnchor="middle" fill="#475569" fontSize="9">
                      Web App
                    </text>
                    <text x="200" y="42" textAnchor="middle" fill="#475569" fontSize="9">
                      Mobile
                    </text>
                    <text x="320" y="42" textAnchor="middle" fill="#475569" fontSize="9">
                      API
                    </text>

                    {/* Arrow with pulse */}
                    <line x1="200" y1="55" x2="200" y2="75" stroke="#A7F3D0" strokeWidth="2" />
                    <polygon points="195,73 200,80 205,73" fill="#A7F3D0" />
                    <circle r="3" fill="#34D399" opacity="0.8">
                      <animateMotion dur="1.5s" repeatCount="indefinite" path="M200,55 L200,75" />
                    </circle>

                    {/* Next.js API */}
                    <rect x="130" y="80" width="140" height="35" rx="8" fill="#F0FDF4" stroke="#10B981" strokeWidth="1.5" />
                    <text x="200" y="102" textAnchor="middle" fill="#059669" fontSize="11" fontWeight="600">
                      Next.js API Layer
                    </text>

                    {/* Arrow with pulse */}
                    <line x1="200" y1="115" x2="200" y2="135" stroke="#A7F3D0" strokeWidth="2" />
                    <polygon points="195,133 200,140 205,133" fill="#A7F3D0" />
                    <circle r="3" fill="#34D399" opacity="0.8">
                      <animateMotion dur="1.8s" repeatCount="indefinite" path="M200,115 L200,135" />
                    </circle>

                    {/* Aurora DSQL */}
                    <rect
                      x="60"
                      y="140"
                      width="280"
                      height="40"
                      rx="10"
                      fill="#059669"
                      opacity="0.1"
                      stroke="#059669"
                      strokeWidth="2"
                    >
                      <animate
                        attributeName="opacity"
                        values="0.1;0.18;0.1"
                        dur="3s"
                        repeatCount="indefinite"
                      />
                    </rect>
                    <text x="200" y="163" textAnchor="middle" fill="#059669" fontSize="13" fontWeight="700">
                      Aurora DSQL
                    </text>
                    <text x="200" y="175" textAnchor="middle" fill="#047857" fontSize="8">
                      Multi-Region · Serializable Isolation
                    </text>

                    {/* Regions */}
                    <rect x="60" y="190" width="90" height="25" rx="6" fill="#ECFDF5" stroke="#A7F3D0" strokeWidth="1" />
                    <text x="105" y="206" textAnchor="middle" fill="#059669" fontSize="9" fontWeight="500">
                      US-East-1
                    </text>
                    <rect x="155" y="190" width="90" height="25" rx="6" fill="#ECFDF5" stroke="#A7F3D0" strokeWidth="1" />
                    <text x="200" y="206" textAnchor="middle" fill="#059669" fontSize="9" fontWeight="500">
                      EU-West-1
                    </text>
                    <rect x="250" y="190" width="90" height="25" rx="6" fill="#ECFDF5" stroke="#A7F3D0" strokeWidth="1" />
                    <text x="295" y="206" textAnchor="middle" fill="#059669" fontSize="9" fontWeight="500">
                      AP-South-1
                    </text>

                    {/* Pulse dots flowing from DSQL to regions */}
                    <circle r="2.5" fill="#34D399" opacity="0.7">
                      <animateMotion dur="2s" repeatCount="indefinite" path="M140,180 L105,190" />
                    </circle>
                    <circle r="2.5" fill="#34D399" opacity="0.7">
                      <animateMotion dur="2.2s" repeatCount="indefinite" path="M200,180 L200,190" />
                    </circle>
                    <circle r="2.5" fill="#34D399" opacity="0.7">
                      <animateMotion dur="2.4s" repeatCount="indefinite" path="M260,180 L295,190" />
                    </circle>

                    {/* Connection lines */}
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
                    {
                      icon: Shield,
                      text: 'Serializable isolation — every read sees the latest write',
                    },
                    {
                      icon: Zap,
                      text: '<50ms read latency with multi-region replication',
                    },
                    {
                      icon: Server,
                      text: 'Zero conflicts — distributed SQL done right',
                    },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                        <item.icon className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-sm text-[#475569] font-medium">
                        {item.text}
                      </span>
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
      <section className="py-10 border-y border-gray-100">
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
                  <span className="text-xs font-medium tracking-wide uppercase">
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          PRICING TEASER
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <FadeIn>
              <p className="section-label mb-6">Pricing</p>
            </FadeIn>
            <FadeIn delay={0.06}>
              <h2 className="section-title mb-6">
                Start free, scale when <span className="gradient-text">you&apos;re ready.</span>
              </h2>
            </FadeIn>
            <FadeIn delay={0.12}>
              <p className="section-subtitle">
                No credit card required. Upgrade only when your team needs more power.
              </p>
            </FadeIn>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-start">
            {pricingTiers.map((tier, i) => (
              <FadeIn key={tier.name} delay={i * 0.1}>
                <div
                  className={`pricing-card ${tier.featured ? 'pricing-card-featured' : ''}`}
                >
                  {/* Badge for featured */}
                  {tier.featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
                        <Crown className="w-3 h-3" />
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-lg font-bold text-[#0F172A] mb-1">{tier.name}</h3>
                    <p className="text-sm text-[#71717A] mb-4">{tier.desc}</p>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-extrabold text-[#0F172A]">
                        {tier.price}
                      </span>
                      {tier.period !== 'forever' && tier.period !== 'tailored pricing' && (
                        <span className="text-sm text-[#71717A]">/{tier.period}</span>
                      )}
                    </div>
                    <p className="text-xs text-[#A1A1AA] mt-1">
                      {tier.period === 'forever' ? 'Free forever' : tier.period === 'tailored pricing' ? 'Tailored to your needs' : `Billed ${tier.period}`}
                    </p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" strokeWidth={3} />
                        <span className="text-sm text-[#475569]">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/signup"
                    className={`w-full inline-flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-semibold transition-all ${
                      tier.featured
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5'
                        : 'bg-white text-[#0F172A] border border-gray-200 hover:border-emerald-300 hover:shadow-md hover:-translate-y-0.5'
                    }`}
                  >
                    {tier.cta}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FINAL CTA
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 emerald-section relative overflow-hidden">
        {/* Animated background dots */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 800 400" fill="none" preserveAspectRatio="xMidYMid slice">
            {Array.from({ length: 30 }).map((_, i) => (
              <circle
                key={i}
                cx={100 + (i * 73) % 700}
                cy={50 + (i * 47) % 350}
                r={2 + (i % 3)}
                fill="white"
                opacity={0.08 + 0.04 * Math.sin(i)}
              >
                <animate
                  attributeName="opacity"
                  values={`${0.06 + 0.03 * Math.sin(i)};${0.12 + 0.04 * Math.sin(i)};${0.06 + 0.03 * Math.sin(i)}`}
                  dur={`${3 + (i % 4)}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="cy"
                  values={`${50 + (i * 47) % 350};${55 + (i * 47) % 350};${50 + (i * 47) % 350}`}
                  dur={`${5 + (i % 3)}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}
          </svg>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <FadeIn>
            <p className="text-xs font-bold tracking-widest uppercase text-white/60 mb-6">
              Ready to start?
            </p>
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
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 h-12 px-8 text-[15px] font-semibold bg-white text-emerald-700 rounded-xl shadow-lg hover:bg-gray-50 transition-colors"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 h-12 px-8 text-[15px] font-semibold bg-white/10 text-white border border-white/20 rounded-xl hover:bg-white/20 transition-colors"
              >
                Learn More
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  )
}
