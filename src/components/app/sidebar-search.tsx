'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Brain,
  StickyNote,
  MessageSquare,
  Network,
} from 'lucide-react'
import { Input } from '@/components/ui/input'

// ─── Types ──────────────────────────────────────────────────
interface SearchResult {
  id: string
  title: string
  type: 'node' | 'note' | 'conversation'
  subtitle?: string
  href: string
  icon: typeof Brain
  iconColor: string
  iconBg: string
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

// ─── Group config ──────────────────────────────────────────
const groupConfig: Record<string, { label: string; order: number }> = {
  node: { label: 'Knowledge Nodes', order: 0 },
  note: { label: 'Notes', order: 1 },
  conversation: { label: 'Conversations', order: 2 },
}

// ─── Main Component ────────────────────────────────────────
export function SidebarSearch() {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [allNodes, setAllNodes] = useState<NodeItem[]>([])
  const [allNotes, setAllNotes] = useState<NoteItem[]>([])
  const [allConversations, setAllConversations] = useState<ConversationItem[]>([])
  const [dataLoaded, setDataLoaded] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const router = useRouter()

  const showDropdown = isFocused && query.trim().length > 0

  // ── Fetch data once when component mounts ────────────────
  useEffect(() => {
    if (dataLoaded) return

    async function fetchData() {
      try {
        const [nodesRes, notesRes, convosRes] = await Promise.allSettled([
          fetch('/api/nodes'),
          fetch('/api/notes'),
          fetch('/api/conversations'),
        ])

        if (nodesRes.status === 'fulfilled' && nodesRes.value.ok) {
          const data = await nodesRes.value.json()
          setAllNodes(data.nodes ?? [])
        }
        if (notesRes.status === 'fulfilled' && notesRes.value.ok) {
          const data = await notesRes.value.json()
          setAllNotes(data.notes ?? [])
        }
        if (convosRes.status === 'fulfilled' && convosRes.value.ok) {
          const data = await convosRes.value.json()
          setAllConversations(data.conversations ?? [])
        }
      } catch {
        // Silently fail
      } finally {
        setDataLoaded(true)
      }
    }

    fetchData()
  }, [dataLoaded])

  // ── Debounced search ─────────────────────────────────────
  const performSearch = useCallback(
    (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([])
        setIsSearching(false)
        return
      }

      const q = searchQuery.toLowerCase().trim()
      const matched: SearchResult[] = []

      // Filter nodes
      for (const node of allNodes) {
        if (node.title.toLowerCase().includes(q)) {
          matched.push({
            id: node.id,
            title: node.title,
            type: 'node',
            subtitle: node.type,
            href: '/app/graph',
            icon: Brain,
            iconColor: 'text-violet-500',
            iconBg: 'bg-violet-50',
          })
        }
        if (matched.filter((r) => r.type === 'node').length >= 5) break
      }

      // Filter notes
      for (const note of allNotes) {
        if (note.title.toLowerCase().includes(q)) {
          matched.push({
            id: note.id,
            title: note.title,
            type: 'note',
            subtitle: note.type,
            href: '/app/memory',
            icon: StickyNote,
            iconColor: 'text-amber-500',
            iconBg: 'bg-amber-50',
          })
        }
        if (matched.filter((r) => r.type === 'note').length >= 5) break
      }

      // Filter conversations
      for (const conv of allConversations) {
        if (conv.title.toLowerCase().includes(q)) {
          matched.push({
            id: conv.id,
            title: conv.title,
            type: 'conversation',
            subtitle: conv.preview,
            href: '/app/chat',
            icon: MessageSquare,
            iconColor: 'text-sky-500',
            iconBg: 'bg-sky-50',
          })
        }
        if (matched.filter((r) => r.type === 'conversation').length >= 5) break
      }

      setResults(matched)
      setIsSearching(false)
    },
    [allNodes, allNotes, allConversations]
  )

  // ── Debounce input ───────────────────────────────────────
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (query.trim().length > 0) {
      setIsSearching(true)
      debounceRef.current = setTimeout(() => {
        performSearch(query)
      }, 300)
    } else {
      setResults([])
      setIsSearching(false)
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [query, performSearch])

  // ── Click outside to close ───────────────────────────────
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // ── Handle result click ──────────────────────────────────
  const handleResultClick = (href: string) => {
    setQuery('')
    setIsFocused(false)
    router.push(href)
  }

  // ── Open command palette via keyboard event ──────────────
  const openCommandPalette = () => {
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      metaKey: true,
      ctrlKey: true,
      bubbles: true,
    })
    document.dispatchEvent(event)
  }

  // ── Group results by type ────────────────────────────────
  const groupedResults = results.reduce<
    Record<string, SearchResult[]>
  >((acc, result) => {
    if (!acc[result.type]) acc[result.type] = []
    acc[result.type].push(result)
    return acc
  }, {})

  const sortedGroups = Object.entries(groupedResults).sort(
    ([a], [b]) =>
      (groupConfig[a]?.order ?? 99) - (groupConfig[b]?.order ?? 99)
  )

  return (
    <div ref={containerRef} className="relative px-4 pt-3 pb-1">
      {/* ── Search Input ──────────────────────────────────────── */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#A1A1AA] pointer-events-none" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          className="h-8 pl-8 pr-12 text-xs bg-[#F9FAFB] border-[#E5E7EB] rounded-lg focus-visible:ring-emerald-500/20 focus-visible:border-emerald-300 placeholder:text-[#A1A1AA]"
        />
        {/* ⌘K badge */}
        <button
          type="button"
          onClick={openCommandPalette}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 h-5 px-1.5 rounded border border-[#E5E7EB] bg-white text-[10px] font-medium text-[#A1A1AA] hover:text-[#71717A] hover:border-[#D4D4D8] transition-colors cursor-pointer"
          aria-label="Open command palette"
        >
          <span className="font-sans text-[9px]">⌘</span>
          <span className="text-[10px]">K</span>
        </button>
      </div>

      {/* ── Search Results Dropdown ───────────────────────────── */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute left-4 right-4 top-[calc(100%-4px)] z-50 bg-white rounded-xl border border-[#E5E7EB] shadow-lg shadow-black/5 overflow-hidden"
          >
            <div className="max-h-72 overflow-y-auto">
              {isSearching ? (
                <div className="flex items-center justify-center py-6">
                  <div className="w-4 h-4 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                  <span className="ml-2 text-xs text-[#A1A1AA]">
                    Searching...
                  </span>
                </div>
              ) : results.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6">
                  <Search className="w-5 h-5 text-[#D4D4D8] mb-1.5" />
                  <p className="text-xs text-[#A1A1AA]">
                    No results for &ldquo;{query}&rdquo;
                  </p>
                </div>
              ) : (
                sortedGroups.map(([type, items]) => (
                  <div key={type}>
                    {/* Group label */}
                    <div className="px-3 pt-2.5 pb-1">
                      <span className="text-[10px] font-semibold text-[#A1A1AA] uppercase tracking-wider">
                        {groupConfig[type]?.label ?? type}
                      </span>
                    </div>
                    {/* Group items */}
                    {items.map((item) => (
                      <button
                        key={`${item.type}-${item.id}`}
                        type="button"
                        onClick={() => handleResultClick(item.href)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-[#F9FAFB] transition-colors"
                      >
                        <div
                          className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${item.iconBg}`}
                        >
                          <item.icon
                            className={`w-3 h-3 ${item.iconColor}`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-[#18181B] truncate">
                            {item.title}
                          </p>
                          {item.subtitle && (
                            <p className="text-[10px] text-[#A1A1AA] truncate capitalize">
                              {item.subtitle}
                            </p>
                          )}
                        </div>
                        <Network className="w-3 h-3 text-[#D4D4D8] shrink-0" />
                      </button>
                    ))}
                  </div>
                ))
              )}
            </div>

            {/* Footer hint */}
            <div className="border-t border-[#F3F4F6] px-3 py-2 flex items-center justify-between">
              <span className="text-[10px] text-[#A1A1AA]">
                {results.length} result{results.length !== 1 ? 's' : ''}
              </span>
              <span className="text-[10px] text-[#A1A1AA]">
                Press{' '}
                <kbd className="inline-flex h-4 items-center px-1 rounded border border-[#E5E7EB] bg-white text-[9px] font-mono">
                  ⌘K
                </kbd>{' '}
                for full search
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
