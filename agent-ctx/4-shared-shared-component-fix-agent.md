# Task 4-shared — Shared Component Fix Agent

## Task
Fix HIGH priority shared component issues (H1, H2, H3, H5) in the LORE project.

## Work Completed

### H1: Sparkline SVG gradient ID collisions
- Created `src/components/shared/sparkline.tsx` with `useId()` for unique gradient IDs
- Removed local Sparkline from `src/app/page.tsx` and `src/app/app/page.tsx`
- Both files now import from shared component

### H2: Use shared FadeIn component
- Replaced local FadeIn in: about, pricing, terms, privacy pages
- All 4 pages now import from `@/components/shared/fade-in`
- Cleaned up unused `useRef` and `useInView` imports

### H3: Extract shared SectionDivider
- Created `src/components/shared/section-divider.tsx`
- Replaced local definitions in about and pricing pages

### H5: Rename ChatMessage → ChatPanelMessage
- Renamed interface in `src/components/lore/chat-panel.tsx`
- Updated all references within the file

## Verification
- All 6 modified pages return HTTP 200
- Dev server compiles successfully
- All lint errors are pre-existing
