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
  enter: { opacity: 0, x: 12 },
  center: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const } },
  exit: { opacity: 0, x: -12, transition: { duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] as const } },
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

  // ─── Profile state (initialized from session, overridden by API) ──
  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')

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
        setTimeout(() => setLastSaved(false), 2000)
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
            <h1 className="text-2xl font-bold tracking-tight text-[#18181B]">Settings</h1>
            <p className="text-sm text-[#71717A]">
              Manage your preferences and account
              {saving && (
                <span className="inline-flex items-center gap-1.5 ml-3 text-xs text-emerald-600">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Saving...
                </span>
              )}
              {lastSaved && !saving && (
                <span className="inline-flex items-center gap-1.5 ml-3 text-xs text-emerald-600">
                  <Check className="w-3 h-3" />
                  Saved
                </span>
              )}
            </p>
          </div>
        </div>
      </motion.div>

      {/* ═══ LAYOUT: SIDEBAR + CONTENT ═══ */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* ──── LEFT: Section Navigation ──── */}
        <motion.nav
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="lg:w-[240px] shrink-0"
        >
          <Card className="bg-white border-[#E5E7EB] shadow-sm">
            <CardContent className="p-2">
              <div className="space-y-0.5">
                {sections.map((section) => {
                  const Icon = section.icon
                  const isActive = activeSection === section.key
                  return (
                    <button
                      key={section.key}
                      onClick={() => setActiveSection(section.key)}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left
                        transition-all duration-200 group
                        ${isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : 'text-[#52525B] hover:bg-[#F9FAFB] hover:text-[#18181B] border border-transparent'
                        }
                      `}
                    >
                      <div className={`
                        w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200
                        ${isActive
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                          : 'bg-[#F9FAFB] text-[#71717A] group-hover:bg-emerald-50 group-hover:text-emerald-600'
                        }
                      `}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-sm font-medium ${isActive ? 'font-semibold' : ''}`}>
                        {section.label}
                      </span>
                      {isActive && (
                        <ChevronRight className="w-3.5 h-3.5 text-emerald-500 ml-auto" />
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
            <Card className="bg-white border-[#E5E7EB] shadow-sm">
              <CardContent className="flex items-center justify-center py-16">
                <div className="flex items-center gap-3 text-[#71717A]">
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
                <Card className="bg-white border-[#E5E7EB] shadow-sm">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                        <User className="w-5 h-5 text-emerald-600" />
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
                        <p className="font-semibold text-[#18181B]">{name || 'Your Name'}</p>
                        <p className="text-sm text-[#71717A]">{email || 'your@email.com'}</p>
                        <Badge className="mt-2 bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-50 text-xs">
                          {currentPlan === 'free' ? 'Free Plan' : currentPlan === 'pro' ? 'Pro Plan' : 'Enterprise'}
                        </Badge>
                      </div>
                    </div>

                    <Separator className="bg-[#E5E7EB]" />

                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium text-[#18181B]">Full Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => { setName(e.target.value); debouncedPersist({ name: e.target.value }) }}
                        className="border-[#E5E7EB] focus:border-emerald-400 focus:ring-emerald-400/20"
                        placeholder="Your name"
                      />
                    </div>

                    {/* Email (readonly) */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-[#18181B]">
                        Email
                        <Badge variant="secondary" className="ml-2 text-[10px] bg-[#F9FAFB] text-[#71717A]">Read-only</Badge>
                      </Label>
                      <Input
                        id="email"
                        value={email}
                        readOnly
                        className="border-[#E5E7EB] bg-[#F9FAFB] text-[#71717A] cursor-not-allowed"
                      />
                    </div>

                    {/* Username */}
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-sm font-medium text-[#18181B]">Username</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#71717A]">@</span>
                        <Input
                          id="username"
                          value={username}
                          onChange={(e) => { setUsername(e.target.value); debouncedPersist({ username: e.target.value }) }}
                          className="border-[#E5E7EB] focus:border-emerald-400 focus:ring-emerald-400/20 pl-8"
                          placeholder="username"
                        />
                      </div>
                    </div>

                    {/* Bio */}
                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-sm font-medium text-[#18181B]">Bio</Label>
                      <Textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => { setBio(e.target.value); debouncedPersist({ bio: e.target.value }) }}
                        className="border-[#E5E7EB] focus:border-emerald-400 focus:ring-emerald-400/20 min-h-[100px]"
                        placeholder="Tell us about yourself..."
                      />
                      <p className="text-xs text-[#A1A1AA]">{bio.length}/280 characters</p>
                    </div>

                    <Button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20"
                    >
                      {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                      Save Changes
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* ══════════ SUBSCRIPTION & BILLING ══════════ */}
              {activeSection === 'subscription' && (
                <div className="space-y-6">
                  {/* Current Plan */}
                  <Card className="bg-white border-[#E5E7EB] shadow-sm">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">Subscription & Billing</CardTitle>
                          <CardDescription>Manage your plan and billing</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Plan Badge */}
                      <div className="flex items-center justify-between p-5 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center">
                            {currentPlan === 'pro' ? (
                              <Crown className="w-5 h-5 text-white" />
                            ) : (
                              <Sparkles className="w-5 h-5 text-white" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-[#18181B]">
                              {currentPlan === 'free' ? 'Free Plan' : currentPlan === 'pro' ? 'Pro Plan' : 'Enterprise Plan'}
                            </p>
                            <p className="text-sm text-[#71717A]">
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
                        <p className="text-sm font-semibold text-[#18181B]">Plan includes:</p>
                        {currentPlan === 'free' ? (
                          <ul className="space-y-2 text-sm text-[#52525B]">
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Up to 50 knowledge nodes</li>
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 10 AI queries per day</li>
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 100 MB storage</li>
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Basic knowledge graph</li>
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Morning digest</li>
                          </ul>
                        ) : (
                          <ul className="space-y-2 text-sm text-[#52525B]">
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
                            className="border-[#E5E7EB] hover:border-emerald-200 hover:bg-emerald-50"
                          >
                            Manage Billing
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Usage Stats */}
                  <Card className="bg-white border-[#E5E7EB] shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-base">Usage Statistics</CardTitle>
                      <CardDescription>Your current usage for this billing period</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      {/* Nodes */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-[#18181B]">Knowledge Nodes</span>
                          <span className="text-[#71717A]">
                            {usageStats.nodesLimit > 0
                              ? `${usageStats.totalNodes} / ${usageStats.nodesLimit}`
                              : `${usageStats.totalNodes} (unlimited)`
                            }
                          </span>
                        </div>
                        <div className="h-2 bg-[#F9FAFB] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${nodesPercent >= 90 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${Math.min(100, nodesPercent)}%` }}
                          />
                        </div>
                      </div>

                      {/* AI Queries */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-[#18181B]">AI Queries Today</span>
                          <div className="flex items-center gap-2">
                            <span className={isOverAiLimit ? 'text-amber-600 font-semibold' : 'text-[#71717A]'}>
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
                        <div className="h-2 bg-[#F9FAFB] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${isOverAiLimit ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${Math.min(100, aiQueriesPercent)}%` }}
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
                          <span className="font-medium text-[#18181B]">Storage</span>
                          <span className="text-[#71717A]">
                            {usageStats.storageLimitMB > 0
                              ? `${formatStorage(usageStats.storageUsedMB)} / ${formatStorage(usageStats.storageLimitMB)}`
                              : `${formatStorage(usageStats.storageUsedMB)} (unlimited)`
                            }
                          </span>
                        </div>
                        <div className="h-2 bg-[#F9FAFB] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${storagePercent >= 90 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${Math.min(100, storagePercent)}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* ══════════ KNOWLEDGE GRAPH ══════════ */}
              {activeSection === 'knowledge-graph' && (
                <Card className="bg-white border-[#E5E7EB] shadow-sm">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                        <Network className="w-5 h-5 text-emerald-600" />
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
                      <Label className="text-sm font-medium text-[#18181B]">Default Layout</Label>
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
                                ? 'border-emerald-300 bg-emerald-50 text-emerald-700 shadow-sm'
                                : 'border-[#E5E7EB] bg-white hover:border-emerald-200 hover:bg-emerald-50/30'
                              }
                            `}
                          >
                            <RadioGroupItem value={layout} className={graphLayout === layout ? 'text-emerald-600' : ''} />
                            <span className="text-sm font-medium capitalize">{layout}</span>
                          </Label>
                        ))}
                      </RadioGroup>
                      <p className="text-xs text-[#A1A1AA]">Force = physics simulation, Radial = hub-spoke, Tree = hierarchical</p>
                    </div>

                    <Separator className="bg-[#E5E7EB]" />

                    {/* Show Labels */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#18181B]">Show Labels</p>
                        <p className="text-xs text-[#71717A]">Display text labels on graph nodes</p>
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
                        <p className="text-sm font-medium text-[#18181B]">Node Size</p>
                        <p className="text-xs text-[#71717A]">Size of nodes in the graph view</p>
                      </div>
                      <Select value={nodeSize} onValueChange={(v) => { setNodeSize(v as 'small' | 'medium' | 'large'); persistSetting({ nodeSize: v }) }}>
                        <SelectTrigger className="w-[140px] border-[#E5E7EB]">
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
                        <p className="text-sm font-medium text-[#18181B]">Edge Style</p>
                        <p className="text-xs text-[#71717A]">Visual style of connection lines</p>
                      </div>
                      <Select value={edgeStyle} onValueChange={(v) => { setEdgeStyle(v as 'solid' | 'dashed'); persistSetting({ edgeStyle: v }) }}>
                        <SelectTrigger className="w-[140px] border-[#E5E7EB]">
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
                        <p className="text-sm font-medium text-[#18181B]">Auto-link Discoveries</p>
                        <p className="text-xs text-[#71717A]">Automatically create connections when new relationships are found</p>
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
                        <p className="text-sm font-medium text-[#18181B]">Animation Speed</p>
                        <p className="text-xs text-[#71717A]">Speed of graph layout transitions</p>
                      </div>
                      <Select value={animationSpeed} onValueChange={(v) => { setAnimationSpeed(v as 'slow' | 'normal' | 'fast'); persistSetting({ animationSpeed: v }) }}>
                        <SelectTrigger className="w-[140px] border-[#E5E7EB]">
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
                <Card className="bg-white border-[#E5E7EB] shadow-sm">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                        <Sun className="w-5 h-5 text-emerald-600" />
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
                        <p className="text-sm font-medium text-[#18181B]">Enable Morning Digest</p>
                        <p className="text-xs text-[#71717A]">Receive a daily summary of your team&apos;s knowledge updates</p>
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
                            <p className="text-sm font-medium text-[#18181B]">Delivery Time</p>
                            <p className="text-xs text-[#71717A]">When to receive your daily digest</p>
                          </div>
                          <Input
                            type="time"
                            value={deliveryTime}
                            onChange={(e) => { setDeliveryTime(e.target.value); debouncedPersist({ deliveryTime: e.target.value }) }}
                            className="w-[140px] border-[#E5E7EB] focus:border-emerald-400"
                          />
                        </div>

                        <Separator className="bg-[#E5E7EB]" />

                        {/* Email Notification */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-[#18181B]">Email Notification</p>
                            <p className="text-xs text-[#71717A]">Send digest via email in addition to in-app</p>
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
                            <p className="text-sm font-medium text-[#18181B]">Include AI Commentary</p>
                            <p className="text-xs text-[#71717A]">Add AI-generated insights to your digest</p>
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
                            <p className="text-sm font-medium text-[#18181B]">Focus Areas</p>
                            <p className="text-xs text-[#71717A]">Select which areas to prioritize in your digest</p>
                          </div>
                          <div className="space-y-3">
                            {[
                              { key: 'apiArchitecture' as const, label: 'API Architecture', desc: 'API design patterns, endpoints, and integrations' },
                              { key: 'team' as const, label: 'Team', desc: 'Team structure, roles, and communications' },
                              { key: 'security' as const, label: 'Security', desc: 'Security protocols, auth, and compliance' },
                              { key: 'projects' as const, label: 'Projects', desc: 'Active projects, milestones, and deadlines' },
                            ].map((area) => (
                              <div key={area.key} className="flex items-start gap-3 p-3 rounded-xl border border-[#E5E7EB] hover:border-emerald-200 transition-colors">
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
                                  <Label htmlFor={`focus-${area.key}`} className="text-sm font-medium text-[#18181B] cursor-pointer">
                                    {area.label}
                                  </Label>
                                  <p className="text-xs text-[#71717A]">{area.desc}</p>
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
                <Card className="bg-white border-[#E5E7EB] shadow-sm">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-emerald-600" />
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
                        <p className="text-sm font-medium text-[#18181B]">Default Model</p>
                        <p className="text-xs text-[#71717A]">Choose the AI model for your conversations</p>
                      </div>
                      <Select value={defaultModel} onValueChange={(v) => { setDefaultModel(v as 'default' | 'advanced'); persistSetting({ defaultModel: v }) }}>
                        <SelectTrigger className="w-[160px] border-[#E5E7EB]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="advanced">
                            <span className="flex items-center gap-2">
                              Advanced
                              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-50 text-[9px] px-1.5">PRO</Badge>
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator className="bg-[#E5E7EB]" />

                    {/* Stream Responses */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#18181B]">Stream Responses</p>
                        <p className="text-xs text-[#71717A]">Display AI responses word by word as they generate</p>
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
                        <p className="text-sm font-medium text-[#18181B]">Show Sources</p>
                        <p className="text-xs text-[#71717A]">Display knowledge source references in AI responses</p>
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
                          <p className="text-sm font-medium text-[#18181B]">Confidence Threshold</p>
                          <p className="text-xs text-[#71717A]">Minimum confidence level for AI responses</p>
                        </div>
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-50">
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
                      <div className="flex justify-between text-xs text-[#A1A1AA]">
                        <span>0% — Show all</span>
                        <span>100% — Only high confidence</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* ══════════ NOTIFICATIONS ══════════ */}
              {activeSection === 'notifications' && (
                <Card className="bg-white border-[#E5E7EB] shadow-sm">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                        <Bell className="w-5 h-5 text-emerald-600" />
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
                        <p className="text-sm font-medium text-[#18181B]">Email Notifications</p>
                        <p className="text-xs text-[#71717A]">Receive important updates via email</p>
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
                        <p className="text-sm font-medium text-[#18181B]">Weekly Summary</p>
                        <p className="text-xs text-[#71717A]">Get a weekly overview of your team&apos;s knowledge activity</p>
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
                        <p className="text-sm font-medium text-[#18181B]">New Features</p>
                        <p className="text-xs text-[#71717A]">Be notified about new LORE features and improvements</p>
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
                        <p className="text-sm font-medium text-[#18181B]">Digest Reminders</p>
                        <p className="text-xs text-[#71717A]">Remind you to check your daily digest</p>
                      </div>
                      <Switch
                        checked={digestReminders}
                        onCheckedChange={(v) => { setDigestReminders(v); persistSetting({ digestReminders: v }) }}
                        className="data-[state=checked]:bg-emerald-600"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* ══════════ PRIVACY & SECURITY ══════════ */}
              {activeSection === 'privacy-security' && (
                <div className="space-y-6">
                  <Card className="bg-white border-[#E5E7EB] shadow-sm">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                          <Shield className="w-5 h-5 text-emerald-600" />
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
                          <p className="text-sm font-medium text-[#18181B]">Two-Factor Authentication</p>
                          <p className="text-xs text-[#71717A]">Add an extra layer of security to your account</p>
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
                          <p className="text-sm font-medium text-[#18181B]">Data Retention</p>
                          <p className="text-xs text-[#71717A]">How long to keep your data after deletion</p>
                        </div>
                        <Select value={dataRetention} onValueChange={(v) => { setDataRetention(v as '30' | '90' | '365' | 'forever'); persistSetting({ dataRetention: v }) }}>
                          <SelectTrigger className="w-[140px] border-[#E5E7EB]">
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
                          <p className="text-sm font-medium text-[#18181B]">Download My Data</p>
                          <p className="text-xs text-[#71717A]">Export all your data in JSON format</p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={handleDownloadData}
                          disabled={downloadingData}
                          className="border-[#E5E7EB] hover:border-emerald-200 hover:bg-emerald-50"
                        >
                          {downloadingData ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Danger Zone */}
                  <Card className="bg-white border-red-200 shadow-sm">
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
                <Card className="bg-white border-[#E5E7EB] shadow-sm">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                        <Palette className="w-5 h-5 text-emerald-600" />
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
                        <p className="text-sm font-medium text-[#18181B]">Theme</p>
                        <p className="text-xs text-[#71717A]">Choose your preferred color scheme</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200">
                          <div className="w-4 h-4 rounded-full bg-white border border-[#E5E7EB]" />
                          <span className="text-sm font-medium text-emerald-700">Light</span>
                        </div>
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-50 text-[10px]">
                          <Lock className="w-2.5 h-2.5 mr-0.5" />
                          Only option
                        </Badge>
                      </div>
                    </div>

                    <Separator className="bg-[#E5E7EB]" />

                    {/* Font Size */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#18181B]">Font Size</p>
                        <p className="text-xs text-[#71717A]">Adjust the base font size</p>
                      </div>
                      <Select value={fontSize} onValueChange={(v) => { setFontSize(v as 'normal' | 'large'); persistSetting({ fontSize: v }) }}>
                        <SelectTrigger className="w-[140px] border-[#E5E7EB]">
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
                        <p className="text-sm font-medium text-[#18181B]">Sidebar Position</p>
                        <p className="text-xs text-[#71717A]">Choose which side the sidebar appears on</p>
                      </div>
                      <div className="flex items-center gap-1 p-1 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                        <button
                          onClick={() => { setSidebarPosition('left'); persistSetting({ sidebarPosition: 'left' }) }}
                          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                            sidebarPosition === 'left' ? 'bg-white text-[#18181B] shadow-sm' : 'text-[#71717A] hover:text-[#52525B]'
                          }`}
                        >
                          Left
                        </button>
                        <button
                          onClick={() => { setSidebarPosition('right'); persistSetting({ sidebarPosition: 'right' }) }}
                          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                            sidebarPosition === 'right' ? 'bg-white text-[#18181B] shadow-sm' : 'text-[#71717A] hover:text-[#52525B]'
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
                        <p className="text-sm font-medium text-[#18181B]">Reduced Motion</p>
                        <p className="text-xs text-[#71717A]">Minimize animations throughout the interface</p>
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
        </div>
      </div>
    </div>
  )
}
