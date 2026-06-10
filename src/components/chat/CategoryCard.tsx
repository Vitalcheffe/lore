'use client';

import { motion } from 'framer-motion';
import { getConfidenceColor } from '@/config/ai';

interface CategoryCardProps {
  category: string;
  confidence: number;
}

export function CategoryCard({ category, confidence }: CategoryCardProps) {
  const color = getConfidenceColor(confidence);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
    >
      {/* Category name + confidence */}
      <div className="flex items-center justify-between gap-3">
        <h4 className="text-base font-semibold text-white">{category}</h4>
        <span className="text-lg font-bold" style={{ color }}>
          {confidence}%
        </span>
      </div>

      {/* Confidence bar */}
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, confidence))}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
}
