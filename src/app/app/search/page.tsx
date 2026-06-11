'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Network,
  BookOpen,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Clock,
  TrendingUp,
  X,
  Command,
  Loader2,
  Hash,
  Lightbulb,
  Zap,
  Filter,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'

// ═══════════════════════════════════════════════════════════════
// LORE — Global Search Page
// ═══════════════════════════════════════════════════════════════

type SearchType = 'node' | 'note' | 'conversation'
type FilterTab = 'all' | 'nodes' | 'notes' | 'conversations'

interface SearchResult {
  id: string
  type: SearchType
  title: string
  description: string
  href: string
  icon: string
}

interface GroupedResults {
  nodes: SearchResult[]
  notes: SearchResult[]
  conversations: SearchResult[]
}

// ─── Constants ──────────────────────────────────────────────
const POPULAR_SEARCHES = [
  { label: 'Architecture decisions', icon: Network },
  { label: 'Meeting notes', icon: BookOpen },
  { label: 'Project status', icon: TrendingUp },
  { label: 'Key contacts', icon: MessageSquare },
  { label: 'Technical specs', icon: Hash },
  { label: 'AI insights', icon: Sparkles },
]

const RECENT_SEARCHES_KEY = 'lore-recent-searches'

const TYPE_CONFIG: Record<SearchType, {
  label: string
  singular: string
  icon: typeof Network
  color: string
  bgLight: string
  bgDark: string
  borderLight: string
  borderDark: string
  textColor: string
  textColorDark: string
}> = {
  node: {
    label: 'Knowledge Nodes',
    singular: 'Node',
    icon: Network,
    color: '#059669',
    bgLight: 'rgba(5,150,105,0.08)',
    bgDark: 'rgba(5,150,105,0.12)',
    borderLight: 'rgba(5,150,105,0.15)',
    borderDark: 'rgba(5,150,105,0.25)',
    textColor: '#059669',
    textColorDark: '#34D399',
  },
  note: {
    label: 'Notes',
    singular: 'Note',
    icon: BookOpen,
    color: '#0D9488',
    bgLight: 'rgba(13,148,136,0.08)',
    bgDark: 'rgba(13,148,136,0.12)',
    borderLight: 'rgba(13,148,136,0.15)',
    borderDark: 'rgba(13,148,136,0.25)',
    textColor: '#0D9488',
    textColorDark: '#5EEAD4',
  },
  conversation: {
    label: 'Conversations',
    singular: 'Conversation',
    icon: MessageSquare,
    color: '#7C3AED',
    bgLight: 'rgba(124,58,237,0.08)',
    bgDark: 'rgba(124,58,237,0.12)',
    borderLight: 'rgba(124,58,237,0.15)',
    borderDark: 'rgba(124,58,237,0.25)',
    textColor: '#7C3AED',
    textColorDark: '#A78BFA',
  },
}

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'nodes', label: 'Nodes' },
  { key: 'notes', label: 'Notes' },
  { key: 'conversations', label: 'Conversations' },
]

// ─── Animation Variants ─────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
}

const resultItemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
}

// ─── Helpers ────────────────────────────────────────────────
function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveRecentSearch(query: string) {
  if (typeof window === 'undefined') return
  try {
    const existing = getRecentSearches()
    const filtered = existing.filter(s => s !== query)
    const updated = [query, ...filtered].slice(0, 8)
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
  } catch {
    // ignore
  }
}

function clearRecentSearches() {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY)
  } catch {
    // ignore
  }
}

function groupResults(results: SearchResult[]): GroupedResults {
  return {
    nodes: results.filter(r => r.type === 'node'),
    notes: results.filter(r => r.type === 'note'),
    conversations: results.filter(r => r.type === 'conversation'),
  }
}

// ─── Search Skeleton ────────────────────────────────────────
function SearchSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2].map(group => (
        <div key={group}>
          <Skeleton className="h-4 w-32 mb-3 bg-[#E5E7EB] dark:bg-[rgba(255,255,255,0.06)]" />
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-[#0F0F12] border border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)]"
              >
                <Skeleton className="h-9 w-9 rounded-lg bg-[#E5E7EB] dark:bg-[rgba(255,255,255,0.06)]" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-3/4 bg-[#E5E7EB] dark:bg-[rgba(255,255,255,0.06)]" />
                  <Skeleton className="h-3 w-1/2 bg-[#E5E7EB] dark:bg-[rgba(255,255,255,0.06)]" />
                </div>
                <Skeleton className="h-5 w-14 rounded-full bg-[#E5E7EB] dark:bg-[rgba(255,255,255,0.06)]" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Empty State ────────────────────────────────────────────
function SearchEmptyState({ query, onSuggestionClick }: { query: string; onSuggestionClick: (q: string) => void }) {
  const suggestions = [
    'Try broader keywords',
    'Search for a person or concept',
    'Look for notes or meeting summaries',
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-6 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F9FAFB] to-white dark:from-[#18181B] dark:to-[#0F0F12] border border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] flex items-center justify-center mb-5 shadow-sm">
        <Search className="w-7 h-7 text-[#D4D4D8] dark:text-[#52525B]" />
      </div>
      <h3 className="text-lg font-bold text-[#18181B] dark:text-[#FAFAFA] mb-2 tracking-tight">
        No results for &ldquo;{query}&rdquo;
      </h3>
      <p className="text-sm text-[#71717A] dark:text-[#A1A1AA] max-w-md leading-relaxed mb-6">
        We couldn&apos;t find anything matching your search. Try adjusting your query or explore these suggestions:
      </p>
      <div className="flex flex-col sm:flex-row gap-2">
        {suggestions.map(suggestion => (
          <button
            key={suggestion}
            onClick={() => onSuggestionClick(suggestion)}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#52525B] dark:text-[#D4D4D8] bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] hover:border-emerald-300 dark:hover:border-emerald-600 hover:text-emerald-700 dark:hover:text-emerald-400 transition-all"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </motion.div>
  )
}

// ─── Result Card ────────────────────────────────────────────
function ResultCard({ result, index }: { result: SearchResult; index: number }) {
  const router = useRouter()
  const config = TYPE_CONFIG[result.type]
  const IconComp = config.icon

  return (
    <motion.button
      variants={resultItemVariants}
      custom={index}
      onClick={() => router.push(result.href)}
      className="w-full flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-[#0F0F12] border border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] hover:border-emerald-200 dark:hover:border-emerald-600/40 hover:shadow-md hover:shadow-emerald-500/5 transition-all text-left group"
      whileHover={{ x: 4, scale: 1.005 }}
      whileTap={{ scale: 0.995 }}
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
        style={{
          background: `color-mix(in srgb, ${config.color} 10%, transparent)`,
        }}
      >
        <IconComp className="w-4 h-4" style={{ color: config.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#18181B] dark:text-[#FAFAFA] group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors truncate">
          {result.title}
        </p>
        <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] truncate mt-0.5">
          {result.description}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span
          className="text-[10px] px-2 py-0.5 rounded-full font-medium capitalize"
          style={{
            background: `color-mix(in srgb, ${config.color} 8%, transparent)`,
            color: config.color,
            border: `1px solid color-mix(in srgb, ${config.color} 15%, transparent)`,
          }}
        >
          {config.singular}
        </span>
        <ArrowRight className="w-3.5 h-3.5 text-[#D4D4D8] dark:text-[#52525B] group-hover:text-emerald-500 transition-colors" />
      </div>
    </motion.button>
  )
}

// ─── Result Group ───────────────────────────────────────────
function ResultGroup({
  type,
  results,
  visibleCount,
}: {
  type: SearchType
  results: SearchResult[]
  visibleCount: number
}) {
  const config = TYPE_CONFIG[type]
  const IconComp = config.icon
  const visible = results.slice(0, visibleCount)

  if (visible.length === 0) return null

  return (
    <motion.div variants={itemVariants}>
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-6 h-6 rounded-md flex items-center justify-center"
          style={{ background: `color-mix(in srgb, ${config.color} 10%, transparent)` }}
        >
          <IconComp className="w-3.5 h-3.5" style={{ color: config.color }} />
        </div>
        <h3 className="text-xs font-bold text-[#71717A] dark:text-[#A1A1AA] uppercase tracking-wider">
          {config.label}
        </h3>
        <Badge
          className="text-[9px] font-bold h-4 px-1.5 bg-[#F9FAFB] dark:bg-[#18181B] text-[#71717A] dark:text-[#A1A1AA] border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)]"
        >
          {results.length}
        </Badge>
      </div>
      <motion.div
        className="space-y-2"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
      >
        {visible.map((result, i) => (
          <ResultCard key={`${result.type}-${result.id}`} result={result} index={i} />
        ))}
      </motion.div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════
// MAIN SEARCH PAGE
// ═══════════════════════════════════════════════════════════════
export default function SearchPage() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all')
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  // Load recent searches on mount
  useEffect(() => {
    setRecentSearches(getRecentSearches())
  }, [])

  // Focus input on mount
  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 100)
    return () => clearTimeout(timer)
  }, [])

  // ── Debounced search ─────────────────────────────────────
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      setHasSearched(false)
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery.trim())}`)
      if (res.ok) {
        const data = await res.json()
        setResults(data.results || [])
      } else {
        setResults([])
      }
    } catch {
      setResults([])
    } finally {
      setIsSearching(false)
      setHasSearched(true)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (query.trim().length > 0) {
      setIsSearching(true)
      debounceRef.current = setTimeout(() => {
        performSearch(query)
      }, 300)
    } else {
      setResults([])
      setHasSearched(false)
      setIsSearching(false)
    }

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, performSearch])

  // ── Handle search submit ─────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      saveRecentSearch(query.trim())
      setRecentSearches(getRecentSearches())
      performSearch(query)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    saveRecentSearch(suggestion)
    setRecentSearches(getRecentSearches())
    performSearch(suggestion)
  }

  const handleRecentClick = (recent: string) => {
    setQuery(recent)
    performSearch(recent)
  }

  const handleClearQuery = () => {
    setQuery('')
    setResults([])
    setHasSearched(false)
    inputRef.current?.focus()
  }

  const handleClearRecent = () => {
    clearRecentSearches()
    setRecentSearches([])
  }

  // ── Group and filter results ─────────────────────────────
  const grouped = useMemo(() => groupResults(results), [results])

  const filteredGrouped = useMemo(() => {
    switch (activeFilter) {
      case 'nodes': return { nodes: grouped.nodes, notes: [], conversations: [] }
      case 'notes': return { nodes: [], notes: grouped.notes, conversations: [] }
      case 'conversations': return { nodes: [], notes: [], conversations: grouped.conversations }
      default: return grouped
    }
  }, [grouped, activeFilter])

  const totalFiltered = filteredGrouped.nodes.length + filteredGrouped.notes.length + filteredGrouped.conversations.length

  // ── Result count per tab ─────────────────────────────────
  const tabCounts = useMemo(() => ({
    all: results.length,
    nodes: grouped.nodes.length,
    notes: grouped.notes.length,
    conversations: grouped.conversations.length,
  }), [results, grouped])

  const showEmpty = hasSearched && !isSearching && totalFiltered === 0

  return (
    <div className="min-h-full bg-[#F9FAFB] dark:bg-[#0F0F12]">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10"
      >
        {/* ═══ HEADER ═════════════════════════════════════════════ */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <Search className="w-5 h-5 text-white" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#18181B] dark:text-[#FAFAFA] tracking-tight">
            Search Everything
          </h1>
          <p className="text-sm text-[#71717A] dark:text-[#A1A1AA] mt-2">
            Find knowledge nodes, notes, and conversations across your workspace
          </p>
        </motion.div>

        {/* ═══ SEARCH INPUT ═══════════════════════════════════════ */}
        <motion.div variants={itemVariants}>
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative group">
              {/* Glow effect on focus */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-teal-500/10 to-emerald-500/20 dark:from-emerald-500/10 dark:via-teal-500/5 dark:to-emerald-500/10 opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity duration-500" />
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A1A1AA] dark:text-[#71717A] group-focus-within:text-emerald-500 transition-colors pointer-events-none" />
                <Input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search across your knowledge..."
                  className="h-14 pl-12 pr-28 text-base bg-white dark:bg-[#18181B] border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] rounded-2xl focus-visible:ring-emerald-500/30 focus-visible:border-emerald-300 dark:focus-visible:border-emerald-600 placeholder:text-[#A1A1AA] dark:placeholder:text-[#52525B] shadow-sm"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  {query && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      type="button"
                      onClick={handleClearQuery}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-[#A1A1AA] dark:text-[#71717A] hover:text-[#52525B] dark:hover:text-[#A1A1AA] hover:bg-[#F3F4F6] dark:hover:bg-[rgba(255,255,255,0.06)] transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  )}
                  <div className="flex items-center gap-0.5 h-7 px-2 rounded-lg border border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] bg-[#F9FAFB] dark:bg-[#0F0F12] text-[10px] font-medium text-[#A1A1AA] dark:text-[#52525B]">
                    <Command className="w-3 h-3" />
                    <span>K</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </motion.div>

        {/* ═══ FILTER TABS ════════════════════════════════════════ */}
        <AnimatePresence>
          {hasSearched && !isSearching && results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-1.5 mt-5 mb-5 overflow-x-auto pb-1"
            >
              <Filter className="w-3.5 h-3.5 text-[#A1A1AA] dark:text-[#71717A] shrink-0 mr-1" />
              {FILTER_TABS.map(tab => {
                const count = tabCounts[tab.key === 'nodes' ? 'nodes' : tab.key === 'notes' ? 'notes' : tab.key === 'conversations' ? 'conversations' : 'all']
                const isActive = activeFilter === tab.key
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveFilter(tab.key)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                      isActive
                        ? 'bg-emerald-50 dark:bg-[rgba(16,185,129,0.10)] text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-[rgba(16,185,129,0.20)]'
                        : 'bg-white dark:bg-[#18181B] text-[#71717A] dark:text-[#A1A1AA] border border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] hover:border-emerald-200 dark:hover:border-emerald-600/40 hover:text-emerald-700 dark:hover:text-emerald-400'
                    }`}
                  >
                    {tab.label}
                    <span className={`text-[10px] font-bold ${
                      isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#A1A1AA] dark:text-[#52525B]'
                    }`}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ RESULTS AREA ═══════════════════════════════════════ */}
        <div className="mt-2">
          {/* Loading state */}
          {isSearching && <SearchSkeleton />}

          {/* Empty / No results state */}
          {showEmpty && (
            <SearchEmptyState
              query={query}
              onSuggestionClick={handleSuggestionClick}
            />
          )}

          {/* Search results */}
          {hasSearched && !isSearching && totalFiltered > 0 && (
            <motion.div
              className="space-y-6"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            >
              <ResultGroup type="node" results={filteredGrouped.nodes} visibleCount={5} />
              <ResultGroup type="note" results={filteredGrouped.notes} visibleCount={5} />
              <ResultGroup type="conversation" results={filteredGrouped.conversations} visibleCount={3} />
            </motion.div>
          )}

          {/* ═══ INITIAL STATE (before search) ═════════════════════════ */}
          {!hasSearched && !isSearching && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8 mt-4"
            >
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <motion.div variants={itemVariants}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#A1A1AA] dark:text-[#71717A]" />
                      <h3 className="text-xs font-bold text-[#71717A] dark:text-[#A1A1AA] uppercase tracking-wider">
                        Recent Searches
                      </h3>
                    </div>
                    <button
                      onClick={handleClearRecent}
                      className="text-[11px] font-medium text-[#A1A1AA] dark:text-[#52525B] hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map(recent => (
                      <motion.button
                        key={recent}
                        onClick={() => handleRecentClick(recent)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#52525B] dark:text-[#D4D4D8] bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] hover:border-emerald-200 dark:hover:border-emerald-600/40 hover:text-emerald-700 dark:hover:text-emerald-400 transition-all"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Clock className="w-3 h-3 text-[#A1A1AA] dark:text-[#71717A]" />
                        {recent}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Popular Suggestions */}
              <motion.div variants={itemVariants}>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <h3 className="text-xs font-bold text-[#71717A] dark:text-[#A1A1AA] uppercase tracking-wider">
                    Popular Searches
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {POPULAR_SEARCHES.map((suggestion, i) => {
                    const SIcon = suggestion.icon
                    return (
                      <motion.button
                        key={suggestion.label}
                        onClick={() => handleSuggestionClick(suggestion.label)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] hover:border-emerald-200 dark:hover:border-emerald-600/40 hover:shadow-md hover:shadow-emerald-500/5 transition-all text-left group"
                        whileHover={{ scale: 1.01, x: 4 }}
                        whileTap={{ scale: 0.99 }}
                        custom={i}
                        variants={resultItemVariants}
                      >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-[rgba(16,185,129,0.08)] dark:to-[rgba(13,148,136,0.08)] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          <SIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <span className="text-sm font-medium text-[#52525B] dark:text-[#D4D4D8] group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                          {suggestion.label}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#D4D4D8] dark:text-[#52525B] group-hover:text-emerald-500 ml-auto transition-colors" />
                      </motion.button>
                    )
                  })}
                </div>
              </motion.div>

              {/* Quick Tips */}
              <motion.div variants={itemVariants}>
                <Card className="bg-gradient-to-r from-emerald-50/80 to-teal-50/60 dark:from-[rgba(16,185,129,0.06)] dark:to-[rgba(13,148,136,0.04)] border-emerald-200/60 dark:border-[rgba(16,185,129,0.12)]">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-[rgba(16,185,129,0.12)] flex items-center justify-center shrink-0 mt-0.5">
                        <Lightbulb className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider mb-1">
                          Search Tips
                        </p>
                        <ul className="space-y-1">
                          <li className="text-xs text-emerald-900/70 dark:text-emerald-200/70 flex items-center gap-1.5">
                            <Zap className="w-3 h-3 shrink-0" />
                            Search in real-time as you type
                          </li>
                          <li className="text-xs text-emerald-900/70 dark:text-emerald-200/70 flex items-center gap-1.5">
                            <Zap className="w-3 h-3 shrink-0" />
                            Filter by type using the tabs above results
                          </li>
                          <li className="text-xs text-emerald-900/70 dark:text-emerald-200/70 flex items-center gap-1.5">
                            <Zap className="w-3 h-3 shrink-0" />
                            Press <kbd className="inline-flex h-4 items-center px-1 rounded border border-emerald-300/50 dark:border-emerald-600/30 bg-white/50 dark:bg-[rgba(255,255,255,0.05)] text-[9px] font-mono">⌘K</kbd> for quick search from anywhere
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
