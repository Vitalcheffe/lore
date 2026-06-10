'use client'

import { motion } from 'framer-motion'
import { ShieldCheck, ShieldAlert, Shield, ShieldX, Clock, Info } from 'lucide-react'
import type { VerificationStatus as VerificationStatusType } from '@/types/classification'

interface VerificationStatusProps {
  verification: VerificationStatusType
  lastVerified: string | null
}

const statusConfig: Record<
  VerificationStatusType,
  {
    icon: typeof ShieldCheck
    label: string
    description: string
    color: string
    bgClass: string
    borderClass: string
    badgeClass: string
  }
> = {
  verified: {
    icon: ShieldCheck,
    label: 'Verified by human review',
    description:
      'This resource has been reviewed and confirmed by a trained 211 navigator or authorized reviewer.',
    color: '#10b981',
    bgClass: 'bg-emerald-500/10',
    borderClass: 'border-emerald-500/20',
    badgeClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  },
  partially_verified: {
    icon: ShieldAlert,
    label: 'Partially verified',
    description:
      'Some aspects of this resource have been verified, but not all details have been independently confirmed. We recommend calling ahead.',
    color: '#f59e0b',
    bgClass: 'bg-amber-500/10',
    borderClass: 'border-amber-500/20',
    badgeClass: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  },
  unverified: {
    icon: Shield,
    label: 'Not yet independently verified',
    description:
      'This resource has not been independently verified by a human reviewer. Details may be outdated or inaccurate. Please confirm directly with the provider.',
    color: '#6b7280',
    bgClass: 'bg-gray-500/10',
    borderClass: 'border-gray-500/20',
    badgeClass: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  },
  disputed: {
    icon: ShieldX,
    label: 'This resource has been disputed',
    description:
      'This resource has been flagged as potentially inaccurate or unavailable by a user or navigator. Please exercise caution and verify independently before relying on this information.',
    color: '#ef4444',
    bgClass: 'bg-red-500/10',
    borderClass: 'border-red-500/20',
    badgeClass: 'bg-red-500/20 text-red-400 border-red-500/30',
  },
}

function formatLastVerified(dateStr: string | null): string {
  if (!dateStr) return 'Not yet verified'
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return 'Not yet verified'
  }
}

export function VerificationStatus({ verification, lastVerified }: VerificationStatusProps) {
  const config = statusConfig[verification]
  const Icon = config.icon
  const formattedDate = formatLastVerified(lastVerified)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-5"
    >
      {/* Status badge */}
      <div className="flex items-center gap-3">
        <div
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-semibold ${config.badgeClass}`}
        >
          <Icon className="w-4 h-4" />
          {config.label}
        </div>
      </div>

      {/* Last verified date */}
      <div className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/[0.03]">
        <Clock className="w-4 h-4 text-white/40 shrink-0" />
        <div>
          <p className="text-xs text-white/40 font-medium">Last verified</p>
          <p className="text-sm text-white/80 font-semibold mt-0.5">{formattedDate}</p>
        </div>
      </div>

      {/* Status description */}
      <div
        className="rounded-xl p-4 border"
        style={{
          backgroundColor: `${config.color}08`,
          borderColor: `${config.color}20`,
        }}
      >
        <p className="text-sm text-white/70 leading-relaxed">{config.description}</p>
      </div>

      {/* Verification process explanation */}
      <div className="rounded-xl p-4 border border-white/10 bg-white/[0.03]">
        <div className="flex items-start gap-3">
          <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-white/60">Our verification process</p>
            <p className="text-xs text-white/40 mt-1 leading-relaxed">
              Resources are verified by trained 211 navigators who confirm availability, contact
              information, and eligibility requirements. Verified resources are re-checked at least
              every 30 days. If a resource hasn&apos;t been verified recently, we display a &ldquo;call
              to confirm&rdquo; notice. Disputed resources are investigated and either updated or
              removed within 48 hours.
            </p>
          </div>
        </div>
      </div>

      {/* Call to action for unverified / disputed */}
      {(verification === 'unverified' || verification === 'disputed') && (
        <a
          href="https://211.org"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors hover:underline"
        >
          Confirm with a navigator →
        </a>
      )}
    </motion.div>
  )
}

export default VerificationStatus
