'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain,
  LayoutDashboard,
  Network,
  Sun,
  Moon,
  MessageSquare,
  BookOpen,
  Users,
  Settings,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { SidebarSearch } from '@/components/app/sidebar-search'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useAuth } from '@/hooks/use-auth'
import { useTheme } from 'next-themes'

// ─── Navigation Items ──────────────────────────────────────
const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/app', shortcut: '⌘D', description: 'Overview of your knowledge base', color: '#059669' },
  { label: 'Knowledge Graph', icon: Network, href: '/app/graph', shortcut: '⌘G', description: 'Visualize and connect your knowledge', color: '#0891B2' },
  { label: 'Morning Digest', icon: Sun, href: '/app/digest', shortcut: '⌘M', description: 'Daily AI-powered briefing', color: '#D97706', hasNotification: true },
  { label: 'AI Chat', icon: MessageSquare, href: '/app/chat', shortcut: '⌘K', description: 'Ask questions about your knowledge', color: '#0284C7', hasNotification: true },
  { label: 'Memory', icon: BookOpen, href: '/app/memory', shortcut: '⌘N', description: 'Notes, bookmarks, and insights', color: '#7C3AED' },
  { label: 'Team', icon: Users, href: '/app/team', shortcut: '⌘T', description: 'Collaborate with your team', color: '#DB2777' },
  { label: 'Settings', icon: Settings, href: '/app/settings', shortcut: '⌘S', description: 'Customize your experience', color: '#52525B' },
]

// ─── Plan badge styles ──────────────────────────────────────
const planBadgeStyles: Record<string, string> = {
  free: 'text-zinc-600 border-zinc-200 bg-zinc-50/50',
  pro: 'text-emerald-700 border-emerald-200 bg-emerald-50/50',
  enterprise: 'text-violet-700 border-violet-200 bg-violet-50/50',
}

// ─── Mini Knowledge Graph Animation ────────────────────────
function MiniGraphAnimation() {
  const dots = [
    { cx: 8, cy: 8 },
    { cx: 20, cy: 5 },
    { cx: 15, cy: 18 },
  ]

  return (
    <svg viewBox="0 0 28 24" className="w-5 h-4 shrink-0" fill="none">
      {/* Connecting lines */}
      <motion.line
        x1={dots[0].cx} y1={dots[0].cy}
        x2={dots[1].cx} y2={dots[1].cy}
        stroke="#10B981" strokeWidth={1} strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.5 }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
      />
      <motion.line
        x1={dots[1].cx} y1={dots[1].cy}
        x2={dots[2].cx} y2={dots[2].cy}
        stroke="#14B8A6" strokeWidth={1} strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.5 }}
        transition={{ duration: 1.5, delay: 0.3, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
      />
      <motion.line
        x1={dots[0].cx} y1={dots[0].cy}
        x2={dots[2].cx} y2={dots[2].cy}
        stroke="#059669" strokeWidth={1} strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.5 }}
        transition={{ duration: 1.5, delay: 0.6, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
      />
      {/* Pulsing dots */}
      {dots.map((dot, i) => (
        <g key={i}>
          <motion.circle
            cx={dot.cx} cy={dot.cy} r={4}
            fill={i === 0 ? '#10B981' : i === 1 ? '#14B8A6' : '#059669'}
            opacity={0.15}
            animate={{ r: [4, 6, 4], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 2, delay: i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.circle
            cx={dot.cx} cy={dot.cy} r={2}
            fill={i === 0 ? '#10B981' : i === 1 ? '#14B8A6' : '#059669'}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, delay: i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </g>
      ))}
    </svg>
  )
}

// ─── Shimmer Badge ─────────────────────────────────────────
function ShimmerBadge() {
  return (
    <span className="relative inline-flex items-center overflow-hidden rounded-md border border-emerald-200 bg-emerald-50/50 px-1.5 py-0.5">
      {/* Shimmer overlay */}
      <motion.span
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
        animate={{ x: ['-100%', '200%'] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
      />
      <span className="relative text-[9px] font-bold tracking-wide text-emerald-700">PRO</span>
    </span>
  )
}

// ─── Props ─────────────────────────────────────────────────
interface AppSidebarProps {
  isOpen: boolean
  onClose: () => void
  collapsed?: boolean
  onToggleCollapse?: () => void
}

// ─── Main Component ────────────────────────────────────────
export function AppSidebar({ isOpen, onClose, collapsed = false, onToggleCollapse }: AppSidebarProps) {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const { theme, setTheme } = useTheme()
  // Demo notification counts (always shown for demo purposes)
  const unreadCounts: Record<string, number> = { '/app/chat': 3, '/app/digest': 1 }

  const plan = (user?.plan || 'free').toLowerCase()
  const planLabel = plan.charAt(0).toUpperCase() + plan.slice(1) + ' Plan'
  const badgeClass = planBadgeStyles[plan] || planBadgeStyles.free

  const isActive = (href: string) => {
    if (href === '/app') return pathname === '/app'
    return pathname.startsWith(href)
  }

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '??'

  const sidebarWidth = collapsed ? 'w-[68px]' : 'w-[260px]'

  return (
    <>
      {/* ── Mobile overlay backdrop ──────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar ──────────────────────────────────────── */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          ${sidebarWidth} bg-white border-r border-[#E5E7EB]
          flex flex-col relative
          transform transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* ── Animated Gradient Border (right edge) ──────── */}
        <div className="absolute top-0 right-0 bottom-0 w-[2px] overflow-hidden pointer-events-none">
          <motion.div
            className="w-full h-full bg-gradient-to-b from-emerald-400 via-teal-400 to-emerald-500"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* ── Logo Section ──────────────────────────────── */}
        <div
          role="banner"
          className={`h-16 flex items-center gap-2.5 border-b border-[#E5E7EB] shrink-0 transition-all duration-300 ${
            collapsed ? 'px-3 justify-center' : 'px-6'
          }`}
        >
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
            onClick={onClose}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-md shadow-emerald-500/20 relative shrink-0">
              <Brain className="w-4 h-4 text-white" />
              {/* Subtle ring animation */}
              <motion.div
                className="absolute inset-0 rounded-lg border border-emerald-400/50"
                animate={{ opacity: [0, 0.5, 0], scale: [1, 1.15, 1.3] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
              />
            </div>
            {!collapsed && (
              <span className="text-lg font-bold tracking-tight text-[#18181B] group-hover:text-emerald-700 transition-colors">
                LORE
              </span>
            )}
          </Link>
          {!collapsed && (
            <>
              {/* Mini Knowledge Graph Animation */}
              <MiniGraphAnimation />
              <Badge
                variant="secondary"
                className="ml-auto text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-50"
              >
                BETA
              </Badge>
            </>
          )}
          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors ml-1"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
          {/* Desktop collapse toggle */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex w-6 h-6 items-center justify-center rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* ── Search ──────────────────────────────────────── */}
        {!collapsed && <SidebarSearch />}
        {collapsed && (
          <div className="px-3 pt-3 pb-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="w-full h-8 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] flex items-center justify-center text-[#A1A1AA] hover:text-[#71717A] hover:border-emerald-300 transition-colors"
                  aria-label="Search"
                >
                  <SearchIcon className="w-3.5 h-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">
                Search (⌘K)
              </TooltipContent>
            </Tooltip>
          </div>
        )}

        {/* ── Navigation ────────────────────────────────── */}
        <TooltipProvider delayDuration={collapsed ? 100 : 300}>
          <nav aria-label="Navigation" className={`flex-1 ${collapsed ? 'px-2' : 'px-4'} pb-4 space-y-1 overflow-y-auto`}>
            {navItems.map((item) => {
              const active = isActive(item.href)
              const unread = unreadCounts[item.href] || 0
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      aria-current={active ? 'page' : undefined}
                      className={`
                        group relative w-full flex items-center ${collapsed ? 'justify-center' : 'gap-3'} ${collapsed ? 'px-2' : 'px-3'} py-2.5 rounded-xl text-sm font-medium transition-all
                        ${
                          active
                            ? 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100'
                            : 'text-[#52525B] hover:bg-[#F9FAFB] hover:text-[#18181B] border border-transparent'
                        }
                      `}
                    >
                      {/* Hover glow effect */}
                      <div
                        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                        style={{
                          background: `radial-gradient(circle at center, ${item.color}08 0%, transparent 70%)`,
                          boxShadow: active ? 'none' : undefined,
                        }}
                      />
                      <div className="relative">
                        <item.icon
                          className={`w-4 h-4 transition-colors ${
                            active ? 'text-emerald-600' : 'text-[#71717A] group-hover:text-emerald-600'
                          }`}
                        />
                        {/* Notification dot for Chat & Digest */}
                        {item.hasNotification && unread > 0 && !active && (
                          <motion.span
                            className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                          />
                        )}
                      </div>
                      {!collapsed && (
                        <>
                          {item.label}
                          {active ? (
                            <motion.div
                              className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500"
                              animate={{ opacity: [1, 0.5, 1], scale: [1, 1.3, 1] }}
                              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            />
                          ) : (
                            <span className="ml-auto text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                              {item.shortcut}
                            </span>
                          )}
                          {/* Notification count badge for Chat & Digest */}
                          {item.hasNotification && unread > 0 && !active && (
                            <span className="ml-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                              {unread}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  </TooltipTrigger>
                  {collapsed && (
                    <TooltipContent side="right" className="text-xs">
                      <p className="font-semibold">{item.label}</p>
                      <p className="text-[#A1A1AA] mt-0.5">{item.description}</p>
                    </TooltipContent>
                  )}
                  {!collapsed && (
                    <TooltipContent side="right" className="text-xs hidden lg:block">
                      <p>{item.description}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              )
            })}
          </nav>
        </TooltipProvider>

        {/* ── User Section ──────────────────────────────── */}
        <div className={`shrink-0 border-t border-[#E5E7EB] ${collapsed ? 'p-2' : 'p-4'}`}>
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} mb-3`}>
            {/* Gradient initials avatar */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600 flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0 relative">
              {user?.image ? (
                <Avatar className="w-9 h-9">
                  <AvatarImage src={user.image} alt={user?.name ?? 'User'} />
                  <AvatarFallback className="bg-transparent text-white text-xs font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <span className="text-white text-xs font-bold">{initials}</span>
              )}
              {/* Subtle ring glow */}
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{ boxShadow: ['0 0 0 0 rgba(16,185,129,0)', '0 0 0 4px rgba(16,185,129,0.15)', '0 0 0 0 rgba(16,185,129,0)'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold text-[#18181B] truncate">
                    {user?.name ?? 'Guest'}
                  </p>
                  <ShimmerBadge />
                </div>
                <p className="text-xs text-[#71717A] truncate">
                  {user?.email ?? ''}
                </p>
              </div>
            )}
          </div>
          {!collapsed && (
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={`text-[10px] font-semibold ${badgeClass}`}
              >
                {planLabel}
              </Badge>
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="h-8 w-8 flex items-center justify-center rounded-lg text-[#71717A] hover:bg-[#F9FAFB] dark:hover:bg-white/10 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>
              <motion.button
                onClick={() => signOut()}
                className="ml-auto h-8 flex items-center gap-1.5 px-3 rounded-lg text-xs text-[#71717A] hover:text-red-600 hover:bg-red-50 transition-all relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 bg-red-50/0"
                  whileHover={{ backgroundColor: 'rgba(254,226,226,0.5)' }}
                />
                <LogOut className="w-3.5 h-3.5 relative z-10" />
                <span className="relative z-10">Sign Out</span>
              </motion.button>
            </div>
          )}
          {collapsed && (
            <div className="flex flex-col items-center gap-1.5 mt-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="h-7 w-7 flex items-center justify-center rounded-lg text-[#71717A] hover:bg-[#F9FAFB] dark:hover:bg-white/10 transition-colors"
                    aria-label="Toggle theme"
                  >
                    {theme === 'dark' ? (
                      <Sun className="w-3.5 h-3.5" />
                    ) : (
                      <Moon className="w-3.5 h-3.5" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="text-xs">Toggle theme</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    onClick={() => signOut()}
                    className="h-7 w-7 flex items-center justify-center rounded-lg text-[#71717A] hover:text-red-600 hover:bg-red-50 transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Sign out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent side="right" className="text-xs">Sign Out</TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}

// ─── Search icon for collapsed sidebar ────────────────────
function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}
