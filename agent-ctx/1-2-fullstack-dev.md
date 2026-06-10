# Task 1 & 2: Forgot Password + Onboarding Flow for LORE

## Summary
Created 3 new page files for the LORE project, following the existing design system and patterns.

## Files Created

### 1. `/home/z/my-project/lore/src/app/auth/forgot-password/page.tsx`
- Split-layout matching login page pattern (left branding, right form)
- Left panel: LoreLogo, "Reset your memory" headline with gradient, Lock/Mail/Shield feature bullets
- Right panel: "Forgot password?" card with email input, submit button with loading state
- Success state: animated transition to "Check your email" card with Mail icon in violet circle
- State: email, loading, submitted
- Simulates 1.5s API delay on submit

### 2. `/home/z/my-project/lore/src/app/auth/reset-password/page.tsx`
- Split-layout matching login/signup pattern
- Left panel: LoreLogo, "Choose a new password" headline with gradient, Lock/Shield/Sparkles bullets
- Right panel: "Set new password" card with:
  - New password input with show/hide toggle
  - Confirm password input with show/hide toggle
  - Password strength indicator (3 bars: red/yellow/green)
  - Password requirements checklist (8+ chars, uppercase, number, special char) — turns green when met
- Success state: animated checkmark card with link to login
- State: password, confirmPassword, showPassword, showConfirm, loading, submitted

### 3. `/home/z/my-project/lore/src/app/onboarding/page.tsx`
- Full-screen dark background, centered card, progress indicator at top
- 5 steps with Framer Motion slide transitions:
  - **Step 1 (Welcome)**: Big LoreLogo, "Welcome to Lore" with gradient, Account type toggle (Individual/Team), "Get Started" button
  - **Step 2 (Profile Setup)**: Role selector (5 options), Team size (conditional, 4 options), Use case checkboxes (6 options), Back + Continue
  - **Step 3 (Connect Sources)**: Grid of 6 integration cards (Slack, Notion, Google Workspace, Microsoft Teams, GitHub, Email), Connect/Connected toggle, Skip option, Back + Continue
  - **Step 4 (Morning Digest)**: Delivery time selector, Content toggles (4 options with ToggleLeft/ToggleRight), Delivery method, Preview card showing digest mockup, Back + Continue
  - **Step 5 (Complete)**: Animated checkmark (spring animation), "You're all set!" heading, 3 quick-start cards, "Go to Dashboard" button linking to /app
- Progress bar: 5 dots with connecting lines, active step highlighted in violet
- Step counter at bottom
- Located at `/onboarding` (outside `/app` route group) to avoid sidebar/topbar layout

## Design System Compliance
- All colors from the LORE design system (violet palette, dark surfaces, opacity levels)
- CSS classes: card-dark, btn-violet, btn-ghost-dark, text-gradient-violet, violet-glow, bg-grid, bg-dots
- Consistent with existing auth page patterns (login, signup)

## Lint Results
- All 3 new files pass ESLint with zero errors
- 6 pre-existing errors in the codebase (unrelated to new files)
