'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
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
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

// ═══════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ═══════════════════════════════════════════════════════════════
export default function DashboardPage() {
  const { user } = useAuth()
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

  // ── Compute derived data ──
  const nodeCount = nodes.length
  const edgeCount = edges.length

  // Count nodes created today
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const newTodayCount = nodes.filter(n => new Date(n.createdAt) >= todayStart).length

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
          <h1 className="text-2xl sm:text-3xl font-bold text-[#18181B] tracking-tight">
            {greeting}, {firstName}
          </h1>
          <p className="text-sm text-[#71717A] mt-1">
            Here&apos;s what&apos;s happening in your knowledge graph today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="text-[10px] font-semibold text-emerald-700 border-emerald-200 bg-emerald-50/50 gap-1"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {isLoading ? 'Loading...' : `${nodeCount} nodes active`}
          </Badge>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════
          QUICK STATS ROW
          ═══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card) => (
          <motion.div key={card.label} variants={itemVariants}>
            <Card className="bg-white border-[#E5E7EB] hover:shadow-md transition-shadow">
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
                  className="text-2xl font-bold text-[#18181B]"
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  {card.value}
                  {card.suffix && (
                    <span className="text-sm font-medium text-[#71717A] ml-0.5">
                      {card.suffix}
                    </span>
                  )}
                </p>
                <p className="text-xs text-[#71717A] mt-1">{card.label}</p>
                <p className="text-[11px] font-medium mt-2" style={{ color: card.color }}>
                  {card.change}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════
          KNOWLEDGE GRAPH PREVIEW + MORNING DIGEST
          ═══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Knowledge Graph Preview */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white border-[#E5E7EB] h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-[#18181B]">
                  Knowledge Graph
                </CardTitle>
                <Badge
                  variant="outline"
                  className="text-[9px] font-bold text-emerald-700 border-emerald-200 bg-emerald-50/50"
                >
                  LIVE
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="rounded-xl bg-gradient-to-br from-[#F9FAFB] to-white border border-[#E5E7EB] p-4 mb-4">
                <MiniGraphSVG />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-[#71717A]">
                  <span className="font-semibold text-[#18181B]">{nodeCount}</span> nodes ·{' '}
                  <span className="font-semibold text-[#18181B]">{edgeCount}</span> edges ·{' '}
                  <span className="font-semibold text-emerald-600">{newTodayCount} new today</span>
                </p>
                <Link href="/app/graph">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 gap-1"
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
          <Card className="bg-white border-[#E5E7EB] h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                    <Sun className="w-3.5 h-3.5 text-amber-600" />
                  </div>
                  <CardTitle className="text-sm font-bold text-[#18181B]">
                    Morning Digest
                  </CardTitle>
                </div>
                <Badge
                  variant="outline"
                  className="text-[9px] font-semibold text-amber-700 border-amber-200 bg-amber-50/50 gap-1"
                >
                  <Clock className="w-2.5 h-2.5" />
                  Today 8:00 AM
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="rounded-xl bg-gradient-to-br from-amber-50/50 via-white to-orange-50/30 border border-amber-100/50 p-4 mb-4">
                <p className="text-sm text-[#52525B] leading-relaxed">
                  {digestSummary}
                </p>
              </div>
              <div className="flex items-center gap-3">
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
                <p className="text-xs text-[#71717A]">
                  {contributorCount} contributor{contributorCount !== 1 ? 's' : ''} active today
                </p>
                <Link href="/app/digest" className="ml-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 gap-1"
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
          <Card className="bg-white border-[#E5E7EB]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-[#18181B]">
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="space-y-1">
                {recentActivity.length > 0 ? (
                  recentActivity.map((item, i) => (
                    <div
                      key={`${item.title}-${i}`}
                      className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-[#F9FAFB] transition-colors cursor-default"
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
                      <p className="text-sm text-[#52525B] font-medium truncate flex-1">
                        {item.title}
                      </p>
                      <span className="text-xs text-[#A1A1AA] shrink-0 whitespace-nowrap">
                        {item.time}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-[#A1A1AA]">
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
          <Card className="bg-white border-[#E5E7EB] h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-[#18181B]">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-6 space-y-3">
              {/* Add Node - opens dialog */}
              <Dialog open={addNodeOpen} onOpenChange={setAddNodeOpen}>
                <DialogTrigger asChild>
                  <button className="w-full flex items-center gap-3 p-3 rounded-xl border border-[#E5E7EB] hover:border-emerald-200 hover:bg-emerald-50/30 transition-all text-left group">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
                      <Plus className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#18181B]">Add Node</p>
                      <p className="text-xs text-[#71717A]">Add a new knowledge node</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#A1A1AA] group-hover:text-emerald-600 transition-colors" />
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
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
                        className="border-[#E5E7EB] focus-visible:ring-emerald-500/30 focus-visible:border-emerald-300"
                        value={nodeTitle}
                        onChange={(e) => setNodeTitle(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="node-type">Type</Label>
                      <Input
                        id="node-type"
                        placeholder="e.g., Concept, Decision, Fact"
                        className="border-[#E5E7EB] focus-visible:ring-emerald-500/30 focus-visible:border-emerald-300"
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
                        className="border-[#E5E7EB] focus-visible:ring-emerald-500/30 focus-visible:border-emerald-300 resize-none"
                        value={nodeDesc}
                        onChange={(e) => setNodeDesc(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setAddNodeOpen(false)}
                      className="border-[#E5E7EB]"
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
                <button className="w-full flex items-center gap-3 p-3 rounded-xl border border-[#E5E7EB] hover:border-teal-200 hover:bg-teal-50/30 transition-all text-left group">
                  <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center shrink-0 group-hover:bg-teal-100 transition-colors">
                    <MessageSquare className="w-4 h-4 text-teal-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#18181B]">Start Chat</p>
                    <p className="text-xs text-[#71717A]">Ask your knowledge graph</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#A1A1AA] group-hover:text-teal-600 transition-colors" />
                </button>
              </Link>

              {/* Create Note */}
              <Link href="/app/memory" className="block">
                <button className="w-full flex items-center gap-3 p-3 rounded-xl border border-[#E5E7EB] hover:border-violet-200 hover:bg-violet-50/30 transition-all text-left group">
                  <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center shrink-0 group-hover:bg-violet-100 transition-colors">
                    <BookOpen className="w-4 h-4 text-violet-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#18181B]">Create Note</p>
                    <p className="text-xs text-[#71717A]">Capture a new memory</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#A1A1AA] group-hover:text-violet-600 transition-colors" />
                </button>
              </Link>

              {/* Morning Digest */}
              <Link href="/app/digest" className="block">
                <button className="w-full flex items-center gap-3 p-3 rounded-xl border border-[#E5E7EB] hover:border-amber-200 hover:bg-amber-50/30 transition-all text-left group">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center shrink-0 group-hover:bg-amber-100 transition-colors">
                    <Sun className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#18181B]">Today&apos;s Digest</p>
                    <p className="text-xs text-[#71717A]">Read your morning briefing</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#A1A1AA] group-hover:text-amber-600 transition-colors" />
                </button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
