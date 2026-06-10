'use client';

import { motion } from 'framer-motion';
import { HelpCircle, SkipForward, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ClarifyPanelProps {
  question: string;
  onReply: (answer: string) => void;
  onSkip: () => void;
}

/** Common quick-reply suggestions based on typical clarification patterns */
const QUICK_REPLIES = [
  'Yes, that sounds right',
  'No, something else',
  'I need immediate help',
  'Tell me more options',
] as const;

export function ClarifyPanel({ question, onReply, onSkip }: ClarifyPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={cn(
        'rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 backdrop-blur-xl',
      )}
    >
      {/* Question header */}
      <div className="flex items-start gap-3">
        <div className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-xl',
          'bg-amber-500/20 text-amber-400',
        )}>
          <HelpCircle className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-semibold text-white">
            Can you help us narrow it down?
          </h4>
          <p className="mt-1 text-sm leading-relaxed text-white/70">
            {question}
          </p>
        </div>
      </div>

      {/* Quick reply buttons */}
      <div className="mt-4 flex flex-wrap gap-2">
        {QUICK_REPLIES.map((reply) => (
          <motion.button
            key={reply}
            type="button"
            onClick={() => onReply(reply)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              'min-h-[44px] rounded-xl border border-white/10 bg-white/5 px-4 py-2',
              'text-sm text-white/70 transition-colors',
              'hover:border-amber-500/30 hover:bg-amber-500/10 hover:text-white',
            )}
          >
            {reply}
          </motion.button>
        ))}
      </div>

      {/* Skip + Human help row */}
      <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
        <motion.button
          type="button"
          onClick={onSkip}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            'flex min-h-[44px] items-center gap-1.5 rounded-xl px-3 text-sm',
            'text-white/40 transition-colors hover:text-white/70',
          )}
        >
          <SkipForward className="h-4 w-4" />
          Skip
        </motion.button>

        <a
          href="tel:211"
          className={cn(
            'flex min-h-[44px] items-center gap-1.5 rounded-xl px-3 text-sm',
            'text-amber-400/80 transition-colors hover:text-amber-400',
          )}
          aria-label="Call 211 to talk to a navigator"
        >
          <Heart className="h-4 w-4" />
          Talk to a Navigator
        </a>
      </div>
    </motion.div>
  );
}
