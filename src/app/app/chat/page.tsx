'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  MessageSquare,
  Plus,
  Search,
  Pin,
  PinOff,
  Send,
  Sparkles,
  Menu,
  X,
  Trash2,
  Network,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { toast } from 'sonner'
import { ChatEmptyState } from '@/components/app/empty-states'
import { MarkdownRenderer } from '@/components/chat/MarkdownRenderer'

// ─── Types ─────────────────────────────────────────────────
interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: string[]
  timestamp?: string
}

interface Conversation {
  id: string
  title: string
  preview: string
  pinned: boolean
  updatedAt: string
  messages: ChatMessage[]
  messagesLoaded?: boolean
}

// ─── Blinking Cursor Component ──────────────────────────────
function BlinkingCursor() {
  return (
    <span className="inline-block w-[2px] h-[1em] bg-emerald-500 ml-0.5 align-text-bottom animate-[blink_1s_step-end_infinite]">
      &ZeroWidthSpace;
    </span>
  )
}

// ─── Streaming Message Component ────────────────────────────
function StreamingMessage({
  content,
  onComplete,
}: {
  content: string
  onComplete: () => void
}) {
  const [displayedWordCount, setDisplayedWordCount] = useState(0)
  const hasCompletedRef = useRef(false)

  // Split content into words, preserving whitespace structure
  const [words] = useState<string[]>(() => content.split(/(\s+)/))

  // Animate word-by-word reveal
  useEffect(() => {
    if (words.length === 0) return

    const interval = setInterval(() => {
      setDisplayedWordCount((prev) => {
        // Add 1-2 "words" at a time (including whitespace chunks) for more natural feel
        const increment = Math.random() > 0.3 ? 2 : 1
        const next = prev + increment
        if (next >= words.length) {
          clearInterval(interval)
          return words.length
        }
        return next
      })
    }, 35)

    return () => clearInterval(interval)
  }, [words])

  // Trigger onComplete when streaming finishes
  useEffect(() => {
    if (displayedWordCount >= words.length && words.length > 0 && !hasCompletedRef.current) {
      hasCompletedRef.current = true
      // Small delay so the user sees the final text before switching to MarkdownRenderer
      const timer = setTimeout(onComplete, 300)
      return () => clearTimeout(timer)
    }
  }, [displayedWordCount, words.length, onComplete])

  const visibleText = words.slice(0, displayedWordCount).join('')
  const isStreaming = displayedWordCount < words.length

  return (
    <div className="text-sm leading-relaxed text-[#52525B] dark:text-[#D4D4D8] whitespace-pre-wrap break-words">
      {visibleText}
      {isStreaming && <BlinkingCursor />}
    </div>
  )
}

// ─── Typing Indicator ──────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-emerald-400"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// ─── Source Badge Colors (dynamic hash-based for any source name) ──
const sourceColorPalette = ['#059669', '#0891B2', '#7C3AED', '#DB2777', '#EA580C', '#3B82F6', '#0D9488']
function getSourceColor(sourceName: string): string {
  // Deterministic hash so same source always gets same color
  let hash = 0
  for (let i = 0; i < sourceName.length; i++) {
    hash = sourceName.charCodeAt(i) + ((hash << 5) - hash)
  }
  return sourceColorPalette[Math.abs(hash) % sourceColorPalette.length]
}

// ─── Helper: format relative time ──────────────────────────
function formatRelativeTime(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  } catch {
    return dateStr
  }
}

// ─── Enhanced Empty State with Animated Suggestion Chips ─────
function AnimatedChatEmptyState({
  onSuggestionClick,
}: {
  onSuggestionClick?: (suggestion: string) => void
}) {
  const suggestions = [
    { text: 'What are my key concepts?', icon: '💡' },
    { text: 'Show recent changes', icon: '🔄' },
    { text: 'Find connections', icon: '🔗' },
    { text: 'Summarize my knowledge', icon: '📝' },
  ]

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-8 px-6 text-center w-full"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.12 } },
      }}
    >
      {/* Chat icon with glow */}
      <motion.div
        variants={{
          hidden: { opacity: 0, scale: 0.8 },
          visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
          },
        }}
        className="relative mb-6"
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-[rgba(16,185,129,0.15)] dark:to-[rgba(20,184,166,0.15)] flex items-center justify-center border border-emerald-200/50 dark:border-[rgba(16,185,129,0.20)] shadow-sm">
          <MessageSquare className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
        </div>
        {/* Animated glow ring */}
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-emerald-400/30"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Title */}
      <motion.h3
        variants={{
          hidden: { opacity: 0, y: 16 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
          },
        }}
        className="text-xl font-bold text-[#18181B] dark:text-[#FAFAFA] mb-2 tracking-tight"
      >
        Ask your knowledge graph
      </motion.h3>

      {/* Description */}
      <motion.p
        variants={{
          hidden: { opacity: 0, y: 16 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
          },
        }}
        className="text-sm text-[#71717A] dark:text-[#A1A1AA] max-w-md leading-relaxed mb-8"
      >
        Start a conversation with your data. Ask questions, explore connections,
        and get AI-powered insights from your knowledge base.
      </motion.p>

      {/* Animated Suggestion Chips - staggered one by one */}
      <motion.div
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.15 } },
        }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg w-full"
      >
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={suggestion.text}
            variants={{
              hidden: { opacity: 0, y: 20, scale: 0.9 },
              visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                  duration: 0.5,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  delay: index * 0.05,
                },
              },
            }}
            onClick={() => onSuggestionClick?.(suggestion.text)}
            className={`
              text-left px-4 py-3.5 rounded-xl
              border border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] bg-white dark:bg-[#0F0F12]
              hover:border-emerald-200 dark:hover:border-[rgba(16,185,129,0.20)] hover:bg-emerald-50/40 dark:hover:bg-[rgba(16,185,129,0.06)]
              hover:shadow-md hover:shadow-emerald-500/5
              transition-all duration-200
              text-xs text-[#52525B] dark:text-[#D4D4D8] font-medium
              group
            `}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="flex items-center gap-2.5">
              <motion.span
                className="text-sm shrink-0"
                initial={{ rotate: -10 }}
                whileHover={{ rotate: 10, scale: 1.2 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {suggestion.icon}
              </motion.span>
              {suggestion.text}
            </span>
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  )
}

// ─── Main Component ────────────────────────────────────────
export default function AIChatPage() {
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConvoId, setActiveConvoId] = useState<string>('')
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoadingConversations, setIsLoadingConversations] = useState(true)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null)
  const [reactions, setReactions] = useState<Record<string, 'up' | 'down' | null>>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const loadedConvoIds = useRef<Set<string>>(new Set())

  const activeConvo = conversations.find((c) => c.id === activeConvoId)

  const filteredConversations = conversations.filter(
    (c) =>
      !searchQuery ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.preview.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Sort: pinned first, then by updated time
  const sortedConversations = [...filteredConversations].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return 0
  })

  // ─── Fetch conversations on mount ─────────────────────
  useEffect(() => {
    async function fetchConversations() {
      setIsLoadingConversations(true)
      try {
        const res = await fetch('/api/conversations')
        if (res.ok) {
          const data = await res.json()
          const mapped: Conversation[] = (data.conversations || []).map(
            (c: Record<string, unknown>) => ({
              id: c.id as string,
              title: (c.title as string) || 'New Conversation',
              preview: (c.preview as string) || '',
              pinned: (c.pinned as boolean) || false,
              updatedAt: formatRelativeTime(
                (c.updatedAt as string) || new Date().toISOString()
              ),
              messages: [],
              messagesLoaded: false,
            })
          )
          setConversations(mapped)
          // Auto-select the first conversation if any
          if (mapped.length > 0) {
            setActiveConvoId(mapped[0].id)
          }
        }
      } catch (err) {
        console.error('Failed to fetch conversations:', err)
      } finally {
        setIsLoadingConversations(false)
      }
    }
    fetchConversations()
  }, [])

  // ─── Fetch messages when selecting a conversation ────
  useEffect(() => {
    if (!activeConvoId || loadedConvoIds.current.has(activeConvoId)) return

    let cancelled = false
    async function loadMessages(convoId: string) {
      loadedConvoIds.current.add(convoId)
      setIsLoadingMessages(true)
      try {
        const res = await fetch(`/api/conversations/${convoId}/messages`)
        if (res.ok && !cancelled) {
          const data = await res.json()
          const messages: ChatMessage[] = (data.messages || []).map(
            (m: Record<string, unknown>) => ({
              id: m.id as string,
              role: m.role as 'user' | 'assistant',
              content: m.content as string,
              sources: Array.isArray(m.sources) ? (m.sources as string[]) : undefined,
              timestamp: m.timestamp
                ? new Date(m.timestamp as string).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : undefined,
            })
          )
          setConversations((prev) =>
            prev.map((c) =>
              c.id === convoId
                ? { ...c, messages, messagesLoaded: true }
                : c
            )
          )
        }
      } catch (err) {
        console.error('Failed to fetch messages:', err)
        loadedConvoIds.current.delete(convoId)
      } finally {
        if (!cancelled) setIsLoadingMessages(false)
      }
    }
    loadMessages(activeConvoId)
    return () => { cancelled = true }
  }, [activeConvoId])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeConvo?.messages.length, isTyping, streamingMessageId])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px'
    }
  }, [inputValue])

  // ─── Handle reaction click ────────────────────────────
  const handleReaction = useCallback((messageId: string, type: 'up' | 'down') => {
    setReactions((prev) => {
      const current = prev[messageId]
      // Toggle: if same reaction clicked again, remove it
      if (current === type) {
        return { ...prev, [messageId]: null }
      }
      return { ...prev, [messageId]: type }
    })
    toast.success('Thanks for the feedback!')
  }, [])

  // ─── Handle streaming complete ────────────────────────
  const handleStreamingComplete = useCallback(() => {
    setStreamingMessageId(null)
  }, [])

  // ─── Send a message ──────────────────────────────────
  const handleSend = useCallback(async () => {
    if (!inputValue.trim() || isTyping) return

    const userContent = inputValue.trim()
    const userMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: userContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    let convoId = activeConvoId

    // If no active conversation, create a new one via API
    if (!convoId) {
      try {
        const createRes = await fetch('/api/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: userContent.slice(0, 60),
            preview: userContent.slice(0, 100),
          }),
        })

        if (createRes.ok) {
          const created = await createRes.json()
          convoId = created.id

          const newConvo: Conversation = {
            id: created.id,
            title: created.title || userContent.slice(0, 60),
            preview: created.preview || userContent.slice(0, 100),
            pinned: created.pinned || false,
            updatedAt: 'Just now',
            messages: [],
            messagesLoaded: false,
          }
          loadedConvoIds.current.add(convoId)
          setConversations((prev) => [newConvo, ...prev])
          setActiveConvoId(convoId)
        } else {
          console.error('Failed to create conversation')
          return
        }
      } catch {
        console.error('Failed to create conversation')
        return
      }
    }

    // Mark this conversation as loaded so the loadMessages effect doesn't overwrite
    loadedConvoIds.current.add(convoId)

    // Optimistically add user message to UI
    setConversations((prev) =>
      prev.map((c) =>
        c.id === convoId
          ? {
              ...c,
              messages: [...c.messages, userMessage],
              messagesLoaded: true,
            }
          : c
      )
    )
    setInputValue('')
    setIsTyping(true)

    try {
      // Get current conversation messages for the chat API context
      const currentConvo = conversations.find((c) => c.id === convoId)
      const allMessages = [...(currentConvo?.messages || []), userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }))

      // Call the chat API for AI response
      const chatRes = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: allMessages }),
      })

      const chatData = await chatRes.json()

      // Extract sources from the response
      const sourceMatch = chatData.content?.match(/\*Sources: (.*?)\*/i)
      const sources = sourceMatch
        ? sourceMatch[1].split(',').map((s: string) => s.trim().replace(/ node$/, ''))
        : []

      const assistantMessage: ChatMessage = {
        id: `temp-${Date.now() + 1}`,
        role: 'assistant',
        content: chatData.content || "I couldn't generate a response. Please try again.",
        sources,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      // Mark this message as streaming
      setStreamingMessageId(assistantMessage.id)

      // Update UI with assistant message
      setConversations((prev) =>
        prev.map((c) =>
          c.id === convoId
            ? {
                ...c,
                messages: [...c.messages, userMessage, assistantMessage],
                preview: userContent.slice(0, 100),
                updatedAt: 'Just now',
                messagesLoaded: true,
              }
            : c
        )
      )

      // Save both messages to the database via API (fire and forget)
      fetch(`/api/conversations/${convoId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'user', content: userContent }),
      }).catch((err) => console.error('Failed to save user message:', err))

      fetch(`/api/conversations/${convoId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'assistant',
          content: assistantMessage.content,
          sources,
        }),
      }).catch((err) => console.error('Failed to save assistant message:', err))

      // Update conversation title if this was the first message
      if (!currentConvo?.messages?.length) {
        fetch(`/api/conversations/${convoId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: userContent.slice(0, 60),
            preview: userContent.slice(0, 100),
          }),
        }).catch((err) => console.error('Failed to update conversation:', err))
      }
    } catch {
      const errorMessage: ChatMessage = {
        id: `temp-${Date.now() + 1}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      setStreamingMessageId(errorMessage.id)

      setConversations((prev) =>
        prev.map((c) =>
          c.id === convoId
            ? { ...c, messages: [...c.messages, userMessage, errorMessage], messagesLoaded: true }
            : c
        )
      )
    } finally {
      setIsTyping(false)
    }
  }, [inputValue, activeConvoId, isTyping, conversations])

  // ─── New Chat ────────────────────────────────────────
  const handleNewChat = () => {
    // Just set activeConvoId to empty to show the empty state
    // The conversation will be created when the user sends their first message
    setActiveConvoId('')
    setSidebarOpen(false)
    toast.success('New chat started')
  }

  // ─── Toggle Pin ──────────────────────────────────────
  const handleTogglePin = async (convoId: string) => {
    const convo = conversations.find((c) => c.id === convoId)
    if (!convo) return

    const newPinned = !convo.pinned

    // Optimistic update
    setConversations((prev) =>
      prev.map((c) => (c.id === convoId ? { ...c, pinned: newPinned } : c))
    )

    // Persist to API
    try {
      await fetch(`/api/conversations/${convoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pinned: newPinned }),
      })
      toast.success('Chat pinned')
    } catch (err) {
      console.error('Failed to toggle pin:', err)
      // Revert on error
      setConversations((prev) =>
        prev.map((c) => (c.id === convoId ? { ...c, pinned: !newPinned } : c))
      )
    }
  }

  // ─── Delete Conversation ─────────────────────────────
  const handleDeleteConvo = async (convoId: string) => {
    // Optimistic update
    const remaining = conversations.filter((c) => c.id !== convoId)
    setConversations(remaining)
    if (activeConvoId === convoId) {
      setActiveConvoId(remaining.length > 0 ? remaining[0].id : '')
    }

    // Persist to API
    try {
      await fetch(`/api/conversations/${convoId}`, {
        method: 'DELETE',
      })
      toast.success('Conversation deleted')
    } catch (err) {
      console.error('Failed to delete conversation:', err)
    }
  }

  // ─── Select Conversation ─────────────────────────────
  const handleSelectConvo = (convoId: string) => {
    setActiveConvoId(convoId)
    setSidebarOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="h-full flex bg-white dark:bg-[#0F0F12] overflow-hidden">
      {/* ─── Mobile Sidebar Overlay ───────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ─── Left Sidebar ─────────────────────────────────── */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-80 sm:w-72 bg-[#F9FAFB] dark:bg-[#09090B] border-r border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)]
          flex flex-col
          transform transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
          lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-bold text-[#18181B] dark:text-[#FAFAFA]">AI Chat</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden min-w-[44px] min-h-[44px] rounded-lg hover:bg-white dark:hover:bg-[#18181B] flex items-center justify-center"
            >
              <X className="w-5 h-5 text-[#71717A] dark:text-[#A1A1AA]" />
            </button>
          </div>
          <Button
            onClick={handleNewChat}
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-md shadow-emerald-500/20 text-xs h-9"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            New Chat
          </Button>
        </div>

        {/* Search */}
        <div className="p-3 shrink-0">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#A1A1AA] dark:text-[#71717A]" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 w-full pl-8 pr-3 text-xs rounded-lg border border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] bg-white dark:bg-[#0F0F12] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-0.5">
          {isLoadingConversations ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2 text-[#A1A1AA] dark:text-[#71717A]">
                <motion.div
                  className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                <span className="text-xs">Loading...</span>
              </div>
            </div>
          ) : sortedConversations.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-xs text-[#A1A1AA] dark:text-[#71717A]">No conversations yet</p>
            </div>
          ) : (
            sortedConversations.map((convo) => (
              <button
                key={convo.id}
                onClick={() => handleSelectConvo(convo.id)}
                className={`w-full text-left p-3 rounded-xl transition-all group ${
                  activeConvoId === convo.id
                    ? 'bg-white dark:bg-[#0F0F12] border border-emerald-100 dark:border-[rgba(16,185,129,0.15)] shadow-sm'
                    : 'hover:bg-white/60 dark:hover:bg-[#0F0F12]/60 active:bg-white/80 dark:active:bg-[#0F0F12]/80 border border-transparent'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      {convo.pinned && <Pin className="w-2.5 h-2.5 text-emerald-500 shrink-0" />}
                      <p
                        className={`text-xs font-semibold truncate ${
                          activeConvoId === convo.id ? 'text-emerald-700 dark:text-emerald-400' : 'text-[#18181B] dark:text-[#FAFAFA]'
                        }`}
                      >
                        {convo.title}
                      </p>
                    </div>
                    <p className="text-[10px] text-[#A1A1AA] dark:text-[#71717A] mt-0.5 truncate">{convo.preview}</p>
                    <p className="text-[9px] text-[#D4D4D8] mt-1">{convo.updatedAt}</p>
                  </div>
                  <div className="flex items-center gap-0.5 lg:opacity-0 lg:group-hover:opacity-100 opacity-70 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleTogglePin(convo.id)
                      }}
                      className="min-w-[32px] min-h-[32px] rounded-lg flex items-center justify-center hover:bg-emerald-50 dark:hover:bg-[rgba(16,185,129,0.10)] active:bg-emerald-100 dark:active:bg-[rgba(16,185,129,0.15)] transition-colors"
                    >
                      {convo.pinned ? (
                        <PinOff className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Pin className="w-3.5 h-3.5 text-[#A1A1AA] dark:text-[#71717A]" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteConvo(convo.id)
                      }}
                      className="min-w-[32px] min-h-[32px] rounded-lg flex items-center justify-center hover:bg-red-50 active:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-[#A1A1AA] dark:text-[#71717A] hover:text-red-500" />
                    </button>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* ─── Main Chat Area ───────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <div className="h-14 bg-white dark:bg-[#0F0F12] border-b border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden min-w-[44px] min-h-[44px] rounded-lg hover:bg-[#F9FAFB] dark:hover:bg-[#18181B] active:bg-[#F3F4F6] dark:active:bg-[#27272A] flex items-center justify-center"
            >
              <Menu className="w-5 h-5 text-[#52525B] dark:text-[#D4D4D8]" />
            </button>
            <div>
              <h2 className="text-sm font-bold text-[#18181B] dark:text-[#FAFAFA]">
                {activeConvo?.title || 'AI Chat'}
              </h2>
              <p className="text-[10px] text-[#71717A] dark:text-[#A1A1AA]">
                {isLoadingMessages
                  ? 'Loading messages...'
                  : `${activeConvo?.messages.length || 0} messages`}
              </p>
            </div>
          </div>
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="outline"
                  className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-[rgba(16,185,129,0.20)] bg-emerald-50/50 dark:bg-[rgba(16,185,129,0.06)] gap-1"
                >
                  <Sparkles className="w-2.5 h-2.5" />
                  Powered by Lore
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">AI responses reference your knowledge graph</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          {!activeConvo || activeConvo.messages.length === 0 ? (
            /* Empty State - using enhanced animated version */
            <div className="flex items-center justify-center h-full p-6">
              <AnimatedChatEmptyState
                onSuggestionClick={(suggestion) => {
                  setInputValue(suggestion)
                  textareaRef.current?.focus()
                }}
              />
            </div>
          ) : isLoadingMessages ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex items-center gap-2 text-[#A1A1AA] dark:text-[#71717A]">
                <motion.div
                  className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                <span className="text-sm">Loading messages...</span>
              </div>
            </div>
          ) : (
            /* Message List */
            <div className="max-w-3xl mx-auto p-4 space-y-4 pb-4">
              {activeConvo.messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] group ${
                      msg.role === 'user' ? 'bubble-user' : 'bubble-assistant'
                    }`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-1.5 mb-2">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                          <Sparkles className="w-2 h-2 text-white" />
                        </div>
                        <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">Lore AI</span>
                        {msg.timestamp && (
                          <span className="text-[9px] text-[#A1A1AA] dark:text-[#71717A] ml-auto">{msg.timestamp}</span>
                        )}
                      </div>
                    )}
                    <div
                      className={`px-3.5 py-2.5 ${
                        msg.role === 'user' ? 'text-white' : 'text-[#52525B] dark:text-[#D4D4D8]'
                      }`}
                    >
                      {msg.role === 'assistant' ? (
                        streamingMessageId === msg.id ? (
                          /* Streaming: show word-by-word reveal */
                          <StreamingMessage
                            content={msg.content}
                            onComplete={handleStreamingComplete}
                          />
                        ) : (
                          /* Normal: show full markdown rendered content */
                          <MarkdownRenderer content={msg.content} />
                        )
                      ) : (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      )}
                    </div>
                    {/* Sources - enhanced with pulse animation, tooltip, and click navigation */}
                    {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && (
                      <div className="px-3.5 pb-2.5 pt-1 border-t border-[rgba(0,0,0,0.04)] dark:border-[rgba(255,255,255,0.06)]">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Network className="w-2.5 h-2.5 text-[#A1A1AA] dark:text-[#71717A]" />
                          <TooltipProvider delayDuration={200}>
                            {msg.sources.map((source) => {
                              const srcColor = getSourceColor(source)
                              return (
                                <Tooltip key={source}>
                                  <TooltipTrigger asChild>
                                    <motion.div
                                      className="inline-flex"
                                      animate={{
                                        boxShadow: [
                                          `0 0 0 0 ${srcColor}00`,
                                          `0 0 0 3px ${srcColor}20`,
                                          `0 0 0 0 ${srcColor}00`,
                                        ],
                                      }}
                                      transition={{
                                        duration: 2.5,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                        delay: Math.random() * 1,
                                      }}
                                    >
                                      <Badge
                                        variant="outline"
                                        className="text-[9px] font-medium py-0 px-1.5 border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] cursor-pointer hover:shadow-sm transition-shadow"
                                        style={{
                                          color: srcColor,
                                          borderColor: `${srcColor}30`,
                                          backgroundColor: `${srcColor}08`,
                                        }}
                                        onClick={() => router.push('/app/graph')}
                                      >
                                        {source}
                                      </Badge>
                                    </motion.div>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="text-xs">
                                    <span className="flex items-center gap-1.5">
                                      <Network className="w-3 h-3" />
                                      Click to view in Knowledge Graph
                                    </span>
                                  </TooltipContent>
                                </Tooltip>
                              )
                            })}
                          </TooltipProvider>
                        </div>
                      </div>
                    )}
                    {/* Message Reactions - thumbs up/down for AI messages */}
                    {msg.role === 'assistant' && streamingMessageId !== msg.id && (
                      <div className="px-3.5 pb-2 pt-0">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <motion.button
                            onClick={() => handleReaction(msg.id, 'up')}
                            className={`min-w-[28px] min-h-[28px] rounded-lg flex items-center justify-center transition-colors ${
                              reactions[msg.id] === 'up'
                                ? 'bg-emerald-100 dark:bg-[rgba(16,185,129,0.15)] text-emerald-600 dark:text-emerald-400'
                                : 'hover:bg-[#F3F4F6] dark:hover:bg-[#27272A] text-[#A1A1AA] dark:text-[#71717A] hover:text-emerald-500'
                            }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <ThumbsUp className="w-3 h-3" />
                          </motion.button>
                          <motion.button
                            onClick={() => handleReaction(msg.id, 'down')}
                            className={`min-w-[28px] min-h-[28px] rounded-lg flex items-center justify-center transition-colors ${
                              reactions[msg.id] === 'down'
                                ? 'bg-red-100 dark:bg-[rgba(239,68,68,0.15)] text-red-500'
                                : 'hover:bg-[#F3F4F6] dark:hover:bg-[#27272A] text-[#A1A1AA] dark:text-[#71717A] hover:text-red-400'
                            }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <ThumbsDown className="w-3 h-3" />
                          </motion.button>
                        </div>
                      </div>
                    )}
                    {msg.role === 'user' && msg.timestamp && (
                      <div className="px-3.5 pb-2 flex justify-end">
                        <span className="text-[9px] text-emerald-200">{msg.timestamp}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex justify-start"
                  >
                    <div className="bubble-assistant px-2 py-1.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                          <Sparkles className="w-2 h-2 text-white" />
                        </div>
                        <TypingIndicator />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] bg-white dark:bg-[#0F0F12] p-3 sm:p-4 shrink-0 safe-area-bottom">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-2">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about your knowledge graph..."
                  rows={1}
                  disabled={isTyping}
                  className="w-full resize-none rounded-xl border border-[#E5E7EB] dark:border-[rgba(255,255,255,0.08)] bg-[#F9FAFB] dark:bg-[#09090B] px-4 py-3 text-sm text-[#18181B] dark:text-[#FAFAFA] placeholder:text-[#A1A1AA] dark:placeholder:text-[#71717A] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all disabled:opacity-50"
                  style={{ maxHeight: '120px' }}
                />
              </div>
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                className="h-11 w-11 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white shadow-md shadow-emerald-500/20 disabled:opacity-40 disabled:shadow-none shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="hidden sm:block text-[10px] text-[#A1A1AA] dark:text-[#71717A] mt-2 text-center">
              Press <kbd className="px-1 py-0.5 bg-[#F4F4F5] dark:bg-[#27272A] rounded text-[9px] font-mono">Enter</kbd> to send,{' '}
              <kbd className="px-1 py-0.5 bg-[#F4F4F5] dark:bg-[#27272A] rounded text-[9px] font-mono">Shift+Enter</kbd> for new line
            </p>
          </div>
        </div>
      </div>

      {/* ─── Global CSS for blinking cursor ──────────────────── */}
      <style jsx global>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}
