# Search API & Command Palette Integration

## Task
Add a search API endpoint that lets users search across all their knowledge (nodes, notes, conversations), and integrate it into the command palette.

## Changes Made

### 1. Created `/src/app/api/search/route.ts`
- New GET endpoint that accepts `?q=` query parameter
- Searches across `KnowledgeNode`, `Note`, and `ChatConversation` models
- Uses Prisma `contains` with `mode: 'insensitive'` for case-insensitive matching
- Searches title, content, tags for nodes; title, content, category for notes; title, preview for conversations
- Returns up to 5 nodes, 5 notes, 3 conversations (sorted by `updatedAt` desc)
- Each result includes: id, type, title, description (truncated to 100 chars), href, icon name
- Requires authentication via `getAuthenticatedUserId`

### 2. Updated `/src/components/app/command-palette.tsx`
- Added `SearchResult` interface for API response items
- Added `searchResultIconMap` and `searchResultColorMap` helpers for rendering search result icons/colors by type
- Added `searchQuery`, `searchResults`, `isSearching` state + `searchTimerRef` for debouncing
- Made `CommandInput` controlled with `value={searchQuery}` and `onValueChange={setSearchQuery}`
- Added debounced search effect (300ms delay, min 2 chars) that fetches `/api/search?q=...`
- Added "Search Results" `CommandGroup` that renders API results with type badges
- Added loading indicator (spinning Loader2) when searching with no results yet
- Static groups (Navigation, Actions, Knowledge Nodes, Notes, Conversations) are hidden when actively searching (query >= 2 chars)
- Search state resets when palette closes
- Updated `CommandEmpty` to show "Searching…" during loading

## Lint Status
- No new lint errors introduced (pre-existing errors in other files remain)
- Dev server running successfully on port 3000
