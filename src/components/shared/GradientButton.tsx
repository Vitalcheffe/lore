// ═══════════════════════════════════════════════════════════
// ClearPath AI — Gradient Button
// ═══════════════════════════════════════════════════════════

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface GradientButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:brightness-110',
  secondary:
    'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:brightness-110',
  outline:
    'border border-white/20 bg-transparent text-white hover:border-white/40 hover:bg-white/5',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export function GradientButton({
  variant = 'primary',
  size = 'md',
  href,
  className,
  children,
  onClick,
  disabled = false,
  type = 'button',
}: GradientButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0f]',
    variantStyles[variant],
    sizeStyles[size],
    disabled && 'pointer-events-none opacity-50',
    className
  );

  const motionProps = {
    whileHover: disabled ? undefined : { scale: 1.03 },
    whileTap: disabled ? undefined : { scale: 0.97 },
    transition: { duration: 0.15 },
  };

  if (href) {
    return (
      <motion.div className="inline-block" {...motionProps}>
        <Link href={href} className={classes}>
          {children}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
}
