// ═══════════════════════════════════════════════════════════
// ClearPath AI — Loading Spinner
// ═══════════════════════════════════════════════════════════

import { cn } from '@/lib/utils';

type SpinnerSize = 'sm' | 'md' | 'lg';

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  label?: string;
}

const sizeMap: Record<SpinnerSize, number> = {
  sm: 16,
  md: 32,
  lg: 48,
};

export function LoadingSpinner({
  size = 'md',
  label,
}: LoadingSpinnerProps) {
  const px = sizeMap[size];
  const borderWidth = size === 'sm' ? 2 : 3;

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className="animate-spin rounded-full border-violet-500"
        style={{
          width: px,
          height: px,
          borderWidth,
          borderStyle: 'solid',
          borderColor: 'rgb(139 92 246)',
          borderRightColor: 'transparent',
        }}
        role="status"
        aria-label={label ?? 'Loading'}
      />
      {label && (
        <p className={cn(
          'text-white/70',
          size === 'sm' && 'text-xs',
          size === 'md' && 'text-sm',
          size === 'lg' && 'text-base',
        )}>
          {label}
        </p>
      )}
    </div>
  );
}
