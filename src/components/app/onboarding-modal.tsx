'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Network, Sun, Sparkles, Plus, MessageSquare, LayoutDashboard, ArrowRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'

// ─── Step Data ─────────────────────────────────────────────
const steps = [
  {
    icon: Brain,
    title: 'Welcome to LORE 🧠',
    description: 'Your team\'s memory, alive. Lore captures, connects, and recalls knowledge so nothing falls through the cracks.',
    color: '#059669',
    bgColor: 'rgba(5,150,105,0.08)',
  },
  {
    icon: Network,
    title: 'Knowledge Graph',
    description: 'See how everything connects. Your knowledge lives as an interactive graph — nodes, edges, and relationships that mirror how your team actually thinks.',
    color: '#0891B2',
    bgColor: 'rgba(8,145,178,0.08)',
    illustration: 'graph',
  },
  {
    icon: Sun,
    title: 'Morning Digest',
    description: 'Start every day with clarity. Lore delivers a personalized AI digest of what changed, what matters, and what needs your attention.',
    color: '#EA580C',
    bgColor: 'rgba(234,88,12,0.08)',
  },
  {
    icon: Sparkles,
    title: "You're all set!",
    description: 'Your workspace is ready. Start building your team\'s memory now.',
    color: '#7C3AED',
    bgColor: 'rgba(124,58,237,0.08)',
    isFinal: true,
  },
]

// ─── Graph SVG Illustration ────────────────────────────────
function GraphIllustration() {
  const nodes = [
    { cx: 80, cy: 60, r: 14, color: '#059669' },
    { cx: 160, cy: 40, r: 11, color: '#0891B2' },
    { cx: 140, cy: 110, r: 12, color: '#7C3AED' },
    { cx: 240, cy: 80, r: 10, color: '#EA580C' },
    { cx: 220, cy: 150, r: 13, color: '#059669' },
    { cx: 60, cy: 140, r: 9, color: '#DB2777' },
  ]

  const edges = [
    [0, 1], [0, 2], [1, 3], [2, 4], [2, 5], [3, 4],
  ]

  return (
    <svg viewBox="0 0 300 200" className="w-full h-40 mx-auto" fill="none">
      {/* Edges */}
      {edges.map(([from, to], i) => (
        <motion.line
          key={`edge-${i}`}
          x1={nodes[from].cx}
          y1={nodes[from].cy}
          x2={nodes[to].cx}
          y2={nodes[to].cy}
          stroke="#D1D5DB"
          strokeWidth={1.5}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
        />
      ))}
      {/* Nodes */}
      {nodes.map((node, i) => (
        <motion.g key={`node-${i}`}>
          <motion.circle
            cx={node.cx}
            cy={node.cy}
            r={node.r}
            fill={node.color}
            opacity={0.15}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 + i * 0.08, type: 'spring', stiffness: 200 }}
          />
          <motion.circle
            cx={node.cx}
            cy={node.cy}
            r={node.r * 0.6}
            fill={node.color}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 + i * 0.08, type: 'spring', stiffness: 300 }}
          />
        </motion.g>
      ))}
      {/* Pulse animation on center node */}
      <motion.circle
        cx={nodes[0].cx}
        cy={nodes[0].cy}
        r={nodes[0].r}
        fill="none"
        stroke="#059669"
        strokeWidth={1.5}
        animate={{ r: [nodes[0].r, nodes[0].r + 8, nodes[0].r], opacity: [0.6, 0, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </svg>
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

// ─── Main Component ────────────────────────────────────────
export function OnboardingModal() {
  const { user } = useAuth()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [completing, setCompleting] = useState(false)

  // Don't show if user has completed onboarding
  if (user?.onboardingComplete) return null
  if (!isOpen) return null

  const step = steps[currentStep]
  const StepIcon = step.icon
  const isLastStep = step.isFinal

  const handleNext = () => {
    if (isLastStep) return
    setDirection(1)
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const handleBack = () => {
    setDirection(-1)
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleSkip = async () => {
    await completeOnboarding()
  }

  const handleGetStarted = async () => {
    await completeOnboarding()
  }

  const completeOnboarding = async () => {
    setCompleting(true)
    try {
      await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          onboardingComplete: true,
        }),
      })
    } catch (err) {
      console.error('Failed to mark onboarding complete:', err)
    }
    setIsOpen(false)
    setCompleting(false)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden border border-[#E5E7EB]"
      >
        {/* Close / Skip button */}
        <div className="flex justify-end p-3 pb-0">
          <button
            onClick={handleSkip}
            className="text-xs text-[#A1A1AA] hover:text-[#71717A] font-medium transition-colors"
          >
            Skip
          </button>
        </div>

        {/* Step Content */}
        <div className="px-8 pb-6 pt-2 min-h-[320px] flex flex-col">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex-1 flex flex-col items-center text-center"
            >
              {/* Icon */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: step.bgColor }}
              >
                <StepIcon className="w-7 h-7" style={{ color: step.color }} />
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold text-[#18181B] mb-2">
                {step.title}
              </h2>

              {/* Description */}
              <p className="text-sm text-[#71717A] leading-relaxed max-w-sm mb-4">
                {step.description}
              </p>

              {/* Graph Illustration (step 2) */}
              {step.illustration === 'graph' && <GraphIllustration />}

              {/* Quick Actions (last step) */}
              {isLastStep && (
                <div className="w-full max-w-xs space-y-2 mt-2">
                  <button
                    onClick={() => {
                      completeOnboarding()
                      router.push('/app/graph')
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-[#E5E7EB] hover:border-emerald-200 hover:bg-emerald-50/30 transition-all text-left group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                      <Plus className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#18181B]">Add your first node</p>
                      <p className="text-[11px] text-[#A1A1AA]">Start building your knowledge graph</p>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      completeOnboarding()
                      router.push('/app/chat')
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-[#E5E7EB] hover:border-emerald-200 hover:bg-emerald-50/30 transition-all text-left group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center shrink-0">
                      <MessageSquare className="w-4 h-4 text-cyan-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#18181B]">Start chatting</p>
                      <p className="text-[11px] text-[#A1A1AA]">Ask your knowledge graph anything</p>
                    </div>
                  </button>
                  <button
                    onClick={handleGetStarted}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-[#E5E7EB] hover:border-emerald-200 hover:bg-emerald-50/30 transition-all text-left group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                      <LayoutDashboard className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#18181B]">Go to dashboard</p>
                      <p className="text-[11px] text-[#A1A1AA]">Explore your workspace</p>
                    </div>
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress Dots + Navigation */}
        <div className="px-8 pb-6 flex items-center justify-between">
          {/* Progress Dots */}
          <div className="flex items-center gap-2">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > currentStep ? 1 : -1)
                  setCurrentStep(i)
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === currentStep
                    ? 'w-6 bg-emerald-500'
                    : i < currentStep
                    ? 'bg-emerald-300'
                    : 'bg-[#E5E7EB]'
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
                className="text-[#71717A] hover:text-[#18181B] text-xs"
              >
                Back
              </Button>
            )}
            {isLastStep ? (
              <Button
                onClick={handleGetStarted}
                disabled={completing}
                className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-md shadow-emerald-500/20 text-sm px-6"
              >
                {completing ? 'Setting up...' : 'Get Started'}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-md shadow-emerald-500/20 text-sm px-6"
              >
                Next
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
