// ═══════════════════════════════════════════════════════════
// ClearPath AI — Glass Morphism Card
// ═══════════════════════════════════════════════════════════

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  className?: string;
  hover?: boolean;
  children: React.ReactNode;
}

export function GlassCard({
  className,
  hover = true,
  children,
}: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        'rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-colors duration-300',
        hover &&
          'hover:border-white/20 hover:bg-white/10 hover:shadow-lg hover:shadow-black/20',
        className
      )}
      whileHover={hover ? { y: -2 } : undefined}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}
