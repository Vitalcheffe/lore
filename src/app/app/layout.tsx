'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import { AppSidebar } from '@/components/app/sidebar'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isAuthenticated, isLoading } = useAuth()

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex">
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

        {/* ── Content ────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full min-h-[60vh]">
              <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                <p className="text-sm text-[#71717A]">Loading...</p>
              </div>
            </div>
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
            children
          )}
        </div>
      </main>
    </div>
  )
}
