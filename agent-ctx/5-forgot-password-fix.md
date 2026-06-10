# Task 5 — Forgot Password Fix Agent

## Task
Fix the forgot-password page to remove demo/simulation behavior.

## Changes Made

### 1. `/src/app/forgot-password/page.tsx`

**Removed:**
- Demo button "I clicked the reset link" (old lines 396-405) that bypassed email verification by directly calling `setCurrentStep(3)`
- Comment `{/* Simulate clicking the link (demo) */}`

**Added:**
- Realistic informational message in step 2: "Check your email for a password reset link. If an account with that email exists, you'll receive a reset link shortly."
- `useSearchParams` hook to read `?token=xxx` from URL — users arriving from a real email reset link automatically land on step 3
- Initial step derived from URL token: `useState<1 | 2 | 3 | 4>(resetToken ? 3 : 1)`
- Rewrote `handleResetSubmit` to call `/api/auth/reset-password` API with token, password, and confirmPassword
- Error display UI in step 3 (red alert box with AlertTriangle icon)
- Loading state for step 3 submit button (shows "Resetting..." with spinner)
- `<Suspense>` boundary wrapping `ForgotPasswordForm` (required by Next.js for `useSearchParams`)

**Fixed bugs:**
- Step 3 button disabled condition used `confirmPassword` (undefined) instead of `confirmNewPassword`
- Removed unused `useCallback` import

**Kept intact:**
- "Resend email" button with countdown (real functionality)
- "Try another email address" button (real functionality)
- Step 3 (New Password) form UI and logic
- Step 4 (Success) page
- Troubleshooting section
- All security notices and trust indicators

### 2. `/src/app/api/auth/forgot-password/route.ts`

**Updated to create verification tokens in the database:**
- Deletes any existing reset tokens for the email first
- Generates a UUID token (`randomUUID()`) with 24-hour expiry
- Stores it in the `VerificationToken` table (already existed in Prisma schema)
- Includes TODO comment for email service integration
- Still returns the same success message regardless (prevents email enumeration)

### Verification
- Build passes with `npx next build`
- No lint errors in the forgot-password page
- No demo/simulation behavior remains in the forgot-password flow
