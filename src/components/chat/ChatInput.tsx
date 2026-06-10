'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { MAX_INPUT_LENGTH } from '@/config/constants';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (text: string) => void;
  isProcessing: boolean;
  disabled?: boolean;
}

export function ChatInput({ onSend, isProcessing, disabled = false }: ChatInputProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isDisabled = isProcessing || disabled;

  // Auto-resize textarea up to 4 rows
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 24;
    const maxHeight = lineHeight * 4 + 16; // 4 rows + padding
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
  }, [text]);

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed || isDisabled) return;
    if (trimmed.length > MAX_INPUT_LENGTH) return;

    onSend(trimmed);
    setText('');

    // Reset height after sending
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [text, isDisabled, onSend]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const charCount = text.length;
  const isOverLimit = charCount > MAX_INPUT_LENGTH;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative w-full"
    >
      <div
        className={cn(
          'flex items-end gap-3 rounded-2xl border bg-white/5 p-3 backdrop-blur-xl transition-all duration-200',
          'border-white/10',
          !isDisabled && 'focus-within:border-violet-500/50 focus-within:shadow-[0_0_20px_rgba(139,92,246,0.15)]',
          isDisabled && 'opacity-60',
        )}
      >
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isDisabled}
          placeholder="Describe your situation in your own words..."
          rows={1}
          className={cn(
            'flex-1 resize-none bg-transparent text-white placeholder:text-white/40',
            'text-sm leading-6 outline-none',
            'scrollbar-thin scrollbar-thumb-white/10',
          )}
          maxLength={MAX_INPUT_LENGTH + 50} // Allow slight overshoot for UX, validated on send
          aria-label="Chat message input"
        />

        {/* Character count + Send button */}
        <div className="flex shrink-0 flex-col items-center gap-1">
          <span
            className={cn(
              'text-xs tabular-nums transition-colors',
              isOverLimit ? 'text-red-400' : charCount > MAX_INPUT_LENGTH * 0.9 ? 'text-amber-400' : 'text-white/30',
            )}
          >
            {charCount}/{MAX_INPUT_LENGTH}
          </span>

          <motion.button
            type="button"
            onClick={handleSend}
            disabled={isDisabled || !text.trim() || isOverLimit}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-xl transition-colors',
              'min-h-[44px] min-w-[44px]', // Touch target RULE 12
              text.trim() && !isDisabled && !isOverLimit
                ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-violet-500/25'
                : 'bg-white/10 text-white/30',
            )}
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
