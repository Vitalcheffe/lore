'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain,
  LayoutDashboard,
  Network,
  Sun,
  MessageSquare,
  BookOpen,
  Users,
  Settings,
  Plus,
  StickyNote,
  Sparkles,
  Search,
} from 'lucide-react'
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command'

// ─── Types ──────────────────────────────────────────────────────
interface NavItem {
  label: string
  icon: React.ElementType
  href: string
  shortcut?: string
}

interface ActionItem {
  label: string
  icon: React.ElementType
  href: string
  description: string
}

interface NodeItem {
  id: string
  title: string
  type: string
}

interface NoteItem {
  id: string
  title: string
  type: string
}

interface ConversationItem {
  id: string
  title: string
  preview?: string
}

// ─── Static Data ────────────────────────────────────────────────
const navigationItems: NavItem[] = [
  { label: 'Go to Dashboard', icon: LayoutDashboard, href: '/app', shortcut: '⌘D' },
  { label: 'Go to Knowledge Graph', icon: Network, href: '/app/graph', shortcut: '⌘G' },
  { label: 'Go to Morning Digest', icon: Sun, href: '/app/digest', shortcut: '⌘M' },
  { label: 'Go to AI Chat', icon: MessageSquare, href: '/app/chat', shortcut: '⌘K' },
  { label: 'Go to Memory', icon: BookOpen, href: '/app/memory', shortcut: '⌘N' },
  { label: 'Go to Team', icon: Users, href: '/app/team', shortcut: '⌘T' },
  { label: 'Go to Settings', icon: Settings, href: '/app/settings', shortcut: '⌘S' },
]

const actionItems: ActionItem[] = [
  { label: 'Add Knowledge Node', icon: Plus, href: '/app/graph', description: 'Create a new node in the knowledge graph' },
  { label: 'Create Note', icon: StickyNote, href: '/app/memory', description: 'Write a new note' },
  { label: 'Start New Chat', icon: MessageSquare, href: '/app/chat', description: 'Begin a new AI conversation' },
  { label: 'Generate Digest', icon: Sparkles, href: '/app/digest', description: 'Generate your morning digest' },
  { label: 'Open Settings', icon: Settings, href: '/app/settings', description: 'Manage your preferences' },
]

// ─── Animation Variants ─────────────────────────────────────────
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0, transition: { duration: 0.15 } },
}

const contentVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 500, damping: 35 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -8,
    transition: { duration: 0.12 },
  },
}

// ─── Main Component ─────────────────────────────────────────────
export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [nodes, setNodes] = useState<NodeItem[]>([])
  const [notes, setNotes] = useState<NoteItem[]>([])
  const [conversations, setConversations] = useState<ConversationItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // ── Keyboard shortcut: Cmd+K / Ctrl+K ──────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // ── Focus input when opening ───────────────────────────────
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        const input = document.querySelector('[cmdk-input]') as HTMLInputElement | null
        input?.focus()
      }, 80)
      return () => clearTimeout(timer)
    }
  }, [open])

  // ── Lock body scroll when open ─────────────────────────────
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // ── Fetch dynamic data when palette opens ──────────────────
  useEffect(() => {
    if (!open) return

    let cancelled = false
    setIsLoading(true)

    async function fetchData() {
      try {
        const [nodesRes, notesRes, convosRes] = await Promise.allSettled([
          fetch('/api/nodes'),
          fetch('/api/notes'),
          fetch('/api/conversations'),
        ])

        if (cancelled) return

        if (nodesRes.status === 'fulfilled' && nodesRes.value.ok) {
          const data = await nodesRes.value.json()
          setNodes((data.nodes ?? []).slice(0, 10))
        }
        if (notesRes.status === 'fulfilled' && notesRes.value.ok) {
          const data = await notesRes.value.json()
          setNotes((data.notes ?? []).slice(0, 10))
        }
        if (convosRes.status === 'fulfilled' && convosRes.value.ok) {
          const data = await convosRes.value.json()
          setConversations((data.conversations ?? []).slice(0, 10))
        }
      } catch {
        // Silently fail — palette still works with nav & actions
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetchData()
    return () => { cancelled = true }
  }, [open])

  // ── Navigate on select ─────────────────────────────────────
  const runCommand = useCallback(
    (command: () => void) => {
      setOpen(false)
      command()
    },
    []
  )

  return (
    <>
      {/* ── Floating trigger hint ─────────────────────────────── */}
      <motion.button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-white/90 backdrop-blur-md border border-gray-200 shadow-lg shadow-black/5 text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:shadow-xl transition-colors cursor-pointer group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open command palette"
      >
        <Search className="w-3.5 h-3.5 transition-colors group-hover:text-emerald-600" />
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded border border-gray-200 bg-gray-50 px-1.5 font-mono text-[11px] font-medium text-gray-500 transition-colors group-hover:border-gray-300 group-hover:text-gray-600">
          <span className="text-xs">⌘</span>K
        </kbd>
      </motion.button>

      {/* ── Command Palette Overlay ───────────────────────────── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay backdrop */}
            <motion.div
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />

            {/* Command palette panel */}
            <motion.div
              className="fixed inset-x-0 top-0 z-50 flex justify-center pt-[15vh] px-4"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              role="dialog"
              aria-modal="true"
              aria-label="Command Palette"
            >
              <div className="w-full max-w-[560px] rounded-xl border border-gray-200/80 bg-white shadow-2xl overflow-hidden">
                <Command className="[&_[cmdk-group-heading]]:text-muted-foreground **:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
                  <CommandInput placeholder="Search commands, pages, knowledge…" />
                  <CommandList className="max-h-[420px]">
                    <CommandEmpty>
                      {isLoading ? 'Loading…' : 'No results found.'}
                    </CommandEmpty>

                    {/* ── Navigation ─────────────────────────── */}
                    <CommandGroup heading="Navigation">
                      {navigationItems.map((item) => (
                        <CommandItem
                          key={item.href}
                          value={`nav-${item.label}`}
                          onSelect={() =>
                            runCommand(() => router.push(item.href))
                          }
                        >
                          <item.icon className="w-4 h-4 text-gray-400" />
                          <span>{item.label}</span>
                          {item.shortcut && (
                            <span className="ml-auto text-xs text-gray-400 font-mono">
                              {item.shortcut}
                            </span>
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>

                    {/* ── Actions ─────────────────────────────── */}
                    <CommandGroup heading="Actions">
                      {actionItems.map((item) => (
                        <CommandItem
                          key={item.label}
                          value={`action-${item.label}`}
                          onSelect={() =>
                            runCommand(() => router.push(item.href))
                          }
                        >
                          <item.icon className="w-4 h-4 text-emerald-500" />
                          <span>{item.label}</span>
                          <span className="ml-auto text-xs text-gray-400 truncate max-w-[180px]">
                            {item.description}
                          </span>
                        </CommandItem>
                      ))}
                    </CommandGroup>

                    {/* ── Knowledge Nodes ─────────────────────── */}
                    {nodes.length > 0 && (
                      <CommandGroup heading="Knowledge Nodes">
                        {nodes.map((node) => (
                          <CommandItem
                            key={node.id}
                            value={`node-${node.title}`}
                            onSelect={() =>
                              runCommand(() => router.push('/app/graph'))
                            }
                          >
                            <Brain className="w-4 h-4 text-violet-500" />
                            <span>{node.title}</span>
                            <span className="ml-auto text-[11px] text-gray-400 capitalize">
                              {node.type}
                            </span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}

                    {/* ── Notes ───────────────────────────────── */}
                    {notes.length > 0 && (
                      <CommandGroup heading="Notes">
                        {notes.map((note) => (
                          <CommandItem
                            key={note.id}
                            value={`note-${note.title}`}
                            onSelect={() =>
                              runCommand(() => router.push('/app/memory'))
                            }
                          >
                            <StickyNote className="w-4 h-4 text-amber-500" />
                            <span>{note.title}</span>
                            <span className="ml-auto text-[11px] text-gray-400 capitalize">
                              {note.type}
                            </span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}

                    {/* ── Conversations ───────────────────────── */}
                    {conversations.length > 0 && (
                      <CommandGroup heading="Conversations">
                        {conversations.map((conv) => (
                          <CommandItem
                            key={conv.id}
                            value={`conv-${conv.title}`}
                            onSelect={() =>
                              runCommand(() => router.push('/app/chat'))
                            }
                          >
                            <MessageSquare className="w-4 h-4 text-sky-500" />
                            <span className="truncate max-w-[300px]">
                              {conv.title}
                            </span>
                            {conv.preview && (
                              <span className="ml-auto text-[11px] text-gray-400 truncate max-w-[140px]">
                                {conv.preview}
                              </span>
                            )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
