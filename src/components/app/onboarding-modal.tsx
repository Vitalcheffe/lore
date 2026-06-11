'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, Network, Plus, MessageSquare, LayoutDashboard,
  ArrowRight, ArrowLeft, Lightbulb, FolderOpen, BookOpen, Hash,
  Check, PartyPopper
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/use-auth'

// ─── Step definitions ──────────────────────────────────────
const TOTAL_STEPS = 5

// ─── Animated SVG: Knowledge Graph (Step 1) ───────────────
function WelcomeIllustration() {
  const nodes = [
    { cx: 80, cy: 60, r: 16, color: '#059669' },
    { cx: 170, cy: 35, r: 12, color: '#0891B2' },
    { cx: 150, cy: 115, r: 13, color: '#7C3AED' },
    { cx: 250, cy: 70, r: 11, color: '#EA580C' },
    { cx: 230, cy: 145, r: 14, color: '#059669' },
    { cx: 55, cy: 140, r: 10, color: '#DB2777' },
  ]
  const edges = [
    [0, 1], [0, 2], [1, 3], [2, 4], [2, 5], [3, 4], [0, 4],
  ]

  return (
    <svg viewBox="0 0 300 200" className="w-full h-44 mx-auto" fill="none">
      {/* Glow filter */}
      <defs>
        <filter id="glow1">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Edges */}
      {edges.map(([from, to], i) => (
        <motion.line
          key={`e-${i}`}
          x1={nodes[from].cx}
          y1={nodes[from].cy}
          x2={nodes[to].cx}
          y2={nodes[to].cy}
          stroke="#D1D5DB"
          strokeWidth={1.5}
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ delay: 0.5 + i * 0.12, duration: 0.6 }}
        />
      ))}
      {/* Nodes */}
      {nodes.map((node, i) => (
        <motion.g key={`n-${i}`}>
          <motion.circle
            cx={node.cx}
            cy={node.cy}
            r={node.r}
            fill={node.color}
            opacity={0.15}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15 + i * 0.1, type: 'spring', stiffness: 200 }}
          />
          <motion.circle
            cx={node.cx}
            cy={node.cy}
            r={node.r * 0.6}
            fill={node.color}
            filter="url(#glow1)"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.25 + i * 0.1, type: 'spring', stiffness: 300 }}
          />
        </motion.g>
      ))}
      {/* Pulse on center node */}
      <motion.circle
        cx={nodes[0].cx}
        cy={nodes[0].cy}
        r={nodes[0].r}
        fill="none"
        stroke="#059669"
        strokeWidth={2}
        animate={{ r: [nodes[0].r, nodes[0].r + 10, nodes[0].r], opacity: [0.6, 0, 0.6] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Floating particles */}
      {[0, 1, 2, 3].map((i) => (
        <motion.circle
          key={`p-${i}`}
          cx={60 + i * 60}
          cy={180}
          r={2}
          fill="#059669"
          opacity={0.3}
          animate={{ y: [0, -30, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.7, ease: 'easeInOut' }}
        />
      ))}
    </svg>
  )
}

// ─── Animated SVG: Node Creation (Step 2) ─────────────────
function NodeCreationIllustration() {
  return (
    <svg viewBox="0 0 300 200" className="w-full h-44 mx-auto" fill="none">
      <defs>
        <filter id="glow2">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Plus icon floating */}
      <motion.g
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.circle
          cx={150}
          cy={90}
          r={30}
          fill="#059669"
          opacity={0.12}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
        />
        <motion.line
          x1={150} y1={72} x2={150} y2={108}
          stroke="#059669" strokeWidth={3} strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        />
        <motion.line
          x1={132} y1={90} x2={168} y2={90}
          stroke="#059669" strokeWidth={3} strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        />
      </motion.g>
      {/* Orbiting suggestion pills */}
      {[
        { cx: 70, cy: 55, color: '#0891B2', label: '📄', delay: 0.8 },
        { cx: 230, cy: 55, color: '#7C3AED', label: '💡', delay: 1.0 },
        { cx: 70, cy: 145, color: '#EA580C', label: '📁', delay: 1.2 },
        { cx: 230, cy: 145, color: '#059669', label: '🔍', delay: 1.4 },
      ].map((item, i) => (
        <motion.g key={`sug-${i}`}>
          <motion.circle
            cx={item.cx}
            cy={item.cy}
            r={18}
            fill={item.color}
            opacity={0.1}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: item.delay, type: 'spring', stiffness: 200 }}
          />
          <motion.circle
            cx={item.cx}
            cy={item.cy}
            r={12}
            fill={item.color}
            opacity={0.3}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: item.delay + 0.1, type: 'spring', stiffness: 250 }}
          />
          <motion.text
            x={item.cx}
            y={item.cy + 5}
            textAnchor="middle"
            fontSize="14"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: item.delay + 0.2 }}
          >
            {item.label}
          </motion.text>
        </motion.g>
      ))}
      {/* Connecting dashed lines from center to suggestions */}
      {[
        { x2: 70, y2: 55 },
        { x2: 230, y2: 55 },
        { x2: 70, y2: 145 },
        { x2: 230, y2: 145 },
      ].map((line, i) => (
        <motion.line
          key={`dash-${i}`}
          x1={150} y1={90} x2={line.x2} y2={line.y2}
          stroke="#D1D5DB"
          strokeWidth={1}
          strokeDasharray="4 4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.4 }}
          transition={{ delay: 1.6 + i * 0.15, duration: 0.5 }}
        />
      ))}
    </svg>
  )
}

// ─── Animated SVG: Edge Connections (Step 3) ──────────────
function EdgeDemoIllustration() {
  return (
    <svg viewBox="0 0 300 200" className="w-full h-44 mx-auto" fill="none">
      {/* Node A */}
      <motion.circle
        cx={75} cy={100} r={22}
        fill="#059669" opacity={0.15}
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
      />
      <motion.circle
        cx={75} cy={100} r={14}
        fill="#059669" opacity={0.8}
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
      />
      <motion.text x={75} y={105} textAnchor="middle" fill="white" fontSize="11" fontWeight="bold"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
      >A</motion.text>

      {/* Node B */}
      <motion.circle
        cx={225} cy={70} r={20}
        fill="#0891B2" opacity={0.15}
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 150 }}
      />
      <motion.circle
        cx={225} cy={70} r={13}
        fill="#0891B2" opacity={0.8}
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
      />
      <motion.text x={225} y={75} textAnchor="middle" fill="white" fontSize="11" fontWeight="bold"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
      >B</motion.text>

      {/* Node C */}
      <motion.circle
        cx={225} cy={135} r={20}
        fill="#7C3AED" opacity={0.15}
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: 0.6, type: 'spring', stiffness: 150 }}
      />
      <motion.circle
        cx={225} cy={135} r={13}
        fill="#7C3AED" opacity={0.8}
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: 0.7, type: 'spring', stiffness: 200 }}
      />
      <motion.text x={225} y={140} textAnchor="middle" fill="white" fontSize="11" fontWeight="bold"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
      >C</motion.text>

      {/* Edge A → B with animated flow */}
      <motion.line
        x1={97} y1={92} x2={205} y2={73}
        stroke="#059669" strokeWidth={2} strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 1.0, duration: 0.6 }}
      />
      {/* Traveling dot A→B */}
      <motion.circle r={4} fill="#059669"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0], cx: [97, 130, 170, 205], cy: [92, 85, 78, 73] }}
        transition={{ delay: 1.8, duration: 1.2, repeat: Infinity, repeatDelay: 1 }}
      />
      {/* Label for edge A→B */}
      <motion.text x={145} y={68} textAnchor="middle" fill="#6B7280" fontSize="9" fontWeight="500"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
      >references</motion.text>

      {/* Edge A → C with animated flow */}
      <motion.line
        x1={97} y1={108} x2={205} y2={132}
        stroke="#7C3AED" strokeWidth={2} strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      />
      {/* Traveling dot A→C */}
      <motion.circle r={4} fill="#7C3AED"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0], cx: [97, 130, 170, 205], cy: [108, 115, 125, 132] }}
        transition={{ delay: 2.2, duration: 1.2, repeat: Infinity, repeatDelay: 1 }}
      />
      {/* Label for edge A→C */}
      <motion.text x={145} y={145} textAnchor="middle" fill="#6B7280" fontSize="9" fontWeight="500"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
      >depends on</motion.text>
    </svg>
  )
}

// ─── Animated SVG: AI Chat (Step 4) ───────────────────────
function ChatIllustration() {
  return (
    <svg viewBox="0 0 300 200" className="w-full h-44 mx-auto" fill="none">
      {/* Chat bubble background */}
      <motion.rect
        x={30} y={15} width={240} height={170} rx={16}
        fill="#F9FAFB" stroke="#E5E7EB" strokeWidth={1}
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      />
      {/* Chat header bar */}
      <motion.rect
        x={30} y={15} width={240} height={28} rx={16}
        fill="#059669" opacity={0.1}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      />
      <motion.circle cx={48} cy={29} r={5} fill="#059669" opacity={0.6}
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring' }}
      />
      <motion.text x={60} y={33} fill="#059669" fontSize="9" fontWeight="600"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
      >Lore AI</motion.text>

      {/* User message */}
      <motion.rect
        x={120} y={52} width={140} height={26} rx={12}
        fill="#059669" opacity={0.9}
        initial={{ opacity: 0, x: 160 }} animate={{ opacity: 1, x: 120 }}
        transition={{ delay: 0.8, duration: 0.3, type: 'spring', stiffness: 150 }}
      />
      <motion.text x={190} y={69} textAnchor="middle" fill="white" fontSize="8" fontWeight="500"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}
      >What connects to Roadmap?</motion.text>

      {/* AI response */}
      <motion.rect
        x={42} y={86} width={180} height={40} rx={12}
        fill="white" stroke="#E5E7EB" strokeWidth={1}
        initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 42 }}
        transition={{ delay: 1.3, duration: 0.3, type: 'spring', stiffness: 150 }}
      />
      <motion.text x={54} y={103} fill="#18181B" fontSize="8" fontWeight="500"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
      >User Research references</motion.text>
      <motion.text x={54} y={116} fill="#71717A" fontSize="7"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
      >Design System depends on it</motion.text>

      {/* Typing indicator dots */}
      <motion.g
        initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }}
        transition={{ delay: 1.2, duration: 1.5, repeat: Infinity }}
      >
        <circle cx={54} cy={140} r={3} fill="#A1A1AA" />
        <circle cx={66} cy={140} r={3} fill="#A1A1AA" />
        <circle cx={78} cy={140} r={3} fill="#A1A1AA" />
      </motion.g>

      {/* Sparkle decoration */}
      <motion.g
        animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <text x={250} y={170} fontSize="16" opacity={0.4}>✨</text>
      </motion.g>
    </svg>
  )
}

// ─── Animated SVG: Celebration (Step 5) ───────────────────
function CelebrationIllustration() {
  const confettiColors = ['#059669', '#0891B2', '#7C3AED', '#EA580C', '#DB2777', '#F59E0B']
  const confetti = Array.from({ length: 20 }, (_, i) => ({
    x: Math.random() * 300,
    color: confettiColors[i % confettiColors.length],
    delay: i * 0.08,
    size: 3 + Math.random() * 4,
  }))

  return (
    <svg viewBox="0 0 300 200" className="w-full h-44 mx-auto" fill="none">
      {/* Big checkmark circle */}
      <motion.circle
        cx={150} cy={95} r={40}
        fill="#059669" opacity={0.1}
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
      />
      <motion.circle
        cx={150} cy={95} r={30}
        fill="#059669" opacity={0.9}
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 150 }}
      />
      {/* Checkmark */}
      <motion.path
        d="M136 95 L146 105 L164 85"
        stroke="white" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      />
      {/* Pulse ring */}
      <motion.circle
        cx={150} cy={95} r={30}
        fill="none" stroke="#059669" strokeWidth={2}
        animate={{ r: [30, 55, 30], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
      />
      {/* Confetti pieces */}
      {confetti.map((c, i) => (
        <motion.rect
          key={`cf-${i}`}
          x={c.x}
          y={-10}
          width={c.size}
          height={c.size}
          rx={1}
          fill={c.color}
          opacity={0.7}
          animate={{
            y: [-10, 210],
            rotate: [0, 360 * (i % 2 === 0 ? 1 : -1)],
            opacity: [0, 0.8, 0.8, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: c.delay + 0.8,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}
      {/* Dashboard preview mini cards */}
      <motion.rect x={30} y={140} width={70} height={35} rx={6} fill="#E5E7EB" opacity={0.5}
        initial={{ opacity: 0, y: 160 }} animate={{ opacity: 0.5, y: 140 }}
        transition={{ delay: 1.0, duration: 0.4 }}
      />
      <motion.rect x={115} y={140} width={70} height={35} rx={6} fill="#E5E7EB" opacity={0.5}
        initial={{ opacity: 0, y: 160 }} animate={{ opacity: 0.5, y: 140 }}
        transition={{ delay: 1.15, duration: 0.4 }}
      />
      <motion.rect x={200} y={140} width={70} height={35} rx={6} fill="#E5E7EB" opacity={0.5}
        initial={{ opacity: 0, y: 160 }} animate={{ opacity: 0.5, y: 140 }}
        transition={{ delay: 1.3, duration: 0.4 }}
      />
      {/* Mini card content lines */}
      {[
        { x: 38, y: 150 }, { x: 38, y: 158 },
        { x: 123, y: 150 }, { x: 123, y: 158 },
        { x: 208, y: 150 }, { x: 208, y: 158 },
      ].map((line, i) => (
        <motion.rect
          key={`ml-${i}`}
          x={line.x} y={line.y} width={30 + (i % 2) * 20} height={4} rx={2}
          fill="#D1D5DB" opacity={0.6}
          initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}
          transition={{ delay: 1.4 + i * 0.05 }}
        />
      ))}
    </svg>
  )
}

// ─── Typing Effect Hook ───────────────────────────────────
function useTypingEffect(text: string, speed: number = 30, startDelay: number = 0) {
  const [displayed, setDisplayed] = useState('')
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), startDelay)
    return () => clearTimeout(timer)
  }, [startDelay])

  useEffect(() => {
    if (!started) return
    if (displayed.length >= text.length) return
    const timer = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1))
    }, speed)
    return () => clearTimeout(timer)
  }, [displayed, text, speed, started])

  return displayed
}

// ─── Typing Message Component ─────────────────────────────
function TypingMessage({ text, speed = 25, startDelay = 0 }: { text: string; speed?: number; startDelay?: number }) {
  const displayed = useTypingEffect(text, speed, startDelay)
  return (
    <span>
      {displayed}
      {displayed.length < text.length && (
        <motion.span
          className="inline-block w-[2px] h-[14px] bg-emerald-500 ml-0.5 align-middle"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      )}
    </span>
  )
}

// ─── Slide Variants ────────────────────────────────────────
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
}

// ─── Node Suggestions for Step 2 ──────────────────────────
const nodeSuggestions = [
  { icon: Lightbulb, label: 'An idea', type: 'idea', color: '#F59E0B' },
  { icon: FolderOpen, label: 'A project', type: 'project', color: '#059669' },
  { icon: BookOpen, label: 'A resource', type: 'resource', color: '#0891B2' },
  { icon: Hash, label: 'A concept', type: 'concept', color: '#7C3AED' },
]

// ─── Confetti Particle Component ──────────────────────────
function ConfettiOverlay() {
  const colors = ['#059669', '#0891B2', '#7C3AED', '#EA580C', '#DB2777', '#F59E0B']
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: colors[i % colors.length],
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 2,
    size: 4 + Math.random() * 6,
    rotation: Math.random() * 360,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: -10,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.id % 3 === 0 ? '50%' : p.id % 3 === 1 ? '2px' : '0',
          }}
          animate={{
            y: [0, window?.innerHeight ?? 800],
            rotate: [p.rotation, p.rotation + 720],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────
export function OnboardingModal() {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [completing, setCompleting] = useState(false)
  const [userName, setUserName] = useState(user?.name || '')
  const [selectedSuggestion, setSelectedSuggestion] = useState<number | null>(null)
  const [nodeTitle, setNodeTitle] = useState('')
  const [showConfetti, setShowConfetti] = useState(false)

  // Don't show if user has completed onboarding
  if (user?.onboardingComplete) return null
  if (!isOpen) return null

  const progress = ((currentStep + 1) / TOTAL_STEPS) * 100

  const handleNext = () => {
    if (currentStep >= TOTAL_STEPS - 1) return
    setDirection(1)
    setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS - 1))
  }

  const handleBack = () => {
    if (currentStep <= 0) return
    setDirection(-1)
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleSkip = async () => {
    await completeOnboarding()
  }

  const handleGetStarted = async () => {
    await completeOnboarding()
  }

  const handleSuggestionClick = (index: number, label: string) => {
    setSelectedSuggestion(index)
    setNodeTitle(label.replace(/^A\s/, '').replace(/^An\s/, ''))
  }

  const completeOnboarding = async () => {
    setCompleting(true)
    try {
      // Call our new onboarding API that creates sample data
      await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userName || undefined,
        }),
      })
    } catch (err) {
      console.error('Failed to complete onboarding:', err)
    }
    setShowConfetti(true)
    // Give confetti time to show
    setTimeout(() => {
      setIsOpen(false)
      setCompleting(false)
    }, 600)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      {showConfetti && <ConfettiOverlay />}
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 20 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="bg-white dark:bg-[#0F0F12] rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden border border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)]"
      >
        {/* ── Progress Bar ─────────────────────────────────── */}
        <div className="px-8 pt-5 pb-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-[#A1A1AA] dark:text-[#71717A] uppercase tracking-wider">
              Step {currentStep + 1} of {TOTAL_STEPS}
            </span>
            <button
              onClick={handleSkip}
              className="text-[11px] text-[#A1A1AA] dark:text-[#71717A] hover:text-[#71717A] font-medium transition-colors"
            >
              Skip for now
            </button>
          </div>
          <div className="w-full h-1.5 bg-[#F3F4F6] dark:bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #059669, #14B8A6)',
              }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          </div>
        </div>

        {/* ── Step Content ─────────────────────────────────── */}
        <div className="px-8 pb-4 min-h-[400px] flex flex-col">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex-1 flex flex-col items-center text-center"
            >
              {/* ── Step 1: Welcome ────────────────────────── */}
              {currentStep === 0 && (
                <>
                  <motion.div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: 'rgba(5,150,105,0.08)' }}
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                  >
                    <Brain className="w-7 h-7 text-emerald-600" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-[#18181B] dark:text-[#FAFAFA] mb-2">
                    Welcome to Lore
                  </h2>
                  <p className="text-sm text-[#71717A] dark:text-[#A1A1AA] leading-relaxed max-w-md mb-4">
                    Your team&apos;s memory, alive. Capture, connect, and recall knowledge so nothing falls through the cracks.
                  </p>
                  <WelcomeIllustration />
                  {/* Name input */}
                  <div className="w-full max-w-xs mt-3">
                    <label className="text-[11px] font-semibold text-[#A1A1AA] dark:text-[#71717A] uppercase tracking-wider block text-left mb-1.5">
                      What should we call you?
                    </label>
                    <Input
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder={user?.name || 'Enter your name'}
                      className="h-10 text-sm rounded-xl border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] focus-visible:border-emerald-300 focus-visible:ring-emerald-100"
                    />
                  </div>
                </>
              )}

              {/* ── Step 2: Your First Node ────────────────── */}
              {currentStep === 1 && (
                <>
                  <motion.div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: 'rgba(8,145,178,0.08)' }}
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                  >
                    <Plus className="w-7 h-7 text-cyan-600" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-[#18181B] dark:text-[#FAFAFA] mb-2">
                    Your First Node
                  </h2>
                  <p className="text-sm text-[#71717A] dark:text-[#A1A1AA] leading-relaxed max-w-md mb-3">
                    Every piece of knowledge in Lore is a <strong>node</strong> — an idea, project, resource, or concept. Pick one to start!
                  </p>
                  <NodeCreationIllustration />
                  {/* Suggestions */}
                  <div className="w-full max-w-sm mt-3">
                    <label className="text-[11px] font-semibold text-[#A1A1AA] dark:text-[#71717A] uppercase tracking-wider block text-left mb-2">
                      Choose a starting point
                    </label>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {nodeSuggestions.map((sug, i) => {
                        const SugIcon = sug.icon
                        const isSelected = selectedSuggestion === i
                        return (
                          <motion.button
                            key={i}
                            onClick={() => handleSuggestionClick(i, sug.label)}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left transition-all text-sm ${
                              isSelected
                                ? 'border-emerald-300 bg-emerald-50/50 shadow-sm shadow-emerald-100'
                                : 'border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] hover:border-emerald-200 hover:bg-emerald-50/30'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div
                              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                              style={{ backgroundColor: sug.color + '15' }}
                            >
                              <SugIcon className="w-3.5 h-3.5" style={{ color: sug.color }} />
                            </div>
                            <span className="font-medium text-[#18181B] dark:text-[#FAFAFA] text-[13px]">{sug.label}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-emerald-500 ml-auto" />}
                          </motion.button>
                        )
                      })}
                    </div>
                    <Input
                      value={nodeTitle}
                      onChange={(e) => {
                        setNodeTitle(e.target.value)
                        setSelectedSuggestion(null)
                      }}
                      placeholder="Or type your own node title..."
                      className="h-10 text-sm rounded-xl border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] focus-visible:border-emerald-300 focus-visible:ring-emerald-100"
                    />
                  </div>
                </>
              )}

              {/* ── Step 3: Connect Your Knowledge ─────────── */}
              {currentStep === 2 && (
                <>
                  <motion.div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: 'rgba(124,58,237,0.08)' }}
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                  >
                    <Network className="w-7 h-7 text-purple-600" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-[#18181B] dark:text-[#FAFAFA] mb-2">
                    Connect Your Knowledge
                  </h2>
                  <p className="text-sm text-[#71717A] dark:text-[#A1A1AA] leading-relaxed max-w-md mb-3">
                    <strong>Edges</strong> link your nodes together with meaningful relationships — like &ldquo;references&rdquo;, &ldquo;depends on&rdquo;, or &ldquo;created by&rdquo;. This is where the magic happens.
                  </p>
                  <EdgeDemoIllustration />
                  {/* Edge type pills */}
                  <div className="flex flex-wrap gap-2 mt-3 justify-center max-w-sm">
                    {[
                      { label: 'references', color: '#059669' },
                      { label: 'depends_on', color: '#7C3AED' },
                      { label: 'related', color: '#0891B2' },
                      { label: 'created_by', color: '#EA580C' },
                      { label: 'part_of', color: '#DB2777' },
                    ].map((edge, i) => (
                      <motion.span
                        key={edge.label}
                        className="px-2.5 py-1 rounded-full text-[11px] font-medium border"
                        style={{
                          color: edge.color,
                          borderColor: edge.color + '30',
                          backgroundColor: edge.color + '08',
                        }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                      >
                        {edge.label}
                      </motion.span>
                    ))}
                  </div>
                </>
              )}

              {/* ── Step 4: Meet AI Chat ───────────────────── */}
              {currentStep === 3 && (
                <>
                  <motion.div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: 'rgba(234,88,12,0.08)' }}
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                  >
                    <MessageSquare className="w-7 h-7 text-orange-600" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-[#18181B] dark:text-[#FAFAFA] mb-2">
                    Meet AI Chat
                  </h2>
                  <p className="text-sm text-[#71717A] dark:text-[#A1A1AA] leading-relaxed max-w-md mb-3">
                    Ask Lore anything about your knowledge graph. AI understands your connections and surfaces insights you might miss.
                  </p>
                  <ChatIllustration />
                  {/* Sample conversation */}
                  <div className="w-full max-w-sm mt-3 space-y-2 text-left">
                    {/* User message */}
                    <motion.div
                      className="flex justify-end"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="bg-emerald-600 text-white px-3 py-2 rounded-2xl rounded-br-md text-xs max-w-[80%]">
                        What connects to Product Roadmap?
                      </div>
                    </motion.div>
                    {/* AI response */}
                    <motion.div
                      className="flex justify-start"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <div className="bg-[#F3F4F6] dark:bg-[rgba(255,255,255,0.06)] text-[#18181B] dark:text-[#FAFAFA] px-3 py-2 rounded-2xl rounded-bl-md text-xs max-w-[80%]">
                        <TypingMessage
                          text="User Research references it, and Design System depends on it. Both are key inputs for your roadmap planning."
                          speed={20}
                          startDelay={1200}
                        />
                      </div>
                    </motion.div>
                  </div>
                </>
              )}

              {/* ── Step 5: You're All Set! ────────────────── */}
              {currentStep === 4 && (
                <>
                  <motion.div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: 'rgba(5,150,105,0.08)' }}
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                  >
                    <PartyPopper className="w-7 h-7 text-emerald-600" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-[#18181B] dark:text-[#FAFAFA] mb-2">
                    You&apos;re All Set!
                  </h2>
                  <p className="text-sm text-[#71717A] dark:text-[#A1A1AA] leading-relaxed max-w-md mb-3">
                    We&apos;ve set up 3 sample nodes and 2 connections to get you started. Your knowledge graph is ready to explore!
                  </p>
                  <CelebrationIllustration />
                  {/* Quick Actions */}
                  <div className="w-full max-w-xs space-y-2 mt-3">
                    <motion.button
                      onClick={() => {
                        completeOnboarding()
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] hover:border-emerald-200 hover:bg-emerald-50/30 transition-all text-left group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-[rgba(16,185,129,0.10)] flex items-center justify-center shrink-0">
                        <Network className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#18181B] dark:text-[#FAFAFA]">Explore your graph</p>
                        <p className="text-[11px] text-[#A1A1AA] dark:text-[#71717A]">See your sample nodes & connections</p>
                      </div>
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        completeOnboarding()
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] hover:border-cyan-200 hover:bg-cyan-50/30 transition-all text-left group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-[rgba(8,145,178,0.10)] flex items-center justify-center shrink-0">
                        <MessageSquare className="w-4 h-4 text-cyan-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#18181B] dark:text-[#FAFAFA]">Chat with Lore AI</p>
                        <p className="text-[11px] text-[#A1A1AA] dark:text-[#71717A]">Ask about your knowledge graph</p>
                      </div>
                    </motion.button>
                    <motion.button
                      onClick={handleGetStarted}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] hover:border-purple-200 hover:bg-purple-50/30 transition-all text-left group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-[rgba(124,58,237,0.10)] flex items-center justify-center shrink-0">
                        <LayoutDashboard className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#18181B] dark:text-[#FAFAFA]">Go to dashboard</p>
                        <p className="text-[11px] text-[#A1A1AA] dark:text-[#71717A]">Explore your workspace</p>
                      </div>
                    </motion.button>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Navigation Footer ────────────────────────────── */}
        <div className="px-8 pb-6 pt-2 flex items-center justify-between border-t border-[#F3F4F6] dark:border-[rgba(255,255,255,0.04)]">
          {/* Progress Dots */}
          <div className="flex items-center gap-2">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > currentStep ? 1 : -1)
                  setCurrentStep(i)
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentStep
                    ? 'w-6 bg-emerald-500'
                    : i < currentStep
                    ? 'w-3 bg-emerald-300'
                    : 'w-3 bg-[#E5E7EB] dark:bg-[rgba(255,255,255,0.12)]'
                }`}
                aria-label={`Go to step ${i + 1}`}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="text-[#71717A] dark:text-[#A1A1AA] hover:text-[#18181B] text-xs gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </Button>
            )}
            {currentStep < TOTAL_STEPS - 1 ? (
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-md shadow-emerald-500/20 text-sm px-5 gap-1"
              >
                Next
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            ) : (
              <Button
                onClick={handleGetStarted}
                disabled={completing}
                className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-md shadow-emerald-500/20 text-sm px-6"
              >
                {completing ? 'Setting up...' : 'Get Started'}
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
