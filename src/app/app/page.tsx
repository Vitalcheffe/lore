'use client'

import { useState, useRef, useEffect, useCallback, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield,
  HelpCircle,
  Heart,
  Star,
  Check,
  Phone,
  ChevronDown,
  RotateCcw,
  Lock,
  MapPin,
  AlertTriangle,
  ShieldCheck,
  ArrowRight,
  MessageCircle,
  Send,
  Sparkles,
  TrendingUp,
  Eye,
  Navigation,
  Zap,
  Activity,
  Layers,
} from 'lucide-react'

// ─── CLEARPATH LOGO MARK ──────────────────────────────────
function ClearPathLogo({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className={className} fill="none">
      <path
        d="M 318 138 A 155 155 0 1 0 318 374"
        stroke="currentColor"
        strokeWidth="50"
        strokeLinecap="round"
      />
      <path
        d="M 318 138 C 358 122, 404 118, 448 132"
        stroke="currentColor"
        strokeWidth="42"
        strokeLinecap="round"
      />
      <circle cx="450" cy="133" r="14" fill="#3b82f6" />
    </svg>
  )
}

// ─── TYPES ───────────────────────────────────────────────
interface Resource {
  name: string
  detail: string
  verified?: string
  distance?: string
}

interface Category {
  label: string
  confidence: number
  resources: Resource[]
  why: string
  also?: string
  warning?: string
}

interface CrisisLine {
  name: string
  action: string
  call?: string
}

interface ClassifyResponse {
  isCrisis: boolean
  categories: { label: string; confidence: number }[]
  confidenceTiers?: {
    high: { label: string; confidence: number }[]
    moderate: { label: string; confidence: number }[]
    low: { label: string; confidence: number }[]
    hidden: number
  }
  needsClarification: boolean
  clarificationMessage: string | null
  crisisLines?: CrisisLine[]
  note?: string
  conversationId?: string
  model: string
}

interface CommunityResource {
  id: string
  name: string
  description: string
  category: string
  services?: string
  verified?: string
  distance?: string
}

// ─── STARTERS ────────────────────────────────────────────
const starters = [
  { id: 'job', label: 'Multi-Need', description: "I lost my job and can't pay rent. My kids need food.", icon: 'layers' },
  { id: 'crisis', label: 'Crisis', description: "I can't take this anymore. I want it all to end.", icon: 'shield' },
  { id: 'stress', label: 'Low Confidence', description: 'I need help with my situation', icon: 'help' },
  { id: 'senior', label: 'Senior', description: "I'm 78 and need help getting groceries delivered", icon: 'heart' },
  { id: 'veteran', label: 'Complex', description: "I'm a veteran dealing with PTSD and housing issues", icon: 'star' },
]

const starterTexts: Record<string, string> = {
  job: "I lost my job and can't pay rent. My kids need food.",
  crisis: "I can't take this anymore. I want it all to end.",
  stress: 'I need help with my situation',
  senior: "I'm 78 and need help getting groceries delivered",
  veteran: "I'm a veteran dealing with PTSD and housing issues",
}

// ─── ENRICHMENT DATA ─────────────────────────────────────
const whyMap: Record<string, string> = {
  'Housing Assistance': 'Housing or shelter need identified',
  'Food Assistance': 'Food or basic necessities need identified',
  'Mental Health': 'Mental or emotional health concern identified',
  'Employment Services': 'Employment or job training need identified',
  'Legal Aid': 'Legal assistance need identified',
  'Healthcare': 'Health or medical need identified',
  'Substance Abuse': 'Substance use concern identified',
  'Senior Services': 'Senior-specific need identified',
}

const alsoMap: Record<string, string> = {
  'Housing Assistance': 'Section 8, Emergency shelters, LIHEAP, Rapid rehousing',
  'Food Assistance': 'WIC, School meal programs, SNAP Online',
  'Mental Health': 'Crisis counseling, Peer support, Telehealth',
  'Employment Services': 'Job Corps, Rapid Re-employment, GI Bill',
  'Legal Aid': 'Immigration services, Tenant rights',
  'Healthcare': 'Telehealth options, Community clinics',
  'Substance Abuse': 'Recovery support groups, Sober living',
  'Senior Services': 'SNAP Online, Congregate meals, Medicare counseling',
}

function enrichCategories(
  rawCategories: { label: string; confidence: number }[],
  resourcesMap: Record<string, Resource[]> = {}
): Category[] {
  return rawCategories.map((c) => ({
    label: c.label,
    confidence: c.confidence,
    resources: resourcesMap[c.label] || [],
    why: whyMap[c.label] || `Matched to ${c.label} category`,
    also: alsoMap[c.label],
    warning:
      c.confidence < 70
        ? `${c.confidence}% confidence — consider providing more detail for better matches`
        : undefined,
  }))
}

// ─── QUICK SUGGESTION CHIPS ──────────────────────────────
const quickChips = [
  'I need housing help',
  'Mental health support',
  'Food assistance',
  'Legal aid',
  'Senior services',
]

// ─── UTILITIES ───────────────────────────────────────────
function getConfidenceColor(v: number): string {
  if (v >= 80) return '#10b981'
  if (v >= 70) return '#3b82f6'
  if (v >= 50) return '#f59e0b'
  return '#f97316'
}
function getConfidenceBg(v: number): string {
  if (v >= 80) return 'rgba(16,185,129,0.06)'
  if (v >= 70) return 'rgba(59,130,246,0.06)'
  if (v >= 50) return 'rgba(245,158,11,0.06)'
  return 'rgba(249,115,22,0.06)'
}
function getConfidenceGlow(v: number): string {
  if (v >= 80) return '0 0 16px rgba(16,185,129,0.25)'
  if (v >= 70) return '0 0 16px rgba(59,130,246,0.25)'
  if (v >= 50) return '0 0 16px rgba(245,158,11,0.25)'
  return '0 0 16px rgba(249,115,22,0.25)'
}
function getConfidenceLabel(v: number): string {
  if (v >= 80) return 'High'
  if (v >= 70) return 'Good'
  if (v >= 50) return 'Moderate'
  return 'Low'
}
function getConfidenceRingBg(v: number): string {
  if (v >= 80) return 'rgba(16,185,129,0.08)'
  if (v >= 70) return 'rgba(59,130,246,0.08)'
  if (v >= 50) return 'rgba(245,158,11,0.08)'
  return 'rgba(249,115,22,0.08)'
}

// ─── CONFIDENCE RING ─────────────────────────────────────
function ConfidenceRing({
  value,
  size = 56,
  strokeWidth = 3.5,
  animated = true,
  delay = 0,
  showPulse = false,
}: {
  value: number
  size?: number
  strokeWidth?: number
  animated?: boolean
  delay?: number
  showPulse?: boolean
}) {
  const r = (size - strokeWidth * 2) / 2
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - value / 100)
  const color = getConfidenceColor(value)
  const [mounted, setMounted] = useState(false)
  const [hasPulsed, setHasPulsed] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100 + delay)
    return () => clearTimeout(t)
  }, [delay])

  useEffect(() => {
    if (showPulse && mounted) {
      const t = setTimeout(() => setHasPulsed(true), 1200 + delay)
      return () => clearTimeout(t)
    }
  }, [showPulse, mounted, delay])

  const label = getConfidenceLabel(value)

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div
        className={`absolute inset-[-6px] rounded-full transition-opacity duration-700 ${
          mounted && showPulse ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: `radial-gradient(circle, ${getConfidenceRingBg(value).replace('0.08', '0.15')}, transparent 70%)`,
        }}
      />
      <svg width={size} height={size} className="-rotate-90 relative">
        <defs>
          <linearGradient id={`ring-grad-${value}-${delay}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={color} stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(0,0,0,0.04)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#ring-grad-${value}-${delay})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={mounted ? offset : circ}
          style={{
            transition: animated
              ? 'stroke-dashoffset 1.4s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.6s ease'
              : 'none',
            filter: mounted ? `drop-shadow(${getConfidenceGlow(value)})` : 'none',
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-[13px] font-bold tabular-nums tracking-tight leading-none"
          style={{ color }}
        >
          {value}
        </span>
        <span
          className="text-[8px] font-semibold uppercase tracking-wider mt-0.5"
          style={{ color: color, opacity: 0.6 }}
        >
          {label}
        </span>
      </div>
      {showPulse && mounted && !hasPulsed && (
        <div
          className="absolute inset-0 rounded-full confidence-ring-pulse"
          style={
            { '--pulse-color': color.replace(')', ',0.3)').replace('rgb', 'rgba') } as React.CSSProperties
          }
        />
      )}
    </div>
  )
}

// ─── 6-LAYER PROCESSING INDICATOR ────────────────────────
const pipelineSteps = [
  { label: 'Input', icon: <MessageCircle className="w-3 h-3" /> },
  { label: 'Crisis', icon: <Shield className="w-3 h-3" /> },
  { label: 'Classify', icon: <Layers className="w-3 h-3" /> },
  { label: 'Confidence', icon: <Activity className="w-3 h-3" /> },
  { label: 'Display', icon: <Eye className="w-3 h-3" /> },
  { label: 'Escalate', icon: <Zap className="w-3 h-3" /> },
]

function ProcessingPipeline() {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % (pipelineSteps.length + 2))
    }, 200)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      className="flex gap-3 items-start"
    >
      <div className="w-10 h-10 rounded-2xl ai-avatar-orb flex items-center justify-center shrink-0 shadow-lg shadow-gray-900/20">
        <ClearPathLogo className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="glass-card rounded-2xl p-4 border border-gray-100/40">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">
            6-Layer Processing Pipeline
          </p>
          <div className="flex items-center gap-0">
            {pipelineSteps.map((step, i) => (
              <div key={i} className="flex items-center">
                <motion.div
                  initial={{ opacity: 0.3, scale: 0.9 }}
                  animate={{
                    opacity: activeStep >= i ? 1 : 0.3,
                    scale: activeStep >= i ? 1 : 0.9,
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold tracking-wide transition-colors duration-200 ${
                    activeStep === i
                      ? 'bg-gray-900 text-white shadow-md shadow-gray-900/20'
                      : activeStep > i
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/40'
                        : 'bg-gray-50 text-gray-400 border border-gray-100/60'
                  }`}
                >
                  {step.icon}
                  <span className="hidden sm:inline">{step.label}</span>
                </motion.div>
                {i < pipelineSteps.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0.2 }}
                    animate={{ opacity: activeStep > i ? 0.8 : 0.2 }}
                    className="mx-0.5"
                  >
                    <ArrowRight className="w-3 h-3 text-gray-300" />
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1.5 mt-3 px-1">
          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full typing-dot-1" />
          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full typing-dot-2" />
          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full typing-dot-3" />
          <span className="text-[11px] text-gray-400 ml-1.5 font-medium">
            Processing your request…
          </span>
        </div>
      </div>
    </motion.div>
  )
}

// ─── STATUS PILL ──────────────────────────────────────────
function StatusPill({ type, text }: { type: 'crisis' | 'clarify' | 'verified' | 'upgrade'; text: string }) {
  const config: Record<
    string,
    { bg: string; text: string; border: string; dot: string; icon: ReactNode; glow: string }
  > = {
    crisis: {
      bg: 'bg-red-50/80',
      text: 'text-red-700',
      border: 'border-red-200/60',
      dot: 'bg-red-500',
      icon: <AlertTriangle className="w-3 h-3" />,
      glow: '0 0 12px rgba(239,68,68,0.2)',
    },
    clarify: {
      bg: 'bg-amber-50/80',
      text: 'text-amber-700',
      border: 'border-amber-200/60',
      dot: 'bg-amber-500',
      icon: <HelpCircle className="w-3 h-3" />,
      glow: '0 0 12px rgba(245,158,11,0.2)',
    },
    verified: {
      bg: 'bg-emerald-50/80',
      text: 'text-emerald-700',
      border: 'border-emerald-200/60',
      dot: 'bg-emerald-500',
      icon: <ShieldCheck className="w-3 h-3" />,
      glow: '0 0 12px rgba(16,185,129,0.2)',
    },
    upgrade: {
      bg: 'bg-emerald-50/80',
      text: 'text-emerald-700',
      border: 'border-emerald-200/60',
      dot: 'bg-emerald-500',
      icon: <TrendingUp className="w-3 h-3" />,
      glow: '0 0 12px rgba(16,185,129,0.2)',
    },
  }
  const c = config[type]
  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-[11px] font-semibold border ${c.bg} ${c.text} ${c.border} mb-4 backdrop-blur-sm relative overflow-hidden`}
      style={{ boxShadow: c.glow }}
    >
      {(type === 'verified' || type === 'upgrade') && (
        <div className="absolute inset-0 badge-shimmer pointer-events-none" />
      )}
      {c.icon}
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} ${type === 'crisis' ? 'animate-pulse' : ''}`} />
      {text}
    </motion.div>
  )
}

// ─── CATEGORY CARD ───────────────────────────────────────
function CategoryCard({ cat, index }: { cat: Category; index: number }) {
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState(false)
  const low = cat.confidence < 70
  const color = getConfidenceColor(cat.confidence)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25, delay: index * 0.1 }}
      onClick={() => setOpen(!open)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`rounded-2xl cursor-pointer transition-all duration-300 group relative overflow-hidden ${
        low ? 'bg-gradient-to-b from-amber-50/30 via-white to-white' : 'bg-white/60 backdrop-blur-md'
      }`}
      style={{
        border: `1px solid ${hovered ? color + '40' : low ? 'rgba(245,158,11,0.15)' : 'rgba(0,0,0,0.04)'}`,
        boxShadow: hovered
          ? `0 8px 40px -8px ${color}15, 0 2px 12px rgba(0,0,0,0.04), inset 0 0 0 1px ${color}10`
          : '0 2px 8px rgba(0,0,0,0.02), 0 8px 32px rgba(0,0,0,0.03), inset 0 0 0 1px rgba(0,0,0,0.02)',
        transform: hovered ? 'translateY(-2px) scale(1.005)' : 'translateY(0) scale(1)',
      }}
    >
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 card-shine" />

      <div className="p-6 relative">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="w-1.5 h-5 rounded-full" style={{ backgroundColor: color }} />
              <h4 className="text-[15px] font-semibold text-gray-900 leading-tight tracking-tight">
                {cat.label}
              </h4>
            </div>
            <p className="text-[12px] text-gray-400 leading-relaxed pl-4">{cat.why}</p>
          </div>
          <ConfidenceRing value={cat.confidence} size={56} strokeWidth={3.5} delay={index * 120} showPulse />
        </div>

        {cat.warning && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ delay: 0.3 + index * 0.05 }}
            className="flex items-start gap-2 text-[12px] text-amber-700 mb-4 leading-relaxed bg-amber-50/50 rounded-xl px-3.5 py-2.5 border border-amber-100/40"
          >
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-500" />
            {cat.warning}
          </motion.div>
        )}

        {cat.resources.length > 0 && (
          <div className="space-y-3">
            {cat.resources.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.08 + i * 0.06 }}
                className="flex items-start gap-3 group/resource"
              >
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200 group-hover/resource:scale-110"
                  style={{
                    backgroundColor: getConfidenceBg(cat.confidence),
                    borderLeft: `2px solid ${color}`,
                    borderRadius: '4px 4px 4px 4px',
                  }}
                >
                  <Check className="w-3 h-3" style={{ color }} strokeWidth={3} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-[13px] font-medium text-gray-800 leading-tight group-hover/resource:text-gray-900 transition-colors">
                      {r.name}
                    </p>
                    <ArrowRight className="w-3 h-3 text-gray-300 opacity-0 -translate-x-1 group-hover/resource:opacity-100 group-hover/resource:translate-x-0 transition-all duration-200" />
                  </div>
                  <p className="text-[12px] text-gray-500 mt-1 leading-relaxed">{r.detail}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {r.verified && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-semibold bg-emerald-50/60 px-2 py-0.5 rounded-md border border-emerald-100/40 relative overflow-hidden">
                        <ShieldCheck className="w-2.5 h-2.5" />
                        Verified {r.verified}
                        <div className="absolute inset-0 badge-shimmer pointer-events-none" />
                      </span>
                    )}
                    {r.distance && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-blue-600 font-semibold bg-blue-50/60 px-2 py-0.5 rounded-md border border-blue-100/40">
                        <MapPin className="w-2.5 h-2.5" />
                        {r.distance}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-gray-100/60">
                {cat.also && (
                  <p className="text-[12px] text-gray-400 leading-relaxed">
                    <span className="text-gray-500 font-semibold">Also considered: </span>
                    {cat.also}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {cat.also && !open && (
          <div className="mt-3 flex items-center gap-1 text-[11px] text-gray-300 group-hover:text-gray-400 transition-colors">
            <motion.div
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <ChevronDown className="w-3 h-3" />
            </motion.div>
            <span>More details</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ─── CRISIS OVERLAY ───────────────────────────────────────
function CrisisBlock({ lines }: { lines: CrisisLine[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className="rounded-2xl border border-red-200/40 bg-white overflow-hidden relative"
      style={{ boxShadow: '0 8px 48px -12px rgba(239,68,68,0.18), 0 0 0 1px rgba(239,68,68,0.06)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none rounded-2xl"
        style={{ boxShadow: 'inset 0 0 60px rgba(239,68,68,0.06)' }}
      />

      <div className="relative bg-gradient-to-r from-red-600 via-red-500 to-rose-500 px-6 py-6 overflow-hidden">
        <div className="absolute inset-0 crisis-header-pulse opacity-20" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3), transparent 50%)',
          }}
        />
        <div className="relative flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center crisis-pulse">
            <Shield className="w-5.5 h-5.5 text-white heartbeat-icon" />
          </div>
          <div>
            <p className="text-[20px] font-bold text-white tracking-tight leading-tight">
              You are not alone.
            </p>
            <p className="text-[12px] text-red-100/80 mt-1 font-medium">
              Crisis keyword detected — AI classification bypassed
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-3">
        {lines.map((l, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.1, type: 'spring', stiffness: 400, damping: 30 }}
            className="flex items-center gap-4 bg-red-50/30 rounded-xl p-4 border border-red-100/30 hover:bg-red-50/50 transition-colors"
          >
            <div className="w-12 h-12 rounded-2xl bg-red-100/60 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-gray-900 leading-tight">{l.name}</p>
              <p className="text-[12px] text-gray-500 mt-0.5">{l.action}</p>
            </div>
            {l.call && (
              <button className="bg-gradient-to-b from-red-500 to-red-600 text-white text-[13px] font-bold px-6 py-3 rounded-xl shrink-0 hover:from-red-600 hover:to-red-700 transition-all shadow-md shadow-red-500/25 active:scale-95 hover:shadow-lg hover:shadow-red-500/30">
                {l.call}
              </button>
            )}
          </motion.div>
        ))}
        <div className="flex items-center justify-center gap-2 pt-3 pb-1">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Lock className="w-3.5 h-3.5 text-gray-300" />
          </motion.div>
          <p className="text-[11px] text-gray-400 font-medium">Nothing was stored or logged</p>
        </div>
      </div>
    </motion.div>
  )
}

// ─── CLARIFY PANEL ────────────────────────────────────────
function ClarifyPanel({
  confidence,
  clarificationMessage,
  onClarify,
}: {
  confidence: number
  clarificationMessage: string | null
  onClarify: (text: string) => void
}) {
  const clarifyOptions = [
    'Housing or shelter',
    'Food or basic necessities',
    'Health or mental health support',
    'Legal assistance or immigration',
    'Employment or job training',
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className="glass-card rounded-2xl p-6 border border-amber-100/30 relative overflow-hidden"
      style={{ boxShadow: '0 0 40px rgba(245,158,11,0.06), 0 4px 16px rgba(0,0,0,0.04)' }}
    >
      <div className="absolute inset-0 pointer-events-none scanning-line" />

      <div className="flex items-center gap-4 mb-5">
        <div className="relative">
          <ConfidenceRing value={confidence} size={56} strokeWidth={4} showPulse />
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-[-8px] rounded-full border-2 border-amber-400/20"
          />
        </div>
        <div>
          <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
            AI Confidence: {confidence}%
          </p>
          <p className="text-[16px] font-semibold text-gray-900 leading-snug mt-1.5">
            Which best describes what you need?
          </p>
          {clarificationMessage && (
            <p className="text-[12px] text-gray-400 mt-1">{clarificationMessage}</p>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2.5">
        {clarifyOptions.map((opt, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.07, type: 'spring', stiffness: 400, damping: 30 }}
            onClick={() => onClarify(opt)}
            className="w-full text-left bg-white/90 border border-gray-100 rounded-xl px-5 py-3.5 text-[14px] font-medium text-gray-700 active:scale-[0.98] transition-all duration-200 hover:scale-[1.005] flex items-center justify-between group relative overflow-hidden gradient-border-hover"
            style={{
              boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
            }}
          >
            <span>{opt}</span>
            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

// ─── TRANSPARENCY SECTION ─────────────────────────────────
function TransparencyPanel({ items }: { items: string[] }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="mt-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider hover:text-gray-600 transition-colors group"
      >
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </motion.div>
        <Eye className="w-3.5 h-3.5" />
        Why these results?
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-2.5 mt-3 pt-4 border-t border-gray-100/60">
              {items.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex gap-2.5 items-start text-[12px] text-gray-500 leading-relaxed"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-200 shrink-0 mt-[7px]" />
                  {item}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── SUGGESTION CARD ──────────────────────────────────────
function SuggestionCard({
  s,
  index,
  onSelect,
}: {
  s: (typeof starters)[0]
  index: number
  onSelect: (id: string, label: string) => void
}) {
  const iconMap: Record<string, { icon: ReactNode; gradient: string; color: string; glowColor: string }> = {
    layers: {
      icon: <Layers className="w-5 h-5" />,
      gradient: 'from-blue-500/10 to-indigo-500/10',
      color: 'text-blue-600',
      glowColor: 'rgba(59,130,246,0.15)',
    },
    shield: {
      icon: <Shield className="w-5 h-5" />,
      gradient: 'from-red-500/10 to-rose-500/10',
      color: 'text-red-600',
      glowColor: 'rgba(239,68,68,0.15)',
    },
    help: {
      icon: <HelpCircle className="w-5 h-5" />,
      gradient: 'from-amber-500/10 to-orange-500/10',
      color: 'text-amber-600',
      glowColor: 'rgba(245,158,11,0.15)',
    },
    heart: {
      icon: <Heart className="w-5 h-5" />,
      gradient: 'from-pink-500/10 to-rose-500/10',
      color: 'text-pink-600',
      glowColor: 'rgba(236,72,153,0.15)',
    },
    star: {
      icon: <Star className="w-5 h-5" />,
      gradient: 'from-emerald-500/10 to-teal-500/10',
      color: 'text-emerald-600',
      glowColor: 'rgba(16,185,129,0.15)',
    },
  }
  const { icon, gradient, color, glowColor } = iconMap[s.icon] || iconMap.help

  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25, delay: index * 0.08 }}
      onClick={() => onSelect(s.id, s.label)}
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.995 }}
      className="w-full text-left glass-card rounded-2xl px-5 py-5 border border-gray-100/40 group relative overflow-hidden"
      style={{
        boxShadow: '0 2px 8px rgba(0,0,0,0.02), 0 8px 32px rgba(0,0,0,0.04)',
      }}
    >
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          boxShadow: `0 0 0 1px ${glowColor}, 0 8px 32px -4px ${glowColor}`,
        }}
      />
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 card-shine" />

      <div className="flex items-center gap-3.5 mb-2.5 relative">
        <div
          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center ${color} group-hover:scale-110 transition-transform duration-300`}
          style={{ boxShadow: `0 4px 12px ${glowColor}` }}
        >
          {icon}
        </div>
        <div>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{s.label}</p>
        </div>
      </div>
      <p className="text-[14px] text-gray-700 font-medium leading-relaxed pl-[52px] relative">
        &ldquo;{s.description}&rdquo;
      </p>
    </motion.button>
  )
}

// ─── UPGRADE ANIMATION ────────────────────────────────────
function UpgradeAnimation({ from, to, category }: { from: number; to: number; category: string }) {
  const [showParticles, setShowParticles] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShowParticles(true), 600)
    return () => clearTimeout(t)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25, delay: 0.15 }}
      className="flex items-center gap-5 mb-4 p-5 bg-gradient-to-r from-emerald-50/40 via-white to-blue-50/30 rounded-2xl border border-emerald-100/20 relative overflow-hidden"
      style={{ boxShadow: '0 0 40px rgba(16,185,129,0.06), 0 4px 16px rgba(0,0,0,0.03)' }}
    >
      {showParticles && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0.8, x: 0, y: 0 }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0.8, 0.5, 0],
                x: Math.cos((i / 8) * Math.PI * 2) * 40,
                y: Math.sin((i / 8) * Math.PI * 2) * 40,
              }}
              transition={{ duration: 0.8, delay: 0.2 + i * 0.05, ease: 'easeOut' }}
              className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400"
              style={{ left: '15%', top: '50%' }}
            />
          ))}
        </div>
      )}

      <div className="relative shrink-0">
        <motion.div
          initial={{ scale: 1, opacity: 0.4 }}
          animate={{ scale: 0.5, opacity: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <ConfidenceRing value={from} size={56} strokeWidth={3.5} animated={false} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-10"
        >
          <motion.div
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowRight className="w-4 h-4 text-emerald-500" />
          </motion.div>
        </motion.div>

        <div className="ring-morph">
          <ConfidenceRing value={to} size={60} strokeWidth={4} delay={300} showPulse />
        </div>
      </div>
      <div className="relative">
        <p className="text-[15px] font-bold text-gray-900 tracking-tight">{category}</p>
        <p className="text-[13px] text-gray-500 mt-1">
          <span className="line-through text-gray-300 mr-1.5 text-[12px]">{from}%</span>
          <span className="font-bold text-[16px]" style={{ color: getConfidenceColor(to) }}>
            {to}%
          </span>
          <span className="text-gray-400 ml-1.5 text-[12px]">after clarification</span>
        </p>
        <div className="flex items-center gap-1.5 mt-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
          <p className="text-[12px] text-emerald-600 font-bold">+{to - from}% confidence boost</p>
        </div>
      </div>
    </motion.div>
  )
}

// ─── FLOATING PARTICLES ──────────────────────────────────
function FloatingParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-gray-200/60"
          initial={{
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
            opacity: 0,
          }}
          animate={{
            y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 6 + Math.random() * 8,
            repeat: Infinity,
            delay: Math.random() * 4,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// ─── MESSAGE TYPE ────────────────────────────────────────
interface MessageData {
  role: 'user' | 'ai'
  text: string
  isCrisis?: boolean
  crisisLines?: CrisisLine[]
  categories?: Category[]
  statusBadge?: 'crisis' | 'clarify' | 'verified' | 'upgrade'
  upgradeInfo?: { from: number; to: number; category: string }
  isClarify?: boolean
  clarifyConfidence?: number
  clarificationMessage?: string | null
  transparencyItems?: string[]
  model?: string
  conversationId?: string
}

// ─── MAIN ─────────────────────────────────────────────────
export default function Home() {
  const [messages, setMessages] = useState<MessageData[]>([])
  const [suggestions, setSuggestions] = useState(starters)
  const [isTyping, setIsTyping] = useState(false)
  const [inputText, setInputText] = useState('')
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [previousClarifyConfidence, setPreviousClarifyConfidence] = useState<number | null>(null)
  const chatRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [headerScrolled, setHeaderScrolled] = useState(false)

  const scrollToBottom = useCallback(() => {
    if (messages.length > 0 || isTyping) {
      setTimeout(() => {
        chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' })
      }, 80)
    }
  }, [messages.length, isTyping])

  // Fetch resources for categories from the API
  const fetchResourcesForCategories = useCallback(
    async (rawCategories: { label: string; confidence: number }[]): Promise<Record<string, Resource[]>> => {
      const resourcesMap: Record<string, Resource[]> = {}
      const fetches = rawCategories.map(async (cat) => {
        try {
          const res = await fetch(`/api/community-resources?category=${encodeURIComponent(cat.label)}`)
          if (res.ok) {
            const data = await res.json()
            const items: CommunityResource[] = data.resources || []
            resourcesMap[cat.label] = items.slice(0, 3).map((r) => ({
              name: r.name,
              detail: r.description || r.services || 'Community resource available',
              verified: r.verified || undefined,
              distance: r.distance || undefined,
            }))
          }
        } catch {
          // Silently skip resource fetching errors
        }
      })
      await Promise.all(fetches)
      return resourcesMap
    },
    []
  )

  // Call the classify API and process the response
  const classifyText = useCallback(
    async (text: string) => {
      // Add user message
      setMessages((prev) => [...prev, { role: 'user', text }])
      setSuggestions([])
      setIsTyping(true)

      try {
        const res = await fetch('/api/classify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, conversationId }),
        })

        if (!res.ok) {
          throw new Error('Classification failed')
        }

        const data: ClassifyResponse = await res.json()

        // Save conversationId for subsequent requests
        if (data.conversationId) {
          setConversationId(data.conversationId)
        }

        // Fetch resources for each category
        let resourcesMap: Record<string, Resource[]> = {}
        if (data.categories.length > 0 && !data.isCrisis) {
          resourcesMap = await fetchResourcesForCategories(data.categories)
        }

        // Enrich categories with why/also/warning
        const enrichedCategories = enrichCategories(data.categories, resourcesMap)

        // Determine status badge
        let statusBadge: MessageData['statusBadge'] = undefined
        let upgradeInfo: MessageData['upgradeInfo'] = undefined
        let isClarify = false
        let clarifyConfidence: number | undefined
        let transparencyItems: string[] = []

        if (data.isCrisis) {
          statusBadge = 'crisis'
          transparencyItems = [
            'Crisis keywords detected by hardcoded safety layer — not AI',
            'AI models can misclassify crisis situations, so this check runs first and bypasses all AI processing',
            'Your safety is always prioritized over resource matching',
          ]
        } else if (data.needsClarification) {
          statusBadge = 'clarify'
          isClarify = true
          const topConf = data.categories.length > 0 ? data.categories[0].confidence : 0
          clarifyConfidence = topConf
          setPreviousClarifyConfidence(topConf)
          transparencyItems = [
            data.clarificationMessage ||
              'Your request scored below 50% across all categories — too ambiguous for reliable matching',
            'One clarification question can boost confidence by 30-40%, ensuring you get accurate resources',
            'This is active learning — the model uses your answer to refine its classification',
          ]
        } else {
          // Check if this is an upgrade from a previous clarification
          if (previousClarifyConfidence !== null && enrichedCategories.length > 0) {
            const topCat = enrichedCategories[0]
            if (topCat.confidence > previousClarifyConfidence + 10) {
              statusBadge = 'upgrade'
              upgradeInfo = {
                from: previousClarifyConfidence,
                to: topCat.confidence,
                category: topCat.label,
              }
              setPreviousClarifyConfidence(null) // Reset after showing upgrade
            } else {
              statusBadge = 'verified'
            }
          } else {
            statusBadge = 'verified'
          }

          transparencyItems = buildTransparencyItems(data, enrichedCategories)
        }

        setIsTyping(false)
        setMessages((prev) => [
          ...prev,
          {
            role: 'ai',
            text: '',
            isCrisis: data.isCrisis,
            crisisLines: data.crisisLines,
            categories: data.isCrisis ? [] : enrichedCategories,
            statusBadge,
            upgradeInfo,
            isClarify,
            clarifyConfidence,
            clarificationMessage: data.clarificationMessage,
            transparencyItems,
            model: data.model,
            conversationId: data.conversationId,
          },
        ])
      } catch (error) {
        console.error('Classification error:', error)
        setIsTyping(false)
        setMessages((prev) => [
          ...prev,
          {
            role: 'ai',
            text: '',
            statusBadge: 'clarify',
            isClarify: true,
            clarifyConfidence: 0,
            clarificationMessage: 'Something went wrong. Please try again.',
            transparencyItems: ['An error occurred while processing your request'],
          },
        ])
      }
    },
    [conversationId, previousClarifyConfidence, fetchResourcesForCategories]
  )

  const handleSelect = useCallback(
    (id: string, _label: string) => {
      const text = starterTexts[id] || _label
      classifyText(text)
    },
    [classifyText]
  )

  const handleClarifySelect = useCallback(
    (text: string) => {
      classifyText(text)
    },
    [classifyText]
  )

  const handleSend = useCallback(() => {
    const text = inputText.trim()
    if (!text || isTyping) return
    setInputText('')
    classifyText(text)
  }, [inputText, isTyping, classifyText])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend]
  )

  const handleChipClick = useCallback(
    (chip: string) => {
      if (isTyping) return
      classifyText(chip)
    },
    [isTyping, classifyText]
  )

  useEffect(() => {
    // Only auto-scroll when there are actual messages (not on initial welcome state)
    if (messages.length > 0) {
      scrollToBottom()
    }
  }, [messages, isTyping, suggestions, scrollToBottom])

  // Track scroll for header shadow
  useEffect(() => {
    const el = chatRef.current
    if (!el) return
    const handleScroll = () => {
      setHeaderScrolled(el.scrollTop > 10)
    }
    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [])

  const reset = () => {
    setMessages([])
    setSuggestions(starters)
    setConversationId(null)
    setPreviousClarifyConfidence(null)
    setInputText('')
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const hasMessages = messages.length > 0

  return (
    <div className="h-screen flex flex-col overflow-hidden relative">
      {/* Animated mesh gradient background */}
      <div className="absolute inset-0 mesh-gradient-bg" />
      {/* Noise texture overlay */}
      <div className="absolute inset-0 noise-overlay pointer-events-none" />

      {/* ─── HEADER ─── */}
      <div
        className={`shrink-0 border-b z-10 transition-all duration-500 header-glass ${
          headerScrolled
            ? 'border-gray-200/40 shadow-[0_1px_12px_rgba(0,0,0,0.06)]'
            : 'border-gray-100/20'
        }`}
      >
        <div className="max-w-[780px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl ai-avatar-orb flex items-center justify-center shadow-md shadow-gray-900/15">
              <ClearPathLogo className="w-4 h-4 text-white" />
            </div>
            <span className="text-[15px] font-bold text-gray-900 tracking-tight">ClearPath AI</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/30" />
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">LIVE</span>
          </div>
          <div className="flex items-center gap-2">
            {hasMessages && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={reset}
                className="h-8 px-3 flex items-center gap-1.5 rounded-lg hover:bg-gray-100/80 transition-colors text-gray-400 hover:text-gray-600"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="text-[12px] font-medium">New</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* ─── CHAT AREA ─── */}
      <div ref={chatRef} className="flex-1 overflow-y-auto scroll-smooth relative">
        <div className="max-w-[780px] mx-auto px-6 relative">
          {/* Empty state — Premium Welcome */}
          <AnimatePresence mode="wait">
            {!hasMessages && !isTyping && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4 }}
                className="pt-[8vh] pb-8 text-center relative"
              >
                {/* Floating particles */}
                <FloatingParticles />

                {/* Animated gradient orb behind logo */}
                <div className="relative w-28 h-28 mx-auto mb-8">
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                    className="absolute inset-[-20px] rounded-full orb-glow-outer"
                  />
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                    className="absolute inset-[-12px] rounded-full"
                    style={{
                      background:
                        'radial-gradient(circle, rgba(16,185,129,0.12) 0%, rgba(59,130,246,0.08) 40%, transparent 70%)',
                    }}
                  />
                  {/* Logo */}
                  <motion.div
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.2 }}
                    className="w-28 h-28 rounded-[28px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center mx-auto shadow-premium-xl subtle-float relative z-10"
                    style={{
                      background: 'linear-gradient(135deg, #111827, #1f2937, #111827)',
                    }}
                  >
                    <ClearPathLogo className="w-11 h-11 text-white" />
                  </motion.div>
                </div>

                {/* Headline */}
                <motion.h1
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="text-[48px] font-extrabold text-gray-900 tracking-[-0.035em] leading-[1.05]"
                >
                  How can I help?
                </motion.h1>

                {/* Tagline */}
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.6 }}
                  className="text-[16px] text-gray-400 mt-4 max-w-[380px] mx-auto leading-relaxed font-medium"
                >
                  I connect you with verified community resources.
                  <br />
                  <span className="text-gray-500">Calibrated confidence, not guesswork.</span>
                </motion.p>

                {/* Feature badges */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="flex items-center justify-center gap-4 mt-7"
                >
                  {[
                    {
                      icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />,
                      label: 'Verified',
                      color: 'rgba(16,185,129,0.08)',
                    },
                    {
                      icon: <Eye className="w-4 h-4 text-blue-500" />,
                      label: 'Transparent',
                      color: 'rgba(59,130,246,0.08)',
                    },
                    {
                      icon: <Sparkles className="w-4 h-4 text-amber-500" />,
                      label: 'Classified',
                      color: 'rgba(245,158,11,0.08)',
                    },
                  ].map((badge, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + i * 0.08 }}
                      className="flex items-center gap-2 text-[12px] text-gray-500 font-semibold px-4 py-2 rounded-full border border-gray-100/40 backdrop-blur-md"
                      style={{
                        background: `rgba(255,255,255,0.5)`,
                        boxShadow: `0 2px 8px ${badge.color}, inset 0 0 0 1px rgba(255,255,255,0.3)`,
                      }}
                    >
                      {badge.icon}
                      {badge.label}
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Suggestion Cards (only in welcome state) */}
          <AnimatePresence>
            {!hasMessages && !isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.8 }}
                className="space-y-2 pb-6"
              >
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 text-center">
                  Try a scenario
                </p>
                {starters.map((s, i) => (
                  <SuggestionCard key={i} s={s} index={i} onSelect={handleSelect} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Messages */}
          {hasMessages && (
            <div className="space-y-6 pt-6 pb-6">
              <AnimatePresence mode="popLayout">
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 26 }}
                  >
                    {msg.role === 'user' ? (
                      /* ─── User Message ─── */
                      <div className="flex justify-end">
                        <div
                          className="max-w-[85%] relative overflow-hidden rounded-2xl rounded-br-sm px-5 py-3.5"
                          style={{
                            background: 'linear-gradient(135deg, #2563EB, #1d4ed8)',
                            boxShadow:
                              '0 4px 16px rgba(37,99,235,0.2), 0 1px 3px rgba(37,99,235,0.1)',
                          }}
                        >
                          <div className="absolute inset-0 pointer-events-none user-bubble-shine" />
                          <p className="text-[14px] leading-relaxed text-white font-medium relative">
                            {msg.text}
                          </p>
                        </div>
                      </div>
                    ) : (
                      /* ─── AI Message ─── */
                      <div className="flex gap-3 items-start">
                        <div className="w-10 h-10 rounded-2xl ai-avatar-orb flex items-center justify-center shrink-0 mt-0.5 shadow-lg shadow-gray-900/15">
                          <ClearPathLogo className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          {/* Status badge */}
                          {msg.statusBadge === 'crisis' && (
                            <StatusPill
                              type="crisis"
                              text="Crisis detected — AI classification bypassed"
                            />
                          )}
                          {msg.statusBadge === 'clarify' && (
                            <StatusPill
                              type="clarify"
                              text="Confidence too low — clarification needed"
                            />
                          )}
                          {msg.statusBadge === 'verified' &&
                            msg.categories &&
                            msg.categories.length > 0 && (
                              <StatusPill
                                type="verified"
                                text={`${msg.categories.length} verified resource${msg.categories.length > 1 ? 's' : ''} found`}
                              />
                            )}
                          {msg.statusBadge === 'upgrade' && msg.upgradeInfo && (
                            <StatusPill
                              type="upgrade"
                              text={`Confidence upgraded: ${msg.upgradeInfo.from}% → ${msg.upgradeInfo.to}%`}
                            />
                          )}

                          {/* Confidence upgrade animation */}
                          {msg.upgradeInfo && (
                            <UpgradeAnimation
                              from={msg.upgradeInfo.from}
                              to={msg.upgradeInfo.to}
                              category={msg.upgradeInfo.category}
                            />
                          )}

                          {/* Crisis */}
                          {msg.isCrisis && msg.crisisLines && (
                            <>
                              <p className="text-[14px] text-gray-700 leading-relaxed mb-4 font-medium">
                                I hear you, and I want to make sure you&apos;re safe right now. You
                                don&apos;t have to go through this alone.
                              </p>
                              <CrisisBlock lines={msg.crisisLines} />
                              <TransparencyPanel items={msg.transparencyItems || []} />
                            </>
                          )}

                          {/* Clarification */}
                          {msg.isClarify && (
                            <>
                              <p className="text-[14px] text-gray-700 leading-relaxed mb-4 font-medium">
                                I want to help, but I need to understand your situation better to find
                                the right resources.
                              </p>
                              <ClarifyPanel
                                confidence={msg.clarifyConfidence || 0}
                                clarificationMessage={msg.clarificationMessage || null}
                                onClarify={handleClarifySelect}
                              />
                              <TransparencyPanel items={msg.transparencyItems || []} />
                            </>
                          )}

                          {/* Categories */}
                          {msg.categories &&
                            msg.categories.length > 0 &&
                            !msg.isCrisis &&
                            !msg.isClarify && (
                              <div className="space-y-3">
                                {msg.categories.map((cat, j) => (
                                  <CategoryCard key={j} cat={cat} index={j} />
                                ))}
                              </div>
                            )}

                          {/* Transparency for regular results */}
                          {msg.categories &&
                            msg.categories.length > 0 &&
                            !msg.isCrisis &&
                            !msg.isClarify &&
                            msg.transparencyItems && (
                              <TransparencyPanel items={msg.transparencyItems} />
                            )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* 6-Layer Processing Pipeline */}
              <AnimatePresence>{isTyping && <ProcessingPipeline />}</AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* ─── FLOATING NAVIGATOR BUTTON ─── */}
      {hasMessages && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25, delay: 0.5 }}
          className="fixed bottom-24 right-6 z-20"
        >
          <button className="flex items-center gap-2.5 text-white text-[13px] font-bold px-6 py-3.5 rounded-2xl navigator-btn-glow hover:shadow-xl active:scale-95 transition-transform relative overflow-hidden">
            <div className="absolute inset-0 navigator-gradient-bg" />
            <span className="relative flex items-center gap-2.5">
              <Navigation className="w-4 h-4" />
              Talk to a Navigator
            </span>
          </button>
        </motion.div>
      )}

      {/* ─── INPUT BAR ─── */}
      <div className="shrink-0 border-t border-gray-100/40 relative z-10 input-bar-glass">
        <div className="max-w-[780px] mx-auto px-6 py-3">
          {/* Quick suggestion chips */}
          {!hasMessages && (
            <div className="flex flex-wrap gap-2 mb-3 justify-center">
              {quickChips.map((chip, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + i * 0.06 }}
                  onClick={() => handleChipClick(chip)}
                  className="text-[12px] font-medium text-gray-500 bg-white/70 hover:bg-white border border-gray-100/60 hover:border-gray-200/80 rounded-full px-3.5 py-1.5 transition-all hover:shadow-sm active:scale-95"
                >
                  {chip}
                </motion.button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 glass-card rounded-2xl px-5 py-3.5 border border-gray-100/30 focus-within:border-gray-200/60 transition-all duration-300 relative overflow-hidden input-focus-ring">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isTyping
                  ? 'Processing...'
                  : hasMessages
                    ? 'Ask another question or describe a different need...'
                    : 'Describe what you need...'
              }
              className="flex-1 bg-transparent text-[14px] outline-none text-gray-900 placeholder:text-gray-300 font-medium relative z-10"
              disabled={isTyping}
            />
            <button
              onClick={handleSend}
              disabled={isTyping || !inputText.trim()}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center shrink-0 shadow-sm shadow-gray-900/10 relative z-10 hover:from-gray-800 hover:to-gray-700 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
          <p className="text-[11px] text-gray-300 text-center mt-2.5 flex items-center justify-center gap-2 font-medium">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/30" />
            ClearPath AI — Verified resources · Calibrated confidence
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── HELPERS ─────────────────────────────────────────────
function buildTransparencyItems(
  data: ClassifyResponse,
  categories: Category[]
): string[] {
  const items: string[] = []

  items.push(
    `Classified by ${data.model || 'BART-large-MNLI zero-shot model'} against 8 service categories`
  )

  if (data.confidenceTiers) {
    const { high, moderate, low, hidden } = data.confidenceTiers
    if (high.length > 0) {
      items.push(
        `High confidence: ${high.map((c) => `${c.label} (${c.confidence}%)`).join(', ')}`
      )
    }
    if (moderate.length > 0) {
      items.push(
        `Moderate confidence: ${moderate.map((c) => `${c.label} (${c.confidence}%)`).join(', ')}`
      )
    }
    if (low.length > 0) {
      items.push(
        `Low confidence: ${low.map((c) => `${c.label} (${c.confidence}%)`).join(', ')}`
      )
    }
    if (hidden > 0) {
      items.push(`${hidden} categor${hidden === 1 ? 'y' : 'ies'} below display threshold (hidden)`)
    }
  }

  items.push('Resources sourced from United Way 211 verified database')

  const lowConf = categories.filter((c) => c.confidence < 70)
  if (lowConf.length > 0) {
    items.push(
      `${lowConf.map((c) => c.label).join(', ')} below 70% threshold — consider providing more detail for better matches`
    )
  }

  return items
}
