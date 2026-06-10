'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

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

// ─── Markdown-like Renderer ────────────────────────────────
function RenderMessageContent({ content }: { content: string }) {
  const lines = content.split('\n')
  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        // Bold headers or list items with bold
        const processed = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Italic
        const withItalic = processed.replace(/\*(.*?)\*/g, '<em class="text-[#71717A] text-xs">$1</em>')

        if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ') || line.startsWith('5. ')) {
          return (
            <p
              key={i}
              className="text-sm leading-relaxed pl-2"
              dangerouslySetInnerHTML={{ __html: withItalic }}
            />
          )
        }
        if (line.trim() === '') {
          return <div key={i} className="h-1" />
        }
        return (
          <p
            key={i}
            className="text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: withItalic }}
          />
        )
      })}
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

// ─── Main Component ────────────────────────────────────────
export default function AIChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConvoId, setActiveConvoId] = useState<string>('')
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoadingConversations, setIsLoadingConversations] = useState(true)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
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
  }, [activeConvo?.messages.length, isTyping])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px'
    }
  }, [inputValue])

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
    <div className="h-full flex bg-white overflow-hidden">
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
          w-72 bg-[#F9FAFB] border-r border-[#E5E7EB]
          flex flex-col
          transform transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
          lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-[#E5E7EB] shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-bold text-[#18181B]">AI Chat</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden w-7 h-7 rounded-lg hover:bg-white flex items-center justify-center"
            >
              <X className="w-4 h-4 text-[#71717A]" />
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
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#A1A1AA]" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 w-full pl-8 pr-3 text-xs rounded-lg border border-[#E5E7EB] bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-0.5">
          {isLoadingConversations ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2 text-[#A1A1AA]">
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
              <p className="text-xs text-[#A1A1AA]">No conversations yet</p>
            </div>
          ) : (
            sortedConversations.map((convo) => (
              <button
                key={convo.id}
                onClick={() => handleSelectConvo(convo.id)}
                className={`w-full text-left p-3 rounded-xl transition-all group ${
                  activeConvoId === convo.id
                    ? 'bg-white border border-emerald-100 shadow-sm'
                    : 'hover:bg-white/60 border border-transparent'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      {convo.pinned && <Pin className="w-2.5 h-2.5 text-emerald-500 shrink-0" />}
                      <p
                        className={`text-xs font-semibold truncate ${
                          activeConvoId === convo.id ? 'text-emerald-700' : 'text-[#18181B]'
                        }`}
                      >
                        {convo.title}
                      </p>
                    </div>
                    <p className="text-[10px] text-[#A1A1AA] mt-0.5 truncate">{convo.preview}</p>
                    <p className="text-[9px] text-[#D4D4D8] mt-1">{convo.updatedAt}</p>
                  </div>
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleTogglePin(convo.id)
                      }}
                      className="w-5 h-5 rounded flex items-center justify-center hover:bg-emerald-50 transition-colors"
                    >
                      {convo.pinned ? (
                        <PinOff className="w-2.5 h-2.5 text-emerald-500" />
                      ) : (
                        <Pin className="w-2.5 h-2.5 text-[#A1A1AA]" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteConvo(convo.id)
                      }}
                      className="w-5 h-5 rounded flex items-center justify-center hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-2.5 h-2.5 text-[#A1A1AA] hover:text-red-500" />
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
        <div className="h-14 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-8 h-8 rounded-lg hover:bg-[#F9FAFB] flex items-center justify-center"
            >
              <Menu className="w-4 h-4 text-[#52525B]" />
            </button>
            <div>
              <h2 className="text-sm font-bold text-[#18181B]">
                {activeConvo?.title || 'AI Chat'}
              </h2>
              <p className="text-[10px] text-[#71717A]">
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
                  className="text-[9px] font-bold text-emerald-700 border-emerald-200 bg-emerald-50/50 gap-1"
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
            /* Empty State */
            <div className="flex items-center justify-center h-full p-6">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-[#18181B] mb-2">
                  Ask your knowledge graph
                </h3>
                <p className="text-sm text-[#71717A] mb-6 leading-relaxed">
                  I can help you find information, understand connections, and explore your
                  team&apos;s collective knowledge. Try asking about your API architecture, sprint goals,
                  or database design.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    'What are our API design principles?',
                    'Who leads the Lore Platform?',
                    'How does the database handle scaling?',
                    'What are our Q2 sprint goals?',
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => {
                        setInputValue(suggestion)
                        textareaRef.current?.focus()
                      }}
                      className="text-left p-3 rounded-xl border border-[#E5E7EB] hover:border-emerald-200 hover:bg-emerald-50/30 transition-all text-xs text-[#52525B] font-medium"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : isLoadingMessages ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex items-center gap-2 text-[#A1A1AA]">
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
                    className={`max-w-[85%] sm:max-w-[75%] ${
                      msg.role === 'user' ? 'bubble-user' : 'bubble-assistant'
                    }`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-1.5 mb-2">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                          <Sparkles className="w-2 h-2 text-white" />
                        </div>
                        <span className="text-[10px] font-semibold text-emerald-600">Lore AI</span>
                        {msg.timestamp && (
                          <span className="text-[9px] text-[#A1A1AA] ml-auto">{msg.timestamp}</span>
                        )}
                      </div>
                    )}
                    <div
                      className={`px-3.5 py-2.5 ${
                        msg.role === 'user' ? 'text-white' : 'text-[#52525B]'
                      }`}
                    >
                      {msg.role === 'assistant' ? (
                        <RenderMessageContent content={msg.content} />
                      ) : (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      )}
                    </div>
                    {/* Sources */}
                    {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && (
                      <div className="px-3.5 pb-2.5 pt-1 border-t border-[rgba(0,0,0,0.04)]">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Network className="w-2.5 h-2.5 text-[#A1A1AA]" />
                          {msg.sources.map((source) => {
                            const srcColor = getSourceColor(source)
                            return (
                            <Badge
                              key={source}
                              variant="outline"
                              className="text-[9px] font-medium py-0 px-1.5 border-[#E5E7EB]"
                              style={{
                                color: srcColor,
                                borderColor: `${srcColor}30`,
                                backgroundColor: `${srcColor}08`,
                              }}
                            >
                              {source}
                            </Badge>
                            )
                          })}
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
        <div className="border-t border-[#E5E7EB] bg-white p-4 shrink-0">
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
                  className="w-full resize-none rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 text-sm text-[#18181B] placeholder:text-[#A1A1AA] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all disabled:opacity-50"
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
            <p className="text-[10px] text-[#A1A1AA] mt-2 text-center">
              Press <kbd className="px-1 py-0.5 bg-[#F4F4F5] rounded text-[9px] font-mono">Enter</kbd> to send,{' '}
              <kbd className="px-1 py-0.5 bg-[#F4F4F5] rounded text-[9px] font-mono">Shift+Enter</kbd> for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
