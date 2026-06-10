# Task 5-medium — Medium Fix Agent

## Task: Fix MEDIUM priority issues (M1–M13)

## Summary

Fixed 10 MEDIUM priority issues across 7 files. M5/M6/M7 were already fixed by previous agents. M14/M15 were skipped per instructions.

## Changes Made

| Issue | File | Change |
|-------|------|--------|
| M1 | `src/app/page.tsx` | Removed 6 unused imports: Check, Star, Users, BarChart3, Send, Layers. Kept Globe and Cpu (used in infrastructure section). |
| M2 | `package.json` | Changed `"name": "nextjs_tailwind_shadcn_ts"` → `"name": "lore"` |
| M3 | `src/app/about/page.tsx` | Changed hackathon badge year "2025" → "2026" |
| M4 | `tailwind.config.ts` | Updated content paths to include `src/` prefix |
| M8 | `src/app/layout.tsx` | Added `metadataBase`, `twitter` card metadata |
| M9 | `src/app/globals.css` | Added `.grain-overlay { position: relative; }` before `::after` |
| M10 | `src/app/app/page.tsx` | Changed Upgrade `<button>` to `<Link href="/pricing">` |
| M11 | `src/app/app/page.tsx` | Added `filteredEntries` search filtering logic |
| M12 | `src/app/app/page.tsx` | Added `tabFilteredEntries` tab filtering, replaced `factEntries.map` with `tabFilteredEntries.map` |
| M13 | `src/app/layout.tsx` | Added `alternates: { canonical: '/' }` to metadata |

## Verification

- Dev server compiling successfully
- All pages returning HTTP 200
- Lint: 7 pre-existing errors only (carousel.tsx, use-mobile.ts) — no new errors introduced
