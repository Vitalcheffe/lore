'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  CreditCard,
  Network,
  Sun,
  MessageSquare,
  Bell,
  Shield,
  Palette,
  Save,
  Check,
  Loader2,
  ChevronRight,
  Lock,
  Download,
  Trash2,
  AlertTriangle,
  Crown,
  Sparkles,
  Zap,
  Calendar,
  Mail,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import { toast as sonnerToast } from 'sonner'

// ─── TYPES ──────────────────────────────────────────────
type SectionKey =
  | 'profile'
  | 'subscription'
  | 'knowledge-graph'
  | 'morning-digest'
  | 'ai-chat'
  | 'notifications'
  | 'privacy-security'
  | 'appearance'

interface SettingsSection {
  key: SectionKey
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
}

interface UsageStats {
  totalNodes: number
  nodesLimit: number
  aiQueriesToday: number
  aiQueriesLimit: number
  storageUsedMB: number
  storageLimitMB: number
}

// ─── SECTIONS CONFIG ────────────────────────────────────
const sections: SettingsSection[] = [
  { key: 'profile', label: 'Profile', icon: User, description: 'Manage your personal information' },
  { key: 'subscription', label: 'Subscription & Billing', icon: CreditCard, description: 'Plan, billing, and usage' },
  { key: 'knowledge-graph', label: 'Knowledge Graph', icon: Network, description: 'Graph display and behavior' },
  { key: 'morning-digest', label: 'Morning Digest', icon: Sun, description: 'Daily digest preferences' },
  { key: 'ai-chat', label: 'AI Chat', icon: MessageSquare, description: 'AI model and chat settings' },
  { key: 'notifications', label: 'Notifications', icon: Bell, description: 'Email and notification preferences' },
  { key: 'privacy-security', label: 'Privacy & Security', icon: Shield, description: 'Security and data controls' },
  { key: 'appearance', label: 'Appearance', icon: Palette, description: 'Look and feel' },
]

// ─── ANIMATION VARIANTS ─────────────────────────────────
const contentVariants = {
  enter: { opacity: 0, x: 16, scale: 0.98 },
  center: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as const } },
  exit: { opacity: 0, x: -16, scale: 0.98, transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const } },
}

// ─── HELPER: format storage ─────────────────────────────
function formatStorage(mb: number): string {
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`
  return `${mb} MB`
}

// ─── MAIN SETTINGS PAGE ────────────────────────────────
export default function SettingsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [activeSection, setActiveSection] = useState<SectionKey>('profile')
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Save button animation state
  const [showSaveSuccess, setShowSaveSuccess] = useState(false)

  // ─── Profile state (initialized from session, overridden by API) ──
  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [joinDate, setJoinDate] = useState('')

  // ─── Subscription state ─────────────────────────────
  const [currentPlan, setCurrentPlan] = useState<'free' | 'pro' | 'enterprise'>(
    (user?.plan as 'free' | 'pro' | 'enterprise') ?? 'free'
  )

  // ─── Knowledge Graph state ──────────────────────────
  const [graphLayout, setGraphLayout] = useState<'force' | 'radial' | 'tree'>('force')
  const [showLabels, setShowLabels] = useState(true)
  const [nodeSize, setNodeSize] = useState<'small' | 'medium' | 'large'>('medium')
  const [edgeStyle, setEdgeStyle] = useState<'solid' | 'dashed'>('solid')
  const [autoLinkDiscoveries, setAutoLinkDiscoveries] = useState(true)
  const [animationSpeed, setAnimationSpeed] = useState<'slow' | 'normal' | 'fast'>('normal')

  // ─── Morning Digest state ───────────────────────────
  const [digestEnabled, setDigestEnabled] = useState(true)
  const [deliveryTime, setDeliveryTime] = useState('08:00')
  const [digestEmail, setDigestEmail] = useState(true)
  const [includeAIComment, setIncludeAIComment] = useState(true)
  const [focusAreas, setFocusAreas] = useState({
    apiArchitecture: true,
    team: false,
    security: true,
    projects: false,
  })

  // ─── AI Chat state ──────────────────────────────────
  const [defaultModel, setDefaultModel] = useState<'default' | 'advanced'>('default')
  const [streamResponses, setStreamResponses] = useState(true)
  const [showSources, setShowSources] = useState(true)
  const [confidenceThreshold, setConfidenceThreshold] = useState([70])

  // ─── Notifications state ────────────────────────────
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [weeklySummary, setWeeklySummary] = useState(false)
  const [newFeatures, setNewFeatures] = useState(true)
  const [digestReminders, setDigestReminders] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(() => {
    if (typeof window === 'undefined') return true
    const stored = localStorage.getItem('lore-sound-enabled')
    return stored === null ? true : stored === 'true'
  })

  // ─── Privacy & Security state ───────────────────────
  const [twoFactor, setTwoFactor] = useState(false)
  const [dataRetention, setDataRetention] = useState<'30' | '90' | '365' | 'forever'>('90')
  const [downloadingData, setDownloadingData] = useState(false)

  // ─── Appearance state ───────────────────────────────
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal')
  const [sidebarPosition, setSidebarPosition] = useState<'left' | 'right'>('left')
  const [reducedMotion, setReducedMotion] = useState(false)

  // ─── Usage stats state (fetched from API) ────────────
  const [usageStats, setUsageStats] = useState<UsageStats>({
    totalNodes: 0,
    nodesLimit: 50,
    aiQueriesToday: 0,
    aiQueriesLimit: 10,
    storageUsedMB: 0,
    storageLimitMB: 100,
  })

  // ─── Fetch profile, settings, and stats on mount ─────
  useEffect(() => {
    if (!user?.id) return

    async function fetchAllData() {
      setLoadingData(true)
      try {
        // Fetch profile
        const profileRes = await fetch(`/api/user/profile?userId=${user.id}`)
        if (profileRes.ok) {
          const profile = await profileRes.json()
          if (profile.name) setName(profile.name)
          if (profile.email) setEmail(profile.email)
          if (profile.username) setUsername(profile.username)
          if (profile.plan) setCurrentPlan(profile.plan as 'free' | 'pro' | 'enterprise')
          if (profile.createdAt) setJoinDate(new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }))

          // Profile API also returns stats
          if (profile.stats) {
            setUsageStats((prev) => ({
              ...prev,
              totalNodes: profile.stats.totalNodes ?? 0,
              aiQueriesToday: profile.stats.aiQueriesToday ?? 0,
            }))
          }
        }

        // Fetch settings
        const settingsRes = await fetch(`/api/user/settings?userId=${user.id}`)
        if (settingsRes.ok) {
          const settings = await settingsRes.json()
          if (settings.graphLayout) setGraphLayout(settings.graphLayout as 'force' | 'radial' | 'tree')
          if (settings.graphShowLabels !== undefined) setShowLabels(settings.graphShowLabels)
          if (settings.nodeSize) setNodeSize(settings.nodeSize as 'small' | 'medium' | 'large')
          if (settings.edgeStyle) setEdgeStyle(settings.edgeStyle as 'solid' | 'dashed')
          if (settings.memoryAutoLink !== undefined) setAutoLinkDiscoveries(settings.memoryAutoLink)
          if (settings.animationSpeed) setAnimationSpeed(settings.animationSpeed as 'slow' | 'normal' | 'fast')
          if (settings.digestEnabled !== undefined) setDigestEnabled(settings.digestEnabled)
          if (settings.digestTime) setDeliveryTime(settings.digestTime)
          if (settings.digestEmailNotif !== undefined) setDigestEmail(settings.digestEmailNotif)
          if (settings.includeAIComment !== undefined) setIncludeAIComment(settings.includeAIComment)
          if (settings.chatModel) setDefaultModel(settings.chatModel as 'default' | 'advanced')
          if (settings.chatStreamResponses !== undefined) setStreamResponses(settings.chatStreamResponses)
          if (settings.showSources !== undefined) setShowSources(settings.showSources)
          if (settings.confidenceThreshold !== undefined) setConfidenceThreshold([settings.confidenceThreshold])
          if (settings.emailNotifs !== undefined) setEmailNotifs(settings.emailNotifs)
          if (settings.weeklySummary !== undefined) setWeeklySummary(settings.weeklySummary)
          if (settings.newFeatures !== undefined) setNewFeatures(settings.newFeatures)
          if (settings.digestReminders !== undefined) setDigestReminders(settings.digestReminders)
          if (settings.twoFactor !== undefined) setTwoFactor(settings.twoFactor)
          if (settings.dataRetention) setDataRetention(settings.dataRetention as '30' | '90' | '365' | 'forever')
          if (settings.fontSize) setFontSize(settings.fontSize as 'normal' | 'large')
          if (settings.sidebarPosition) setSidebarPosition(settings.sidebarPosition as 'left' | 'right')
          if (settings.reducedMotion !== undefined) setReducedMotion(settings.reducedMotion)
        }

        // Fetch stats
        const statsRes = await fetch(`/api/user/stats?userId=${user.id}`)
        if (statsRes.ok) {
          const stats = await statsRes.json()
          setUsageStats({
            totalNodes: stats.totalNodes ?? 0,
            nodesLimit: stats.nodesLimit ?? 50,
            aiQueriesToday: stats.aiQueriesToday ?? 0,
            aiQueriesLimit: stats.aiQueriesLimit ?? 10,
            storageUsedMB: stats.storageUsedMB ?? 0,
            storageLimitMB: stats.storageLimitMB ?? 100,
          })
        }
      } catch (err) {
        console.error('Failed to load settings data:', err)
      } finally {
        setLoadingData(false)
      }
    }

    fetchAllData()
  }, [user?.id])

  // ─── Persist settings ────────────────────────────────
  const persistSetting = useCallback(async (updates: Record<string, unknown>) => {
    if (!user?.id) return
    setSaving(true)
    try {
      const res = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, ...updates }),
      })
      if (res.ok) {
        setLastSaved(true)
        setShowSaveSuccess(true)
        sonnerToast.success('Settings saved ✓')
        setTimeout(() => {
          setLastSaved(false)
          setShowSaveSuccess(false)
        }, 2000)
      }
    } catch {
      console.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }, [user?.id])

  const debouncedPersist = useCallback((updates: Record<string, unknown>) => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    saveTimeoutRef.current = setTimeout(() => persistSetting(updates), 500)
  }, [persistSetting])

  // ─── Save profile handler ────────────────────────────
  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      await persistSetting({ name, username, bio })
      toast({
        title: 'Profile saved',
        description: 'Your profile has been updated successfully.',
      })
    } finally {
      setSaving(false)
    }
  }

  // ─── Stripe handlers ─────────────────────────────────
  const handleUpgrade = async () => {
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: 'price_pro_monthly', plan: 'pro' }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to start checkout. Please try again.', variant: 'destructive' })
    }
  }

  const handleManageBilling = async () => {
    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: user?.id }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to open billing portal.', variant: 'destructive' })
    }
  }

  // ─── Download data handler ────────────────────────────
  const handleDownloadData = async () => {
    setDownloadingData(true)
    try {
      const data = {
        profile: { name, email, username, bio },
        settings: {
          graphLayout, showLabels, nodeSize, edgeStyle, autoLinkDiscoveries, animationSpeed,
          digestEnabled, deliveryTime, digestEmail, includeAIComment, focusAreas,
          defaultModel, streamResponses, showSources, confidenceThreshold: confidenceThreshold[0],
          emailNotifs, weeklySummary, newFeatures, digestReminders,
          twoFactor, dataRetention, fontSize, sidebarPosition, reducedMotion,
        },
        exportedAt: new Date().toISOString(),
      }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'lore-data-export.json'
      a.click()
      URL.revokeObjectURL(url)
      toast({ title: 'Download started', description: 'Your data export is ready.' })
    } finally {
      setDownloadingData(false)
    }
  }

  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  // ─── Computed usage values ────────────────────────────
  const nodesPercent = usageStats.nodesLimit > 0
    ? Math.min(100, Math.round((usageStats.totalNodes / usageStats.nodesLimit) * 100))
    : 0
  const aiQueriesPercent = usageStats.aiQueriesLimit > 0
    ? Math.min(100, Math.round((usageStats.aiQueriesToday / usageStats.aiQueriesLimit) * 100))
    : 0
  const storagePercent = usageStats.storageLimitMB > 0
    ? Math.min(100, Math.round((usageStats.storageUsedMB / usageStats.storageLimitMB) * 100))
    : 0
  const isOverAiLimit = usageStats.aiQueriesLimit > 0 && usageStats.aiQueriesToday > usageStats.aiQueriesLimit

  // ─── Find active section index for animated underline ──
  const activeIndex = sections.findIndex((s) => s.key === activeSection)

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      {/* ═══ HEADER ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mb-8"
      >
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-md shadow-emerald-500/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#18181B] dark:text-[#FAFAFA]">Settings</h1>
            <p className="text-sm text-[#71717A] dark:text-[#A1A1AA]">
              Manage your preferences and account
              {saving && !showSaveSuccess && (
                <span className="inline-flex items-center gap-1.5 ml-3 text-xs text-emerald-600 dark:text-emerald-400">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Saving...
                </span>
              )}
              {showSaveSuccess && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="inline-flex items-center gap-1.5 ml-3 text-xs text-emerald-600 dark:text-emerald-400"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                  >
                    <Check className="w-3 h-3" />
                  </motion.div>
                  Saved
                </motion.span>
              )}
            </p>
          </div>
        </div>
      </motion.div>

      {/* ═══ PROFILE CARD ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mb-6"
      >
        <Card className="bg-gradient-to-r from-emerald-50/80 to-teal-50/60 border-emerald-100 dark:border-[rgba(16,185,129,0.20)]/80 shadow-sm overflow-hidden">
          <CardContent className="p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-emerald-500/20 shrink-0">
                {initials || '??'}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-[#18181B] dark:text-[#FAFAFA] truncate">{name || 'Your Name'}</h2>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                  <span className="flex items-center gap-1.5 text-sm text-[#71717A] dark:text-[#A1A1AA]">
                    <Mail className="w-3.5 h-3.5" />
                    {email || 'your@email.com'}
                  </span>
                  {joinDate && (
                    <span className="flex items-center gap-1.5 text-sm text-[#71717A] dark:text-[#A1A1AA]">
                      <Calendar className="w-3.5 h-3.5" />
                      Joined {joinDate}
                    </span>
                  )}
                </div>
              </div>
              <Badge className={`shrink-0 text-xs font-semibold ${
                currentPlan === 'pro'
                  ? 'bg-emerald-600 text-white border-0 hover:bg-emerald-700'
                  : currentPlan === 'enterprise'
                  ? 'bg-emerald-700 text-white border-0 hover:bg-emerald-800'
                  : 'bg-white dark:bg-[#0F0F12] text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-[rgba(16,185,129,0.20)] hover:bg-white dark:bg-[#0F0F12]'
              }`}>
                {currentPlan === 'pro' && <Crown className="w-3 h-3 mr-1" />}
                {currentPlan === 'free' ? 'Free Plan' : currentPlan === 'pro' ? 'Pro Plan' : 'Enterprise'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ═══ LAYOUT: SIDEBAR + CONTENT ═══ */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* ──── LEFT: Section Navigation ──── */}
        <motion.nav
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="lg:w-[240px] shrink-0"
        >
          <Card className="bg-white dark:bg-[#0F0F12] border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] shadow-sm overflow-hidden">
            <CardContent className="p-2 relative">
              {/* Animated sliding indicator */}
              <motion.div
                className="absolute left-2 right-2 h-[42px] rounded-xl bg-emerald-50 dark:bg-[rgba(16,185,129,0.10)] border border-emerald-100 dark:border-[rgba(16,185,129,0.20)] dark:border-[rgba(16,185,129,0.20)] z-0"
                animate={{
                  top: activeIndex * 44 + 8,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 350,
                  damping: 30,
                }}
              />
              <div className="space-y-0.5 relative z-10">
                {sections.map((section) => {
                  const Icon = section.icon
                  const isActive = activeSection === section.key
                  return (
                    <button
                      key={section.key}
                      onClick={() => setActiveSection(section.key)}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left
                        transition-colors duration-200 group
                        ${isActive
                          ? 'text-emerald-700 dark:text-emerald-400 dark:text-emerald-400'
                          : 'text-[#52525B] dark:text-[#D4D4D8] hover:text-[#18181B] dark:hover:text-[#FAFAFA]'
                        }
                      `}
                    >
                      <div className={`
                        w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200
                        ${isActive
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                          : 'bg-[#F9FAFB] dark:bg-[#09090B] text-[#71717A] dark:text-[#A1A1AA] group-hover:bg-emerald-50 dark:group-hover:bg-[rgba(16,185,129,0.10)] group-hover:text-emerald-600 dark:group-hover:text-emerald-400'
                        }
                      `}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-sm font-medium transition-all duration-200 ${isActive ? 'font-semibold' : ''}`}>
                        {section.label}
                      </span>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, x: -4 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRight className="w-3.5 h-3.5 text-emerald-500 ml-auto" />
                        </motion.div>
                      )}
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.nav>

        {/* ──── RIGHT: Settings Content ──── */}
        <div className="flex-1 min-w-0">
          {/* Loading state */}
          {loadingData && (
            <Card className="bg-white dark:bg-[#0F0F12] border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] shadow-sm">
              <CardContent className="flex items-center justify-center py-16">
                <div className="flex items-center gap-3 text-[#71717A] dark:text-[#A1A1AA]">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm">Loading your settings...</span>
                </div>
              </CardContent>
            </Card>
          )}

          {!loadingData && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              variants={contentVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {/* ══════════ PROFILE ══════════ */}
              {activeSection === 'profile' && (
                <Card className="bg-white dark:bg-[#0F0F12] border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] shadow-sm">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-[rgba(16,185,129,0.10)] flex items-center justify-center">
                        <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Profile</CardTitle>
                        <CardDescription>Manage your personal information</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Avatar */}
                    <div className="flex items-center gap-5">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-emerald-500/20">
                        {initials || '??'}
                      </div>
                      <div>
                        <p className="font-semibold text-[#18181B] dark:text-[#FAFAFA]">{name || 'Your Name'}</p>
                        <p className="text-sm text-[#71717A] dark:text-[#A1A1AA]">{email || 'your@email.com'}</p>
                        <Badge className="mt-2 bg-emerald-50 dark:bg-[rgba(16,185,129,0.10)] text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-[rgba(16,185,129,0.20)] hover:bg-emerald-50 dark:bg-[rgba(16,185,129,0.10)] text-xs">
                          {currentPlan === 'free' ? 'Free Plan' : currentPlan === 'pro' ? 'Pro Plan' : 'Enterprise'}
                        </Badge>
                      </div>
                    </div>

                    <Separator className="bg-[#E5E7EB]" />

                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium text-[#18181B] dark:text-[#FAFAFA]">Full Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => { setName(e.target.value); debouncedPersist({ name: e.target.value }) }}
                        className="border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] focus:border-emerald-400 focus:ring-emerald-400/20"
                        placeholder="Your name"
                      />
                    </div>

                    {/* Email (readonly) */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-[#18181B] dark:text-[#FAFAFA]">
                        Email
                        <Badge variant="secondary" className="ml-2 text-[10px] bg-[#F9FAFB] dark:bg-[#09090B] text-[#71717A] dark:text-[#A1A1AA]">Read-only</Badge>
                      </Label>
                      <Input
                        id="email"
                        value={email}
                        readOnly
                        className="border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] bg-[#F9FAFB] dark:bg-[#09090B] text-[#71717A] dark:text-[#A1A1AA] cursor-not-allowed"
                      />
                    </div>

                    {/* Username */}
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-sm font-medium text-[#18181B] dark:text-[#FAFAFA]">Username</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#71717A] dark:text-[#A1A1AA]">@</span>
                        <Input
                          id="username"
                          value={username}
                          onChange={(e) => { setUsername(e.target.value); debouncedPersist({ username: e.target.value }) }}
                          className="border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] focus:border-emerald-400 focus:ring-emerald-400/20 pl-8"
                          placeholder="username"
                        />
                      </div>
                    </div>

                    {/* Bio */}
                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-sm font-medium text-[#18181B] dark:text-[#FAFAFA]">Bio</Label>
                      <Textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => { setBio(e.target.value); debouncedPersist({ bio: e.target.value }) }}
                        className="border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] focus:border-emerald-400 focus:ring-emerald-400/20 min-h-[100px]"
                        placeholder="Tell us about yourself..."
                      />
                      <p className="text-xs text-[#A1A1AA] dark:text-[#71717A]">{bio.length}/280 characters</p>
                    </div>

                    <Button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 min-w-[140px]"
                    >
                      <AnimatePresence mode="wait">
                        {showSaveSuccess ? (
                          <motion.span
                            key="success"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className="flex items-center gap-2"
                          >
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                            >
                              <Check className="w-4 h-4" />
                            </motion.div>
                            Saved!
                          </motion.span>
                        ) : saving ? (
                          <motion.span
                            key="saving"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2"
                          >
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Saving...
                          </motion.span>
                        ) : (
                          <motion.span
                            key="default"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2"
                          >
                            <Save className="w-4 h-4" />
                            Save Changes
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* ══════════ SUBSCRIPTION & BILLING ══════════ */}
              {activeSection === 'subscription' && (
                <div className="space-y-6">
                  {/* Current Plan */}
                  <Card className="bg-white dark:bg-[#0F0F12] border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] shadow-sm">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-[rgba(16,185,129,0.10)] flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">Subscription & Billing</CardTitle>
                          <CardDescription>Manage your plan and billing</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Plan Badge */}
                      <div className="flex items-center justify-between p-5 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 dark:border-[rgba(16,185,129,0.20)]">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center">
                            {currentPlan === 'pro' ? (
                              <Crown className="w-5 h-5 text-white" />
                            ) : (
                              <Sparkles className="w-5 h-5 text-white" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-[#18181B] dark:text-[#FAFAFA]">
                              {currentPlan === 'free' ? 'Free Plan' : currentPlan === 'pro' ? 'Pro Plan' : 'Enterprise Plan'}
                            </p>
                            <p className="text-sm text-[#71717A] dark:text-[#A1A1AA]">
                              {currentPlan === 'free' ? 'Basic features for individuals' : currentPlan === 'pro' ? 'Advanced features for teams' : 'Custom features for organizations'}
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-emerald-600 text-white border-0 hover:bg-emerald-700">
                          {currentPlan.toUpperCase()}
                        </Badge>
                      </div>

                      {/* Plan Features */}
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-[#18181B] dark:text-[#FAFAFA]">Plan includes:</p>
                        {currentPlan === 'free' ? (
                          <ul className="space-y-2 text-sm text-[#52525B] dark:text-[#D4D4D8]">
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Up to 50 knowledge nodes</li>
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 10 AI queries per day</li>
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 100 MB storage</li>
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Basic knowledge graph</li>
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Morning digest</li>
                          </ul>
                        ) : (
                          <ul className="space-y-2 text-sm text-[#52525B] dark:text-[#D4D4D8]">
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Unlimited knowledge nodes</li>
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Unlimited AI queries</li>
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 10 GB storage</li>
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Advanced graph with auto-discovery</li>
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Priority support</li>
                          </ul>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        {currentPlan === 'free' && (
                          <Button
                            onClick={handleUpgrade}
                            className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-md shadow-emerald-500/20"
                          >
                            <Zap className="w-4 h-4 mr-2" />
                            Upgrade to Pro
                          </Button>
                        )}
                        {currentPlan !== 'free' && (
                          <Button
                            onClick={handleManageBilling}
                            variant="outline"
                            className="border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] hover:border-emerald-200 dark:border-[rgba(16,185,129,0.20)] hover:bg-emerald-50 dark:bg-[rgba(16,185,129,0.10)]"
                          >
                            Manage Billing
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Usage Stats */}
                  <Card className="bg-white dark:bg-[#0F0F12] border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-base">Usage Statistics</CardTitle>
                      <CardDescription>Your current usage for this billing period</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      {/* Nodes */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-[#18181B] dark:text-[#FAFAFA]">Knowledge Nodes</span>
                          <span className="text-[#71717A] dark:text-[#A1A1AA]">
                            {usageStats.nodesLimit > 0
                              ? `${usageStats.totalNodes} / ${usageStats.nodesLimit}`
                              : `${usageStats.totalNodes} (unlimited)`
                            }
                          </span>
                        </div>
                        <div className="h-2 bg-[#F9FAFB] dark:bg-[#09090B] rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${nodesPercent >= 90 ? 'bg-amber-500' : 'bg-emerald-50 dark:bg-[rgba(16,185,129,0.10)]0'}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, nodesPercent)}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                          />
                        </div>
                      </div>

                      {/* AI Queries */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-[#18181B] dark:text-[#FAFAFA]">AI Queries Today</span>
                          <div className="flex items-center gap-2">
                            <span className={isOverAiLimit ? 'text-amber-600 font-semibold' : 'text-[#71717A] dark:text-[#A1A1AA]'}>
                              {usageStats.aiQueriesLimit > 0
                                ? `${usageStats.aiQueriesToday} / ${usageStats.aiQueriesLimit}`
                                : `${usageStats.aiQueriesToday} (unlimited)`
                              }
                            </span>
                            {isOverAiLimit && (
                              <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50 text-[10px]">Limit reached</Badge>
                            )}
                          </div>
                        </div>
                        <div className="h-2 bg-[#F9FAFB] dark:bg-[#09090B] rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${isOverAiLimit ? 'bg-amber-500' : 'bg-emerald-50 dark:bg-[rgba(16,185,129,0.10)]0'}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, aiQueriesPercent)}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                          />
                        </div>
                        {isOverAiLimit && (
                          <p className="text-xs text-amber-600 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            You&apos;ve exceeded your daily AI query limit. Upgrade to Pro for unlimited queries.
                            <button onClick={handleUpgrade} className="font-semibold underline hover:text-amber-700">Upgrade →</button>
                          </p>
                        )}
                      </div>

                      {/* Storage */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-[#18181B] dark:text-[#FAFAFA]">Storage</span>
                          <span className="text-[#71717A] dark:text-[#A1A1AA]">
                            {usageStats.storageLimitMB > 0
                              ? `${formatStorage(usageStats.storageUsedMB)} / ${formatStorage(usageStats.storageLimitMB)}`
                              : `${formatStorage(usageStats.storageUsedMB)} (unlimited)`
                            }
                          </span>
                        </div>
                        <div className="h-2 bg-[#F9FAFB] dark:bg-[#09090B] rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${storagePercent >= 90 ? 'bg-amber-500' : 'bg-emerald-50 dark:bg-[rgba(16,185,129,0.10)]0'}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, storagePercent)}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* ══════════ KNOWLEDGE GRAPH ══════════ */}
              {activeSection === 'knowledge-graph' && (
                <Card className="bg-white dark:bg-[#0F0F12] border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] shadow-sm">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-[rgba(16,185,129,0.10)] flex items-center justify-center">
                        <Network className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Knowledge Graph</CardTitle>
                        <CardDescription>Configure graph display and behavior</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Default Layout */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-[#18181B] dark:text-[#FAFAFA]">Default Layout</Label>
                      <RadioGroup
                        value={graphLayout}
                        onValueChange={(v) => { setGraphLayout(v as 'force' | 'radial' | 'tree'); persistSetting({ graphLayout: v }) }}
                        className="flex flex-col sm:flex-row gap-3"
                      >
                        {(['force', 'radial', 'tree'] as const).map((layout) => (
                          <Label
                            key={layout}
                            className={`
                              flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all
                              ${graphLayout === layout
                                ? 'border-emerald-300 bg-emerald-50 dark:bg-[rgba(16,185,129,0.10)] text-emerald-700 dark:text-emerald-400 shadow-sm'
                                : 'border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] bg-white dark:bg-[#0F0F12] hover:border-emerald-200 dark:border-[rgba(16,185,129,0.20)] hover:bg-emerald-50 dark:bg-[rgba(16,185,129,0.10)]/30'
                              }
                            `}
                          >
                            <RadioGroupItem value={layout} className={graphLayout === layout ? 'text-emerald-600 dark:text-emerald-400' : ''} />
                            <span className="text-sm font-medium capitalize">{layout}</span>
                          </Label>
                        ))}
                      </RadioGroup>
                      <p className="text-xs text-[#A1A1AA] dark:text-[#71717A]">Force = physics simulation, Radial = hub-spoke, Tree = hierarchical</p>
                    </div>

                    <Separator className="bg-[#E5E7EB]" />

                    {/* Show Labels */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#18181B] dark:text-[#FAFAFA]">Show Labels</p>
                        <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">Display text labels on graph nodes</p>
                      </div>
                      <Switch
                        checked={showLabels}
                        onCheckedChange={(v) => { setShowLabels(v); persistSetting({ showLabels: v }) }}
                        className="data-[state=checked]:bg-emerald-600"
                      />
                    </div>

                    <Separator className="bg-[#E5E7EB]" />

                    {/* Node Size */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#18181B] dark:text-[#FAFAFA]">Node Size</p>
                        <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">Size of nodes in the graph view</p>
                      </div>
                      <Select value={nodeSize} onValueChange={(v) => { setNodeSize(v as 'small' | 'medium' | 'large'); persistSetting({ nodeSize: v }) }}>
                        <SelectTrigger className="w-[140px] border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator className="bg-[#E5E7EB]" />

                    {/* Edge Style */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#18181B] dark:text-[#FAFAFA]">Edge Style</p>
                        <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">Visual style of connection lines</p>
                      </div>
                      <Select value={edgeStyle} onValueChange={(v) => { setEdgeStyle(v as 'solid' | 'dashed'); persistSetting({ edgeStyle: v }) }}>
                        <SelectTrigger className="w-[140px] border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="solid">Solid</SelectItem>
                          <SelectItem value="dashed">Dashed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator className="bg-[#E5E7EB]" />

                    {/* Auto-link Discoveries */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#18181B] dark:text-[#FAFAFA]">Auto-link Discoveries</p>
                        <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">Automatically create connections when new relationships are found</p>
                      </div>
                      <Switch
                        checked={autoLinkDiscoveries}
                        onCheckedChange={(v) => { setAutoLinkDiscoveries(v); persistSetting({ autoLinkDiscoveries: v }) }}
                        className="data-[state=checked]:bg-emerald-600"
                      />
                    </div>

                    <Separator className="bg-[#E5E7EB]" />

                    {/* Animation Speed */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#18181B] dark:text-[#FAFAFA]">Animation Speed</p>
                        <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">Speed of graph layout transitions</p>
                      </div>
                      <Select value={animationSpeed} onValueChange={(v) => { setAnimationSpeed(v as 'slow' | 'normal' | 'fast'); persistSetting({ animationSpeed: v }) }}>
                        <SelectTrigger className="w-[140px] border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="slow">Slow</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="fast">Fast</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* ══════════ MORNING DIGEST ══════════ */}
              {activeSection === 'morning-digest' && (
                <Card className="bg-white dark:bg-[#0F0F12] border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] shadow-sm">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-[rgba(16,185,129,0.10)] flex items-center justify-center">
                        <Sun className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Morning Digest</CardTitle>
                        <CardDescription>Configure your daily knowledge summary</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Enabled */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#18181B] dark:text-[#FAFAFA]">Enable Morning Digest</p>
                        <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">Receive a daily summary of your team&apos;s knowledge updates</p>
                      </div>
                      <Switch
                        checked={digestEnabled}
                        onCheckedChange={(v) => { setDigestEnabled(v); persistSetting({ digestEnabled: v }) }}
                        className="data-[state=checked]:bg-emerald-600"
                      />
                    </div>

                    {digestEnabled && (
                      <>
                        <Separator className="bg-[#E5E7EB]" />

                        {/* Delivery Time */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-[#18181B] dark:text-[#FAFAFA]">Delivery Time</p>
                            <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">When to receive your daily digest</p>
                          </div>
                          <Input
                            type="time"
                            value={deliveryTime}
                            onChange={(e) => { setDeliveryTime(e.target.value); debouncedPersist({ deliveryTime: e.target.value }) }}
                            className="w-[140px] border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] focus:border-emerald-400"
                          />
                        </div>

                        <Separator className="bg-[#E5E7EB]" />

                        {/* Email Notification */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-[#18181B] dark:text-[#FAFAFA]">Email Notification</p>
                            <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">Send digest via email in addition to in-app</p>
                          </div>
                          <Switch
                            checked={digestEmail}
                            onCheckedChange={(v) => { setDigestEmail(v); persistSetting({ digestEmail: v }) }}
                            className="data-[state=checked]:bg-emerald-600"
                          />
                        </div>

                        <Separator className="bg-[#E5E7EB]" />

                        {/* Include AI Comment */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-[#18181B] dark:text-[#FAFAFA]">Include AI Commentary</p>
                            <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">Add AI-generated insights to your digest</p>
                          </div>
                          <Switch
                            checked={includeAIComment}
                            onCheckedChange={(v) => { setIncludeAIComment(v); persistSetting({ includeAIComment: v }) }}
                            className="data-[state=checked]:bg-emerald-600"
                          />
                        </div>

                        <Separator className="bg-[#E5E7EB]" />

                        {/* Focus Areas */}
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-[#18181B] dark:text-[#FAFAFA]">Focus Areas</p>
                            <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">Select which areas to prioritize in your digest</p>
                          </div>
                          <div className="space-y-3">
                            {[
                              { key: 'apiArchitecture' as const, label: 'API Architecture', desc: 'API design patterns, endpoints, and integrations' },
                              { key: 'team' as const, label: 'Team', desc: 'Team structure, roles, and communications' },
                              { key: 'security' as const, label: 'Security', desc: 'Security protocols, auth, and compliance' },
                              { key: 'projects' as const, label: 'Projects', desc: 'Active projects, milestones, and deadlines' },
                            ].map((area) => (
                              <div key={area.key} className="flex items-start gap-3 p-3 rounded-xl border border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] hover:border-emerald-200 dark:border-[rgba(16,185,129,0.20)] transition-colors">
                                <Checkbox
                                  id={`focus-${area.key}`}
                                  checked={focusAreas[area.key]}
                                  onCheckedChange={(v) => {
                                    const updated = { ...focusAreas, [area.key]: !!v }
                                    setFocusAreas(updated)
                                    persistSetting({ focusAreas: updated })
                                  }}
                                  className="mt-0.5 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                                />
                                <div>
                                  <Label htmlFor={`focus-${area.key}`} className="text-sm font-medium text-[#18181B] dark:text-[#FAFAFA] cursor-pointer">
                                    {area.label}
                                  </Label>
                                  <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">{area.desc}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* ══════════ AI CHAT ══════════ */}
              {activeSection === 'ai-chat' && (
                <Card className="bg-white dark:bg-[#0F0F12] border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] shadow-sm">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-[rgba(16,185,129,0.10)] flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">AI Chat</CardTitle>
                        <CardDescription>Configure AI model and chat behavior</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Default Model */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#18181B] dark:text-[#FAFAFA]">Default Model</p>
                        <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">Choose the AI model for your conversations</p>
                      </div>
                      <Select value={defaultModel} onValueChange={(v) => { setDefaultModel(v as 'default' | 'advanced'); persistSetting({ defaultModel: v }) }}>
                        <SelectTrigger className="w-[160px] border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="advanced">
                            <span className="flex items-center gap-2">
                              Advanced
                              <Badge className="bg-emerald-50 dark:bg-[rgba(16,185,129,0.10)] text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-[rgba(16,185,129,0.20)] hover:bg-emerald-50 dark:bg-[rgba(16,185,129,0.10)] text-[9px] px-1.5">PRO</Badge>
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator className="bg-[#E5E7EB]" />

                    {/* Stream Responses */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#18181B] dark:text-[#FAFAFA]">Stream Responses</p>
                        <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">Display AI responses word by word as they generate</p>
                      </div>
                      <Switch
                        checked={streamResponses}
                        onCheckedChange={(v) => { setStreamResponses(v); persistSetting({ streamResponses: v }) }}
                        className="data-[state=checked]:bg-emerald-600"
                      />
                    </div>

                    <Separator className="bg-[#E5E7EB]" />

                    {/* Show Sources */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#18181B] dark:text-[#FAFAFA]">Show Sources</p>
                        <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">Display knowledge source references in AI responses</p>
                      </div>
                      <Switch
                        checked={showSources}
                        onCheckedChange={(v) => { setShowSources(v); persistSetting({ showSources: v }) }}
                        className="data-[state=checked]:bg-emerald-600"
                      />
                    </div>

                    <Separator className="bg-[#E5E7EB]" />

                    {/* Confidence Threshold */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-[#18181B] dark:text-[#FAFAFA]">Confidence Threshold</p>
                          <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">Minimum confidence level for AI responses</p>
                        </div>
                        <Badge className="bg-emerald-50 dark:bg-[rgba(16,185,129,0.10)] text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-[rgba(16,185,129,0.20)] hover:bg-emerald-50 dark:bg-[rgba(16,185,129,0.10)]">
                          {confidenceThreshold[0]}%
                        </Badge>
                      </div>
                      <Slider
                        value={confidenceThreshold}
                        onValueChange={(v) => { setConfidenceThreshold(v); debouncedPersist({ confidenceThreshold: v[0] }) }}
                        min={0}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-[#A1A1AA] dark:text-[#71717A]">
                        <span>0% — Show all</span>
                        <span>100% — Only high confidence</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* ══════════ NOTIFICATIONS ══════════ */}
              {activeSection === 'notifications' && (
                <Card className="bg-white dark:bg-[#0F0F12] border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] shadow-sm">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-[rgba(16,185,129,0.10)] flex items-center justify-center">
                        <Bell className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Notifications</CardTitle>
                        <CardDescription>Manage your notification preferences</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Email Notifications */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#18181B] dark:text-[#FAFAFA]">Email Notifications</p>
                        <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">Receive important updates via email</p>
                      </div>
                      <Switch
                        checked={emailNotifs}
                        onCheckedChange={(v) => { setEmailNotifs(v); persistSetting({ emailNotifs: v }) }}
                        className="data-[state=checked]:bg-emerald-600"
                      />
                    </div>

                    <Separator className="bg-[#E5E7EB]" />

                    {/* Weekly Summary */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#18181B] dark:text-[#FAFAFA]">Weekly Summary</p>
                        <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">Get a weekly overview of your team&apos;s knowledge activity</p>
                      </div>
                      <Switch
                        checked={weeklySummary}
                        onCheckedChange={(v) => { setWeeklySummary(v); persistSetting({ weeklySummary: v }) }}
                        className="data-[state=checked]:bg-emerald-600"
                      />
                    </div>

                    <Separator className="bg-[#E5E7EB]" />

                    {/* New Features */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#18181B] dark:text-[#FAFAFA]">New Features</p>
                        <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">Be notified about new LORE features and improvements</p>
                      </div>
                      <Switch
                        checked={newFeatures}
                        onCheckedChange={(v) => { setNewFeatures(v); persistSetting({ newFeatures: v }) }}
                        className="data-[state=checked]:bg-emerald-600"
                      />
                    </div>

                    <Separator className="bg-[#E5E7EB]" />

                    {/* Digest Reminders */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#18181B] dark:text-[#FAFAFA]">Digest Reminders</p>
                        <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">Remind you to check your daily digest</p>
                      </div>
                      <Switch
                        checked={digestReminders}
                        onCheckedChange={(v) => { setDigestReminders(v); persistSetting({ digestReminders: v }) }}
                        className="data-[state=checked]:bg-emerald-600"
                      />
                    </div>

                    <Separator className="bg-[#E5E7EB]" />

                    {/* Notification Sounds */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#18181B] dark:text-[#FAFAFA]">Notification Sounds</p>
                        <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">Play sounds for achievements and notifications</p>
                      </div>
                      <Switch
                        checked={soundEnabled}
                        onCheckedChange={(v) => {
                          setSoundEnabled(v)
                          localStorage.setItem('lore-sound-enabled', String(v))
                        }}
                        className="data-[state=checked]:bg-emerald-600"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* ══════════ PRIVACY & SECURITY ══════════ */}
              {activeSection === 'privacy-security' && (
                <div className="space-y-6">
                  <Card className="bg-white dark:bg-[#0F0F12] border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] shadow-sm">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-[rgba(16,185,129,0.10)] flex items-center justify-center">
                          <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">Privacy & Security</CardTitle>
                          <CardDescription>Manage your security and data privacy settings</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Two-Factor Authentication */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-[#18181B] dark:text-[#FAFAFA]">Two-Factor Authentication</p>
                          <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">Add an extra layer of security to your account</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50 text-[10px]">Coming Soon</Badge>
                          <Switch
                            checked={twoFactor}
                            onCheckedChange={(v) => { setTwoFactor(v); persistSetting({ twoFactor: v }) }}
                            disabled
                            className="data-[state=checked]:bg-emerald-600 opacity-50"
                          />
                        </div>
                      </div>

                      <Separator className="bg-[#E5E7EB]" />

                      {/* Data Retention */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-[#18181B] dark:text-[#FAFAFA]">Data Retention</p>
                          <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">How long to keep your data after deletion</p>
                        </div>
                        <Select value={dataRetention} onValueChange={(v) => { setDataRetention(v as '30' | '90' | '365' | 'forever'); persistSetting({ dataRetention: v }) }}>
                          <SelectTrigger className="w-[140px] border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30">30 days</SelectItem>
                            <SelectItem value="90">90 days</SelectItem>
                            <SelectItem value="365">1 year</SelectItem>
                            <SelectItem value="forever">Forever</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Separator className="bg-[#E5E7EB]" />

                      {/* Download My Data */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-[#18181B] dark:text-[#FAFAFA]">Download My Data</p>
                          <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">Export all your data in JSON format</p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={handleDownloadData}
                          disabled={downloadingData}
                          className="border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] hover:border-emerald-200 dark:border-[rgba(16,185,129,0.20)] hover:bg-emerald-50 dark:bg-[rgba(16,185,129,0.10)]"
                        >
                          {downloadingData ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Danger Zone - now inside privacy-security section */}
                  <Card className="bg-white dark:bg-[#0F0F12] border-red-200 shadow-sm">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-red-700">Danger Zone</CardTitle>
                          <CardDescription>Irreversible actions — proceed with caution</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between p-4 rounded-xl bg-red-50/50 border border-red-100">
                        <div>
                          <p className="text-sm font-medium text-red-800">Delete Account</p>
                          <p className="text-xs text-red-600">Permanently delete your account and all associated data. This action cannot be undone.</p>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="bg-red-600 hover:bg-red-700 shadow-md shadow-red-500/20">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Account
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your account
                                and remove all of your data from our servers, including all knowledge nodes,
                                graph connections, conversations, and personal settings.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                                Yes, delete my account
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* ══════════ APPEARANCE ══════════ */}
              {activeSection === 'appearance' && (
                <Card className="bg-white dark:bg-[#0F0F12] border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] shadow-sm">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-[rgba(16,185,129,0.10)] flex items-center justify-center">
                        <Palette className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Appearance</CardTitle>
                        <CardDescription>Customize the look and feel of LORE</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Theme */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#18181B] dark:text-[#FAFAFA]">Theme</p>
                        <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">Choose your preferred color scheme</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-[rgba(16,185,129,0.10)] border border-emerald-200 dark:border-[rgba(16,185,129,0.20)]">
                          <div className="w-4 h-4 rounded-full bg-white dark:bg-[#0F0F12] border border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)]" />
                          <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Light</span>
                        </div>
                        <Badge className="bg-emerald-50 dark:bg-[rgba(16,185,129,0.10)] text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-[rgba(16,185,129,0.20)] hover:bg-emerald-50 dark:bg-[rgba(16,185,129,0.10)] text-[10px]">
                          <Lock className="w-2.5 h-2.5 mr-0.5" />
                          Only option
                        </Badge>
                      </div>
                    </div>

                    <Separator className="bg-[#E5E7EB]" />

                    {/* Font Size */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#18181B] dark:text-[#FAFAFA]">Font Size</p>
                        <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">Adjust the base font size</p>
                      </div>
                      <Select value={fontSize} onValueChange={(v) => { setFontSize(v as 'normal' | 'large'); persistSetting({ fontSize: v }) }}>
                        <SelectTrigger className="w-[140px] border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator className="bg-[#E5E7EB]" />

                    {/* Sidebar Position */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#18181B] dark:text-[#FAFAFA]">Sidebar Position</p>
                        <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">Choose which side the sidebar appears on</p>
                      </div>
                      <div className="flex items-center gap-1 p-1 bg-[#F9FAFB] dark:bg-[#09090B] rounded-lg border border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)]">
                        <button
                          onClick={() => { setSidebarPosition('left'); persistSetting({ sidebarPosition: 'left' }) }}
                          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                            sidebarPosition === 'left' ? 'bg-white dark:bg-[#0F0F12] text-[#18181B] dark:text-[#FAFAFA] shadow-sm' : 'text-[#71717A] dark:text-[#A1A1AA] hover:text-[#52525B] dark:text-[#D4D4D8]'
                          }`}
                        >
                          Left
                        </button>
                        <button
                          onClick={() => { setSidebarPosition('right'); persistSetting({ sidebarPosition: 'right' }) }}
                          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                            sidebarPosition === 'right' ? 'bg-white dark:bg-[#0F0F12] text-[#18181B] dark:text-[#FAFAFA] shadow-sm' : 'text-[#71717A] dark:text-[#A1A1AA] hover:text-[#52525B] dark:text-[#D4D4D8]'
                          }`}
                        >
                          Right
                        </button>
                      </div>
                    </div>

                    <Separator className="bg-[#E5E7EB]" />

                    {/* Reduced Motion */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#18181B] dark:text-[#FAFAFA]">Reduced Motion</p>
                        <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">Minimize animations throughout the interface</p>
                      </div>
                      <Switch
                        checked={reducedMotion}
                        onCheckedChange={(v) => { setReducedMotion(v); persistSetting({ reducedMotion: v }) }}
                        className="data-[state=checked]:bg-emerald-600"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </AnimatePresence>
          )}

          {/* ═══ DANGER ZONE (always visible at bottom) ═══ */}
          {!loadingData && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mt-8"
            >
              <Card className="bg-red-50/50 border-red-200/60 shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-red-700">Danger Zone</CardTitle>
                      <CardDescription className="text-red-500/80">These actions are irreversible. Please be certain.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl bg-white dark:bg-[#0F0F12] border border-red-200/50">
                    <div>
                      <p className="text-sm font-medium text-[#18181B] dark:text-[#FAFAFA]">Delete Account</p>
                      <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">Permanently delete your account and all associated data</p>
                    </div>
                    <Button
                      disabled
                      className="bg-red-600 text-white opacity-60 cursor-not-allowed sm:shrink-0"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Coming Soon
                    </Button>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl bg-white dark:bg-[#0F0F12] border border-red-200/50">
                    <div>
                      <p className="text-sm font-medium text-[#18181B] dark:text-[#FAFAFA]">Export All Data</p>
                      <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">Download a complete export of your knowledge graph and settings</p>
                    </div>
                    <a
                      href="/api/export?type=all"
                      download
                      className="sm:shrink-0"
                    >
                      <Button
                        variant="outline"
                        className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export Data
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
