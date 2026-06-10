// ═══════════════════════════════════════════════════════════
// ClearPath AI — Theme Provider (next-themes)
// ═══════════════════════════════════════════════════════════

'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
