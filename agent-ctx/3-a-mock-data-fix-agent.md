# Task 3-a: Fix history page and profile page hardcoded/mock data

## Summary
Removed all hardcoded/mock data from the history page and profile page, replacing with real API data.

## Changes Made

### 1. History Page (`/src/app/history/page.tsx`)
- **Removed**: Hardcoded `recentSearches = ['housing assistance', 'food stamps', 'crisis support', 'legal aid']`
- **Added**: `useState<string[]>([])` for `recentSearches`
- **Added**: `useEffect` that fetches 4 most recent conversations from `/api/conversations` and uses their titles as recent search suggestions
- **Added**: Empty state "No recent searches" when no conversations exist

### 2. Profile API (`/src/app/api/user/profile/route.ts`)
- **Added**: `accounts: { select: { id: true, provider: true } }` to Prisma include
- **Added**: `sessions: { select: { id: true, sessionToken: true, expires: true } }` to Prisma include
- **Added**: `connectedProviders` field in API response (array of provider strings)
- **Added**: `sessions` field in API response (array of session objects)

### 3. Profile Page (`/src/app/profile/page.tsx`)
- **Removed**: Hardcoded `connectedAccounts` array (Google/GitHub with `connected: false`)
- **Replaced with**: Dynamic `connectedAccounts` derived from `profileData.connectedProviders`
- **Removed**: Hardcoded `activeSessions = [{ id: '1', device: 'Current browser' }]`
- **Replaced with**: Dynamic `activeSessions` derived from `profileData.sessions` (falls back to "Current browser" only when no API data)
- **Fixed**: Undefined variables in privacy score (`emailNotifications` → `emailNotifs`, etc.)
- **Fixed**: Stats type mismatch — updated to match actual API response shape

## Build Status
- ✅ `npx next build` passes
- ✅ `bun run lint` passes (no errors in project files)
