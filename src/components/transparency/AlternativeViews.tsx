'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, Lightbulb } from 'lucide-react'
import type { AlternativeView } from '@/types/classification'

interface AlternativeViewsProps {
  alternatives: AlternativeView[]
}

function getConfidenceColor(confidence: number): string {
  if (confidence >= 80) return '#10b981'
  if (confidence >= 60) return '#3b82f6'
  if (confidence >= 40) return '#f59e0b'
  return '#f97316'
}

function getConfidenceBarClass(confidence: number): string {
  if (confidence >= 80) return 'bg-emerald-500'
  if (confidence >= 60) return 'bg-blue-500'
  if (confidence >= 40) return 'bg-amber-500'
  return 'bg-orange-500'
}

export function AlternativeViews({ alternatives }: AlternativeViewsProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const top3 = alternatives.slice(0, 3)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-white/70">
          Top {top3.length} alternative {top3.length === 1 ? 'category' : 'categories'}
        </p>
        <span className="text-[10px] text-white/30 font-medium uppercase tracking-wider">
          What else this could be
        </span>
      </div>

      {/* Alternative cards */}
      <div className="space-y-3">
        {top3.map((alt, index) => {
          const isExpanded = expandedIndex === index
          const color = getConfidenceColor(alt.confidence)
          const barClass = getConfidenceBarClass(alt.confidence)

          return (
            <motion.div
              key={alt.category}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden"
            >
              <button
                onClick={() => setExpandedIndex(isExpanded ? null : index)}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/[0.02] transition-colors"
              >
                <span
                  className="text-lg font-bold tabular-nums shrink-0 w-8 text-center"
                  style={{ color, opacity: 0.5 }}
                >
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-white/80 truncate">
                      {alt.category}
                    </span>
                    <span
                      className="text-sm font-bold tabular-nums shrink-0"
                      style={{ color }}
                    >
                      {alt.confidence}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full overflow-hidden bg-white/10 mt-2">
                    <motion.div
                      className={`h-full rounded-full ${barClass}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${alt.confidence}%` }}
                      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: index * 0.1 }}
                    />
                  </div>
                </div>
                <div className="shrink-0 text-white/30">
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-0 ml-11">
                      <p className="text-xs text-white/50 leading-relaxed">{alt.reason}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {/* Why showing alternatives matters */}
      <div className="rounded-xl p-4 border border-white/10 bg-white/[0.03]">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-white/60">Why showing alternatives matters</p>
            <p className="text-xs text-white/40 mt-1 leading-relaxed">
              No classification is perfect. By showing you what else the AI considered, you can see
              the full picture and make a more informed decision. If an alternative resonates more
              with your situation, we encourage you to explore it — or talk to a navigator for
              personalized guidance.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default AlternativeViews
