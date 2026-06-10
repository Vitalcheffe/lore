'use client';

import { motion } from 'framer-motion';
import { Phone, ExternalLink, Heart } from 'lucide-react';
import type { CrisisResource } from '@/types/classification';
import { cn } from '@/lib/utils';

interface CrisisBlockProps {
  resources: CrisisResource[];
}

export function CrisisBlock({ resources }: CrisisBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'rounded-2xl border-2 border-red-500/60 bg-white/5 p-5 backdrop-blur-xl',
        'shadow-[0_0_30px_rgba(239,68,68,0.15)]',
        'animate-[pulse-red-glow_3s_ease-in-out_infinite]',
      )}
      role="alert"
      aria-live="assertive"
      aria-label="Crisis resources"
    >
      {/* Header */}
      <div className="mb-4 flex items-start gap-3">
        <span className="text-2xl leading-none" role="img" aria-hidden="true">
          ⚠️
        </span>
        <div>
          <h3 className="text-base font-semibold text-white">
            If you&apos;re in crisis, help is available right now
          </h3>
          <p className="mt-1 text-sm text-white/60">
            You don&apos;t have to face this alone. Reach out — people are standing by to help.
          </p>
        </div>
      </div>

      {/* Crisis resource list */}
      <div className="space-y-3">
        {resources.map((resource, index) => (
          <motion.div
            key={`${resource.name}-${index}`}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: index * 0.08 }}
            className="rounded-xl border border-white/10 bg-white/5 p-4"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-white">{resource.name}</p>
                <p className="text-sm text-white/60">{resource.action}</p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {/* Phone link — large touch target RULE 12 */}
                <a
                  href={`tel:${resource.call}`}
                  className={cn(
                    'inline-flex min-h-[44px] min-w-[44px] items-center gap-2 rounded-xl px-4 py-2.5',
                    'bg-red-500/20 text-red-300 font-semibold text-sm',
                    'transition-colors hover:bg-red-500/30 active:bg-red-500/40',
                    'border border-red-500/30',
                  )}
                  aria-label={`Call ${resource.name} at ${resource.call}`}
                >
                  <Phone className="h-4 w-4" />
                  <span>{resource.call}</span>
                </a>

                {/* URL link if available */}
                {resource.url && (
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl px-3 py-2.5',
                      'bg-white/10 text-white/70 text-sm',
                      'transition-colors hover:bg-white/20 hover:text-white',
                    )}
                    aria-label={`Visit ${resource.name} website`}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 988 Lifeline — always prominently displayed */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className={cn(
          'mt-4 rounded-xl border border-red-500/40 bg-red-500/10 p-4',
          'text-center',
        )}
      >
        <p className="text-sm font-medium text-white/80">
          Suicide & Crisis Lifeline
        </p>
        <a
          href="tel:988"
          className={cn(
            'mt-1 inline-flex min-h-[44px] items-center gap-2 rounded-xl px-6 py-3',
            'bg-gradient-to-r from-red-600 to-red-500 text-white font-bold text-lg',
            'transition-all hover:shadow-lg hover:shadow-red-500/30 active:scale-[0.98]',
          )}
          aria-label="Call 988 Suicide and Crisis Lifeline"
        >
          <Phone className="h-5 w-5" />
          Call 988
        </a>
        <p className="mt-2 text-xs text-white/50">
          Available 24/7 — Call or text 988
        </p>
      </motion.div>

      {/* Talk to a Navigator button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        className="mt-4 text-center"
      >
        <a
          href="tel:211"
          className={cn(
            'inline-flex min-h-[44px] items-center gap-2 rounded-xl px-5 py-2.5',
            'border border-white/20 bg-white/5 text-white/80 font-medium text-sm',
            'transition-colors hover:bg-white/10 hover:text-white',
          )}
          aria-label="Call 211 to talk to a navigator"
        >
          <Heart className="h-4 w-4" />
          Talk to a Navigator (211)
        </a>
      </motion.div>

      {/* Safety note */}
      <p className="mt-4 text-center text-xs text-white/40">
        All crisis resources are verified and hardcoded — no AI-generated content.
      </p>
    </motion.div>
  );
}
