// ═══════════════════════════════════════════════════════════
// ClearPath AI — Section Wrapper
// ═══════════════════════════════════════════════════════════

import { cn } from '@/lib/utils';

interface SectionProps {
  title?: string;
  subtitle?: string;
  gradient?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function Section({
  title,
  subtitle,
  gradient = false,
  className,
  children,
}: SectionProps) {
  return (
    <section
      className={cn(
        'py-16 sm:py-24',
        gradient && 'bg-gradient-to-b from-violet-950/20',
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          {(title || subtitle) && (
            <div className="flex flex-col gap-3">
              {title && (
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="max-w-2xl text-lg text-white/70">{subtitle}</p>
              )}
            </div>
          )}
          {children}
        </div>
      </div>
    </section>
  );
}
