// ═══════════════════════════════════════════════════════════
// ClearPath AI — Animated Number Counter
// ═══════════════════════════════════════════════════════════

'use client';

import { useEffect, useRef } from 'react';
import {
  useMotionValue,
  useTransform,
  animate,
  motion,
} from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  decimals?: number;
  duration?: number;
}

export function AnimatedCounter({
  value,
  suffix = '',
  decimals = 0,
  duration = 2,
}: AnimatedCounterProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) =>
    latest.toFixed(decimals)
  );
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const controls = animate(count, value, {
      duration,
      ease: 'easeOut',
    });

    return controls.stop;
  }, [count, value, duration]);

  useEffect(() => {
    const unsubscribe = rounded.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = latest + suffix;
      }
    });

    return unsubscribe;
  }, [rounded, suffix]);

  return (
    <motion.span
      ref={ref}
      className="tabular-nums text-4xl font-bold text-white sm:text-5xl"
    >
      0{suffix}
    </motion.span>
  );
}
