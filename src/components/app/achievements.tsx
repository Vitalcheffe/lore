'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trophy, Star, Zap, Brain, Network, Flame, BookOpen } from 'lucide-react'

export interface Achievement {
  id: string
  title: string
  description: string
  icon: typeof Trophy
  color: string
  bgColor: string
}

export const ACHIEVEMENTS: Record<string, Achievement> = {
  first_node: {
    id: 'first_node',
    title: 'First Node',
    description: 'You created your first knowledge node!',
    icon: Network,
    color: '#059669',
    bgColor: 'rgba(5,150,105,0.1)',
  },
  five_nodes: {
    id: 'five_nodes',
    title: 'Knowledge Seeker',
    description: "You've created 5 knowledge nodes!",
    icon: Brain,
    color: '#7C3AED',
    bgColor: 'rgba(124,58,237,0.1)',
  },
  ten_nodes: {
    id: 'ten_nodes',
    title: 'Knowledge Architect',
    description: '10 nodes and counting! Your graph is growing!',
    icon: Star,
    color: '#D97706',
    bgColor: 'rgba(217,119,6,0.1)',
  },
  first_edge: {
    id: 'first_edge',
    title: 'Connection Maker',
    description: 'You linked two nodes together!',
    icon: Zap,
    color: '#0D9488',
    bgColor: 'rgba(13,148,136,0.1)',
  },
  first_note: {
    id: 'first_note',
    title: 'Memory Keeper',
    description: 'You saved your first note!',
    icon: BookOpen,
    color: '#7C3AED',
    bgColor: 'rgba(124,58,237,0.1)',
  },
  first_chat: {
    id: 'first_chat',
    title: 'AI Explorer',
    description: 'You had your first AI conversation!',
    icon: Flame,
    color: '#EA580C',
    bgColor: 'rgba(234,88,12,0.1)',
  },
  streak_3: {
    id: 'streak_3',
    title: 'On a Roll',
    description: "3-day streak! You're building a habit!",
    icon: Flame,
    color: '#DC2626',
    bgColor: 'rgba(220,38,38,0.1)',
  },
}

interface AchievementPopupProps {
  achievement: Achievement | null
  onClose?: () => void
}

export function AchievementPopup({ achievement, onClose }: AchievementPopupProps) {
  const [dismissed, setDismissed] = useState(false)
  const [prevId, setPrevId] = useState<string | null>(null)

  // Reset dismissed state when a new achievement comes in
  if (achievement && achievement.id !== prevId) {
    setDismissed(false)
    setPrevId(achievement.id)
  }

  const isVisible = achievement !== null && !dismissed

  useEffect(() => {
    if (!achievement || dismissed) return
    const timer = setTimeout(() => {
      setDismissed(true)
      onClose?.()
    }, 4000)
    return () => clearTimeout(timer)
  }, [achievement, dismissed, onClose])

  if (!achievement) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -80, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -80, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="fixed top-6 right-6 z-[200] bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] p-4 max-w-xs"
        >
          <div className="flex items-start gap-3">
            <motion.div
              initial={{ rotate: -30, scale: 0.5 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: achievement.bgColor }}
            >
              <achievement.icon className="w-6 h-6" style={{ color: achievement.color }} />
            </motion.div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Achievement Unlocked!</p>
              </div>
              <p className="text-sm font-bold text-[#18181B]">{achievement.title}</p>
              <p className="text-xs text-[#71717A] mt-0.5">{achievement.description}</p>
            </div>
            <button
              onClick={() => { setDismissed(true); onClose?.() }}
              className="w-6 h-6 rounded-md flex items-center justify-center text-[#A1A1AA] hover:text-[#52525B] hover:bg-gray-100 transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
