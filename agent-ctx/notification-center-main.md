# Task: Notification Center for Lore App

## Summary
Added a notification center to the Lore app with a bell icon, dropdown panel, and desktop header bar integration.

## Files Created
- `/home/z/my-project/src/components/app/notification-center.tsx` — NotificationCenter component with bell, dropdown, Zustand store, and client-side data fetching

## Files Modified
- `/home/z/my-project/src/app/app/layout.tsx` — Added desktop header bar with page title, notification bell, and user avatar

## Implementation Details

### NotificationCenter Component
- **Bell icon** with unread count badge (animated with framer-motion spring)
- **Subtle bounce animation** on the bell when there are unread notifications
- **Dropdown panel** with framer-motion enter/exit animations (opacity, y, scale)
- **Staggered entrance animation** for notification items
- **3 smart notifications** generated client-side from API data:
  1. "Your morning digest is ready!" — shown when today's digest hasn't been read (from `/api/digest`)
  2. "X new knowledge connections found" — shown when 2+ nodes lack edges (from `/api/nodes` + `/api/edges`)
  3. "AI found 2 insights in your notes" — shown when notes lack AI summaries (from `/api/notes`)
- Each notification has: icon, title, description, time ago, read/unread dot indicator
- **Mark as read** on click (navigates to linked page)
- **Mark all as read** button
- **Empty state**: "No new notifications" with CheckCircle2 icon
- **Close on outside click** and **Escape key**
- **Zustand store** for state management (`useNotificationCenter`)

### Layout Integration
- Desktop-only header bar (hidden on mobile with `hidden lg:flex`)
- Height: h-14, white background, bottom border
- Contains: page title (from pathname), notification bell, vertical separator, user avatar
- Page title mapping: Dashboard, Knowledge Graph, AI Chat, Memory, Morning Digest, Settings, Team

## Lint Status
All new code passes lint. Pre-existing errors in `record_*.js` files are unrelated.
