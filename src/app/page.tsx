'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

// Suppress unused import warning - useRef is used by Counter, ProgressBar, Card, Slider

const F = {
  display: 'var(--font-playfair), "Playfair Display", Georgia, serif',
  elegant: 'var(--font-cormorant), "Cormorant Garamond", Georgia, serif',
  body: 'var(--font-inter), "Inter", -apple-system, sans-serif',
}

const C = {
  gold: '#D4A853',
  goldLight: '#F0D68A',
  goldDark: '#A07830',
  terracotta: '#C75B39',
  cream: '#FDF5E6',
  bg: '#0D0A07',
  bgCard: '#16120E',
  bgCardH: '#1E1812',
  blue: '#4A90D9',
  violet: '#7B5EA7',
  rose: '#D4728C',
  emerald: '#2E8B6E',
  amber: '#E8A838',
  txt: '#F5EDE0',
  txt2: 'rgba(245,237,224,0.55)',
  txt3: 'rgba(245,237,224,0.3)',
  border: 'rgba(212,168,83,0.12)',
}

interface Tier {
  id: string
  amount: number
  label: string
  subtitle: string
  desc: string
  details: string[]
  color: string
  icon: string
}

const TIERS: Tier[] = [
  {
    id: 'supplies', amount: 5000, label: 'Fournitures', color: C.amber,
    subtitle: 'Le premier pas vers le savoir',
    desc: 'Fournitures scolaires completes pour 10 filles pendant une annee entiere. Cahiers, manuels, instruments et tout le materiel necessaire pour apprendre dans de bonnes conditions.',
    details: ['Cahiers et manuels scolaires', 'Instruments de geometrie et calculatrices', 'Cartables et trousses completes', 'Materiel artistique pour les ateliers'],
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  },
  {
    id: 'classroom', amount: 25000, label: 'Salle de classe', color: C.emerald,
    subtitle: 'Un espace pour grandir',
    desc: 'Equipement complet d\'une salle de classe dediee : bureaux, chaises, tableau interactif, eclairage adequat et ventilation. Un environnement d\'apprentissage digne de ces jeunes filles.',
    details: ['Bureaux et chaises pour 30 eleves', 'Tableau blanc interactif et projection', 'Eclairage LED et ventilation', 'Bibliotheque de classe avec 200 ouvrages'],
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  },
  {
    id: 'dormitory', amount: 100000, label: 'Dortoir', color: C.blue,
    subtitle: 'Un foyer, une securite',
    desc: 'Construction et amenagement complet d\'un dortoir pour 20 filles. Lits, linge de maison, espaces de vie commune, sanitaires prives et une piece de detente pour se sentir chez soi.',
    details: ['20 lits avec literie complete', 'Sanitaires et douches prives', 'Espace commun et salle de detente', 'Linge de maison et rangements individuels'],
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  },
  {
    id: 'kitchen', amount: 150000, label: 'Cuisine et refectoire', color: C.terracotta,
    subtitle: 'Nourrir le corps et l\'esprit',
    desc: 'Une cuisine professionnelle et un refectoire ou chaque fille prend ses repas dans la dignite. Equipement professionnel, stockage alimentaire, et un espace chaleureux pour les repas en communaute.',
    details: ['Cuisine professionnelle equipee', 'Refectoire pour 60 couverts', 'Chaine froide et stockage alimentaire', 'Programme nutritionnel equilibre'],
    icon: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z',
  },
  {
    id: 'operation', amount: 500000, label: 'Fonctionnement annuel', color: C.violet,
    subtitle: 'Assurer la perennite',
    desc: 'Le fonctionnement complet du pensionnat pendant une annee entiere. Personnel encadrant, programmes educatifs, suivi sanitaire, activites parascolaires et tout ce qui fait d\'un pensionnat un veritable foyer.',
    details: ['Equipe educative et encadrante complete', 'Programmes scolaires et parascolaires', 'Suivi medical et psychologique', 'Activites sportives, culturelles et artistiques'],
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  },
]

function Counter({ value, duration = 1.5, prefix = '', suffix = '' }: { value: number; duration?: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView) return
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - start) / 1000 / duration, 1)
      setDisplay(Math.round((1 - Math.pow(1 - p, 4)) * value))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, value, duration])
  return <span ref={ref} className="tabular-nums">{prefix}{display.toLocaleString('fr-FR')}{suffix}</span>
}

function ProgressBar({ amount, total = 500000 }: { amount: number; total?: number }) {
  const pct = Math.min((amount / total) * 100, 100)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  return (
    <div ref={ref} className="w-full">
      <div className="flex justify-between mb-3">
        <span style={{ color: C.txt2, fontFamily: F.body }} className="text-xs tracking-widest uppercase">Objectif</span>
        <span style={{ color: C.txt2, fontFamily: F.body }} className="text-xs">{pct.toFixed(1)}%</span>
      </div>
      <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: 'rgba(212,168,83,0.08)' }}>
        <motion.div className="h-full rounded-full" style={{ background: `linear-gradient(90deg,${C.goldDark},${C.gold},${C.goldLight})` }}
          initial={{ width: 0 }} animate={inView ? { width: `${pct}%` } : { width: 0 }} transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }} />
      </div>
      <div className="flex justify-between mt-3">
        <span style={{ color: C.gold, fontFamily: F.display }} className="text-lg font-bold"><Counter value={amount} suffix=" MAD" /></span>
        <span style={{ color: C.txt3, fontFamily: F.body }} className="text-xs">sur {total.toLocaleString('fr-FR')} MAD</span>
      </div>
    </div>
  )
}

function Card({ tier, i, active, onClick }: { tier: Tier; i: number; active: boolean; onClick: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }} onClick={onClick} className="cursor-pointer">
      <div className="relative overflow-hidden rounded-lg transition-all duration-500"
        style={{ backgroundColor: active ? C.bgCardH : C.bgCard, border: `1px solid ${active ? tier.color + '40' : C.border}`, boxShadow: active ? `0 0 40px ${tier.color}10` : 'none' }}>
        <div className="h-px w-full transition-all duration-700" style={{ background: active ? `linear-gradient(90deg,transparent,${tier.color},transparent)` : 'transparent' }} />
        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="text-3xl md:text-4xl font-bold tracking-tight" style={{ color: tier.color, fontFamily: F.display }}>
                <Counter value={tier.amount} suffix=" MAD" duration={2} />
              </div>
              <div className="text-lg font-semibold mt-1" style={{ color: C.txt, fontFamily: F.elegant, letterSpacing: '0.04em' }}>{tier.label}</div>
            </div>
            <div className="w-10 h-10 rounded-md flex items-center justify-center transition-all duration-500"
              style={{ backgroundColor: active ? tier.color + '18' : 'rgba(255,255,255,0.03)', border: `1px solid ${active ? tier.color + '30' : 'transparent'}` }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? tier.color : C.txt3} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={tier.icon} /></svg>
            </div>
          </div>
          <div className="text-sm mb-4" style={{ color: C.txt2, fontFamily: F.elegant, letterSpacing: '0.06em' }}>{tier.subtitle}</div>
          <AnimatePresence>
            {active && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
                <div className="pt-4" style={{ borderTop: `1px solid ${C.border}` }}>
                  <p className="text-sm mb-5" style={{ color: C.txt2, fontFamily: F.body, lineHeight: '1.8' }}>{tier.desc}</p>
                  <div className="space-y-2.5">
                    {tier.details.map((d, j) => (
                      <motion.div key={d} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + j * 0.08, duration: 0.4 }} className="flex items-start gap-3">
                        <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: tier.color }} />
                        <span className="text-sm" style={{ color: 'rgba(245,237,224,0.7)', fontFamily: F.body }}>{d}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex items-center justify-center mt-4">
            <motion.svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? tier.color : C.txt3} strokeWidth="1.5"
              animate={{ rotate: active ? 180 : 0 }} transition={{ duration: 0.3 }}><path d="M6 9l6 6 6-6" /></motion.svg>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function Slider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const [drag, setDrag] = useState(false)
  const move = useCallback((cx: number) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    const pct = Math.max(0, Math.min((cx - r.left) / r.width, 1))
    onChange(Math.round(pct * 500000 / 1000) * 1000)
  }, [onChange])

  useEffect(() => {
    if (!drag) return
    const onMove = (e: MouseEvent) => move(e.clientX)
    const onTouch = (e: TouchEvent) => move(e.touches[0].clientX)
    const onUp = () => setDrag(false)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('touchmove', onTouch)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchend', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onTouch)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchend', onUp)
    }
  }, [drag, move])

  const pct = (value / 500000) * 100
  const ct = [...TIERS].reverse().find(t => value >= t.amount)
  const col = ct?.color || C.gold
  return (
    <div className="w-full">
      <div ref={ref} className="relative w-full h-2 rounded-full cursor-pointer select-none"
        style={{ backgroundColor: 'rgba(212,168,83,0.08)' }}
        onMouseDown={e => { setDrag(true); move(e.clientX) }}
        onTouchStart={e => { setDrag(true); move(e.touches[0].clientX) }}>
        <div className="absolute top-0 left-0 h-full rounded-full transition-all duration-150" style={{ width: `${pct}%`, background: `linear-gradient(90deg,${C.goldDark},${col})` }} />
        {TIERS.map(t => <div key={t.id} className="absolute top-1/2 -translate-y-1/2" style={{ left: `${(t.amount / 500000) * 100}%` }}>
          <div className="w-0.5 h-4 -translate-x-1/2" style={{ backgroundColor: value >= t.amount ? t.color + '60' : 'rgba(255,255,255,0.08)' }} />
        </div>)}
        <div className="absolute top-1/2 -translate-x-1/2 w-5 h-5 rounded-full transition-all duration-150"
          style={{ left: `${pct}%`, backgroundColor: col, boxShadow: `0 0 20px ${col}40,0 0 6px ${col}60`, transform: `translate(-50%,-50%) scale(${drag ? 1.3 : 1})` }} />
      </div>
      <div className="flex justify-between mt-4">
        <span className="text-xs tracking-widest uppercase" style={{ color: C.txt3, fontFamily: F.body }}>0 MAD</span>
        <div className="text-2xl font-bold" style={{ color: col, fontFamily: F.display }}>{value.toLocaleString('fr-FR')} MAD</div>
        <span className="text-xs tracking-widest uppercase" style={{ color: C.txt3, fontFamily: F.body }}>500 000 MAD</span>
      </div>
    </div>
  )
}

export default function Page() {
  const [active, setActive] = useState<string | null>('supplies')
  const [sliderVal, setSliderVal] = useState(0)

  // Subtle CSS-based background instead of canvas for stability

  const ct = [...TIERS].reverse().find(t => sliderVal >= t.amount)

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: C.bg, color: C.txt }}>
      {/* Subtle radial glow background */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0, background: 'radial-gradient(ellipse at 50% 30%, rgba(212,168,83,0.04) 0%, transparent 60%)' }} />

      {/* Header */}
      <header className="relative z-10 w-full" style={{ borderBottom: `1px solid ${C.border}` }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <svg width="28" height="28" viewBox="0 0 28 28"><polygon points="14,1 27,8 27,20 14,27 1,20 1,8" fill="none" stroke={C.gold} strokeWidth="0.8" opacity="0.6" /><polygon points="14,5 23,10 23,18 14,23 5,18 5,10" fill="none" stroke={C.gold} strokeWidth="0.4" opacity="0.3" /></svg>
            <span className="text-xs tracking-[0.3em] uppercase" style={{ color: C.txt2, fontFamily: F.body }}>Fondation TGCC</span>
          </div>
          <span className="text-xs tracking-[0.2em] uppercase" style={{ color: C.txt3, fontFamily: F.body }}>1er Juillet 2025</span>
        </div>
      </header>

      <main className="relative z-10 flex-1">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 pt-16 md:pt-24 pb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="text-center">
            <div className="text-xs tracking-[0.35em] uppercase mb-6" style={{ color: C.gold, fontFamily: F.body }}>Calculateur d&apos;impact</div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6" style={{ fontFamily: F.display }}>
              <span style={{ color: C.cream }}>Votre geste,</span><br />
              <span style={{ background: `linear-gradient(135deg,${C.gold},${C.terracotta},${C.rose})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>leur avenir</span>
            </h1>
            <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: C.txt2, fontFamily: F.elegant, letterSpacing: '0.03em' }}>
              Chaque contribution finance directement la construction d&apos;un pensionnat pour les jeunes filles de 12 a 20 ans a Casablanca. Decouvrez ce que votre generosite rend possible.
            </p>
          </motion.div>
        </section>

        {/* Progress */}
        <section className="max-w-4xl mx-auto px-6 md:px-12 py-8">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="rounded-lg p-8 md:p-10" style={{ backgroundColor: C.bgCard, border: `1px solid ${C.border}` }}>
            <div className="text-xs tracking-[0.25em] uppercase mb-6" style={{ color: C.gold, fontFamily: F.body }}>Etat des collectes</div>
            <ProgressBar amount={320000} />
          </motion.div>
        </section>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 my-12 md:my-16 max-w-4xl mx-auto px-6">
          <div className="h-px flex-1" style={{ background: `linear-gradient(90deg,transparent,${C.border})` }} />
          <svg width="16" height="16" viewBox="0 0 16 16"><polygon points="8,1 15,5 15,11 8,15 1,11 1,5" fill="none" stroke={C.gold} strokeWidth="0.5" opacity="0.4" /></svg>
          <div className="h-px flex-1" style={{ background: `linear-gradient(270deg,transparent,${C.border})` }} />
        </div>

        {/* Slider */}
        <section className="max-w-4xl mx-auto px-6 md:px-12 py-8">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}>
            <div className="text-xs tracking-[0.25em] uppercase mb-8 text-center" style={{ color: C.gold, fontFamily: F.body }}>Simulez votre contribution</div>
            <Slider value={sliderVal} onChange={setSliderVal} />
            <AnimatePresence mode="wait">
              {ct && sliderVal > 0 && (
                <motion.div key={ct.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }} className="mt-8 text-center">
                  <div className="text-xl md:text-2xl font-semibold" style={{ color: ct.color, fontFamily: F.elegant, letterSpacing: '0.04em' }}>{ct.label}</div>
                  <p className="text-sm mt-2 max-w-lg mx-auto" style={{ color: C.txt2, fontFamily: F.body, lineHeight: '1.7' }}>{ct.subtitle}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 my-12 md:my-16 max-w-4xl mx-auto px-6">
          <div className="h-px flex-1" style={{ background: `linear-gradient(90deg,transparent,${C.border})` }} />
          <svg width="16" height="16" viewBox="0 0 16 16"><polygon points="8,1 15,5 15,11 8,15 1,11 1,5" fill="none" stroke={C.gold} strokeWidth="0.5" opacity="0.4" /></svg>
          <div className="h-px flex-1" style={{ background: `linear-gradient(270deg,transparent,${C.border})` }} />
        </div>

        {/* Cards */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-8 md:py-12">
          <div className="text-center mb-12">
            <div className="text-xs tracking-[0.25em] uppercase mb-4" style={{ color: C.gold, fontFamily: F.body }}>Ce que chaque montant rend possible</div>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: F.display, color: C.cream }}>L&apos;impact en detail</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {TIERS.map((t, i) => <Card key={t.id} tier={t} i={i} active={active === t.id} onClick={() => setActive(active === t.id ? null : t.id)} />)}
          </div>
        </section>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 my-12 md:my-16 max-w-4xl mx-auto px-6">
          <div className="h-px flex-1" style={{ background: `linear-gradient(90deg,transparent,${C.border})` }} />
          <svg width="16" height="16" viewBox="0 0 16 16"><polygon points="8,1 15,5 15,11 8,15 1,11 1,5" fill="none" stroke={C.gold} strokeWidth="0.5" opacity="0.4" /></svg>
          <div className="h-px flex-1" style={{ background: `linear-gradient(270deg,transparent,${C.border})` }} />
        </div>

        {/* Stats */}
        <section className="max-w-5xl mx-auto px-6 md:px-12 py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { v: 60, s: '', l: 'Filles hebergees', c: C.gold },
              { v: 12, s: '-20', l: 'Ans', c: C.emerald },
              { v: 1, s: '', l: 'Pensionnat', c: C.violet },
              { v: 1, s: '', l: 'Objectif commun', c: C.rose },
            ].map((st, i) => (
              <motion.div key={st.l} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}>
                <div className="text-4xl md:text-5xl font-bold mb-2" style={{ color: st.c, fontFamily: F.display }}><Counter value={st.v} suffix={st.s} /></div>
                <div className="text-xs tracking-[0.2em] uppercase" style={{ color: C.txt2, fontFamily: F.body }}>{st.l}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 my-12 md:my-16 max-w-4xl mx-auto px-6">
          <div className="h-px flex-1" style={{ background: `linear-gradient(90deg,transparent,${C.border})` }} />
          <svg width="16" height="16" viewBox="0 0 16 16"><polygon points="8,1 15,5 15,11 8,15 1,11 1,5" fill="none" stroke={C.gold} strokeWidth="0.5" opacity="0.4" /></svg>
          <div className="h-px flex-1" style={{ background: `linear-gradient(270deg,transparent,${C.border})` }} />
        </div>

        {/* About */}
        <section className="max-w-4xl mx-auto px-6 md:px-12 py-12 md:py-16">
          <div className="text-center">
            <div className="text-xs tracking-[0.25em] uppercase mb-6" style={{ color: C.gold, fontFamily: F.body }}>A propos</div>
            <h2 className="text-2xl md:text-3xl font-bold mb-8" style={{ fontFamily: F.display, color: C.cream }}>Couleur de l&apos;Espoir</h2>
            <p className="text-base leading-[1.9] max-w-2xl mx-auto" style={{ color: C.txt2, fontFamily: F.elegant, letterSpacing: '0.02em' }}>
              Le 1er juillet 2025, la Fondation TGCC organise a Casablanca une vente aux encheres caritative au profit de la construction d&apos;un pensionnat pour jeunes filles. Des artistes engagees offrent leurs oeuvres pour que chaque enchere devienne une pierre de cet edifice. Un lieu d&apos;accueil, d&apos;apprentissage et d&apos;emancipation pour celles qui n&apos;ont pas acces a l&apos;education qu&apos;elles meritent.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-auto" style={{ borderTop: `1px solid ${C.border}` }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <svg width="18" height="18" viewBox="0 0 28 28"><polygon points="14,1 27,8 27,20 14,27 1,20 1,8" fill="none" stroke={C.gold} strokeWidth="0.8" opacity="0.4" /></svg>
            <span className="text-xs tracking-[0.2em]" style={{ color: C.txt3, fontFamily: F.body }}>Fondation TGCC — Couleur de l&apos;Espoir</span>
          </div>
          <span className="text-xs tracking-[0.15em]" style={{ color: C.txt3, fontFamily: F.body }}>fondationtgcc.com</span>
        </div>
      </footer>
    </div>
  )
}
