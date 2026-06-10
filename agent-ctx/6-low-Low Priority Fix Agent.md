# Task 6-low — Low Priority Fix Agent

## Summary
Fixed all 5 LOW priority issues (L1, L3, L8, L9, L10) for the LORE hackathon project.

## Changes Made

### L1: JSON-LD Structured Data
- **File**: `src/app/layout.tsx`
- Added `<script type="application/ld+json">` with SoftwareApplication schema inside `<body>`, before `{children}`
- Schema includes: name, description, applicationCategory (Productivity), operatingSystem (Web), free offer

### L3: Updated robots.txt
- **File**: `public/robots.txt`
- Replaced multi-user-agent format (Googlebot, Bingbot, Twitterbot, facebookexternalhit) with simplified `User-agent: *` + `Allow: /` + `Sitemap: https://getlore.dev/sitemap.xml`

### L8: Verified Shared FadeIn Usage
- Grepped for local `function FadeIn` / `const FadeIn` definitions — none found outside shared component
- All 4 consuming pages (about, pricing, terms, privacy) already import from `@/components/shared/fade-in`
- No changes needed

### L9: Reduced Motion Support
- **File**: `src/components/shared/fade-in.tsx`
- Added `useReducedMotion` import from `framer-motion`
- Added early return: when `prefersReducedMotion` is true, renders plain `<div>` with className and children (no animation)

### L10: Remove Upload Directory
- Deleted `upload/IMG_0438.png`
- Removed empty `upload/` directory

## Verification
- All pages return HTTP 200
- Lint shows only pre-existing 6 errors (carousel.tsx, use-mobile.ts)
- No new errors introduced
