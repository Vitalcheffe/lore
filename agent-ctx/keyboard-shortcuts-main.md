# Task: Add Real Keyboard Shortcuts to Lore Next.js App

## Task ID: keyboard-shortcuts-task

## Summary
Created a fully functional keyboard shortcuts system for the Lore app, making the sidebar's shortcut hints (⌘D, ⌘G, etc.) actually work.

## Files Created
- `/home/z/my-project/src/components/app/keyboard-shortcuts.tsx` — Main component with global keyboard listener, shortcuts help dialog, and help button

## Files Modified
- `/home/z/my-project/src/app/app/layout.tsx` — Added `KeyboardShortcuts` import and rendered it alongside `CommandPalette` and `OnboardingModal`

## Shortcuts Implemented
| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + D` | Go to Dashboard (`/app`) |
| `Cmd/Ctrl + G` | Go to Knowledge Graph (`/app/graph`) |
| `Cmd/Ctrl + M` | Go to Morning Digest (`/app/digest`) |
| `Cmd/Ctrl + N` | Go to Memory (`/app/memory`) |
| `Cmd/Ctrl + T` | Go to Team (`/app/team`) |
| `Cmd/Ctrl + S` | Go to Settings (`/app/settings`) |
| `Cmd/Ctrl + K` | Command Palette (already handled by command-palette.tsx, not overridden) |
| `?` | Toggle shortcuts help dialog |

## Key Features
1. **Global keyboard listener** — Attaches to `document` via `keydown` event
2. **Input detection** — Shortcuts don't fire when typing in `input`, `textarea`, `select`, or `contentEditable` elements
3. **Auth gating** — Only activates when user is authenticated (via `useAuth`)
4. **No ⌘K conflict** — Explicitly skips ⌘K so it doesn't interfere with the existing CommandPalette
5. **Help dialog** — Beautiful dialog using shadcn Dialog + framer-motion animations with:
   - Grouped sections (Navigation / General)
   - Staggered entrance animations for each shortcut row
   - Kbd badges showing key combos
   - Icon + label for each shortcut
   - Footer hint about Mac vs Windows/Linux modifiers
6. **Help button** — Small circular button in bottom-left corner with spring animation, subtle hover effects, and emerald accent on hover
7. **Lint clean** — No new lint errors introduced

## Design Decisions
- Used the same emerald color scheme as the rest of the app
- Help button uses `backdrop-blur-md` and subtle shadow matching the CommandPalette's trigger button style
- Dialog uses staggered `framer-motion` animations for each shortcut row
- Kbd component uses a consistent badge style matching the command palette
