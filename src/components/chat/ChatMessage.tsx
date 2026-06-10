'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Clock } from 'lucide-react';
import { CategoryCard } from './CategoryCard';
import { CrisisBlock } from './CrisisBlock';
import type { ChatMessage as ChatMessageType } from '@/types/chat';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: ChatMessageType;
}

/** Format ISO timestamp to readable time */
function formatTimestamp(iso: string): string {
  try {
    const date = new Date(iso);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

/** Loading dots skeleton */
function LoadingDots() {
  return (
    <div className="flex items-center gap-1.5 py-2">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-2 w-2 rounded-full bg-white/30"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.2,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [showTimestamp, setShowTimestamp] = useState(false);
  const time = formatTimestamp(message.timestamp);

  // System message — centered, small, muted
  if (message.role === 'system') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex justify-center py-2"
      >
        <p className="rounded-full bg-white/5 px-4 py-1.5 text-xs text-white/40">
          {message.content}
        </p>
      </motion.div>
    );
  }

  // Loading message
  if (message.isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex justify-start"
      >
        <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <LoadingDots />
        </div>
      </motion.div>
    );
  }

  // Error message
  if (message.isError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex justify-start"
      >
        <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-red-500/30 bg-red-500/10 p-4 backdrop-blur-xl">
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
            <div>
              <p className="text-sm text-red-300">
                {message.errorMessage || 'Something went wrong. Please try again.'}
              </p>
              <p className="mt-1 text-xs text-red-400/50">
                Your input was not stored. You can safely retry.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // User message — right-aligned, blue-violet gradient
  if (message.role === 'user') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex justify-end"
        onMouseEnter={() => setShowTimestamp(true)}
        onMouseLeave={() => setShowTimestamp(false)}
        onFocus={() => setShowTimestamp(true)}
        onBlur={() => setShowTimestamp(false)}
      >
        <div className="max-w-[85%]">
          <div className="rounded-2xl rounded-tr-sm bg-gradient-to-br from-blue-600/20 to-violet-600/20 p-4 border border-white/5">
            <p className="whitespace-pre-wrap text-sm text-white">{message.content}</p>
          </div>
          {/* Timestamp on hover */}
          {showTimestamp && time && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-1 text-right text-xs text-white/30"
            >
              {time}
            </motion.p>
          )}
        </div>
      </motion.div>
    );
  }

  // Assistant message — left-aligned, dark glass card
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex justify-start"
      onMouseEnter={() => setShowTimestamp(true)}
      onMouseLeave={() => setShowTimestamp(false)}
      onFocus={() => setShowTimestamp(true)}
      onBlur={() => setShowTimestamp(false)}
    >
      <div className="max-w-[85%] space-y-3">
        <div className="rounded-2xl rounded-tl-sm border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <p className="whitespace-pre-wrap text-sm text-white/90">{message.content}</p>
        </div>

        {/* Crisis resources block — RULE 2: sacred */}
        {message.isCrisis && message.crisisResources && message.crisisResources.length > 0 && (
          <CrisisBlock resources={message.crisisResources} />
        )}

        {/* Classification result inline */}
        {message.classification && (
          <CategoryCard
            category={message.classification.category}
            confidence={message.classification.confidence}
            allScores={message.classification.allScores}
            sourceQuality={message.classification.sourceQuality}
            verificationStatus={message.classification.verificationStatus}
            matchedResources={message.classification.matchedResources}
            classificationId={message.classification.id}
          />
        )}

        {/* Timestamp on hover */}
        {showTimestamp && time && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-1 text-xs text-white/30"
          >
            <Clock className="h-3 w-3" />
            {time}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
