'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain,
  LayoutDashboard,
  Network,
  Sun,
  MessageSquare,
  BookOpen,
  Settings,
  LogOut,
  X,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/hooks/use-auth'

// ─── Navigation Items ──────────────────────────────────────
const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/app' },
  { label: 'Knowledge Graph', icon: Network, href: '/app/graph' },
  { label: 'Morning Digest', icon: Sun, href: '/app/digest' },
  { label: 'AI Chat', icon: MessageSquare, href: '/app/chat' },
  { label: 'Memory', icon: BookOpen, href: '/app/memory' },
  { label: 'Settings', icon: Settings, href: '/app/settings' },
]

// ─── Plan badge styles ──────────────────────────────────────
const planBadgeStyles: Record<string, string> = {
  free: 'text-zinc-600 border-zinc-200 bg-zinc-50/50',
  pro: 'text-emerald-700 border-emerald-200 bg-emerald-50/50',
  enterprise: 'text-violet-700 border-violet-200 bg-violet-50/50',
}

// ─── Props ─────────────────────────────────────────────────
interface AppSidebarProps {
  isOpen: boolean
  onClose: () => void
}

// ─── Main Component ────────────────────────────────────────
export function AppSidebar({ isOpen, onClose }: AppSidebarProps) {
  const pathname = usePathname()
  const { user, signOut } = useAuth()

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
          w-[260px] bg-white border-r border-[#E5E7EB]
          flex flex-col
          transform transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* ── Logo Section ──────────────────────────────── */}
        <div className="h-16 flex items-center gap-2.5 px-6 border-b border-[#E5E7EB] shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
            onClick={onClose}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-[#18181B] group-hover:text-emerald-700 transition-colors">
              LORE
            </span>
          </Link>
          <Badge
            variant="secondary"
            className="ml-auto text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-50"
          >
            BETA
          </Badge>
          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors ml-1"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* ── Navigation ────────────────────────────────── */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${
                    active
                      ? 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100'
                      : 'text-[#52525B] hover:bg-[#F9FAFB] hover:text-[#18181B] border border-transparent'
                  }
                `}
              >
                <item.icon
                  className={`w-4 h-4 ${
                    active ? 'text-emerald-600' : 'text-[#71717A]'
                  }`}
                />
                {item.label}
                {active && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* ── User Section ──────────────────────────────── */}
        <div className="shrink-0 border-t border-[#E5E7EB] p-4">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="w-9 h-9">
              <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? 'User'} />
              <AvatarFallback className="bg-emerald-50 text-emerald-700 text-xs font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#18181B] truncate">
                {user?.name ?? 'Guest'}
              </p>
              <p className="text-xs text-[#71717A] truncate">
                {user?.email ?? ''}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`text-[10px] font-semibold ${badgeClass}`}
            >
              {planLabel}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut()}
              className="ml-auto h-8 text-xs text-[#71717A] hover:text-red-600 hover:bg-red-50 gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
