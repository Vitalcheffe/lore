'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Calendar,
  Sun,
  Sparkles,
  Network,
  Link2,
  Rocket,
  Plus,
  LinkIcon,
  Pencil,
  BookOpen,
  Shield,
  LayoutGrid,
  CheckSquare,
  MessageCircle,
  ChevronRight,
  TrendingUp,
  Clock,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { DigestEmptyState } from '@/components/app/empty-states'

// ─── Types ────────────────────────────────────────────────────
interface DigestData {
  id: string
  date: string
  summary: string
  keyInsights: string[]
  connections: { source: string; target: string; type: string; confidence: number }[]
  mood: string
  focusAreas: { name: string; progress: number }[]
  aiComment: string
  quickStats: {
    nodesAddedToday: number
    connections: number
    activeMembers: number
    queriesAnswered: number
  }
  timeline: { time: string; description: string; affected: string; type: string }[]
  actionItems: { id: string; label: string; checked: boolean }[]
  read: boolean
  createdAt: string
}

interface PastDigest {
  id: string
  date: string
  day: string
  summary: string
}

interface ApiResponse {
  digest: DigestData | null
  pastDigests: PastDigest[]
  error?: string
}

// ─── Animation Variants ───────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

// ─── Mappings for dynamic icon/color assignment ───────────────
const insightIcons = [Network, Link2, Rocket]
const insightColors = [
  { color: '#059669', bgColor: 'rgba(5,150,105,0.08)' },
  { color: '#0D9488', bgColor: 'rgba(13,148,136,0.08)' },
  { color: '#EA580C', bgColor: 'rgba(234,88,12,0.08)' },
  { color: '#7C3AED', bgColor: 'rgba(124,58,237,0.08)' },
]

const timelineIconMap: Record<string, { icon: typeof Plus; color: string; bgColor: string }> = {
  add: { icon: Plus, color: '#059669', bgColor: 'rgba(5,150,105,0.12)' },
  link: { icon: LinkIcon, color: '#0D9488', bgColor: 'rgba(13,148,136,0.12)' },
  edit: { icon: Pencil, color: '#3B82F6', bgColor: 'rgba(59,130,246,0.12)' },
  note: { icon: BookOpen, color: '#EA580C', bgColor: 'rgba(234,88,12,0.12)' },
}
const defaultTimelineIcon = { icon: Shield, color: '#7C3AED', bgColor: 'rgba(124,58,237,0.12)' }

const focusAreaColors = ['#059669', '#0D9488', '#3B82F6', '#EA580C']

const statConfig = [
  { label: 'Nodes added today', icon: Plus, color: '#059669' },
  { label: 'Connections', icon: Link2, color: '#0D9488' },
  { label: 'Active members', icon: LayoutGrid, color: '#EA580C' },
  { label: 'Queries answered', icon: MessageCircle, color: '#7C3AED' },
]

const moodLabelMap: Record<string, string> = {
  productive: 'Productive day',
  slow: 'Quiet day',
  neutral: 'Steady day',
}

// ─── Helpers ──────────────────────────────────────────────────
function formatDateDisplay(dateStr: string): string {
  try {
    const d = new Date(dateStr + 'T12:00:00')
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

function formatPastDigestDate(dateStr: string): string {
  try {
    const d = new Date(dateStr + 'T12:00:00')
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  } catch {
    return dateStr
  }
}

// ═══════════════════════════════════════════════════════════════
// MAIN DIGEST PAGE
// ═══════════════════════════════════════════════════════════════
export default function DigestPage() {
  const [digest, setDigest] = useState<DigestData | null>(null)
  const [pastDigests, setPastDigests] = useState<PastDigest[]>([])
  const [actionItems, setActionItems] = useState<{ id: string; label: string; checked: boolean }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDigest() {
      try {
        const res = await fetch('/api/digest')
        if (!res.ok) {
          throw new Error('Failed to fetch digest')
        }
        const data: ApiResponse = await res.json()

        if (data.error) {
          setError(data.error)
        } else {
          setDigest(data.digest)
          setPastDigests(data.pastDigests || [])
          if (data.digest?.actionItems) {
            setActionItems(data.digest.actionItems)
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }

    fetchDigest()
  }, [])

  const toggleAction = (id: string) => {
    setActionItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    )
  }

  // ─── Loading State ────────────────────────────────────────
  if (loading) {
    return (
      <ScrollArea className="h-full">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-amber-100 flex items-center justify-center mb-4 shadow-sm">
              <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
            </div>
            <h2 className="text-lg font-semibold text-[#18181B] dark:text-[#FAFAFA] mb-1">
              Preparing your digest…
            </h2>
            <p className="text-sm text-[#71717A] dark:text-[#A1A1AA]">
              Gathering insights from your knowledge graph
            </p>
          </div>
        </div>
      </ScrollArea>
    )
  }

  // ─── Error State ──────────────────────────────────────────
  if (error) {
    return (
      <ScrollArea className="h-full">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mb-4 shadow-sm">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <h2 className="text-lg font-semibold text-[#18181B] dark:text-[#FAFAFA] mb-1">
              Something went wrong
            </h2>
            <p className="text-sm text-[#71717A] dark:text-[#A1A1AA] text-center max-w-md">
              {error}
            </p>
          </div>
        </div>
      </ScrollArea>
    )
  }

  // ─── Empty State ──────────────────────────────────────────
  if (!digest) {
    return (
      <ScrollArea className="h-full">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <DigestEmptyState />
        </div>
      </ScrollArea>
    )
  }

  // ─── Derive display values from API data ──────────────────
  const dateDisplay = formatDateDisplay(digest.date)
  const moodLabel = moodLabelMap[digest.mood] || 'Steady day'

  const keyInsightsMapped = digest.keyInsights.map((text, i) => {
    const cfg = insightColors[i % insightColors.length]
    return {
      icon: insightIcons[i % insightIcons.length],
      title: text.length > 60 ? text.slice(0, 60) + '…' : text,
      description: text,
      color: cfg.color,
      bgColor: cfg.bgColor,
    }
  })

  const timelineMapped = digest.timeline.map((entry) => {
    const cfg = timelineIconMap[entry.type] || defaultTimelineIcon
    return {
      time: entry.time,
      description: entry.description,
      affected: entry.affected,
      icon: cfg.icon,
      color: cfg.color,
      bgColor: cfg.bgColor,
    }
  })

  const focusAreasMapped = digest.focusAreas.map((area, i) => ({
    name: area.name,
    progress: area.progress,
    color: focusAreaColors[i % focusAreaColors.length],
  }))

  const quickStatsMapped = [
    { label: statConfig[0].label, value: digest.quickStats.nodesAddedToday, icon: statConfig[0].icon, color: statConfig[0].color },
    { label: statConfig[1].label, value: digest.quickStats.connections, icon: statConfig[1].icon, color: statConfig[1].color },
    { label: statConfig[2].label, value: digest.quickStats.activeMembers, icon: statConfig[2].icon, color: statConfig[2].color },
    { label: statConfig[3].label, value: digest.quickStats.queriesAnswered, icon: statConfig[3].icon, color: statConfig[3].color },
  ]

  return (
    <ScrollArea className="h-full">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto"
      >
        {/* ═══════════════════════════════════════════════════════
            DATE HEADER
            ═══════════════════════════════════════════════════════ */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center shadow-sm">
              <Calendar className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#18181B] dark:text-[#FAFAFA] tracking-tight">
                Morning Digest
              </h1>
              <p className="text-sm text-[#71717A] dark:text-[#A1A1AA] mt-0.5">
                {dateDisplay}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════
            MAIN LAYOUT: Content + Sidebar
            ═══════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ─── Left: Main Content ────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            {/* ── Daily Summary Card ─────────────────────── */}
            <motion.div variants={itemVariants}>
              <Card className="bg-white dark:bg-[#0F0F12] border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-50 via-white to-amber-50/30 dark:from-[rgba(16,185,129,0.06)] dark:via-[#0F0F12] dark:to-[rgba(245,158,11,0.04)] p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-md shadow-emerald-500/20">
                        <Sun className="w-4 h-4 text-white" />
                      </div>
                      <h2 className="text-lg font-bold text-[#18181B] dark:text-[#FAFAFA]">
                        Daily Summary
                      </h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="text-[10px] font-semibold gap-1.5 border-emerald-200 dark:border-[rgba(16,185,129,0.20)] bg-emerald-50/50 dark:bg-[rgba(16,185,129,0.06)] text-emerald-700 dark:text-emerald-400"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {moodLabel}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-[10px] font-semibold gap-1 border-violet-200 dark:border-[rgba(139,92,246,0.20)] bg-violet-50/50 dark:bg-[rgba(139,92,246,0.06)] text-violet-700 dark:text-violet-400"
                      >
                        <Sparkles className="w-2.5 h-2.5" />
                        Powered by AI
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-[#52525B] dark:text-[#D4D4D8] leading-relaxed">
                    {digest.summary}
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* ── Key Insights Section ────────────────────── */}
            {keyInsightsMapped.length > 0 && (
              <motion.div variants={itemVariants}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-[#18181B] dark:text-[#FAFAFA] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Key Insights
                  </h3>
                  <Badge
                    variant="outline"
                    className="text-[10px] font-semibold gap-1.5 border-emerald-200 dark:border-[rgba(16,185,129,0.20)] bg-emerald-50/50 dark:bg-[rgba(16,185,129,0.06)] text-emerald-700 dark:text-emerald-400"
                  >
                    <Sparkles className="w-2.5 h-2.5" />
                    AI Insight
                  </Badge>
                </div>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.1 } },
                  }}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                >
                  {keyInsightsMapped.map((insight) => (
                    <motion.div
                      key={insight.title}
                      variants={{
                        hidden: { opacity: 0, y: 16, scale: 0.97 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
                        },
                      }}
                    >
                      <Card
                        className="bg-white dark:bg-[#0F0F12] border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] hover:shadow-md transition-shadow group cursor-default overflow-hidden"
                      >
                        {/* Emerald left border accent */}
                        <div className="flex">
                          <div className="w-1 bg-gradient-to-b from-emerald-400 to-emerald-600 shrink-0" />
                          <CardContent className="p-4 flex-1 bg-gradient-to-br from-emerald-50/30 via-white to-white dark:from-[rgba(16,185,129,0.04)] dark:via-[#0F0F12] dark:to-[#0F0F12]">
                            <div className="flex items-center gap-2 mb-3">
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{ background: insight.bgColor }}
                              >
                                <insight.icon className="w-3.5 h-3.5" style={{ color: insight.color }} />
                              </div>
                              <Sparkles className="w-3.5 h-3.5 text-emerald-500 ml-auto opacity-60 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <h4 className="text-sm font-semibold text-[#18181B] dark:text-[#FAFAFA] mb-1.5 leading-snug">
                              {insight.title}
                            </h4>
                            <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
                              {insight.description}
                            </p>
                          </CardContent>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* ── Knowledge Changes Timeline ──────────────── */}
            {timelineMapped.length > 0 && (
              <motion.div variants={itemVariants}>
                <h3 className="text-sm font-bold text-[#18181B] dark:text-[#FAFAFA] mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Knowledge Changes Timeline
                </h3>
                <Card className="bg-white dark:bg-[#0F0F12] border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)]">
                  <CardContent className="p-6">
                    <div className="relative">
                      {/* Timeline line */}
                      <div className="absolute left-[15px] top-2 bottom-2 w-px bg-[#E5E7EB] dark:bg-[rgba(255,255,255,0.08)]" />

                      <div className="space-y-5">
                        {timelineMapped.map((entry, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                            className="flex items-start gap-4 relative"
                          >
                            {/* Timeline dot + icon */}
                            <div
                              className="w-[30px] h-[30px] rounded-full flex items-center justify-center shrink-0 z-10 border-2 border-white dark:border-[#0F0F12] shadow-sm"
                              style={{ background: entry.bgColor }}
                            >
                              <entry.icon className="w-3.5 h-3.5" style={{ color: entry.color }} />
                            </div>
                            {/* Content */}
                            <div className="flex-1 min-w-0 pt-0.5">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-xs font-semibold text-[#71717A] dark:text-[#A1A1AA]">
                                  {entry.time}
                                </span>
                              </div>
                              <p className="text-sm font-medium text-[#18181B] dark:text-[#FAFAFA]">
                                {entry.description}
                              </p>
                              <p className="text-xs text-[#A1A1AA] dark:text-[#71717A] mt-0.5">
                                Affected: {entry.affected}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* ── Focus Areas ─────────────────────────────── */}
            {focusAreasMapped.length > 0 && (
              <motion.div variants={itemVariants}>
                <h3 className="text-sm font-bold text-[#18181B] dark:text-[#FAFAFA] mb-3 flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Focus Areas
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {focusAreasMapped.map((area) => (
                    <Card
                      key={area.name}
                      className="bg-white dark:bg-[#0F0F12] border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-semibold text-[#18181B] dark:text-[#FAFAFA]">
                            {area.name}
                          </h4>
                          <span
                            className="text-xs font-bold"
                            style={{ color: area.color }}
                          >
                            {area.progress}%
                          </span>
                        </div>
                        <Progress
                          value={area.progress}
                          className="h-2 bg-gray-100"
                        />
                        <p className="text-[11px] text-[#A1A1AA] dark:text-[#71717A] mt-1.5">
                          Knowledge coverage
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* ─── Right Sidebar ──────────────────────────── */}
          <div className="space-y-6">
            {/* ── Quick Stats ────────────────────────────── */}
            <motion.div variants={itemVariants}>
              <h3 className="text-sm font-bold text-[#18181B] dark:text-[#FAFAFA] mb-3">Quick Stats</h3>
              <Card className="bg-white dark:bg-[#0F0F12] border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)]">
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-3">
                    {quickStatsMapped.map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-xl bg-[#F9FAFB] dark:bg-[#09090B] p-3 text-center border border-[#F3F4F6] dark:border-[rgba(255,255,255,0.06)]"
                      >
                        <stat.icon
                          className="w-4 h-4 mx-auto mb-1.5"
                          style={{ color: stat.color }}
                        />
                        <p className="text-xl font-bold text-[#18181B] dark:text-[#FAFAFA]">{stat.value}</p>
                        <p className="text-[10px] text-[#71717A] dark:text-[#A1A1AA] mt-0.5 leading-tight">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* ── Action Items ────────────────────────────── */}
            {actionItems.length > 0 && (
              <motion.div variants={itemVariants}>
                <h3 className="text-sm font-bold text-[#18181B] dark:text-[#FAFAFA] mb-3 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Action Items
                </h3>
                <Card className="bg-white dark:bg-[#0F0F12] border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)]">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {actionItems.map((item) => (
                        <div key={item.id} className="flex items-start gap-3">
                          <Checkbox
                            checked={item.checked}
                            onCheckedChange={() => toggleAction(item.id)}
                            className="mt-0.5 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                          />
                          <span
                            className={`text-sm leading-relaxed transition-colors ${
                              item.checked
                                ? 'text-[#A1A1AA] dark:text-[#71717A] line-through'
                                : 'text-[#52525B] dark:text-[#D4D4D8]'
                            }`}
                          >
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                    <Separator className="my-4 bg-[#E5E7EB] dark:bg-[rgba(255,255,255,0.08)]" />
                    <p className="text-xs text-[#A1A1AA] dark:text-[#71717A]">
                      {actionItems.filter((i) => i.checked).length} of {actionItems.length} completed
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* ── AI Comment ─────────────────────────────── */}
            {digest.aiComment && (
              <motion.div variants={itemVariants}>
                <h3 className="text-sm font-bold text-[#18181B] dark:text-[#FAFAFA] mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                  AI Insight
                </h3>
                <div className="relative">
                  <div className="bg-gradient-to-br from-violet-50 via-white to-emerald-50/30 dark:from-[rgba(139,92,246,0.06)] dark:via-[#0F0F12] dark:to-[rgba(16,185,129,0.04)] rounded-2xl border border-violet-100 dark:border-[rgba(139,92,246,0.15)] p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center shrink-0 shadow-sm">
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                      </div>
                      <p className="text-sm text-[#52525B] dark:text-[#D4D4D8] leading-relaxed">
                        {digest.aiComment}
                      </p>
                    </div>
                  </div>
                  {/* Speech bubble pointer */}
                  <div className="absolute -bottom-2 left-8 w-4 h-4 bg-white dark:bg-[#0F0F12] border-r border-b border-violet-100 dark:border-[rgba(139,92,246,0.15)] transform rotate-45" />
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            PAST DIGESTS
            ═══════════════════════════════════════════════════════ */}
        {pastDigests.length > 0 && (
          <motion.div variants={itemVariants} className="mt-8">
            <h3 className="text-sm font-bold text-[#18181B] dark:text-[#FAFAFA] mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Past Digests
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {pastDigests.map((pd) => (
                <Card
                  key={pd.id}
                  className="bg-white dark:bg-[#0F0F12] border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] hover:shadow-md hover:border-emerald-200 dark:hover:border-[rgba(16,185,129,0.20)] transition-all group cursor-pointer"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-[#18181B] dark:text-[#FAFAFA]">
                        {pd.day}
                      </h4>
                      <span className="text-[10px] text-[#A1A1AA] dark:text-[#71717A]">{formatPastDigestDate(pd.date)}</span>
                    </div>
                    <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] leading-relaxed mb-3">
                      {pd.summary}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-[rgba(16,185,129,0.10)] p-0 h-auto gap-1"
                    >
                      Read more
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </ScrollArea>
  )
}
