'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Network,
  Sun,
  BookOpen,
  Users,
  Settings,
  Keyboard,
  Search,
  HelpCircle,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { useAuth } from '@/hooks/use-auth'

// ─── Shortcut definitions ────────────────────────────────────────
interface ShortcutDef {
  key: string
  label: string
  href: string
  icon: React.ElementType
  category: 'navigation' | 'general'
}

const shortcuts: ShortcutDef[] = [
  { key: 'd', label: 'Dashboard', href: '/app', icon: LayoutDashboard, category: 'navigation' },
  { key: 'g', label: 'Knowledge Graph', href: '/app/graph', icon: Network, category: 'navigation' },
  { key: 'm', label: 'Morning Digest', href: '/app/digest', icon: Sun, category: 'navigation' },
  { key: 'n', label: 'Memory', href: '/app/memory', icon: BookOpen, category: 'navigation' },
  { key: 't', label: 'Team', href: '/app/team', icon: Users, category: 'navigation' },
  { key: 's', label: 'Settings', href: '/app/settings', icon: Settings, category: 'navigation' },
  { key: 'k', label: 'Command Palette', href: '', icon: Search, category: 'general' },
]

// ─── Helper: is user in an editable element? ─────────────────────
function isEditableElement(el: EventTarget | null): boolean {
  if (!el || !(el instanceof HTMLElement)) return false

  const tag = el.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true
  if (el.isContentEditable) return true

  // Also check if inside a cmdk input wrapper
  if (el.closest('[cmdk-input-wrapper]')) return true

  return false
}

// ─── Kbd badge component ─────────────────────────────────────────
function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-md border border-gray-200 bg-gray-50 text-xs font-mono font-medium text-gray-600 shadow-sm">
      {children}
    </kbd>
  )
}

// ─── Animation variants ──────────────────────────────────────────
const gridItemVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.04,
      duration: 0.25,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
  exit: { opacity: 0, y: 6, scale: 0.97, transition: { duration: 0.12 } },
}

const helpButtonVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: { type: 'spring', stiffness: 400, damping: 25, delay: 0.8 },
  },
  hover: { scale: 1.1 },
  tap: { scale: 0.9 },
}

// ─── Main Component ──────────────────────────────────────────────
export function KeyboardShortcuts() {
  const [helpOpen, setHelpOpen] = useState(false)
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  // ── Global keyboard shortcut handler ───────────────────────
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't fire shortcuts when not authenticated
      if (!isAuthenticated) return

      const target = e.target

      // ── ? key for help dialog ────────────────────────────────
      if (e.key === '?' && !isEditableElement(target)) {
        e.preventDefault()
        setHelpOpen((prev) => !prev)
        return
      }

      // ── Cmd/Ctrl + key shortcuts ─────────────────────────────
      if (e.metaKey || e.ctrlKey) {
        const key = e.key.toLowerCase()

        // Skip ⌘K — already handled by CommandPalette
        if (key === 'k') return

        // Don't fire in editable elements
        if (isEditableElement(target)) return

        const shortcut = shortcuts.find((s) => s.key === key && s.category === 'navigation')
        if (shortcut) {
          e.preventDefault()
          router.push(shortcut.href)
        }
      }
    },
    [isAuthenticated, router]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Don't render anything if not authenticated
  if (!isAuthenticated) return null

  const navigationShortcuts = shortcuts.filter((s) => s.category === 'navigation')
  const generalShortcuts = shortcuts.filter((s) => s.category === 'general')

  return (
    <>
      {/* ── Help Button (bottom-left) ─────────────────────────── */}
      <motion.button
        variants={helpButtonVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        whileTap="tap"
        onClick={() => setHelpOpen(true)}
        className="fixed bottom-6 left-6 z-40 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-gray-200 shadow-lg shadow-black/5 flex items-center justify-center text-gray-400 hover:text-emerald-600 hover:border-emerald-200 hover:shadow-xl transition-colors cursor-pointer"
        aria-label="Show keyboard shortcuts"
        title="Keyboard shortcuts (?)"
      >
        <HelpCircle className="w-4.5 h-4.5" />
      </motion.button>

      {/* ── Shortcuts Help Dialog ─────────────────────────────── */}
      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent className="sm:max-w-[520px] p-0 gap-0 overflow-hidden">
          <DialogHeader className="p-6 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Keyboard className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-[#18181B]">
                  Keyboard Shortcuts
                </DialogTitle>
                <DialogDescription className="text-sm text-[#71717A] mt-0.5">
                  Navigate faster with these shortcuts
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
            {/* ── Navigation section ────────────────────────────── */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#71717A] mb-3">
                Navigation
              </h3>
              <div className="grid gap-2">
                <AnimatePresence mode="popLayout">
                  {navigationShortcuts.map((shortcut, i) => (
                    <motion.div
                      key={shortcut.key}
                      custom={i}
                      variants={gridItemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-emerald-50 flex items-center justify-center transition-colors">
                          <shortcut.icon className="w-4 h-4 text-gray-500 group-hover:text-emerald-600 transition-colors" />
                        </div>
                        <span className="text-sm font-medium text-[#18181B]">
                          {shortcut.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Kbd>⌘</Kbd>
                        <Kbd>{shortcut.key.toUpperCase()}</Kbd>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* ── General section ───────────────────────────────── */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#71717A] mb-3">
                General
              </h3>
              <div className="grid gap-2">
                <AnimatePresence mode="popLayout">
                  {generalShortcuts.map((shortcut, i) => (
                    <motion.div
                      key={shortcut.key}
                      custom={i + navigationShortcuts.length}
                      variants={gridItemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-emerald-50 flex items-center justify-center transition-colors">
                          <shortcut.icon className="w-4 h-4 text-gray-500 group-hover:text-emerald-600 transition-colors" />
                        </div>
                        <span className="text-sm font-medium text-[#18181B]">
                          {shortcut.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Kbd>⌘</Kbd>
                        <Kbd>{shortcut.key.toUpperCase()}</Kbd>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Help shortcut (the ? key) */}
                <motion.div
                  custom={generalShortcuts.length + navigationShortcuts.length}
                  variants={gridItemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-emerald-50 flex items-center justify-center transition-colors">
                      <HelpCircle className="w-4 h-4 text-gray-500 group-hover:text-emerald-600 transition-colors" />
                    </div>
                    <span className="text-sm font-medium text-[#18181B]">
                      Show Shortcuts
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Kbd>?</Kbd>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* ── Footer hint ──────────────────────────────────────── */}
          <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50">
            <p className="text-xs text-center text-[#71717A]">
              Use <Kbd className="inline-flex mx-0.5 min-w-0 px-1 h-5 text-[10px]">⌘</Kbd> on Mac or{' '}
              <Kbd className="inline-flex mx-0.5 min-w-0 px-1 h-5 text-[10px]">Ctrl</Kbd> on Windows/Linux
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
