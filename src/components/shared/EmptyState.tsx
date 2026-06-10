// ═══════════════════════════════════════════════════════════
// ClearPath AI — Empty State Display
// ═══════════════════════════════════════════════════════════

import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
        <Icon className="h-8 w-8 text-white/40" />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="max-w-sm text-sm text-white/50">{description}</p>
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className={cn(
            'mt-2 inline-flex items-center justify-center rounded-xl px-6 py-3',
            'bg-gradient-to-r from-blue-600 to-violet-600 text-sm font-semibold text-white',
            'transition-all duration-200 hover:brightness-110 hover:scale-103 active:scale-97',
          )}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
