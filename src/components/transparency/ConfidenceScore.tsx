'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ConfidenceRing } from '@/components/chat/ConfidenceRing'

interface ConfidenceScoreProps {
  confidence: number
}

function getConfidenceLevel(confidence: number) {
  if (confidence >= 85) return {
    label: 'High confidence',
    explanation: 'High confidence — this classification is reliable',
    color: '#10b981',
    barColor: 'bg-emerald-500',
  }
  if (confidence >= 70) return {
    label: 'Moderate confidence',
    explanation: 'Moderate confidence — consider the alternatives below',
    color: '#3b82f6',
    barColor: 'bg-blue-500',
  }
  if (confidence >= 50) return {
    label: 'Low confidence',
    explanation: 'Low confidence — clarification is recommended',
    color: '#f59e0b',
    barColor: 'bg-amber-500',
  }
  return {
    label: 'Very low confidence',
    explanation: 'Very low confidence — we recommend talking to a navigator',
    color: '#ef4444',
    barColor: 'bg-red-500',
  }
}

export function ConfidenceScore({ confidence }: ConfidenceScoreProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const level = getConfidenceLevel(confidence)

  useEffect(() => {
    const duration = 1200
    const startTime = performance.now()

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayValue(Math.round(eased * confidence))
      if (progress < 1) requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
  }, [confidence])

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Ring + Percentage */}
      <div className="flex items-center gap-6">
        <ConfidenceRing confidence={displayValue} size="lg" showLabel={false} />
        <div className="space-y-1">
          <div className="flex items-baseline gap-1.5">
            <span
              className="text-4xl font-extrabold tabular-nums tracking-tight"
              style={{ color: level.color }}
            >
              {displayValue}
            </span>
            <span className="text-lg font-semibold" style={{ color: level.color, opacity: 0.7 }}>
              %
            </span>
          </div>
          <p className="text-sm font-medium text-white/60">{level.label}</p>
        </div>
      </div>

      {/* Confidence bar */}
      <div className="space-y-2">
        <div className="h-2.5 w-full rounded-full overflow-hidden bg-white/10">
          <motion.div
            className={`h-full rounded-full ${level.barColor}`}
            initial={{ width: 0 }}
            animate={{ width: `${confidence}%` }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-white/30 font-medium">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Explanation */}
      <div
        className="rounded-xl p-4 border"
        style={{
          backgroundColor: `${level.color}08`,
          borderColor: `${level.color}20`,
        }}
      >
        <p className="text-sm text-white/80 leading-relaxed">{level.explanation}</p>
        {confidence < 50 && (
          <a
            href="https://211.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold transition-colors hover:underline"
            style={{ color: level.color }}
          >
            Talk to a navigator →
          </a>
        )}
      </div>
    </motion.div>
  )
}

export default ConfidenceScore
