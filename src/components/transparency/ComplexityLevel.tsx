'use client'

import { motion } from 'framer-motion'
import { AlertCircle, Navigation } from 'lucide-react'
import type { ComplexityLevel as ComplexityLevelType } from '@/types/classification'

interface ComplexityLevelProps {
  complexity: ComplexityLevelType
  explanation: string
}

const complexityConfig: Record<
  ComplexityLevelType,
  {
    dots: number
    color: string
    label: string
    dotClass: string
    bgClass: string
    borderClass: string
    pulse: boolean
  }
> = {
  simple: {
    dots: 1,
    color: '#10b981',
    label: 'Simple',
    dotClass: 'bg-emerald-500',
    bgClass: 'bg-emerald-500/10',
    borderClass: 'border-emerald-500/20',
    pulse: false,
  },
  moderate: {
    dots: 2,
    color: '#f59e0b',
    label: 'Moderate',
    dotClass: 'bg-amber-500',
    bgClass: 'bg-amber-500/10',
    borderClass: 'border-amber-500/20',
    pulse: false,
  },
  complex: {
    dots: 3,
    color: '#f97316',
    label: 'Complex',
    dotClass: 'bg-orange-500',
    bgClass: 'bg-orange-500/10',
    borderClass: 'border-orange-500/20',
    pulse: false,
  },
  critical: {
    dots: 4,
    color: '#ef4444',
    label: 'Critical',
    dotClass: 'bg-red-500',
    bgClass: 'bg-red-500/10',
    borderClass: 'border-red-500/20',
    pulse: true,
  },
}

export function ComplexityLevel({ complexity, explanation }: ComplexityLevelProps) {
  const config = complexityConfig[complexity]
  const needsNavigator = complexity === 'complex' || complexity === 'critical'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-5"
    >
      {/* Visual indicator */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={i}
              className={`w-4 h-4 rounded-full ${i < config.dots ? config.dotClass : 'bg-white/10'}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              style={
                config.pulse && i < config.dots
                  ? { animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }
                  : undefined
              }
            />
          ))}
        </div>
        <div>
          <span
            className="text-lg font-bold"
            style={{ color: config.color }}
          >
            {config.label}
          </span>
          <span className="text-xs text-white/40 ml-2">complexity</span>
        </div>
      </div>

      {/* Complexity scale */}
      <div className="space-y-2">
        <p className="text-[10px] uppercase tracking-wider text-white/30 font-semibold">
          Complexity scale
        </p>
        <div className="grid grid-cols-4 gap-2">
          {(['simple', 'moderate', 'complex', 'critical'] as const).map((level) => {
            const levelConfig = complexityConfig[level]
            const isActive = level === complexity
            return (
              <div
                key={level}
                className={`text-center py-2 px-1 rounded-lg border transition-all ${
                  isActive
                    ? `${levelConfig.bgClass} ${levelConfig.borderClass}`
                    : 'bg-white/[0.02] border-white/5'
                }`}
              >
                <div className="flex justify-center gap-1 mb-1">
                  {Array.from({ length: levelConfig.dots }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${isActive ? levelConfig.dotClass : 'bg-white/20'}`}
                    />
                  ))}
                </div>
                <span
                  className={`text-[10px] font-semibold capitalize ${isActive ? '' : 'text-white/30'}`}
                  style={isActive ? { color: levelConfig.color } : undefined}
                >
                  {level}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Explanation */}
      <div
        className="rounded-xl p-4 border"
        style={{
          backgroundColor: `${config.color}08`,
          borderColor: `${config.color}20`,
        }}
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: config.color }} />
          <p className="text-sm text-white/70 leading-relaxed">{explanation}</p>
        </div>
      </div>

      {/* Navigator recommendation */}
      {needsNavigator && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="rounded-xl p-4 border border-white/10 bg-white/[0.03]"
        >
          <div className="flex items-start gap-3">
            <Navigation className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-white/80">
                We recommend talking to a navigator
              </p>
              <p className="text-xs text-white/50 mt-1 leading-relaxed">
                {complexity === 'critical'
                  ? 'This situation involves critical and potentially overlapping needs. A trained 211 navigator can help you navigate multiple services at once and ensure nothing falls through the cracks.'
                  : 'This situation involves multiple needs that may require coordination across services. A 211 navigator can help you create a comprehensive action plan.'}
              </p>
              <a
                href="https://211.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors hover:underline"
              >
                Talk to a navigator →
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default ComplexityLevel
