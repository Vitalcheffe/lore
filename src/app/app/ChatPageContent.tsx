'use client';

import { useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Plus, User, Sparkles, Phone, AlertTriangle } from 'lucide-react';

import { ChatInput } from '@/components/chat/ChatInput';
import { CrisisBlock } from '@/components/chat/CrisisBlock';
import { CategoryCard } from '@/components/chat/CategoryCard';
import { useClassify } from '@/hooks/use-classify';
import { useAuth } from '@/hooks/use-auth';
import { useChatStore } from '@/stores/chat-store';
import { siteConfig } from '@/config/site';
import type { ChatMessage as ChatMsg } from '@/types';

const EXAMPLE_PROMPTS = [
  { icon: '🏠', title: 'Multi-need support', text: "I lost my job and can't pay rent. My kids need food." },
  { icon: '💜', title: 'Emotional distress', text: "I'm feeling overwhelmed and don't know where to turn." },
  { icon: '🏥', title: 'Healthcare access', text: 'I need help finding affordable healthcare.' },
] as const;

export default function ChatPageContent() {
  const { messages, isProcessing, clearMessages } = useChatStore();
  const classify = useClassify();
  const { user, isAuthenticated } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = useCallback((text: string) => { classify.mutate(text); }, [classify]);

  return (
    <div className="flex h-screen flex-col bg-[#0a0a0f] text-white">
      <header className="flex shrink-0 items-center justify-between border-b border-white/5 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 shadow-lg shadow-violet-500/20">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-base font-semibold tracking-tight">{siteConfig.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <motion.button type="button" onClick={clearMessages} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="flex min-h-[44px] items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Start new chat">
            <Plus className="h-4 w-4" /><span className="hidden sm:inline">New Chat</span>
          </motion.button>
          {isAuthenticated && user ? (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-sm font-bold">
              {user.name?.[0]?.toUpperCase() ?? <User className="h-4 w-4" />}
            </div>
          ) : (
            <Link href="/login"
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Log in"><User className="h-4 w-4" /></Link>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
        {messages.length === 0 ? (
          <WelcomeScreen onSend={handleSend} />
        ) : (
          <div className="mx-auto max-w-3xl space-y-6 px-4 py-6 sm:px-6">
            <AnimatePresence mode="popLayout">
              {messages.map((msg) => (
                <MessageRenderer key={msg.id} message={msg} />
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      <div className="shrink-0 border-t border-white/5 bg-white/[0.02] px-4 py-2 text-center">
        <p className="text-xs text-white/40">
          <AlertTriangle className="mr-1 inline h-3 w-3 text-red-400/70" />
          If you&apos;re in crisis, call{' '}
          <a href="tel:988" className="font-semibold text-red-400/80 hover:text-red-400">988</a>{' '}
          or text{' '}
          <a href="sms:741741&body=HOME" className="font-semibold text-red-400/80 hover:text-red-400">HOME to 741741</a>
        </p>
      </div>

      <div className="shrink-0 border-t border-white/5 bg-[#0a0a0f]/80 px-4 py-3 backdrop-blur-xl sm:px-6">
        <div className="mx-auto max-w-3xl">
          <ChatInput onSend={handleSend} isProcessing={isProcessing} />
          <p className="mt-2 text-center text-[11px] text-white/25">
            Powered by BART-large-MNLI{' '}
            <Link href="/privacy" className="underline decoration-white/20 hover:text-white/40">Privacy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function WelcomeScreen({ onSend }: { onSend: (text: string) => void }) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-violet-600 shadow-2xl shadow-violet-500/30">
          <Sparkles className="h-9 w-9 text-white" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{siteConfig.name}</h2>
        <p className="mt-2 max-w-md text-base text-white/50">Describe your situation in your own words</p>
      </motion.div>

      <div className="mt-10 grid w-full max-w-2xl gap-3 sm:grid-cols-3">
        {EXAMPLE_PROMPTS.map((prompt, i) => (
          <motion.button key={prompt.title} type="button" onClick={() => onSend(prompt.text)}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 + i * 0.1 }}
            whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
            className="group rounded-2xl border border-white/10 bg-white/5 p-4 text-left backdrop-blur-xl transition-colors hover:border-violet-500/30 hover:bg-white/[0.08]">
            <span className="text-xl" role="img" aria-hidden="true">{prompt.icon}</span>
            <p className="mt-2 text-sm font-medium text-white/80 group-hover:text-white">{prompt.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-white/40 line-clamp-2">{prompt.text}</p>
          </motion.button>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-10 rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-3">
        <p className="text-center text-xs text-red-300/80">
          <Phone className="mr-1.5 inline h-3 w-3" />
          If you&apos;re in crisis, call{' '}
          <a href="tel:988" className="font-bold text-red-300 hover:text-red-200">988</a>{' '}
          or text{' '}
          <a href="sms:741741&body=HOME" className="font-bold text-red-300 hover:text-red-200">HOME to 741741</a>
        </p>
      </motion.div>
    </div>
  );
}

function MessageRenderer({ message }: { message: ChatMsg }) {
  // System message
  if (message.role === 'system') {
    return (
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center py-2">
        <p className="rounded-full bg-white/5 px-4 py-1.5 text-xs text-white/40">{message.content}</p>
      </motion.div>
    );
  }

  // Loading
  if (message.isLoading) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
        <div className="flex max-w-[85%] items-center gap-3 rounded-2xl rounded-tl-sm border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.span key={i} className="h-2 w-2 rounded-full bg-violet-400/60"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }} />
            ))}
          </div>
          <span className="text-sm text-white/40">Analyzing…</span>
        </div>
      </motion.div>
    );
  }

  // Error
  if (message.isError) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
        <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-red-500/30 bg-red-500/10 p-4 backdrop-blur-xl">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
            <p className="text-sm text-red-300">{message.errorMessage || 'Something went wrong.'}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  // User message
  if (message.role === 'user') {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-tr-sm border border-white/5 bg-gradient-to-br from-blue-600/20 to-violet-600/20 p-4">
          <p className="whitespace-pre-wrap text-sm text-white">{message.content}</p>
        </div>
      </motion.div>
    );
  }

  // ─── Assistant: Crisis ───
  if (message.isCrisis && message.crisisResources && message.crisisResources.length > 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
        <CrisisBlock resources={message.crisisResources} />
      </motion.div>
    );
  }

  // ─── Assistant: Classification results ───
  const cls = message.classification as any | undefined;

  if (cls && cls.categories && cls.categories.length > 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
        <div className="max-w-[85%] space-y-3">
          {cls.categories.slice(0, 2).map((cat: any) => (
            <CategoryCard
              key={cat.label}
              category={cat.label}
              confidence={cat.confidence ?? 0}
            />
          ))}
        </div>
      </motion.div>
    );
  }

  // ─── Assistant: No categories found ───
  if (cls && cls.categories && cls.categories.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
        <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <p className="text-sm text-white/60">I couldn&apos;t find a strong match. Try describing your situation with more details.</p>
        </div>
      </motion.div>
    );
  }

  // Fallback: text content
  if (message.content) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
        <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <p className="whitespace-pre-wrap text-sm text-white/90">{message.content}</p>
        </div>
      </motion.div>
    );
  }

  return null;
}
