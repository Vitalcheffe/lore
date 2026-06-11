# Task: Add Global Search Bar to Sidebar + Profile Completion Indicator

## Agent: Main Developer

### Summary
Added two polish features to the Lore app:

1. **Global Search Bar in Sidebar** (`src/components/app/sidebar-search.tsx`)
   - Search input with search icon and "Search..." placeholder
   - On focus/typing, shows a dropdown with matching results from knowledge nodes, notes, and conversations
   - Debounced search (300ms) that fetches from `/api/nodes`, `/api/notes`, `/api/conversations` on mount, then filters client-side by title
   - Results grouped by type with labeled sections (Knowledge Nodes, Notes, Conversations)
   - Clicking a result navigates to the appropriate page (/app/graph, /app/memory, /app/chat)
   - Uses existing Input component from `@/components/ui/input`
   - Compact dropdown that overlays sidebar content with smooth framer-motion animations
   - ⌘K badge on right side of search input that dispatches a keyboard event to open the existing CommandPalette
   - Click-outside-to-close behavior
   - Loading spinner during search, empty state when no results
   - Footer showing result count and ⌘K hint

2. **Profile Completion Indicator on Dashboard** (`src/components/app/profile-completion.tsx`)
   - Circular progress ring (SVG with animated stroke) indicating profile completion percentage
   - Calculates completion based on 4 criteria (25% each):
     - Has name: +25%
     - Has username: +25% (fetched from `/api/user/profile`)
     - Has at least 1 knowledge node: +25%
     - Has completed onboarding: +25%
   - Shows a checklist of missing items with icons and arrow links to relevant pages
   - Only shows if profile < 100% complete (returns null when complete)
   - Uses emerald/green colors matching the app's theme
   - Framer-motion animations: card entrance, progress ring animation, staggered checklist items, percentage pulse
   - Gradient card background (emerald-50/80 → white → teal-50/40)

### Files Modified
- `src/components/app/sidebar.tsx` - Added SidebarSearch import and component between logo and nav
- `src/app/app/page.tsx` - Added ProfileCompletionCard import and component after welcome section

### Files Created
- `src/components/app/sidebar-search.tsx` - Global search bar component
- `src/components/app/profile-completion.tsx` - Profile completion card component

### No Breaking Changes
- All existing functionality preserved
- No API changes required
- Lint passes on all modified/created files
