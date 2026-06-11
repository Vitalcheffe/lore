'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  AtSign,
  Network,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'

// ─── Types ──────────────────────────────────────────────────
interface ProfileData {
  username?: string | null
}

interface CompletionItem {
  id: string
  label: string
  description: string
  completed: boolean
  href: string
  icon: typeof User
}

// ─── Circular Progress Ring ────────────────────────────────
function CircularProgress({
  value,
  size = 72,
  strokeWidth = 6,
}: {
  value: number
  size?: number
  strokeWidth?: number
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#F3F4F6"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#emeraldGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
        />
        {/* Gradient definition */}
        <defs>
          <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>
      </svg>
      {/* Center percentage */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          className="text-lg font-bold text-emerald-700 dark:text-emerald-400"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          {value}%
        </motion.span>
      </div>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────
export function ProfileCompletionCard({ nodeCount }: { nodeCount: number }) {
  const { user } = useAuth()
  const [profileData, setProfileData] = useState<ProfileData | null>(null)

  // ── Fetch profile data for username ──────────────────────
  useEffect(() => {
    if (!user?.id) return

    async function fetchProfile() {
      try {
        const res = await fetch(`/api/user/profile?userId=${user.id}`)
        if (res.ok) {
          const data = await res.json()
          setProfileData({ username: data.username })
        }
      } catch {
        // Silently fail
      }
    }

    fetchProfile()
  }, [user?.id])

  // ── Calculate completion items ───────────────────────────
  const completionItems: CompletionItem[] = useMemo(
    () => [
      {
        id: 'name',
        label: 'Add your name',
        description: 'Personalize your experience',
        completed: !!user?.name,
        href: '/app/settings',
        icon: User,
      },
      {
        id: 'username',
        label: 'Add a username',
        description: 'Let others find and mention you',
        completed: !!profileData?.username,
        href: '/app/settings',
        icon: AtSign,
      },
      {
        id: 'node',
        label: 'Create your first knowledge node',
        description: 'Start building your knowledge graph',
        completed: nodeCount > 0,
        href: '/app/graph',
        icon: Network,
      },
      {
        id: 'onboarding',
        label: 'Complete onboarding',
        description: 'Set up your workspace preferences',
        completed: !!user?.onboardingComplete,
        href: '/app/settings',
        icon: Sparkles,
      },
    ],
    [user?.name, user?.onboardingComplete, profileData?.username, nodeCount]
  )

  // ── Calculate percentage ─────────────────────────────────
  const completionPercentage = useMemo(() => {
    const completed = completionItems.filter((item) => item.completed).length
    return completed * 25
  }, [completionItems])

  // ── Don't show if 100% complete ──────────────────────────
  if (completionPercentage === 100) return null

  const missingItems = completionItems.filter((item) => !item.completed)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.98 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <Card className="bg-gradient-to-r from-emerald-50/80 dark:from-[rgba(16,185,129,0.08)] via-white dark:via-[#0F0F12] to-teal-50/40 dark:to-[rgba(20,184,166,0.06)] border-emerald-100/80 dark:border-[rgba(16,185,129,0.15)] overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-start gap-5">
              {/* ── Circular Progress ──────────────────────── */}
              <div className="shrink-0">
                <CircularProgress value={completionPercentage} />
              </div>

              {/* ── Content ────────────────────────────────── */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold text-[#18181B] dark:text-[#FAFAFA]">
                    Complete your profile
                  </h3>
                  <motion.span
                    key={completionPercentage}
                    initial={{ scale: 1.3, color: '#059669' }}
                    animate={{ scale: 1, color: '#059669' }}
                    transition={{ duration: 0.3 }}
                    className="text-xs font-bold text-emerald-600"
                  >
                    {completionPercentage}%
                  </motion.span>
                </div>
                <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] mb-3">
                  Finish setting up your account to unlock the full power of LORE.
                </p>

                {/* ── Checklist ────────────────────────────── */}
                <div className="space-y-2">
                  {missingItems.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i + 0.3, duration: 0.3 }}
                    >
                      <Link
                        href={item.href}
                        className="flex items-center gap-2.5 py-1.5 px-2 -mx-2 rounded-lg hover:bg-white/60 dark:hover:bg-[rgba(255,255,255,0.04)] transition-colors group"
                      >
                        <div className="w-5 h-5 rounded-full border-2 border-[#D4D4D8] dark:border-[#52525B] bg-white dark:bg-[#0F0F12] flex items-center justify-center shrink-0 group-hover:border-emerald-300 transition-colors">
                          {/* Empty circle for incomplete */}
                        </div>
                        <item.icon className="w-3.5 h-3.5 text-[#A1A1AA] dark:text-[#71717A] shrink-0 group-hover:text-emerald-500 transition-colors" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-[#52525B] dark:text-[#D4D4D8] group-hover:text-[#18181B] dark:group-hover:text-[#FAFAFA] transition-colors">
                            {item.label}
                          </p>
                        </div>
                        <ArrowRight className="w-3 h-3 text-[#D4D4D8] shrink-0 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}
