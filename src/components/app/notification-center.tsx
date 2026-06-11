'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  Sun,
  Network,
  BookOpen,
  CheckCircle2,
  Check,
  X,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { create } from 'zustand'

// ─── Notification Item Types ──────────────────────────────────
interface NotificationCenterItem {
  id: string
  icon: typeof Bell
  iconColor: string
  iconBgColor: string
  title: string
  description: string
  href: string
  read: boolean
  createdAt: Date
}

// ─── Zustand Store for Notification Center ────────────────────
interface NotificationCenterState {
  notifications: NotificationCenterItem[]
  isOpen: boolean
  setNotifications: (notifications: NotificationCenterItem[]) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  setOpen: (open: boolean) => void
  toggleOpen: () => void
  unreadCount: () => number
}

export const useNotificationCenter = create<NotificationCenterState>((set, get) => ({
  notifications: [],
  isOpen: false,

  setNotifications: (notifications) => set({ notifications }),

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),

  setOpen: (open) => set({ isOpen: open }),

  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),

  unreadCount: () => get().notifications.filter((n) => !n.read).length,
}))

// ─── Hook to fetch notification data from APIs ────────────────
function useNotificationData() {
  const setNotifications = useNotificationCenter((s) => s.setNotifications)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function fetchNotificationData() {
      try {
        const [digestRes, nodesRes, edgesRes, notesRes] = await Promise.all([
          fetch('/api/digest').catch(() => null),
          fetch('/api/nodes').catch(() => null),
          fetch('/api/edges').catch(() => null),
          fetch('/api/notes').catch(() => null),
        ])

        const digestData = digestRes?.ok ? await digestRes.json() : null
        const nodesData = nodesRes?.ok ? await nodesRes.json() : null
        const edgesData = edgesRes?.ok ? await edgesRes.json() : null
        const notesData = notesRes?.ok ? await notesRes.json() : null

        if (cancelled) return

        const notifications: NotificationCenterItem[] = []
        const now = new Date()

        // 1. Check if today's digest has been read
        const todayDigest = digestData?.digest
        if (todayDigest && !todayDigest.read) {
          notifications.push({
            id: 'digest-unread',
            icon: Sun,
            iconColor: '#D97706',
            iconBgColor: 'rgba(217,119,6,0.10)',
            title: 'Your morning digest is ready!',
            description: 'Read today\'s AI-powered insights and summary.',
            href: '/app/digest',
            read: false,
            createdAt: new Date(now.getTime() - 30 * 60 * 1000), // 30 min ago
          })
        }

        // 2. Count unlinked nodes (nodes without edges)
        const nodes: Array<{ id: string; title: string }> = nodesData?.nodes || []
        const edges: Array<{ sourceId: string; targetId: string }> = edgesData?.edges || []

        if (nodes.length > 0) {
          const linkedNodeIds = new Set<string>()
          for (const edge of edges) {
            linkedNodeIds.add(edge.sourceId)
            linkedNodeIds.add(edge.targetId)
          }
          const unlinkedNodes = nodes.filter((n) => !linkedNodeIds.has(n.id))

          if (unlinkedNodes.length >= 2) {
            notifications.push({
              id: 'unlinked-nodes',
              icon: Network,
              iconColor: '#0D9488',
              iconBgColor: 'rgba(13,148,136,0.10)',
              title: `${unlinkedNodes.length} new knowledge connections found`,
              description: `${unlinkedNodes.length} nodes are waiting to be linked — connect them to unlock insights.`,
              href: '/app/graph',
              read: false,
              createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
            })
          }
        }

        // 3. Check for notes without AI summaries
        const notes: Array<{ id: string; aiSummary: string | null }> = notesData?.notes || []
        const notesWithoutSummary = notes.filter((n) => !n.aiSummary)

        if (notesWithoutSummary.length >= 1) {
          notifications.push({
            id: 'notes-no-ai-summary',
            icon: BookOpen,
            iconColor: '#059669',
            iconBgColor: 'rgba(5,150,105,0.10)',
            title: 'AI found 2 insights in your notes',
            description: `${notesWithoutSummary.length} note${notesWithoutSummary.length > 1 ? 's' : ''} could benefit from AI-powered summaries.`,
            href: '/app/memory',
            read: false,
            createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000), // 4 hours ago
          })
        }

        setNotifications(notifications)
        setLoaded(true)
      } catch (err) {
        console.error('Failed to load notification data:', err)
        setLoaded(true)
      }
    }

    fetchNotificationData()

    return () => {
      cancelled = true
    }
  }, [setNotifications])

  return loaded
}

// ─── Time Ago Helper ─────────────────────────────────────────
function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)

  if (diffMin < 1) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`

  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`

  const diffDay = Math.floor(diffHr / 24)
  return `${diffDay}d ago`
}

// ─── Animation Variants ──────────────────────────────────────
const dropdownVariants = {
  hidden: {
    opacity: 0,
    y: -8,
    scale: 0.95,
    transition: { duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.06,
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
}

// ─── Bell Bounce Animation ───────────────────────────────────
const bellBounce = {
  animate: {
    y: [0, -4, 0, -2, 0],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      repeatDelay: 3,
      ease: 'easeInOut',
    },
  },
}

// ═══════════════════════════════════════════════════════════════
// NOTIFICATION CENTER COMPONENT
// ═══════════════════════════════════════════════════════════════
export function NotificationCenter() {
  const loaded = useNotificationData()
  const { notifications, isOpen, markAsRead, markAllAsRead, setOpen, toggleOpen, unreadCount } =
    useNotificationCenter()
  const containerRef = useRef<HTMLDivElement>(null)
  const count = unreadCount()

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, setOpen])

  // Close on Escape key
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, setOpen])

  const handleNotificationClick = useCallback(
    (id: string) => {
      markAsRead(id)
      setOpen(false)
    },
    [markAsRead, setOpen]
  )

  return (
    <div className="relative" ref={containerRef}>
      {/* ── Bell Button ────────────────────────────────────── */}
      <motion.button
        onClick={toggleOpen}
        className="relative w-9 h-9 rounded-lg flex items-center justify-center text-[#71717A] dark:text-[#A1A1AA] hover:bg-[#F9FAFB] dark:hover:bg-[#09090B] dark:bg-[#09090B] hover:text-[#18181B] dark:hover:text-[#FAFAFA] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30 focus-visible:ring-offset-1"
        aria-label={`Notifications${count > 0 ? ` (${count} unread)` : ''}`}
        {...(count > 0 ? bellBounce : {})}
      >
        <Bell className="w-[18px] h-[18px]" />

        {/* Unread badge */}
        <AnimatePresence>
          {count > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              className="absolute -top-0.5 -right-0.5"
            >
              <Badge className="h-[18px] min-w-[18px] px-1 text-[10px] font-bold bg-emerald-600 text-white border-2 border-white shadow-sm flex items-center justify-center rounded-full">
                {count > 9 ? '9+' : count}
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ── Dropdown Panel ─────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="absolute right-0 top-full mt-2 w-[360px] bg-white dark:bg-[#0F0F12] border border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] rounded-2xl shadow-xl shadow-black/[0.06] z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#F3F4F6] dark:border-[rgba(255,255,255,0.04)]">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#18181B] dark:text-[#FAFAFA]">Notifications</h3>
                {count > 0 && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] font-bold bg-emerald-50 dark:bg-[rgba(16,185,129,0.10)] text-emerald-700 dark:text-emerald-400 h-5 px-1.5"
                  >
                    {count} new
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1">
                {count > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 hover:bg-emerald-50 dark:bg-[rgba(16,185,129,0.10)] h-7 px-2 gap-1"
                  >
                    <Check className="w-3 h-3" />
                    Mark all read
                  </Button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[#A1A1AA] dark:text-[#71717A] hover:bg-[#F9FAFB] dark:hover:bg-[#09090B] dark:bg-[#09090B] hover:text-[#52525B] dark:hover:text-[#D4D4D8] transition-colors"
                  aria-label="Close notifications"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Notification List */}
            {notifications.length === 0 ? (
              /* ── Empty State ────────────────────────────── */
              <div className="flex flex-col items-center justify-center py-10 px-6">
                <div className="w-12 h-12 rounded-full bg-[#F9FAFB] dark:bg-[#09090B] border border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
                <p className="text-sm font-semibold text-[#18181B] dark:text-[#FAFAFA] mb-1">
                  No new notifications
                </p>
                <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] text-center">
                  You&apos;re all caught up! Check back later for updates.
                </p>
              </div>
            ) : (
              <ScrollArea className="max-h-[380px]">
                <div className="py-1">
                  {notifications.map((notification, i) => (
                    <motion.div
                      key={notification.id}
                      custom={i}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <Link
                        href={notification.href}
                        onClick={() => handleNotificationClick(notification.id)}
                        className={`
                          flex items-start gap-3 px-4 py-3 transition-colors group
                          ${notification.read
                            ? 'bg-white dark:bg-[#0F0F12] hover:bg-[#FAFAFA] dark:hover:bg-[rgba(255,255,255,0.04)]'
                            : 'bg-emerald-50/40 dark:bg-[rgba(16,185,129,0.08)] hover:bg-emerald-50/70 dark:hover:bg-[rgba(16,185,129,0.14)]'
                          }
                        `}
                      >
                        {/* Icon */}
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                          style={{ background: notification.iconBgColor }}
                        >
                          <notification.icon
                            className="w-4 h-4"
                            style={{ color: notification.iconColor }}
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p
                              className={`text-sm leading-snug ${
                                notification.read
                                  ? 'font-medium text-[#52525B] dark:text-[#D4D4D8]'
                                  : 'font-semibold text-[#18181B] dark:text-[#FAFAFA]'
                              }`}
                            >
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                            )}
                          </div>
                          <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] leading-relaxed mt-0.5 line-clamp-2">
                            {notification.description}
                          </p>
                          <p className="text-[10px] text-[#A1A1AA] dark:text-[#71717A] mt-1.5 font-medium">
                            {formatTimeAgo(notification.createdAt)}
                          </p>
                        </div>
                      </Link>

                      {/* Separator between items */}
                      {i < notifications.length - 1 && (
                        <Separator className="mx-4 bg-[#F3F4F6]" />
                      )}
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            )}

            {/* ── What's New Section ────────────────────────── */}
            <div className="border-t border-[#F3F4F6] dark:border-[rgba(255,255,255,0.04)]">
              <div className="px-4 pt-3 pb-1 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-xs font-bold text-[#18181B] dark:text-[#FAFAFA]">What&apos;s New</span>
                <Badge className="h-[16px] min-w-[16px] px-1 text-[8px] font-bold bg-emerald-600 text-white border-0 shadow-sm flex items-center justify-center rounded-full">
                  New
                </Badge>
              </div>
              <div className="px-4 pb-3 pt-1 space-y-2">
                {[
                  { title: 'Dark Mode', desc: 'Switch between light and dark themes' },
                  { title: 'Data Export', desc: 'Download your knowledge as JSON' },
                  { title: 'Achievements', desc: 'Earn badges as you build your graph' },
                  { title: 'Markdown Chat', desc: 'AI responses now render with syntax highlighting' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold text-[#18181B] dark:text-[#FAFAFA] leading-tight">{item.title}</p>
                      <p className="text-[10px] text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="border-t border-[#F3F4F6] dark:border-[rgba(255,255,255,0.04)] px-4 py-2.5">
                <p className="text-[10px] text-[#A1A1AA] dark:text-[#71717A] text-center">
                  Notifications are based on your knowledge graph activity
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
