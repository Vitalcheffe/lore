'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Network,
  Link2,
  Flame,
  MessageSquare,
  ArrowRight,
  Sun,
  Clock,
  Plus,
  BookOpen,
  Sparkles,
  CircleDot,
  GitBranch,
  FileText,
  Zap,
  Download,
  Lightbulb,
  Activity,
  Heart,
} from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/hooks/use-auth'
import { ProfileCompletionCard } from '@/components/app/profile-completion'
import { ACHIEVEMENTS } from '@/components/app/achievements'
import { useAchievementStore } from '@/stores/achievement-store'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts'

// ─── Types ──────────────────────────────────────────────────
interface UserStats {
  conversations: number
  resourcesFound: number
  avgConfidence: number
  streak: number
  totalConversations: number
  totalResources: number
  weeklyActivity: { date: string; day: string; count: number }[]
}

interface KnowledgeNode {
  id: string
  title: string
  type: string
  content: string
  createdAt: string
  updatedAt: string
}

interface KnowledgeEdge {
  id: string
  sourceId: string
  targetId: string
  label: string | null
  type: string
  createdAt: string
}

interface DigestData {
  id: string
  date: string
  summary: string
  aiComment: string | null
  quickStats: {
    nodesAddedToday: number
    connections: number
    activeMembers: number
    queriesAnswered: number
  }
  focusAreas: { name: string; progress: number }[]
}

interface ActivityItem {
  icon: typeof CircleDot
  title: string
  time: string
  color: string
  bgColor: string
}

// ─── Time-based greeting ───────────────────────────────────
function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

// ─── Relative time helper ──────────────────────────────────
function timeAgo(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  const diffDay = Math.floor(diffHr / 24)
  return `${diffDay}d ago`
}

// ─── Animated Number Counter ──────────────────────────────
function AnimatedNumber({ value, duration = 1 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    let start = 0
    const end = parseInt(String(value)) || 0
    if (start === end) return

    const timer = setTimeout(() => {
      const incrementTime = (duration * 1000) / end
      const counter = setInterval(() => {
        start += 1
        setDisplay(start)
        if (start === end) clearInterval(counter)
      }, incrementTime)
      return () => clearInterval(counter)
    }, 300)

    return () => clearTimeout(timer)
  }, [value, duration])

  return <>{display}</>
}

// ─── Knowledge Graph SVG Preview ───────────────────────────
function MiniGraphSVG() {
  return (
    <svg viewBox="0 0 320 200" className="w-full h-auto" fill="none">
      {/* Edges */}
      <line x1="65" y1="55" x2="160" y2="100" stroke="#A7F3D0" strokeWidth="1.5" />
      <line x1="160" y1="100" x2="260" y2="60" stroke="#A7F3D0" strokeWidth="1.5" />
      <line x1="160" y1="100" x2="110" y2="165" stroke="#A7F3D0" strokeWidth="1.5" />
      <line x1="160" y1="100" x2="240" y2="155" stroke="#A7F3D0" strokeWidth="1.5" />
      <line x1="65" y1="55" x2="110" y2="165" stroke="#D1FAE5" strokeWidth="1" />
      <line x1="260" y1="60" x2="240" y2="155" stroke="#D1FAE5" strokeWidth="1" />
      <line x1="65" y1="55" x2="35" y2="115" stroke="#D1FAE5" strokeWidth="1" />
      <line x1="260" y1="60" x2="295" y2="110" stroke="#D1FAE5" strokeWidth="1" />
      {/* Animated pulse dots */}
      <circle r="2.5" fill="#10B981">
        <animateMotion dur="3s" repeatCount="indefinite" path="M65,55 L160,100" />
      </circle>
      <circle r="2.5" fill="#0D9488">
        <animateMotion dur="4s" repeatCount="indefinite" path="M160,100 L260,60" />
      </circle>
      <circle r="2" fill="#059669">
        <animateMotion dur="3.5s" repeatCount="indefinite" path="M160,100 L240,155" />
      </circle>
      {/* Nodes */}
      <circle cx="65" cy="55" r="14" fill="#10B981" opacity="0.9" />
      <circle cx="160" cy="100" r="20" fill="#059669" opacity="0.95" />
      <circle cx="260" cy="60" r="12" fill="#34D399" opacity="0.8" />
      <circle cx="110" cy="165" r="13" fill="#0D9488" opacity="0.85" />
      <circle cx="240" cy="155" r="11" fill="#14B8A6" opacity="0.75" />
      <circle cx="35" cy="115" r="8" fill="#6EE7B7" opacity="0.7" />
      <circle cx="295" cy="110" r="8" fill="#6EE7B7" opacity="0.7" />
      {/* Node labels */}
      <text x="65" y="59" textAnchor="middle" fill="white" fontSize="7" fontWeight="600">API</text>
      <text x="160" y="104" textAnchor="middle" fill="white" fontSize="8" fontWeight="700">Core</text>
      <text x="260" y="64" textAnchor="middle" fill="white" fontSize="6.5" fontWeight="600">Auth</text>
      <text x="110" y="169" textAnchor="middle" fill="white" fontSize="6.5" fontWeight="600">Data</text>
      <text x="240" y="159" textAnchor="middle" fill="white" fontSize="6" fontWeight="600">AI</text>
    </svg>
  )
}

// ─── Health Score Calculation ──────────────────────────────
interface HealthScoreBreakdown {
  nodes: number
  connections: number
  diversity: number
  activity: number
  total: number
}

function calculateHealthScore(
  nodeCount: number,
  edgeCount: number,
  uniqueTypes: number,
  recentNodeCount: number
): HealthScoreBreakdown {
  // Node count score (0-25)
  let nodesScore = 0
  if (nodeCount >= 20) nodesScore = 25
  else if (nodeCount >= 10) nodesScore = 20
  else if (nodeCount >= 5) nodesScore = 15
  else if (nodeCount >= 1) nodesScore = 8

  // Edge density score (0-25)
  let connectionsScore = 0
  if (nodeCount > 0) {
    const ratio = edgeCount / nodeCount
    if (ratio > 2.0) connectionsScore = 25
    else if (ratio > 1.0) connectionsScore = 20
    else if (ratio > 0.5) connectionsScore = 15
    else if (ratio > 0) connectionsScore = 8
  }

  // Type diversity score (0-25)
  let diversityScore = 0
  if (uniqueTypes >= 4) diversityScore = 25
  else if (uniqueTypes === 3) diversityScore = 15
  else if (uniqueTypes === 2) diversityScore = 10
  else if (uniqueTypes === 1) diversityScore = 5

  // Recent activity score (0-25)
  let activityScore = 0
  if (recentNodeCount >= 8) activityScore = 25
  else if (recentNodeCount >= 4) activityScore = 20
  else if (recentNodeCount >= 1) activityScore = 10

  return {
    nodes: nodesScore,
    connections: connectionsScore,
    diversity: diversityScore,
    activity: activityScore,
    total: nodesScore + connectionsScore + diversityScore + activityScore,
  }
}

function getHealthLabel(score: number): string {
  if (score >= 81) return 'Excellent'
  if (score >= 61) return 'Good'
  if (score >= 41) return 'Needs Work'
  return 'Getting Started'
}

function getHealthColor(score: number): string {
  if (score >= 81) return '#10B981' // bright emerald
  if (score >= 61) return '#059669' // emerald
  if (score >= 41) return '#F59E0B' // amber
  return '#EF4444' // red
}

function getHealthGlow(score: number): string {
  if (score >= 81) return '0 0 20px rgba(16,185,129,0.5), 0 0 40px rgba(16,185,129,0.2)'
  if (score >= 61) return '0 0 10px rgba(5,150,105,0.3)'
  return 'none'
}

// ─── Health Score Ring Component ───────────────────────────
function HealthScoreRing({ score, color, glow }: { score: number; color: string; glow: string }) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const [animatedOffset, setAnimatedOffset] = useState(0)
  const radius = 58
  const strokeWidth = 8
  const circumference = 2 * Math.PI * radius

  useEffect(() => {
    const targetOffset = circumference - (score / 100) * circumference
    const timer = setTimeout(() => {
      // Animate the score number
      let current = 0
      const step = Math.max(1, Math.floor(score / 40))
      const counter = setInterval(() => {
        current += step
        if (current >= score) {
          current = score
          clearInterval(counter)
        }
        setAnimatedScore(current)
      }, 25)
      // Animate the ring
      setAnimatedOffset(targetOffset)
    }, 400)
    return () => clearTimeout(timer)
  }, [score, circumference])

  return (
    <div className="relative" style={{ filter: glow }}>
      <svg width="140" height="140" viewBox="0 0 140 140" className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          className="stroke-[rgba(0,0,0,0.06)] dark:stroke-[rgba(255,255,255,0.06)]"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animatedOffset}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-3xl font-bold"
          style={{ color, fontVariantNumeric: 'tabular-nums' }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          {animatedScore}
        </motion.span>
        <span
          className="text-[10px] font-semibold uppercase tracking-wider mt-0.5"
          style={{ color: color, opacity: 0.8 }}
        >
          {getHealthLabel(score)}
        </span>
      </div>
    </div>
  )
}

// ─── Mini Progress Bar ────────────────────────────────────
function MiniProgressBar({
  label,
  value,
  maxValue,
  color,
  icon,
}: {
  label: string
  value: number
  maxValue: number
  color: string
  icon: React.ReactNode
}) {
  const percentage = Math.min(100, (value / maxValue) * 100)
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-5 h-5 rounded flex items-center justify-center shrink-0" style={{ background: `${color}15` }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-medium text-[#52525B] dark:text-[#D4D4D8]">{label}</span>
          <span className="text-[10px] font-semibold" style={{ color }}>
            {value}/{maxValue}
          </span>
        </div>
        <div className="h-1.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: color }}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ delay: 0.6, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>
      </div>
    </div>
  )
}

// ─── Weekly Activity Chart Component ──────────────────────
function WeeklyActivityChart({ data }: { data: { day: string; count: number }[] }) {
  return (
    <div className="h-[120px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#10B981" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#A1A1AA' }}
            dy={5}
          />
          <YAxis hide />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#10B981"
            strokeWidth={2}
            fill="url(#emeraldGradient)"
            dot={false}
            activeDot={{ r: 3, fill: '#059669', stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

// ─── Animation Variants ────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

// ─── Pro Tip Card ──────────────────────────────────────────
const PRO_TIPS = [
  "Use ⌘K to quickly search across your knowledge base",
  "Link related nodes to help AI make better connections",
  "Pin important notes to find them faster",
  "Check your morning digest daily for AI-powered insights",
]

function ProTipCard() {
  const [tipIndex] = useState(() => Math.floor(Math.random() * PRO_TIPS.length))

  return (
    <Card className="bg-gradient-to-r from-amber-50/80 to-amber-100/40 dark:from-[rgba(245,158,11,0.08)] dark:to-[rgba(245,158,11,0.04)] border-amber-200/60 dark:border-[rgba(245,158,11,0.15)] hover:shadow-sm transition-shadow">
      <CardContent className="p-4 flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-[rgba(245,158,11,0.12)] flex items-center justify-center shrink-0 mt-0.5">
          <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider mb-1">Pro Tip</p>
          <p className="text-sm text-amber-900/80 dark:text-amber-200/80 leading-relaxed">{PRO_TIPS[tipIndex]}</p>
        </div>
      </CardContent>
    </Card>
  )
}

// ═══════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ═══════════════════════════════════════════════════════════════
export default function DashboardPage() {
  const { user } = useAuth()
  const { triggerAchievement } = useAchievementStore()
  const [addNodeOpen, setAddNodeOpen] = useState(false)
  const greeting = useMemo(() => getGreeting(), [])

  // ── Form state for Add Node dialog ──
  const [nodeTitle, setNodeTitle] = useState('')
  const [nodeType, setNodeType] = useState('')
  const [nodeDesc, setNodeDesc] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ── Fetched data state ──
  const [stats, setStats] = useState<UserStats | null>(null)
  const [nodes, setNodes] = useState<KnowledgeNode[]>([])
  const [edges, setEdges] = useState<KnowledgeEdge[]>([])
  const [digest, setDigest] = useState<DigestData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // ── Fetch all data ──
  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true)
    try {
      const headers: HeadersInit = { 'Content-Type': 'application/json' }

      // Fetch stats if user is authenticated
      const statsPromise = user?.id
        ? fetch(`/api/user/stats?userId=${user.id}`, { headers }).then(r => r.json()).catch(() => null)
        : Promise.resolve(null)

      // Fetch nodes
      const nodesPromise = fetch('/api/nodes', { headers }).then(r => r.json()).catch(() => ({ nodes: [] }))

      // Fetch edges
      const edgesPromise = fetch('/api/edges', { headers }).then(r => r.json()).catch(() => ({ edges: [] }))

      // Fetch digest
      const digestPromise = fetch('/api/digest', { headers }).then(r => r.json()).catch(() => ({ digest: null }))

      const [statsResult, nodesResult, edgesResult, digestResult] = await Promise.all([
        statsPromise,
        nodesPromise,
        edgesPromise,
        digestPromise,
      ])

      if (statsResult) setStats(statsResult)
      setNodes(nodesResult.nodes || [])
      setEdges(edgesResult.edges || [])
      setDigest(digestResult.digest || null)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  // ── Trigger achievements based on stats ──
  useEffect(() => {
    if (!isLoading && nodes.length > 0) {
      if (nodes.length >= 1) triggerAchievement(ACHIEVEMENTS.first_node)
      if (nodes.length >= 5) triggerAchievement(ACHIEVEMENTS.five_nodes)
      if (nodes.length >= 10) triggerAchievement(ACHIEVEMENTS.ten_nodes)
      if (edges.length >= 1) triggerAchievement(ACHIEVEMENTS.first_edge)
    }
  }, [isLoading, nodes.length, edges.length, triggerAchievement])

  // ── Compute derived data ──
  const nodeCount = nodes.length
  const edgeCount = edges.length

  // Count nodes created today
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const newTodayCount = nodes.filter(n => new Date(n.createdAt) >= todayStart).length

  // Count nodes created in the last 7 days
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const recentNodeCount = nodes.filter(n => new Date(n.createdAt) >= sevenDaysAgo).length

  // Count unique node types
  const uniqueTypes = useMemo(() => {
    const types = new Set(nodes.map(n => n.type))
    return types.size
  }, [nodes])

  // Calculate health score
  const healthScore = useMemo(
    () => calculateHealthScore(nodeCount, edgeCount, uniqueTypes, recentNodeCount),
    [nodeCount, edgeCount, uniqueTypes, recentNodeCount]
  )

  // Build a map of node id → title for edge labels
  const nodeTitleMap = useMemo(() => {
    const map = new Map<string, string>()
    for (const node of nodes) {
      map.set(node.id, node.title)
    }
    return map
  }, [nodes])

  // Build recent activity from real nodes + edges
  const recentActivity: ActivityItem[] = useMemo(() => {
    const activities: (ActivityItem & { sortDate: Date })[] = []

    // Recent nodes → "Added 'X' to Knowledge Graph"
    for (const node of nodes.slice(0, 10)) {
      activities.push({
        icon: CircleDot,
        title: `Added '${node.title}' to Knowledge Graph`,
        time: timeAgo(node.createdAt),
        color: '#059669',
        bgColor: 'rgba(5,150,105,0.08)',
        sortDate: new Date(node.createdAt),
      })
    }

    // Recent edges → "Linked 'A' → 'B'"
    for (const edge of edges.slice(0, 10)) {
      const sourceTitle = nodeTitleMap.get(edge.sourceId) || 'Unknown'
      const targetTitle = nodeTitleMap.get(edge.targetId) || 'Unknown'
      activities.push({
        icon: GitBranch,
        title: `Linked '${sourceTitle}' → '${targetTitle}'`,
        time: timeAgo(edge.createdAt),
        color: '#0D9488',
        bgColor: 'rgba(13,148,136,0.08)',
        sortDate: new Date(edge.createdAt),
      })
    }

    // Sort by date descending, take top 5
    activities.sort((a, b) => b.sortDate.getTime() - a.sortDate.getTime())
    return activities.slice(0, 5)
  }, [nodes, edges, nodeTitleMap])

  // Stats cards with real data
  const statsCards = useMemo(() => [
    {
      label: 'Total Knowledge Nodes',
      value: String(nodeCount),
      icon: Network,
      change: newTodayCount > 0 ? `+${newTodayCount} today` : 'No new today',
      color: '#059669',
      bgColor: 'rgba(5,150,105,0.08)',
    },
    {
      label: 'Connections Made',
      value: String(edgeCount),
      icon: Link2,
      change: edgeCount > 0 ? `${edgeCount} total links` : 'Start linking nodes',
      color: '#0D9488',
      bgColor: 'rgba(13,148,136,0.08)',
    },
    {
      label: 'Daily Digest Streak',
      value: String(stats?.streak ?? 0),
      suffix: ' days',
      icon: Flame,
      change: (stats?.streak ?? 0) > 0 ? 'Keep it going!' : 'Start your streak',
      color: '#EA580C',
      bgColor: 'rgba(234,88,12,0.08)',
    },
    {
      label: 'AI Queries Today',
      value: String(digest?.quickStats?.queriesAnswered ?? stats?.conversations ?? 0),
      icon: MessageSquare,
      change: stats?.conversations ? `${stats.conversations} total convos` : 'No queries yet',
      color: '#7C3AED',
      bgColor: 'rgba(124,58,237,0.08)',
    },
  ], [nodeCount, edgeCount, newTodayCount, stats, digest])

  // Weekly activity data for chart
  const weeklyChartData = useMemo(() => {
    if (stats?.weeklyActivity && stats.weeklyActivity.length > 0) {
      return stats.weeklyActivity.map(d => ({
        day: d.day?.slice(0, 3) || d.date?.slice(0, 3) || '',
        count: d.count,
      }))
    }
    // Generate placeholder data from node creation dates
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const now = new Date()
    const dayOfWeek = now.getDay() // 0=Sun, 1=Mon, ...
    const data = days.map((day, i) => {
      // Map index to day of week (Mon=0, Sun=6)
      const jsDay = i === 6 ? 0 : i + 1 // Convert Mon=0 to JS day format
      const count = nodes.filter(n => {
        const d = new Date(n.createdAt)
        // Simple: count if the day of week matches and within last 7 days
        const diffMs = now.getTime() - d.getTime()
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
        return diffDays < 7 && d.getDay() === jsDay
      }).length
      return { day, count }
    })
    return data
  }, [stats, nodes])

  // Dynamic welcome message based on node count
  const welcomeMessage = useMemo(() => {
    if (nodeCount === 0) return "Welcome to Lore! Start by adding your first knowledge node."
    if (nodeCount >= 1 && nodeCount <= 4) return "Great start! Add more nodes to unlock AI insights."
    if (nodeCount >= 5 && nodeCount <= 9) return "Your knowledge graph is growing! Try connecting some nodes."
    return "Your knowledge graph is thriving! Check your morning digest for insights."
  }, [nodeCount])

  // Digest summary text
  const digestSummary = digest?.summary || 'Your morning digest is being prepared. Add some knowledge nodes to get started!'

  // Contributor initials derived from digest focus areas (or fallback)
  const contributorInitials = useMemo(() => {
    if (digest?.focusAreas && digest.focusAreas.length > 0) {
      return digest.focusAreas.slice(0, 3).map(area => area.name.slice(0, 2).toUpperCase())
    }
    // Fallback: use first 2 chars of most common node types
    const typeMap = new Map<string, number>()
    for (const node of nodes) {
      typeMap.set(node.type, (typeMap.get(node.type) || 0) + 1)
    }
    const topTypes = [...typeMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3)
    if (topTypes.length > 0) {
      return topTypes.map(([t]) => t.slice(0, 2).toUpperCase())
    }
    return ['LO', 'RE']
  }, [digest, nodes])

  const contributorCount = digest?.quickStats?.activeMembers ?? 1

  // ── Handle Add Node submit ──
  const handleAddNode = async () => {
    if (!nodeTitle.trim()) return
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/nodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: nodeTitle.trim(),
          type: nodeType.trim() || 'concept',
          content: nodeDesc.trim(),
        }),
      })
      if (res.ok) {
        setNodeTitle('')
        setNodeType('')
        setNodeDesc('')
        setAddNodeOpen(false)
        // Refresh data to reflect the new node
        await fetchDashboardData()
      }
    } catch (error) {
      console.error('Failed to create node:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const firstName = user?.name?.split(' ')[0] ?? 'there'

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6"
    >
      {/* ═══════════════════════════════════════════════════════
          WELCOME SECTION
          ═══════════════════════════════════════════════════════ */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#18181B] dark:text-[#FAFAFA] tracking-tight">
            {greeting}, {firstName}
          </h1>
          <p className="text-sm text-[#71717A] dark:text-[#A1A1AA] mt-1">
            Here&apos;s what&apos;s happening in your knowledge graph today.
          </p>
          <p className="text-[11px] text-[#A1A1AA] dark:text-[#71717A] mt-1.5 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Last updated just now
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-[rgba(16,185,129,0.20)] bg-emerald-50/50 dark:bg-[rgba(16,185,129,0.06)] gap-1"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {isLoading ? 'Loading...' : `${nodeCount} nodes active`}
          </Badge>
          <a href="/api/export?type=all" download>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-[rgba(16,185,129,0.10)] gap-1 h-7"
            >
              <Download className="w-3 h-3" />
              Export
            </Button>
          </a>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════
          WELCOME BACK BANNER (Enhanced)
          ═══════════════════════════════════════════════════════ */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-r from-emerald-600 to-emerald-500 border-0 text-white overflow-hidden relative">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <h2 className="text-sm sm:text-base font-bold text-white truncate">
                    {nodeCount > 0 ? `Welcome back, ${firstName}!` : `Welcome to Lore, ${firstName}!`}
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                  {welcomeMessage}
                </p>
                {nodeCount > 0 && (
                  <p className="text-[11px] text-emerald-200/70 mt-1">
                    {nodeCount} node{nodeCount !== 1 ? 's' : ''}, {edgeCount} connection{edgeCount !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
              {/* Mini sparkline indicator */}
              <div className="hidden sm:flex items-end gap-[3px] h-8 shrink-0">
                {[0.4, 0.6, 0.45, 0.8, 0.65, 0.9, 1.0].map((h, i) => (
                  <div
                    key={i}
                    className="w-[5px] rounded-full bg-white/40"
                    style={{ height: `${h * 100}%` }}
                  />
                ))}
              </div>
            </div>
            {/* Decorative circles */}
            <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/5" />
            <div className="absolute -right-2 -bottom-8 w-20 h-20 rounded-full bg-white/5" />
          </CardContent>
        </Card>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════
          PROFILE COMPLETION
          ═══════════════════════════════════════════════════════ */}
      <ProfileCompletionCard nodeCount={nodeCount} />

      {/* ═══════════════════════════════════════════════════════
          QUICK STATS ROW
          ═══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card) => (
          <motion.div
            key={card.label}
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Card className="bg-white dark:bg-[#0F0F12] border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] hover:shadow-md transition-shadow cursor-default">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ background: card.bgColor }}
                  >
                    <card.icon className="w-4 h-4" style={{ color: card.color }} />
                  </div>
                  <Zap className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <p
                  className="text-2xl font-bold text-[#18181B] dark:text-[#FAFAFA]"
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  <AnimatedNumber value={parseInt(card.value)} />
                  {card.suffix && (
                    <span className="text-sm font-medium text-[#71717A] dark:text-[#A1A1AA] ml-0.5">
                      {card.suffix}
                    </span>
                  )}
                </p>
                <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] mt-1">{card.label}</p>
                <p className="text-[11px] font-medium mt-2" style={{ color: card.color }}>
                  {card.change}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════
          KNOWLEDGE HEALTH SCORE
          ═══════════════════════════════════════════════════════ */}
      <motion.div variants={itemVariants}>
        <Card className="bg-white dark:bg-[#0F0F12] border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-100 dark:from-[rgba(16,185,129,0.12)] to-teal-100 dark:to-[rgba(13,148,136,0.08)] flex items-center justify-center">
                  <Heart className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <h2 className="text-sm font-bold text-[#18181B] dark:text-[#FAFAFA]">
                  Knowledge Health Score
                </h2>
              </div>
              <Badge
                variant="outline"
                className="text-[9px] font-bold border-emerald-200 dark:border-[rgba(16,185,129,0.20)] bg-emerald-50/50 dark:bg-[rgba(16,185,129,0.06)]"
                style={{ color: getHealthColor(healthScore.total) }}
              >
                {getHealthLabel(healthScore.total).toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
              {/* Circular gauge */}
              <HealthScoreRing
                score={healthScore.total}
                color={getHealthColor(healthScore.total)}
                glow={getHealthGlow(healthScore.total)}
              />

              {/* Component breakdown */}
              <div className="flex-1 w-full space-y-3.5">
                <MiniProgressBar
                  label="Nodes"
                  value={healthScore.nodes}
                  maxValue={25}
                  color="#059669"
                  icon={<Network className="w-3 h-3 text-emerald-600" />}
                />
                <MiniProgressBar
                  label="Connections"
                  value={healthScore.connections}
                  maxValue={25}
                  color="#0D9488"
                  icon={<Link2 className="w-3 h-3 text-teal-600" />}
                />
                <MiniProgressBar
                  label="Diversity"
                  value={healthScore.diversity}
                  maxValue={25}
                  color="#7C3AED"
                  icon={<GitBranch className="w-3 h-3 text-violet-600" />}
                />
                <MiniProgressBar
                  label="Activity"
                  value={healthScore.activity}
                  maxValue={25}
                  color="#EA580C"
                  icon={<Activity className="w-3 h-3 text-orange-600" />}
                />
              </div>

              {/* Weekly Activity Mini Chart */}
              <div className="flex-1 w-full sm:min-w-[180px] sm:max-w-[240px]">
                <p className="text-[11px] font-semibold text-[#71717A] dark:text-[#A1A1AA] mb-2 uppercase tracking-wider">
                  Weekly Activity
                </p>
                <WeeklyActivityChart data={weeklyChartData} />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════
          KNOWLEDGE GRAPH PREVIEW + MORNING DIGEST
          ═══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Knowledge Graph Preview */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white dark:bg-[#0F0F12] border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] h-full" style={{ animation: 'pulseGlow 3s ease-in-out infinite' }}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-[#18181B] dark:text-[#FAFAFA]">
                  Knowledge Graph
                </h2>
                <Badge
                  variant="outline"
                  className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-[rgba(16,185,129,0.20)] bg-emerald-50/50 dark:bg-[rgba(16,185,129,0.06)]"
                >
                  LIVE
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="rounded-xl bg-gradient-to-br from-[#F9FAFB] dark:from-[#09090B] to-white dark:to-[#0F0F12] border border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] p-4 mb-4">
                <MiniGraphSVG />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
                  <span className="font-semibold text-[#18181B] dark:text-[#FAFAFA]">{nodeCount}</span> nodes ·{' '}
                  <span className="font-semibold text-[#18181B] dark:text-[#FAFAFA]">{edgeCount}</span> edges ·{' '}
                  <span className="font-semibold text-emerald-600">{newTodayCount} new today</span>
                </p>
                <Link href="/app/graph">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-[rgba(16,185,129,0.10)] gap-1"
                  >
                    View Full Graph
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Morning Digest Preview */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white dark:bg-[#0F0F12] border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-100 dark:from-[rgba(245,158,11,0.12)] to-orange-100 dark:to-[rgba(249,115,22,0.08)] flex items-center justify-center">
                    <Sun className="w-3.5 h-3.5 text-amber-600" />
                  </div>
                  <h2 className="text-sm font-bold text-[#18181B] dark:text-[#FAFAFA]">
                    Morning Digest
                  </h2>
                </div>
                <Badge
                  variant="outline"
                  className="text-[9px] font-semibold text-amber-700 dark:text-amber-400 border-amber-200 dark:border-[rgba(245,158,11,0.15)] bg-amber-50/50 dark:bg-[rgba(245,158,11,0.06)] gap-1"
                >
                  <Clock className="w-2.5 h-2.5" />
                  Today 8:00 AM
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="rounded-xl bg-gradient-to-br from-amber-50/50 dark:from-[rgba(245,158,11,0.06)] via-white dark:via-[#0F0F12] to-orange-50/30 dark:to-[rgba(249,115,22,0.04)] border border-amber-100/50 dark:border-[rgba(245,158,11,0.10)] p-4 mb-4">
                <p className="text-sm text-[#52525B] dark:text-[#D4D4D8] leading-relaxed">
                  {digestSummary}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <div className="flex -space-x-1.5">
                  {contributorInitials.map((initials, i) => (
                    <div
                      key={`${initials}-${i}`}
                      className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold"
                      style={{
                        background: ['#059669', '#0D9488', '#7C3AED'][i % 3],
                        color: 'white',
                      }}
                    >
                      {initials}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
                  {contributorCount} contributor{contributorCount !== 1 ? 's' : ''} active today
                </p>
                <Link href="/app/digest" className="sm:ml-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-[rgba(16,185,129,0.10)] gap-1"
                  >
                    Read Full Digest
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          RECENT ACTIVITY + QUICK ACTIONS
          ═══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Feed */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="bg-white dark:bg-[#0F0F12] border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)]">
            <CardHeader className="pb-2">
              <h2 className="text-sm font-bold text-[#18181B] dark:text-[#FAFAFA]">
                Recent Activity
              </h2>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="space-y-1">
                {recentActivity.length > 0 ? (
                  recentActivity.map((item, i) => (
                    <div
                      key={`${item.title}-${i}`}
                      className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-[#F9FAFB] dark:hover:bg-[#09090B] transition-colors cursor-default"
                      style={{
                        borderBottom:
                          i < recentActivity.length - 1
                            ? '1px solid rgba(0,0,0,0.04)'
                            : 'none',
                      }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: item.bgColor }}
                      >
                        <item.icon className="w-4 h-4" style={{ color: item.color }} />
                      </div>
                      <p className="text-sm text-[#52525B] dark:text-[#D4D4D8] font-medium truncate flex-1">
                        {item.title}
                      </p>
                      <span className="text-xs text-[#A1A1AA] dark:text-[#71717A] shrink-0 whitespace-nowrap">
                        {item.time}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-[#A1A1AA] dark:text-[#71717A]">
                    <CircleDot className="w-8 h-8 mb-2 opacity-40" />
                    <p className="text-sm">No recent activity yet</p>
                    <p className="text-xs mt-1">Add a node to get started</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white dark:bg-[#0F0F12] border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] h-full">
            <CardHeader className="pb-2">
              <h2 className="text-sm font-bold text-[#18181B] dark:text-[#FAFAFA]">
                Quick Actions
              </h2>
            </CardHeader>
            <CardContent className="pb-6 space-y-3">
              {/* Add Node - opens dialog */}
              <Dialog open={addNodeOpen} onOpenChange={setAddNodeOpen}>
                <DialogTrigger asChild>
                  <button className="w-full flex items-center gap-3 p-3 rounded-xl border border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] hover:border-emerald-200 dark:hover:border-[rgba(16,185,129,0.20)] hover:bg-emerald-50/30 transition-all text-left group">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-[rgba(16,185,129,0.10)] flex items-center justify-center shrink-0 group-hover:bg-emerald-100 dark:group-hover:bg-[rgba(16,185,129,0.15)] transition-colors">
                      <Plus className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#18181B] dark:text-[#FAFAFA]">Add Node</p>
                      <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">Add a new knowledge node</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#A1A1AA] dark:text-[#71717A] group-hover:text-emerald-600 transition-colors" />
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-[rgba(16,185,129,0.10)] flex items-center justify-center">
                        <Plus className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      Add Knowledge Node
                    </DialogTitle>
                    <DialogDescription>
                      Add a new node to your knowledge graph. It will be automatically linked to related entries.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    <div className="space-y-2">
                      <Label htmlFor="node-title">Title</Label>
                      <Input
                        id="node-title"
                        placeholder="e.g., Payment Gateway Architecture"
                        className="border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] focus-visible:ring-emerald-500/30 focus-visible:border-emerald-300"
                        value={nodeTitle}
                        onChange={(e) => setNodeTitle(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="node-type">Type</Label>
                      <Input
                        id="node-type"
                        placeholder="e.g., Concept, Decision, Fact"
                        className="border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] focus-visible:ring-emerald-500/30 focus-visible:border-emerald-300"
                        value={nodeType}
                        onChange={(e) => setNodeType(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="node-desc">Description</Label>
                      <Textarea
                        id="node-desc"
                        placeholder="Describe this knowledge node..."
                        rows={3}
                        className="border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] focus-visible:ring-emerald-500/30 focus-visible:border-emerald-300 resize-none"
                        value={nodeDesc}
                        onChange={(e) => setNodeDesc(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setAddNodeOpen(false)}
                      className="border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)]"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddNode}
                      disabled={isSubmitting || !nodeTitle.trim()}
                      className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-md shadow-emerald-500/20"
                    >
                      {isSubmitting ? 'Adding...' : 'Add Node'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Start Chat */}
              <Link href="/app/chat" className="block">
                <button className="w-full flex items-center gap-3 p-3 rounded-xl border border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] hover:border-teal-200 hover:bg-teal-50/30 transition-all text-left group">
                  <div className="w-9 h-9 rounded-lg bg-teal-50 dark:bg-[rgba(13,148,136,0.10)] flex items-center justify-center shrink-0 group-hover:bg-teal-100 dark:group-hover:bg-[rgba(13,148,136,0.15)] transition-colors">
                    <MessageSquare className="w-4 h-4 text-teal-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#18181B] dark:text-[#FAFAFA]">Start Chat</p>
                    <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">Ask your knowledge graph</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#A1A1AA] dark:text-[#71717A] group-hover:text-teal-600 transition-colors" />
                </button>
              </Link>

              {/* Create Note */}
              <Link href="/app/memory" className="block">
                <button className="w-full flex items-center gap-3 p-3 rounded-xl border border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] hover:border-violet-200 hover:bg-violet-50/30 transition-all text-left group">
                  <div className="w-9 h-9 rounded-lg bg-violet-50 dark:bg-[rgba(124,58,237,0.10)] flex items-center justify-center shrink-0 group-hover:bg-violet-100 dark:group-hover:bg-[rgba(124,58,237,0.15)] transition-colors">
                    <BookOpen className="w-4 h-4 text-violet-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#18181B] dark:text-[#FAFAFA]">Create Note</p>
                    <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">Capture a new memory</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#A1A1AA] dark:text-[#71717A] group-hover:text-violet-600 transition-colors" />
                </button>
              </Link>

              {/* Morning Digest */}
              <Link href="/app/digest" className="block">
                <button className="w-full flex items-center gap-3 p-3 rounded-xl border border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] hover:border-amber-200 hover:bg-amber-50/30 transition-all text-left group">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-[rgba(245,158,11,0.10)] flex items-center justify-center shrink-0 group-hover:bg-amber-100 dark:group-hover:bg-[rgba(245,158,11,0.15)] transition-colors">
                    <Sun className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#18181B] dark:text-[#FAFAFA]">Today&apos;s Digest</p>
                    <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">Read your morning briefing</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#A1A1AA] dark:text-[#71717A] group-hover:text-amber-600 transition-colors" />
                </button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      {/* ═══════════════════════════════════════════════════════
          PRO TIP
          ═══════════════════════════════════════════════════════ */}
      <motion.div variants={itemVariants}>
        <ProTipCard />
      </motion.div>
    </motion.div>
  )
}
