'use client'

import { useState } from 'react'
import { Menu, MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { AppSidebar } from '@/components/app/sidebar'
import { CommandPalette } from '@/components/app/command-palette'
import { KeyboardShortcuts } from '@/components/app/keyboard-shortcuts'
import { ShortcutHelp } from '@/components/app/shortcut-help'
import { OnboardingModal } from '@/components/app/onboarding-modal'
import { PageTransition } from '@/components/app/page-transition'
import { LoadingBar } from '@/components/app/loading-bar'
import { PageSkeleton, type PageSkeletonVariant } from '@/components/app/page-skeleton'
import { NotificationCenter } from '@/components/app/notification-center'
import { AchievementPopup } from '@/components/app/achievements'
import { useAchievementStore } from '@/stores/achievement-store'
import { useAuth } from '@/hooks/use-auth'
import { ErrorBoundary } from '@/components/app/error-boundary'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'

// Map pathname to skeleton variant
function getSkeletonVariant(pathname: string): PageSkeletonVariant {
  if (pathname === '/app') return 'dashboard'
  if (pathname.startsWith('/app/graph')) return 'graph'
  if (pathname.startsWith('/app/chat')) return 'chat'
  if (pathname.startsWith('/app/memory')) return 'memory'
  if (pathname.startsWith('/app/digest')) return 'digest'
  if (pathname.startsWith('/app/settings')) return 'settings'
  if (pathname.startsWith('/app/team')) return 'team'
  return 'dashboard'
}

// Map pathname to page title
function getPageTitle(pathname: string): string {
  if (pathname === '/app') return 'Dashboard'
  if (pathname.startsWith('/app/graph')) return 'Knowledge Graph'
  if (pathname.startsWith('/app/chat')) return 'AI Chat'
  if (pathname.startsWith('/app/memory')) return 'Memory'
  if (pathname.startsWith('/app/digest')) return 'Morning Digest'
  if (pathname.startsWith('/app/settings')) return 'Settings'
  if (pathname.startsWith('/app/team')) return 'Team'
  return 'Lore'
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { currentAchievement, clearAchievement } = useAchievementStore()
  const { isAuthenticated, isLoading, user } = useAuth()
  const pathname = usePathname()
  const skeletonVariant = getSkeletonVariant(pathname)
  const pageTitle = getPageTitle(pathname)

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '??'

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex">
      <LoadingBar />
      {/* ── Sidebar ──────────────────────────────────────── */}
      <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* ── Main Content Area ────────────────────────────── */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* ── Top bar (mobile hamburger) ─────────────────── */}
        <div className="h-14 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-4 lg:px-6 shrink-0 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="w-9 h-9"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5 text-[#52525B]" />
          </Button>
          <span className="text-sm font-bold text-[#18181B]">LORE</span>
          <div className="w-9" /> {/* Spacer for centering */}
        </div>

        {/* ── Desktop Header Bar ──────────────────────────── */}
        <div className="hidden lg:flex h-14 bg-white border-b border-[#E5E7EB] items-center justify-between px-6 shrink-0">
          <h1 className="text-sm font-bold text-[#18181B]">{pageTitle}</h1>
          <div className="flex items-center gap-3">
            <NotificationCenter />
            <Separator orientation="vertical" className="h-5 bg-[#E5E7EB]" />
            <Avatar className="w-8 h-8">
              <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? 'User'} />
              <AvatarFallback className="bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* ── Content ────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <PageSkeleton variant={skeletonVariant} />
          ) : !isAuthenticated ? (
            <div className="flex items-center justify-center h-full min-h-[60vh] p-6">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-6">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="14" stroke="#059669" strokeWidth="2" strokeDasharray="4 3" />
                    <path d="M12 16L15 19L20 13" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-[#18181B] mb-2">
                  Sign in to access your workspace
                </h2>
                <p className="text-sm text-[#71717A] mb-6">
                  LORE keeps your team&apos;s memory structured, consistent, and available everywhere. Sign in to get started.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center h-10 px-6 text-sm font-semibold bg-gradient-to-r from-emerald-500 to-emerald-700 text-white rounded-xl shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center h-10 px-6 text-sm font-semibold bg-white text-[#18181B] border border-[#E5E7EB] rounded-xl hover:border-emerald-200 hover:bg-emerald-50/50 transition-all"
                  >
                    Create Account
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <ErrorBoundary>
              <PageTransition>{children}</PageTransition>
              <CommandPalette />
              <KeyboardShortcuts />
              <ShortcutHelp />
              <OnboardingModal />
              <AchievementPopup achievement={currentAchievement} onClose={clearAchievement} />
            </ErrorBoundary>
          )}
        </div>
      </main>

      {/* ── Floating Feedback Button (desktop only) ─────── */}
      {isAuthenticated && (
        <div className="hidden lg:block fixed bottom-6 right-6 z-40">
          <motion.a
            href="mailto:feedback@lore.app"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="group relative flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/35 transition-shadow"
            aria-label="Send feedback"
          >
            <MessageCircle className="w-5 h-5" />
            {/* Tooltip */}
            <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-[#18181B] px-2.5 py-1 text-[11px] font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
              Feedback
              <span className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-[#18181B]" />
            </span>
          </motion.a>
        </div>
      )}
    </div>
  )
}
