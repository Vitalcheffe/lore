'use client';

import { motion } from 'framer-motion';
import { getConfidenceColor, getConfidenceLevel } from '@/config/ai';
import { cn } from '@/lib/utils';

interface ConfidenceRingProps {
  confidence: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const SIZE_MAP = {
  sm: 48,
  md: 80,
  lg: 120,
} as const;

const STROKE_MAP = {
  sm: 4,
  md: 6,
  lg: 8,
} as const;

const FONT_MAP = {
  sm: 'text-xs',
  md: 'text-lg',
  lg: 'text-2xl',
} as const;

function getConfidenceLabelShort(confidence: number): string {
  const level = getConfidenceLevel(confidence);
  switch (level) {
    case 'high':
      return 'High';
    case 'medium':
      return 'Moderate';
    case 'low':
      return 'Low';
    case 'veryLow':
      return 'Very Low';
  }
}

export function ConfidenceRing({ confidence, size = 'md', showLabel = true }: ConfidenceRingProps) {
  const dimension = SIZE_MAP[size];
  const strokeWidth = STROKE_MAP[size];
  const radius = (dimension - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const color = getConfidenceColor(confidence);
  const clampedConfidence = Math.min(100, Math.max(0, confidence));
  const offset = circumference - (clampedConfidence / 100) * circumference;
  const center = dimension / 2;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: dimension, height: dimension }}>
        <svg
          width={dimension}
          height={dimension}
          viewBox={`0 0 ${dimension} ${dimension}`}
          className="-rotate-90"
          role="img"
          aria-label={`Confidence: ${clampedConfidence}%`}
        >
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={strokeWidth}
          />
          {/* Animated confidence arc */}
          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className={cn('font-semibold text-white', FONT_MAP[size])}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {Math.round(clampedConfidence)}%
          </motion.span>
        </div>
      </div>

      {showLabel && (
        <motion.span
          className="text-xs font-medium text-white/60"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
          style={{ color }}
        >
          {getConfidenceLabelShort(clampedConfidence)}
        </motion.span>
      )}
    </div>
  );
}
