# Task 3-kg: Fix C4 + C5 in knowledge-graph.tsx

## Summary

Fixed two critical issues in `src/components/lore/knowledge-graph.tsx`:

### C4: Undefined CSS custom properties
Replaced all 5 undefined CSS custom properties with their actual hardcoded values:
- `var(--text-dim)` → `rgba(255,255,255,0.55)` (6 occurrences)
- `var(--text-faint)` → `rgba(255,255,255,0.35)` (12 occurrences)
- `var(--text-secondary)` → `rgba(255,255,255,0.55)` (2 occurrences)
- `var(--surface-3)` → `#12121E` (1 occurrence)
- `var(--surface-5)` → `#0A0A12` (1 occurrence)

### C5: Wrong color scheme (Indigo → Violet)
Replaced all indigo colors with LORE's violet design system colors:
- `#6366F1` → `#8B5CF6` (4 occurrences)
- `#818CF8` → `#A78BFA` (4 occurrences)
- `rgba(99, 102, 241,` → `rgba(139, 92, 246,` (7 occurrences)
- Comment "Indigo accent" → "Violet accent"

## Verification
- Grep confirmed 0 remaining occurrences of old values
- Dev server compiling successfully with no errors
