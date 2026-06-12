'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
// ═══════════════════════════════════════════════════════════════
// FONTS — Defined in layout.tsx, accessed via CSS variables
// ═══════════════════════════════════════════════════════════════

const FONT_PLAYFAIR = 'var(--font-playfair), "Playfair Display", Georgia, serif'
const FONT_CORMORANT = 'var(--font-cormorant), "Cormorant Garamond", Georgia, serif'
const FONT_INTER = 'var(--font-inter), "Inter", -apple-system, sans-serif'

// ═══════════════════════════════════════════════════════════════
// PALETTE
// ═══════════════════════════════════════════════════════════════

const COLORS = {
  gold: '#D4A853',
  goldLight: '#F0D68A',
  goldDark: '#A07830',
  terracotta: '#C75B39',
  brick: '#B23421',
  deepBrown: '#483924',
  cream: '#FDF5E6',
  ivory: '#FFFFF0',
  bgDark: '#0D0A07',
  bgWarm: '#1A1410',
  bgCard: '#16120E',
  bgCardHover: '#1E1812',
  hopeBlue: '#4A90D9',
  hopeViolet: '#7B5EA7',
  hopeRose: '#D4728C',
  hopeEmerald: '#2E8B6E',
  hopeAmber: '#E8A838',
  textPrimary: '#F5EDE0',
  textSecondary: 'rgba(245, 237, 224, 0.55)',
  textTertiary: 'rgba(245, 237, 224, 0.3)',
  border: 'rgba(212, 168, 83, 0.12)',
  borderHover: 'rgba(212, 168, 83, 0.25)',
}

// ═══════════════════════════════════════════════════════════════
// IMPACT DATA
// ═══════════════════════════════════════════════════════════════

interface ImpactTier {
  id: string
  amount: number
  label: string
  subtitle: string
  description: string
  details: string[]
  color: string
  icon: string
}

const IMPACT_TIERS: ImpactTier[] = [
  {
    id: 'supplies',
    amount: 5000,
    label: 'Fournitures',
    subtitle: 'Le premier pas vers le savoir',
    description: 'Fournitures scolaires complètes pour 10 filles pendant une anneee entiere. Cahiers, manuels, instruments de geometrie, et tout le materiel necessaire pour apprendre dans de bonnes conditions.',
    details: ['Cahiers et manuels scolaires', 'Instruments de geometrie et calculatrices', 'Cartables et trousses completes', 'Materiel artistique pour les ateliers creatifs'],
    color: COLORS.hopeAmber,
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  },
  {
    id: 'classroom',
    amount: 25000,
    label: 'Salle de classe',
    subtitle: 'Un espace pour grandir',
    description: 'Equipement complet d\'une salle de classe dediee : bureaux, chaises, tableau interactif, eclairage adequat et ventilation. Un environnement d\'apprentissage digne de ces jeunes filles.',
    details: ['Bureaux et chaises pour 30 eleves', 'Tableau blanc interactif et projection', 'Eclairage LED et ventilation', 'Bibliotheque de classe avec 200 ouvrages'],
    color: COLORS.hopeEmerald,
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  },
  {
    id: 'dormitory',
    amount: 100000,
    label: 'Dortoir',
    subtitle: 'Un foyer, une securite',
    description: 'Construction et amenagement complet d\'un dortoir pour 20 filles. Lits, linge de maison, espaces de vie commune, sanitaires prives et une piece de detente pour qu\'elles se sentent chez elles.',
    details: ['20 lits avec literie complete', 'Sanitaires et douches prives', 'Espace commun et salle de detente', 'Linge de maison et rangements individuels'],
    color: COLORS.hopeBlue,
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  },
  {
    id: 'kitchen',
    amount: 150000,
    label: 'Cuisine et refectoire',
    subtitle: 'Nourrir le corps et l\'esprit',
    description: 'Une cuisine professionnelle et un refectoire ou chaque fille prend ses repas dans la dignite. Equipement professionnel, stockage alimentaire, et un espace chaleureux pour les repas en communaute.',
    details: ['Cuisine professionnelle equipee', 'Refectoire pour 60 couverts', 'Chaine froide et stockage alimentaire', 'Programme nutritionnel equilibre'],
    color: COLORS.terracotta,
    icon: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z',
  },
  {
    id: 'operation',
    amount: 500000,
    label: 'Fonctionnement annuel',
    subtitle: 'Assurer la perennite',
    description: 'Le fonctionnement complet du pensionnat pendant une annee entiere. Personnel encadrant, programmes educatifs, suivi sanitaire, activites parascolaires et tout ce qui fait d\'un pensionnat un veritable foyer.',
    details: ['Equipe educative et encadrante complete', 'Programmes scolaires et parascolaires', 'Suivi medical et psychologique', 'Activites sportives, culturelles et artistiques'],
    color: COLORS.hopeViolet,
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  },
]

// ═══════════════════════════════════════════════════════════════
// ANIMATED COUNTER
// ═══════════════════════════════════════════════════════════════

function AnimatedCounter({ value, duration = 1.5, prefix = '', suffix = '' }: {
  value: number
  duration?: number
  prefix?: string
  suffix?: string
}) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const start = performance.now()
    const animate = (now: number) => {
      const elapsed = (now - start) / 1000
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4)
      setDisplay(Math.round(eased * value))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [inView, value, duration])

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{display.toLocaleString('fr-FR')}{suffix}
    </span>
  )
}

// ═══════════════════════════════════════════════════════════════
// PROGRESS BAR
// ═══════════════════════════════════════════════════════════════

function ImpactProgress({ amount, total = 500000 }: { amount: number; total?: number }) {
  const percentage = Math.min((amount / total) * 100, 100)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  return (
    <div ref={ref} className="w-full">
      <div className="flex justify-between items-baseline mb-3">
        <span style={{ color: COLORS.textSecondary, fontFamily: FONT_INTER }} className="text-xs tracking-widest uppercase">
          Objectif
        </span>
        <span style={{ color: COLORS.textSecondary, fontFamily: FONT_INTER }} className="text-xs tracking-wide">
          {percentage.toFixed(1)}%
        </span>
      </div>
      <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: 'rgba(212, 168, 83, 0.08)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${COLORS.goldDark}, ${COLORS.gold}, ${COLORS.goldLight})`,
          }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${percentage}%` } : { width: 0 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <div className="flex justify-between items-baseline mt-3">
        <span style={{ color: COLORS.gold, fontFamily: FONT_PLAYFAIR }} className="text-lg font-bold">
          <AnimatedCounter value={amount} prefix="" suffix=" MAD" />
        </span>
        <span style={{ color: COLORS.textTertiary, fontFamily: FONT_INTER }} className="text-xs">
          sur {total.toLocaleString('fr-FR')} MAD
        </span>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// IMPACT CARD
// ═══════════════════════════════════════════════════════════════

function ImpactCard({ tier, index, isActive, onClick }: {
  tier: ImpactTier
  index: number
  isActive: boolean
  onClick: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      className="cursor-pointer group"
    >
      <div
        className="relative overflow-hidden rounded-lg transition-all duration-500"
        style={{
          backgroundColor: isActive ? COLORS.bgCardHover : COLORS.bgCard,
          border: `1px solid ${isActive ? tier.color + '40' : COLORS.border}`,
          boxShadow: isActive ? `0 0 40px ${tier.color}10` : 'none',
        }}
      >
        {/* Top accent line */}
        <div
          className="h-px w-full transition-all duration-700"
          style={{
            background: isActive
              ? `linear-gradient(90deg, transparent, ${tier.color}, transparent)`
              : 'transparent',
          }}
        />

        <div className="p-6 md:p-8">
          {/* Amount + Icon row */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <div
                className="text-3xl md:text-4xl font-bold tracking-tight"
                style={{
                  color: tier.color,
                  fontFamily: FONT_PLAYFAIR,
                }}
              >
                <AnimatedCounter value={tier.amount} suffix=" MAD" duration={2} />
              </div>
              <div
                className="text-lg font-semibold mt-1"
                style={{
                  color: COLORS.textPrimary,
                  fontFamily: FONT_CORMORANT,
                  letterSpacing: '0.04em',
                }}
              >
                {tier.label}
              </div>
            </div>
            <div
              className="w-10 h-10 rounded-md flex items-center justify-center transition-all duration-500"
              style={{
                backgroundColor: isActive ? tier.color + '18' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${isActive ? tier.color + '30' : 'transparent'}`,
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke={isActive ? tier.color : COLORS.textTertiary}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={tier.icon} />
              </svg>
            </div>
          </div>

          {/* Subtitle */}
          <div
            className="text-sm mb-4"
            style={{
              color: COLORS.textSecondary,
              fontFamily: FONT_CORMORANT,
              letterSpacing: '0.06em',
            }}
          >
            {tier.subtitle}
          </div>

          {/* Expandable content */}
          <AnimatePresence>
            {isActive && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="pt-4 border-t" style={{ borderColor: COLORS.border }}>
                  <p
                    className="text-sm leading-relaxed mb-5"
                    style={{
                      color: COLORS.textSecondary,
                      fontFamily: FONT_INTER,
                      lineHeight: '1.8',
                    }}
                  >
                    {tier.description}
                  </p>
                  <div className="space-y-2.5">
                    {tier.details.map((detail, i) => (
                      <motion.div
                        key={detail}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                        className="flex items-start gap-3"
                      >
                        <div
                          className="w-1 h-1 rounded-full mt-2 flex-shrink-0"
                          style={{ backgroundColor: tier.color }}
                        />
                        <span
                          className="text-sm"
                          style={{
                            color: 'rgba(245, 237, 224, 0.7)',
                            fontFamily: FONT_INTER,
                          }}
                        >
                          {detail}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Expand indicator */}
          <div className="flex items-center justify-center mt-4">
            <motion.svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke={isActive ? tier.color : COLORS.textTertiary}
              strokeWidth="1.5"
              animate={{ rotate: isActive ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <path d="M6 9l6 6 6-6" />
            </motion.svg>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════
// GOLD DIVIDER
// ═══════════════════════════════════════════════════════════════

function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-4 my-12 md:my-16">
      <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, transparent, ${COLORS.border})` }} />
      <svg width="16" height="16" viewBox="0 0 16 16">
        <polygon points="8,1 15,5 15,11 8,15 1,11 1,5" fill="none" stroke={COLORS.gold} strokeWidth="0.5" opacity="0.4" />
      </svg>
      <div className="h-px flex-1" style={{ background: `linear-gradient(270deg, transparent, ${COLORS.border})` }} />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// FLOATING PARTICLES (subtle background)
// ═══════════════════════════════════════════════════════════════

function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5 + 0.3,
      speedX: (Math.random() - 0.5) * 0.15,
      speedY: (Math.random() - 0.5) * 0.1 - 0.05,
      opacity: Math.random() * 0.25 + 0.05,
    }))

    let animationId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.speedX
        p.y += p.speedY
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(212, 168, 83, ${p.opacity})`
        ctx.fill()
      })
      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => cancelAnimationFrame(animationId)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}

// ═══════════════════════════════════════════════════════════════
// INTERACTIVE SLIDER
// ═══════════════════════════════════════════════════════════════

function ImpactSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const sliderRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleMove = useCallback((clientX: number) => {
    if (!sliderRef.current) return
    const rect = sliderRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
    const percentage = x / rect.width
    const newValue = Math.round(percentage * 500000 / 1000) * 1000
    onChange(Math.max(0, Math.min(500000, newValue)))
  }, [onChange])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    handleMove(e.clientX)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    handleMove(e.touches[0].clientX)
  }

  useEffect(() => {
    if (!isDragging) return
    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX)
    const handleTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX)
    const handleUp = () => setIsDragging(false)

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleTouchMove)
    window.addEventListener('mouseup', handleUp)
    window.addEventListener('touchend', handleUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('mouseup', handleUp)
      window.removeEventListener('touchend', handleUp)
    }
  }, [isDragging, handleMove])

  const percentage = (value / 500000) * 100

  // Find the current tier color
  const currentTier = [...IMPACT_TIERS].reverse().find(t => value >= t.amount)
  const activeColor = currentTier?.color || COLORS.gold

  return (
    <div className="w-full">
      <div
        ref={sliderRef}
        className="relative w-full h-2 rounded-full cursor-pointer select-none"
        style={{ backgroundColor: 'rgba(212, 168, 83, 0.08)' }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Fill */}
        <div
          className="absolute top-0 left-0 h-full rounded-full transition-all duration-150"
          style={{
            width: `${percentage}%`,
            background: `linear-gradient(90deg, ${COLORS.goldDark}, ${activeColor})`,
          }}
        />

        {/* Tier markers */}
        {IMPACT_TIERS.map((tier) => {
          const tierPos = (tier.amount / 500000) * 100
          return (
            <div
              key={tier.id}
              className="absolute top-1/2 -translate-y-1/2"
              style={{ left: `${tierPos}%` }}
            >
              <div
                className="w-0.5 h-4 -translate-x-1/2"
                style={{ backgroundColor: value >= tier.amount ? tier.color + '60' : 'rgba(255,255,255,0.08)' }}
              />
            </div>
          )
        })}

        {/* Thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full transition-all duration-150"
          style={{
            left: `${percentage}%`,
            backgroundColor: activeColor,
            boxShadow: `0 0 20px ${activeColor}40, 0 0 6px ${activeColor}60`,
            transform: `translate(-50%, -50%) scale(${isDragging ? 1.3 : 1})`,
          }}
        />
      </div>

      {/* Current value display */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-xs tracking-widest uppercase" style={{ color: COLORS.textTertiary, fontFamily: FONT_INTER }}>
          0 MAD
        </span>
        <div
          className="text-2xl font-bold"
          style={{ color: activeColor, fontFamily: FONT_PLAYFAIR }}
        >
          {value.toLocaleString('fr-FR')} MAD
        </div>
        <span className="text-xs tracking-widest uppercase" style={{ color: COLORS.textTertiary, fontFamily: FONT_INTER }}>
          500 000 MAD
        </span>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// VISUAL IMPACT OVERLAY
// ═══════════════════════════════════════════════════════════════

function ImpactVisualization({ amount }: { amount: number }) {
  const currentTier = [...IMPACT_TIERS].reverse().find(t => amount >= t.amount)
  const tierIndex = currentTier ? IMPACT_TIERS.indexOf(currentTier) : -1
  const progress = currentTier ? Math.min(amount / currentTier.amount, 2) : 0

  // SVG building that lights up based on tier
  const windowCount = 14
  const litWindows = Math.round((tierIndex + 1) / IMPACT_TIERS.length * windowCount)

  return (
    <div className="relative w-full h-48 md:h-64 flex items-center justify-center">
      <svg viewBox="0 0 800 300" className="w-full h-full" style={{ maxHeight: '300px' }}>
        {/* Building outline */}
        <rect x="150" y="60" width="500" height="220" rx="2" fill="none" stroke="rgba(212,168,83,0.15)" strokeWidth="1" />
        <rect x="170" y="40" width="460" height="20" rx="1" fill="none" stroke="rgba(212,168,83,0.1)" strokeWidth="0.5" />

        {/* Windows row 1 */}
        {Array.from({ length: 7 }).map((_, i) => (
          <rect
            key={`w1-${i}`}
            x={190 + i * 65}
            y="90"
            width="40"
            height="50"
            rx="1"
            fill={i < litWindows ? `rgba(212, 168, 83, ${0.15 + progress * 0.1})` : 'rgba(255,255,255,0.02)'}
            stroke={i < litWindows ? 'rgba(212,168,83,0.3)' : 'rgba(255,255,255,0.04)'}
            strokeWidth="0.5"
          />
        ))}

        {/* Windows row 2 */}
        {Array.from({ length: 7 }).map((_, i) => (
          <rect
            key={`w2-${i}`}
            x={190 + i * 65}
            y="165"
            width="40"
            height="50"
            rx="1"
            fill={i < litWindows - 7 ? `rgba(212, 168, 83, ${0.15 + progress * 0.1})` : 'rgba(255,255,255,0.02)'}
            stroke={i < litWindows - 7 ? 'rgba(212,168,83,0.3)' : 'rgba(255,255,255,0.04)'}
            strokeWidth="0.5"
          />
        ))}

        {/* Door */}
        <path d="M360,280 L360,270 A40,40 0 0,1 440,270 L440,280 Z" fill="none" stroke={currentTier ? currentTier.color + '40' : 'rgba(212,168,83,0.1)'} strokeWidth="1" />

        {/* Glow above lit windows */}
        {currentTier && (
          <ellipse
            cx="400"
            cy="60"
            rx="250"
            ry="40"
            fill={`url(#buildingGlow)`}
            opacity={progress * 0.3}
          />
        )}

        <defs>
          <radialGradient id="buildingGlow" cx="50%" cy="100%" r="80%">
            <stop offset="0%" stopColor={currentTier?.color || COLORS.gold} stopOpacity="0.4" />
            <stop offset="100%" stopColor={currentTier?.color || COLORS.gold} stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════

export default function CouleurDeLEspoirImpact() {
  const [activeTier, setActiveTier] = useState<string | null>(null)
  const [sliderValue, setSliderValue] = useState(0)

  // Auto-activate first tier on load
  const initialized = useRef(false)
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      setTimeout(() => setActiveTier('supplies'), 800)
    }
  }, [])

  const currentSliderTier = [...IMPACT_TIERS].reverse().find(t => sliderValue >= t.amount)

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: COLORS.bgDark, color: COLORS.textPrimary }}
    >
      <FloatingParticles />

      {/* ═══ HEADER ═══ */}
      <header className="relative z-10 w-full" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <svg width="28" height="28" viewBox="0 0 28 28">
              <polygon points="14,1 27,8 27,20 14,27 1,20 1,8" fill="none" stroke={COLORS.gold} strokeWidth="0.8" opacity="0.6" />
              <polygon points="14,5 23,10 23,18 14,23 5,18 5,10" fill="none" stroke={COLORS.gold} strokeWidth="0.4" opacity="0.3" />
            </svg>
            <span
              className="text-xs tracking-[0.3em] uppercase"
              style={{ color: COLORS.textSecondary, fontFamily: FONT_INTER }}
            >
              Fondation TGCC
            </span>
          </div>
          <div
            className="text-xs tracking-[0.2em] uppercase"
            style={{ color: COLORS.textTertiary, fontFamily: FONT_INTER }}
          >
            1er Juillet 2025
          </div>
        </div>
      </header>

      {/* ═══ HERO ═══ */}
      <main className="relative z-10 flex-1">
        <section className="max-w-7xl mx-auto px-6 md:px-12 pt-16 md:pt-24 pb-8 md:pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <div
              className="text-xs tracking-[0.35em] uppercase mb-6"
              style={{ color: COLORS.gold, fontFamily: FONT_INTER }}
            >
              Calculateur d&apos;impact
            </div>
            <h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6"
              style={{ fontFamily: FONT_PLAYFAIR }}
            >
              <span style={{ color: COLORS.cream }}>Votre geste,</span>
              <br />
              <span style={{
                background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.terracotta}, ${COLORS.hopeRose})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                leur avenir
              </span>
            </h1>
            <p
              className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
              style={{ color: COLORS.textSecondary, fontFamily: FONT_CORMORANT, letterSpacing: '0.03em' }}
            >
              Chaque contribution finance directement la construction d&apos;un pensionnat pour les jeunes filles de 12 a 20 ans a Casablanca. Decouvrez ce que votre generosite rend possible.
            </p>
          </motion.div>
        </section>

        {/* ═══ PROGRESS SECTION ═══ */}
        <section className="max-w-4xl mx-auto px-6 md:px-12 py-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-lg p-8 md:p-10"
            style={{
              backgroundColor: COLORS.bgCard,
              border: `1px solid ${COLORS.border}`,
            }}
          >
            <div
              className="text-xs tracking-[0.25em] uppercase mb-6"
              style={{ color: COLORS.gold, fontFamily: FONT_INTER }}
            >
              Etat des collectes
            </div>
            <ImpactProgress amount={320000} total={500000} />
          </motion.div>
        </section>

        <GoldDivider />

        {/* ═══ INTERACTIVE SLIDER ═══ */}
        <section className="max-w-4xl mx-auto px-6 md:px-12 py-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="text-xs tracking-[0.25em] uppercase mb-8 text-center"
              style={{ color: COLORS.gold, fontFamily: FONT_INTER }}
            >
              Simulez votre contribution
            </div>

            <ImpactSlider value={sliderValue} onChange={setSliderValue} />

            {/* Result display */}
            <AnimatePresence mode="wait">
              {currentSliderTier && sliderValue > 0 && (
                <motion.div
                  key={currentSliderTier.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="mt-8 text-center"
                >
                  <div
                    className="text-xl md:text-2xl font-semibold"
                    style={{ color: currentSliderTier.color, fontFamily: FONT_CORMORANT, letterSpacing: '0.04em' }}
                  >
                    {currentSliderTier.label}
                  </div>
                  <p
                    className="text-sm mt-2 max-w-lg mx-auto"
                    style={{ color: COLORS.textSecondary, fontFamily: FONT_INTER, lineHeight: '1.7' }}
                  >
                    {currentSliderTier.subtitle}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Building visualization */}
            <ImpactVisualization amount={sliderValue} />
          </motion.div>
        </section>

        <GoldDivider />

        {/* ═══ IMPACT TIERS GRID ═══ */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-8 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-12"
          >
            <div
              className="text-xs tracking-[0.25em] uppercase mb-4"
              style={{ color: COLORS.gold, fontFamily: FONT_INTER }}
            >
              Ce que chaque montant rend possible
            </div>
            <h2
              className="text-3xl md:text-4xl font-bold"
              style={{ fontFamily: FONT_PLAYFAIR, color: COLORS.cream }}
            >
              L&apos;impact en detail
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {IMPACT_TIERS.map((tier, index) => (
              <ImpactCard
                key={tier.id}
                tier={tier}
                index={index}
                isActive={activeTier === tier.id}
                onClick={() => setActiveTier(activeTier === tier.id ? null : tier.id)}
              />
            ))}
          </div>
        </section>

        <GoldDivider />

        {/* ═══ KEY NUMBERS ═══ */}
        <section className="max-w-5xl mx-auto px-6 md:px-12 py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: 60, suffix: '', label: 'Filles hebergees', color: COLORS.gold },
              { value: 12, suffix: '-20', label: 'Ans', color: COLORS.hopeEmerald },
              { value: 1, suffix: '', label: 'Pensionnat', color: COLORS.hopeViolet },
              { value: 1, suffix: '', label: 'Objectif commun', color: COLORS.hopeRose },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div
                  className="text-4xl md:text-5xl font-bold mb-2"
                  style={{ color: stat.color, fontFamily: FONT_PLAYFAIR }}
                >
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div
                  className="text-xs tracking-[0.2em] uppercase"
                  style={{ color: COLORS.textSecondary, fontFamily: FONT_INTER }}
                >
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <GoldDivider />

        {/* ═══ ABOUT / CONTEXT ═══ */}
        <section className="max-w-4xl mx-auto px-6 md:px-12 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <div
              className="text-xs tracking-[0.25em] uppercase mb-6"
              style={{ color: COLORS.gold, fontFamily: FONT_INTER }}
            >
              A propos
            </div>
            <h2
              className="text-2xl md:text-3xl font-bold mb-8"
              style={{ fontFamily: FONT_PLAYFAIR, color: COLORS.cream }}
            >
              Couleur de l&apos;Espoir
            </h2>
            <p
              className="text-base leading-[1.9] max-w-2xl mx-auto"
              style={{ color: COLORS.textSecondary, fontFamily: FONT_CORMORANT, letterSpacing: '0.02em' }}
            >
              Le 1er juillet 2025, la Fondation TGCC organise a Casablanca une vente aux encheres caritative au profit de la construction d&apos;un pensionnat pour jeunes filles. Des artistes engagees offrent leurs oeuvres pour que chaque enchere devienne une pierre de cet edifice. Un lieu d&apos;accueil, d&apos;apprentissage et d&apos;emancipation pour celles qui n&apos;ont pas acces a l&apos;education qu&apos;elles meritent.
            </p>
          </motion.div>
        </section>
      </main>

      {/* ═══ FOOTER ═══ */}
      <footer
        className="relative z-10 mt-auto"
        style={{ borderTop: `1px solid ${COLORS.border}` }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <svg width="18" height="18" viewBox="0 0 28 28">
              <polygon points="14,1 27,8 27,20 14,27 1,20 1,8" fill="none" stroke={COLORS.gold} strokeWidth="0.8" opacity="0.4" />
            </svg>
            <span
              className="text-xs tracking-[0.2em]"
              style={{ color: COLORS.textTertiary, fontFamily: FONT_INTER }}
            >
              Fondation TGCC — Couleur de l&apos;Espoir
            </span>
          </div>
          <span
            className="text-xs tracking-[0.15em]"
            style={{ color: COLORS.textTertiary, fontFamily: FONT_INTER }}
          >
            fondationtgcc.com
          </span>
        </div>
      </footer>
    </div>
  )
}
