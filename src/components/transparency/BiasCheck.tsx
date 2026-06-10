'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertTriangle, Info } from 'lucide-react'
import type { BiasInfo } from '@/types/classification'

interface BiasCheckProps {
  biasCheck: BiasInfo
}

const severityConfig = {
  low: { color: '#f59e0b', label: 'Low', dotClass: 'bg-amber-500' },
  medium: { color: '#f97316', label: 'Medium', dotClass: 'bg-orange-500' },
  high: { color: '#ef4444', label: 'High', dotClass: 'bg-red-500' },
}

const mitigations: Record<string, string> = {
  geographic: 'We supplement with location-independent resources and flag when availability may vary by region.',
  socioeconomic: 'Our categories are designed with community navigator input to avoid assumptions about income or status.',
  language: 'We are expanding multilingual support and flag when resources may not be available in non-English languages.',
  demographic: 'We use zero-shot classification without fine-tuning to minimize training data bias against specific groups.',
  temporal: 'Resources are time-stamped and flagged when verification is older than 30 days.',
  representation: 'Our 8 categories were designed with input from diverse community organizations to ensure broad coverage.',
  availability: 'We always recommend calling ahead to confirm resource availability before visiting.',
  cultural: 'We flag when resources may not account for cultural or religious considerations and suggest navigator assistance.',
}

export function BiasCheck({ biasCheck }: BiasCheckProps) {
  if (!biasCheck.detected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-emerald-400">No significant biases detected</p>
            <p className="text-xs text-white/50 mt-1">
              Our analysis did not identify meaningful bias patterns in this classification.
            </p>
          </div>
        </div>

        <div className="rounded-xl p-4 bg-white/5 border border-white/10">
          <p className="text-xs text-white/40 leading-relaxed">
            We use zero-shot classification (BART-large-MNLI) without fine-tuning, which minimizes
            training data bias. Our 8 categories are broad and inclusive, designed with community
            navigator input. Even when no bias is detected, we encourage users to consider
            alternative perspectives shown in the Alternatives tab.
          </p>
        </div>
      </motion.div>
    )
  }

  const severity = severityConfig[biasCheck.severity]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-5"
    >
      {/* Bias detected header */}
      <div className="flex items-center gap-3 p-4 rounded-xl border" style={{
        backgroundColor: `${severity.color}08`,
        borderColor: `${severity.color}20`,
      }}>
        <AlertTriangle className="w-6 h-6 shrink-0" style={{ color: severity.color }} />
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold" style={{ color: severity.color }}>
              Biases detected
            </p>
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: `${severity.color}20`,
                color: severity.color,
              }}
            >
              {severity.label} severity
            </span>
          </div>
          <p className="text-xs text-white/50 mt-1">
            We found {biasCheck.types.length} potential bias {biasCheck.types.length === 1 ? 'pattern' : 'patterns'} in this classification.
          </p>
        </div>
      </div>

      {/* Detected bias types */}
      <div className="space-y-3">
        <p className="text-[10px] uppercase tracking-wider text-white/30 font-semibold">
          Detected bias types
        </p>
        <AnimatePresence>
          {biasCheck.types.map((type, index) => {
            const mitigation = mitigations[type.toLowerCase()] || mitigations.representation
            return (
              <motion.div
                key={type}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="rounded-xl p-4 bg-white/5 border border-white/10 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2.5 h-2.5 rounded-full shrink-0 ${severity.dotClass}`}
                  />
                  <span className="text-sm font-medium text-white/80 capitalize">
                    {type.replace(/_/g, ' ')} bias
                  </span>
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ml-auto"
                    style={{
                      backgroundColor: `${severity.color}20`,
                      color: severity.color,
                    }}
                  >
                    {severity.label}
                  </span>
                </div>
                <p className="text-xs text-white/50 leading-relaxed pl-[22px]">
                  {mitigation}
                </p>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Explanation */}
      {biasCheck.explanation && (
        <div className="rounded-xl p-4 bg-white/5 border border-white/10">
          <p className="text-sm text-white/60 leading-relaxed">{biasCheck.explanation}</p>
        </div>
      )}

      {/* What we're doing about it */}
      <div className="rounded-xl p-4 border border-white/10 bg-white/[0.03]">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-blue-400 shrink-0" />
          <p className="text-xs font-semibold text-white/70">What we&apos;re doing about it</p>
        </div>
        <ul className="space-y-2 pl-6">
          {biasCheck.types.map((type) => {
            const mitigation = mitigations[type.toLowerCase()] || mitigations.representation
            return (
              <li key={type} className="text-xs text-white/50 leading-relaxed list-disc">
                <span className="text-white/60 font-medium capitalize">
                  {type.replace(/_/g, ' ')}:
                </span>{' '}
                {mitigation}
              </li>
            )
          })}
          <li className="text-xs text-white/50 leading-relaxed list-disc">
            <span className="text-white/60 font-medium">General:</span> We always show alternative
            classifications and confidence scores so you can make informed decisions.
          </li>
        </ul>
      </div>
    </motion.div>
  )
}

export default BiasCheck
