'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import {
  Search,
  Plus,
  LayoutGrid,
  List,
  Pin,
  ExternalLink,
  X,
  FileText,
  Bookmark,
  Lightbulb,
  Code2,
  Users,
  Sparkles,
  Filter,
  Loader2,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// ─── Types ─────────────────────────────────────────────────
type NoteType = 'note' | 'bookmark' | 'insight' | 'snippet' | 'meeting' | 'idea'
type ViewMode = 'grid' | 'list'

interface Note {
  id: string
  title: string
  type: NoteType
  category: string
  content: string
  tags: string[]
  pinned: boolean
  updatedAt: string
  color: string
  sourceUrl?: string
}

// API note shape from the backend
interface ApiNote {
  id: string
  userId: string
  title: string
  content: string
  type: string
  category: string | null
  tags: string | null
  pinned: boolean
  aiSummary: string | null
  sourceUrl: string | null
  createdAt: string
  updatedAt: string
}

// ─── Type Config ───────────────────────────────────────────
const typeConfig: Record<NoteType, { label: string; color: string; bgColor: string; icon: typeof FileText }> = {
  note: { label: 'Note', color: '#059669', bgColor: 'rgba(5,150,105,0.08)', icon: FileText },
  bookmark: { label: 'Bookmark', color: '#EA580C', bgColor: 'rgba(234,88,12,0.08)', icon: Bookmark },
  insight: { label: 'Insight', color: '#3B82F6', bgColor: 'rgba(59,130,246,0.08)', icon: Lightbulb },
  snippet: { label: 'Snippet', color: '#7C3AED', bgColor: 'rgba(124,58,237,0.08)', icon: Code2 },
  meeting: { label: 'Meeting', color: '#0D9488', bgColor: 'rgba(13,148,136,0.08)', icon: Users },
  idea: { label: 'Idea', color: '#DB2777', bgColor: 'rgba(219,39,119,0.08)', icon: Sparkles },
}

// ─── Helpers ───────────────────────────────────────────────
function apiNoteToNote(apiNote: ApiNote): Note {
  const noteType = (apiNote.type || 'note') as NoteType
  const config = typeConfig[noteType] || typeConfig.note
  return {
    id: apiNote.id,
    title: apiNote.title,
    type: noteType,
    category: apiNote.category || 'Uncategorized',
    content: apiNote.content || '',
    tags: apiNote.tags ? apiNote.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    pinned: apiNote.pinned || false,
    updatedAt: formatDistanceToNow(new Date(apiNote.updatedAt), { addSuffix: true }),
    color: config.color,
    sourceUrl: apiNote.sourceUrl || undefined,
  }
}

const categoryEmojis: Record<string, string> = {
  Projects: '🏗️',
  Ideas: '💡',
  Resources: '📚',
  'Meeting Notes': '📋',
  Uncategorized: '📂',
}

function getCategoryEmoji(category: string): string {
  return categoryEmojis[category] || '📝'
}

// ─── Animation Variants ────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

// ─── Type Filter Options ───────────────────────────────────
const typeFilters: Array<{ value: string; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'note', label: 'Notes' },
  { value: 'bookmark', label: 'Bookmarks' },
  { value: 'insight', label: 'Insights' },
  { value: 'snippet', label: 'Snippets' },
  { value: 'meeting', label: 'Meetings' },
]

// ═══════════════════════════════════════════════════════════════
// MAIN MEMORY PAGE
// ═══════════════════════════════════════════════════════════════
export default function MemoryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [selectedCategory, setSelectedCategory] = useState('All Notes')
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [newNoteOpen, setNewNoteOpen] = useState(false)
  const [detailNote, setDetailNote] = useState<Note | null>(null)
  const [creating, setCreating] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // New note form state
  const [newTitle, setNewTitle] = useState('')
  const [newType, setNewType] = useState<NoteType>('note')
  const [newCategory, setNewCategory] = useState('')
  const [newContent, setNewContent] = useState('')
  const [newTags, setNewTags] = useState('')

  // ─── Fetch notes on mount ────────────────────────────────
  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/notes')
      if (!res.ok) throw new Error('Failed to fetch notes')
      const data = await res.json()
      const mapped: Note[] = (data.notes || []).map(apiNoteToNote)
      setNotes(mapped)
    } catch (err) {
      console.error('Failed to fetch notes:', err)
      setNotes([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNotes()
  }, [fetchNotes])

  // ─── Dynamic categories ──────────────────────────────────
  const categories = useMemo(() => {
    const catCounts: Record<string, number> = {}
    let pinnedCount = 0

    for (const note of notes) {
      const cat = note.category || 'Uncategorized'
      catCounts[cat] = (catCounts[cat] || 0) + 1
      if (note.pinned) pinnedCount++
    }

    const dynamicCategories = [
      { name: 'All Notes', emoji: '📝', count: notes.length },
    ]

    // Add categories sorted by count descending
    const sortedCats = Object.entries(catCounts).sort((a, b) => b[1] - a[1])
    for (const [name, count] of sortedCats) {
      dynamicCategories.push({
        name,
        emoji: getCategoryEmoji(name),
        count,
      })
    }

    // Favorites (pinned)
    dynamicCategories.push({ name: 'Favorites', emoji: '⭐', count: pinnedCount })

    return dynamicCategories
  }, [notes])

  // ─── Filtered notes ──────────────────────────────────────
  const filteredNotes = useMemo(() => {
    let result = [...notes]

    // Category filter
    if (selectedCategory !== 'All Notes') {
      if (selectedCategory === 'Favorites') {
        result = result.filter((n) => n.pinned)
      } else {
        result = result.filter((n) => n.category === selectedCategory)
      }
    }

    // Type filter
    if (typeFilter !== 'all') {
      result = result.filter((n) => n.type === typeFilter)
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          n.tags.some((t) => t.toLowerCase().includes(q))
      )
    }

    // Pinned first, then by recency
    result.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      return 0
    })

    return result
  }, [notes, selectedCategory, typeFilter, searchQuery])

  // ─── Create note via API ─────────────────────────────────
  const handleCreateNote = async () => {
    if (!newTitle.trim()) return

    setCreating(true)
    try {
      const tagsArray = newTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle.trim(),
          type: newType,
          category: newCategory.trim() || 'Ideas',
          content: newContent.trim(),
          tags: tagsArray.join(','),
          pinned: false,
          sourceUrl: newType === 'bookmark' ? newContent.trim() : undefined,
        }),
      })

      if (!res.ok) throw new Error('Failed to create note')
      const data = await res.json()
      const createdNote = apiNoteToNote(data.note)

      setNotes([createdNote, ...notes])
      setNewTitle('')
      setNewType('note')
      setNewCategory('')
      setNewContent('')
      setNewTags('')
      setNewNoteOpen(false)
    } catch (err) {
      console.error('Failed to create note:', err)
    } finally {
      setCreating(false)
    }
  }

  // ─── Delete note via API ─────────────────────────────────
  const handleDeleteNote = async (id: string) => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete note')
      setNotes(notes.filter((n) => n.id !== id))
      setDetailNote(null)
    } catch (err) {
      console.error('Failed to delete note:', err)
    } finally {
      setDeleting(false)
    }
  }

  // ─── Toggle pin via API (PUT) ────────────────────────────
  const handleTogglePin = async (note: Note) => {
    try {
      const res = await fetch(`/api/notes/${note.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pinned: !note.pinned }),
      })

      if (!res.ok) throw new Error('Failed to update note')
      const data = await res.json()
      const updatedNote = apiNoteToNote(data.note)

      setNotes(notes.map((n) => (n.id === note.id ? updatedNote : n)))
      if (detailNote?.id === note.id) {
        setDetailNote(updatedNote)
      }
    } catch (err) {
      console.error('Failed to toggle pin:', err)
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* ═══════════════════════════════════════════════════════
          TOP BAR
          ═══════════════════════════════════════════════════════ */}
      <div className="bg-white border-b border-[#E5E7EB] px-4 sm:px-6 lg:px-8 py-4 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
            <Input
              placeholder="Search notes, bookmarks, insights..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 border-[#E5E7EB] bg-[#F9FAFB] focus-visible:ring-emerald-500/30 focus-visible:border-emerald-300 h-9"
            />
          </div>

          {/* Type Filters */}
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 sm:pb-0">
            {typeFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setTypeFilter(filter.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                  typeFilter === filter.value
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'text-[#71717A] hover:bg-[#F9FAFB] hover:text-[#18181B] border border-transparent'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* View toggle + New button */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center border border-[#E5E7EB] rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-[#71717A] hover:bg-[#F9FAFB]'
                }`}
                aria-label="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${
                  viewMode === 'list'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-[#71717A] hover:bg-[#F9FAFB]'
                }`}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            <Button
              onClick={() => setNewNoteOpen(true)}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-md shadow-emerald-500/20 gap-1.5 h-9"
              size="sm"
            >
              <Plus className="w-4 h-4" />
              New Note
            </Button>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          MAIN LAYOUT: Sidebar + Content
          ═══════════════════════════════════════════════════════ */}
      <div className="flex-1 flex min-h-0">
        {/* ─── Categories Sidebar ──────────────────────── */}
        <aside className="hidden md:flex w-[220px] shrink-0 border-r border-[#E5E7EB] bg-white flex-col">
          <div className="p-4">
            <h3 className="text-xs font-bold text-[#A1A1AA] uppercase tracking-wider mb-3">
              Categories
            </h3>
            <nav className="space-y-1">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.name
                return (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : 'text-[#52525B] hover:bg-[#F9FAFB] border border-transparent'
                    }`}
                  >
                    <span className="text-base">{cat.emoji}</span>
                    <span className="flex-1 text-left truncate">{cat.name}</span>
                    <Badge
                      variant="secondary"
                      className={`text-[10px] font-semibold h-5 min-w-[20px] justify-center ${
                        isActive
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-gray-100 text-[#71717A]'
                      }`}
                    >
                      {cat.count}
                    </Badge>
                  </button>
                )
              })}
            </nav>
          </div>
        </aside>

        {/* ─── Notes Content ──────────────────────────── */}
        <main className="flex-1 overflow-y-auto bg-[#F9FAFB]">
          <ScrollArea className="h-full">
            <div className="p-4 sm:p-6 lg:p-8 max-w-6xl">
              {/* Category header for mobile */}
              <div className="md:hidden flex items-center gap-2 mb-4 overflow-x-auto pb-1">
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all ${
                      selectedCategory === cat.name
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-white text-[#71717A] border border-[#E5E7EB]'
                    }`}
                  >
                    <span>{cat.emoji}</span>
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Results count */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs text-[#71717A]">
                  <span className="font-semibold text-[#18181B]">{filteredNotes.length}</span>{' '}
                  {filteredNotes.length === 1 ? 'note' : 'notes'} found
                </p>
                {selectedCategory !== 'All Notes' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCategory('All Notes')}
                    className="text-xs text-[#71717A] hover:text-[#18181B] h-7"
                  >
                    <X className="w-3 h-3 mr-1" />
                    Clear filter
                  </Button>
                )}
              </div>

              {/* ─── Loading State ──────────────────────── */}
              {loading && (
                <div className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-4" />
                  <p className="text-sm text-[#71717A]">Loading notes...</p>
                </div>
              )}

              {/* ─── Notes Grid/List ──────────────────────── */}
              {!loading && (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'
                      : 'space-y-3'
                  }
                >
                  {filteredNotes.map((note) => {
                    const config = typeConfig[note.type]
                    const TypeIcon = config.icon

                    if (viewMode === 'list') {
                      return (
                        <motion.div key={note.id} variants={itemVariants}>
                          <Card
                            className="bg-white border-[#E5E7EB] hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer group"
                            onClick={() => setDetailNote(note)}
                          >
                            <CardContent className="p-4 flex items-start gap-4">
                              <div
                                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                                style={{ background: config.bgColor }}
                              >
                                <TypeIcon className="w-4 h-4" style={{ color: config.color }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <h4 className="text-sm font-semibold text-[#18181B] truncate">
                                    {note.title}
                                  </h4>
                                  {note.pinned && (
                                    <Pin className="w-3 h-3 text-amber-500 shrink-0" />
                                  )}
                                </div>
                                <p className="text-xs text-[#71717A] truncate">
                                  {note.content}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <Badge
                                  variant="outline"
                                  className="text-[10px] font-medium"
                                  style={{
                                    color: config.color,
                                    borderColor: config.color + '40',
                                    backgroundColor: config.bgColor,
                                  }}
                                >
                                  {config.label}
                                </Badge>
                                <span className="text-[10px] text-[#A1A1AA] whitespace-nowrap">
                                  {note.updatedAt}
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      )
                    }

                    // Grid card
                    return (
                      <motion.div key={note.id} variants={itemVariants}>
                        <Card
                          className="bg-white border-[#E5E7EB] hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer group h-full flex flex-col"
                          onClick={() => setDetailNote(note)}
                        >
                          <CardContent className="p-5 flex flex-col flex-1">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                                  style={{ background: config.bgColor }}
                                >
                                  <TypeIcon className="w-3.5 h-3.5" style={{ color: config.color }} />
                                </div>
                                <Badge
                                  variant="outline"
                                  className="text-[9px] font-semibold"
                                  style={{
                                    color: config.color,
                                    borderColor: config.color + '40',
                                    backgroundColor: config.bgColor,
                                  }}
                                >
                                  {config.label}
                                </Badge>
                              </div>
                              {note.pinned && (
                                <Pin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              )}
                            </div>

                            {/* Title */}
                            <h4 className="text-sm font-semibold text-[#18181B] mb-1.5 leading-snug group-hover:text-emerald-700 transition-colors">
                              {note.title}
                            </h4>

                            {/* Content preview */}
                            <p className="text-xs text-[#71717A] leading-relaxed mb-3 line-clamp-3 flex-1">
                              {note.content}
                            </p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {note.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#F3F4F6] text-[#52525B]"
                                >
                                  {tag}
                                </span>
                              ))}
                              {note.tags.length > 3 && (
                                <span className="text-[10px] text-[#A1A1AA] self-center">
                                  +{note.tags.length - 3}
                                </span>
                              )}
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-2 border-t border-[#F3F4F6]">
                              <span className="text-[10px] text-[#A1A1AA]">
                                {note.category}
                              </span>
                              <span className="text-[10px] text-[#A1A1AA]">
                                {note.updatedAt}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )
                  })}
                </motion.div>
              )}

              {/* Empty state */}
              {!loading && filteredNotes.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-14 h-14 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-center mb-4">
                    <Filter className="w-6 h-6 text-[#A1A1AA]" />
                  </div>
                  <h3 className="text-sm font-semibold text-[#18181B] mb-1">No notes found</h3>
                  <p className="text-xs text-[#71717A] mb-4">
                    Try adjusting your search or filters
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery('')
                      setTypeFilter('all')
                      setSelectedCategory('All Notes')
                    }}
                    className="border-[#E5E7EB] text-xs"
                  >
                    Clear all filters
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>
        </main>
      </div>

      {/* ═══════════════════════════════════════════════════════
          NEW NOTE DIALOG
          ═══════════════════════════════════════════════════════ */}
      <Dialog open={newNoteOpen} onOpenChange={setNewNoteOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Plus className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              Create New Note
            </DialogTitle>
            <DialogDescription>
              Add a new note to your structured memory. It will be automatically tagged and categorized.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="note-title">Title</Label>
              <Input
                id="note-title"
                placeholder="e.g., Sprint Planning — Q2 Goals"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="border-[#E5E7EB] focus-visible:ring-emerald-500/30 focus-visible:border-emerald-300"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="note-type">Type</Label>
                <Select value={newType} onValueChange={(v) => setNewType(v as NoteType)}>
                  <SelectTrigger className="border-[#E5E7EB] w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="note">Note</SelectItem>
                    <SelectItem value="bookmark">Bookmark</SelectItem>
                    <SelectItem value="insight">Insight</SelectItem>
                    <SelectItem value="snippet">Snippet</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="idea">Idea</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="note-category">Category</Label>
                <Input
                  id="note-category"
                  placeholder="e.g., Projects"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="border-[#E5E7EB] focus-visible:ring-emerald-500/30 focus-visible:border-emerald-300"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="note-content">Content</Label>
              <Textarea
                id="note-content"
                placeholder={newType === 'bookmark' ? 'Paste the URL here...' : 'Write your note content...'}
                rows={4}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="border-[#E5E7EB] focus-visible:ring-emerald-500/30 focus-visible:border-emerald-300 resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="note-tags">Tags (comma-separated)</Label>
              <Input
                id="note-tags"
                placeholder="e.g., api, security, planning"
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
                className="border-[#E5E7EB] focus-visible:ring-emerald-500/30 focus-visible:border-emerald-300"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setNewNoteOpen(false)}
              className="border-[#E5E7EB]"
              disabled={creating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateNote}
              disabled={!newTitle.trim() || creating}
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-md shadow-emerald-500/20"
            >
              {creating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Note'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══════════════════════════════════════════════════════
          NOTE DETAIL DIALOG
          ═══════════════════════════════════════════════════════ */}
      <Dialog open={!!detailNote} onOpenChange={(open) => !open && setDetailNote(null)}>
        <DialogContent className="sm:max-w-lg">
          {detailNote && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-1">
                  {(() => {
                    const config = typeConfig[detailNote.type]
                    const TypeIcon = config.icon
                    return (
                      <>
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{ background: config.bgColor }}
                        >
                          <TypeIcon className="w-3.5 h-3.5" style={{ color: config.color }} />
                        </div>
                        <Badge
                          variant="outline"
                          className="text-[10px] font-semibold"
                          style={{
                            color: config.color,
                            borderColor: config.color + '40',
                            backgroundColor: config.bgColor,
                          }}
                        >
                          {config.label}
                        </Badge>
                        {detailNote.pinned && (
                          <Badge
                            variant="outline"
                            className="text-[10px] font-semibold text-amber-700 border-amber-200 bg-amber-50/50 gap-1"
                          >
                            <Pin className="w-2.5 h-2.5" />
                            Pinned
                          </Badge>
                        )}
                      </>
                    )
                  })()}
                </div>
                <DialogTitle className="text-lg">{detailNote.title}</DialogTitle>
                <DialogDescription className="flex items-center gap-3">
                  <span>{detailNote.category}</span>
                  <span className="text-[#A1A1AA]">·</span>
                  <span>Updated {detailNote.updatedAt}</span>
                </DialogDescription>
              </DialogHeader>
              <div className="py-2">
                <p className="text-sm text-[#52525B] leading-relaxed whitespace-pre-wrap">
                  {detailNote.content}
                </p>
                {detailNote.sourceUrl && (
                  <a
                    href={detailNote.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700 mt-2"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    {detailNote.sourceUrl}
                  </a>
                )}
                {detailNote.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {detailNote.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-[#F3F4F6] text-[#52525B]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => handleTogglePin(detailNote)}
                  className={`border-amber-200 ${
                    detailNote.pinned
                      ? 'text-amber-600 hover:bg-amber-50 hover:text-amber-700'
                      : 'text-[#71717A] hover:bg-[#F9FAFB]'
                  }`}
                >
                  <Pin className="w-3.5 h-3.5 mr-1" />
                  {detailNote.pinned ? 'Unpin' : 'Pin'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDeleteNote(detailNote.id)}
                  disabled={deleting}
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </Button>
                <Button
                  onClick={() => setDetailNote(null)}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-md shadow-emerald-500/20"
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
