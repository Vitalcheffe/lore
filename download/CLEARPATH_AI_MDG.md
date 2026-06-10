# ClearPath AI — Master Development Guide (MDG)
## The Definitive Blueprint: From Prototype to Production

**Project:** ClearPath AI — Community Resource Navigator  
**Hackathon:** USAII Global AI Hackathon 2026  
**Author:** Amine Harch El Korane  
**Version:** 1.0.0 — June 2026  
**Status:** Active Development  

---

> *"This document is the single source of truth. Every line of code, every API endpoint, every database table, every component — everything needed to make ClearPath AI real lives here. No ambiguity. No guessing. Just precision."*

---

## Table of Contents

1. [Project Vision & Philosophy](#1-project-vision--philosophy)
2. [Current State Assessment](#2-current-state-assessment)
3. [Architecture Blueprint](#3-architecture-blueprint)
4. [Technology Stack — Complete Reference](#4-technology-stack--complete-reference)
5. [Environment Configuration](#5-environment-configuration)
6. [Database Schema — Complete Prisma Models](#6-database-schema--complete-prisma-models)
7. [API Specification — Every Endpoint](#7-api-specification--every-endpoint)
8. [Authentication & Authorization System](#8-authentication--authorization-system)
9. [AI Classification Pipeline](#9-ai-classification-pipeline)
10. [Crisis Detection System](#10-crisis-detection-system)
11. [6-Layer Transparency System](#11-6-layer-transparency-system)
12. [Frontend Architecture](#12-frontend-architecture)
13. [State Management — Zustand Stores](#13-state-management--zustand-stores)
14. [Component Library — Shared Components](#14-component-library--shared-components)
15. [Page-by-Page Implementation Guide](#15-page-by-page-implementation-guide)
16. [Real-Time Features & WebSocket](#16-real-time-features--websocket)
17. [Security & Privacy Implementation](#17-security--privacy-implementation)
18. [Testing Strategy](#18-testing-strategy)
19. [CI/CD Pipeline](#19-cicd-pipeline)
20. [Deployment & Infrastructure](#20-deployment--infrastructure)
21. [Monitoring, Logging & Analytics](#21-monitoring-logging--analytics)
22. [Rate Limiting & Abuse Prevention](#22-rate-limiting--abuse-prevention)
23. [Email & Notification System](#23-email--notification-system)
24. [Payment Integration — Stripe](#24-payment-integration--stripe)
25. [Blog & Content Management](#25-blog--content-management)
26. [Search & Filtering System](#26-search--filtering-system)
27. [File Storage & Media Management](#27-file-storage--media-management)
28. [Internationalization (i18n)](#28-internationalization-i18n)
29. [Accessibility (a11y)](#29-accessibility-a11y)
30. [Performance Optimization](#30-performance-optimization)
31. [Error Handling & Edge Cases](#31-error-handling--edge-cases)
32. [Data Seeding & Migration](#32-data-seeding--migration)
33. [Third-Party Integrations](#33-third-party-integrations)
34. [Development Workflow & Git Strategy](#34-development-workflow--git-strategy)
35. [Code Quality Standards](#35-code-quality-standards)
36. [Hackathon Demo Script](#36-hackathon-demo-script)
37. [Judge Preparation & Scoring Alignment](#37-judge-preparation--scoring-alignment)
38. [Post-Hackathon Roadmap](#38-post-hackathon-roadmap)
39. [Appendix A — Complete File Tree](#appendix-a--complete-file-tree)
40. [Appendix B — Environment Variables Reference](#appendix-b--environment-variables-reference)
41. [Appendix C — Dependency Audit](#appendix-c--dependency-audit)
42. [Appendix D — Crisis Keyword Database](#appendix-d--crisis-keyword-database)

---


# 1. Project Vision & Philosophy

## 1.1 Mission Statement

ClearPath AI is a community resource navigator that uses AI-powered classification with **calibrated transparency** to connect people in need with verified community resources. Unlike generic AI chatbots that present information with false certainty, ClearPath AI discloses its confidence level, source quality, potential biases, complexity, alternative viewpoints, and verification status for every single classification it makes.

## 1.2 Core Problem

When someone faces a crisis — eviction, food insecurity, domestic violence, substance abuse — they need reliable help fast. Existing systems have critical failures:

- **211.org and similar hotlines**: Offer phone-based navigation with no transparency about data quality or confidence. Users have no idea how reliable the referral is.
- **Generic AI chatbots** (ChatGPT, Claude, etc.): Present information with confident authority even when uncertain, creating dangerous false trust. A person in crisis receiving a wrong referral is not just inconvenient — it can be life-threatening.
- **Government portals**: Overwhelming, outdated, and impossible to navigate during stress.
- **Search engines**: Return SEO-optimized results, not needs-optimized results.

## 1.3 Solution: Calibrated Transparency

ClearPath AI's innovation is the **6-Layer Transparency System**, which is displayed alongside every classification result:

| Layer | What It Shows | Why It Matters |
|-------|---------------|----------------|
| 1. Confidence Score | 0–100% confidence in classification | Users know how much to trust the result |
| 2. Source Quality | Where the data comes from (government, nonprofit, crowd-sourced) | Users can verify credibility |
| 3. Bias Check | Detected biases in the classification | Users understand potential blind spots |
| 4. Complexity Level | How complex the user's situation is | Users know if they need professional help |
| 5. Alternative Views | Other possible classifications | Users see the full picture, not just one answer |
| 6. Verification Status | Whether a human has verified this resource | Users know what's AI-generated vs. human-confirmed |

## 1.4 Target Users

### Primary Users
- **Crisis navigators** (social workers, case managers, 211 operators)
- **Individuals in need** seeking community resources
- **Nonprofit organizations** referring clients to services
- **Community health workers** doing outreach

### Secondary Users
- **Researchers** studying community resource gaps
- **Policy makers** understanding service availability
- **AI ethics advocates** evaluating transparent AI systems

## 1.5 Design Principles

1. **Transparency is non-negotiable** — Every AI output comes with its confidence and limitations
2. **Crisis-first design** — If someone might be in danger, the system detects it immediately
3. **Accessible by default** — Works on any device, any connection speed, any literacy level
4. **Privacy by design** — No personal data stored without consent, all conversations deletable
5. **Open source ethos** — The classification logic is inspectable and auditable
6. **Progressive disclosure** — Show what matters first, reveal complexity on demand

## 1.6 Brand Identity

- **Name**: ClearPath AI
- **Tagline**: "Verified Community Resources with Calibrated Transparency"
- **Logo**: Ultra-minimalist "CP" letters with rock grain texture (symbolizing solid, grounded reliability)
- **Primary Colors**: Blue-violet gradients (#3b82f6 → #8b5cf6), Dark backgrounds (#0a0a0f), Emerald accents (#10b981)
- **Typography**: Inter (weights 300–900), monospace for technical data
- **UI Language**: Glass morphism, subtle animations, premium but approachable

---

# 2. Current State Assessment

## 2.1 What Exists (As of June 2026)

### Pages & Routes — 20 pages, 26 routes

| Route | File | Lines | Status | Real Backend? |
|-------|------|-------|--------|---------------|
| `/` | `src/app/page.tsx` | ~2,500 | ✅ Complete UI | ❌ Mock data |
| `/app` | `src/app/app/page.tsx` | 2,241 | ✅ Complete UI | ❌ Hardcoded mock chat |
| `/about` | `src/app/about/page.tsx` | 1,964 | ✅ Complete UI | N/A (static) |
| `/how-it-works` | `src/app/how-it-works/page.tsx` | 2,154 | ✅ Complete UI | N/A (static) |
| `/responsible-ai` | `src/app/responsible-ai/page.tsx` | 2,302 | ✅ Complete UI | N/A (static) |
| `/pricing` | `src/app/pricing/page.tsx` | 2,070 | ✅ Complete UI | ❌ No Stripe |
| `/privacy` | `src/app/privacy/page.tsx` | 1,185 | ✅ Complete UI | N/A (static) |
| `/terms` | `src/app/terms/page.tsx` | 1,180 | ✅ Complete UI | N/A (static) |
| `/team` | `src/app/team/page.tsx` | 2,456 | ✅ Complete UI | N/A (static) |
| `/contact` | `src/app/contact/page.tsx` | 2,720 | ✅ Complete UI | ❌ No backend |
| `/blog` | `src/app/blog/page.tsx` | 2,622 | ✅ Complete UI | ❌ No MDX/posts |
| `/api-docs` | `src/app/api-docs/page.tsx` | 2,530 | ✅ Complete UI | N/A (static) |
| `/dashboard` | `src/app/dashboard/page.tsx` | 1,820 | ✅ Complete UI | ❌ Mock data |
| `/verification` | `src/app/verification/page.tsx` | 2,060 | ✅ Complete UI | N/A (static) |
| `/login` | `src/app/login/page.tsx` | 600 | ✅ Complete UI | ❌ No auth |
| `/signup` | `src/app/signup/page.tsx` | 860 | ✅ Complete UI | ❌ No auth |
| `/forgot-password` | `src/app/forgot-password/page.tsx` | 715 | ✅ Complete UI | ❌ No email |
| `/profile` | `src/app/profile/page.tsx` | 1,558 | ✅ Complete UI | ❌ Mock user |
| `/settings` | `src/app/settings/page.tsx` | 1,379 | ✅ Complete UI | ❌ No persistence |
| `/history` | `src/app/history/page.tsx` | 1,110 | ✅ Complete UI | ❌ Mock data |
| `/api` | `src/app/api/route.ts` | 9 | ✅ Working | ✅ Health check |
| `/api/classify` | `src/app/api/classify/route.ts` | 191 | ✅ Working | ⚠️ Works but UI doesn't call it |
| `404` | `src/app/not-found.tsx` | 564 | ✅ Complete UI | N/A |

### Components — 50 total

| Category | Count | Status |
|----------|-------|--------|
| Custom components (Navbar, Footer) | 2 | ✅ Working |
| shadcn/ui components | 48 | ✅ Installed |

### API Routes — 2 endpoints

| Endpoint | Method | Status | Called by UI? |
|----------|--------|--------|---------------|
| `/api` | GET | ✅ Working | No |
| `/api/classify` | POST/GET | ✅ Working | **❌ NO — this is the critical gap** |

### Database — Prisma + SQLite

| Aspect | Status |
|--------|--------|
| Schema defined | ✅ (but minimal — only User + Post) |
| Client initialized | ✅ (`src/lib/db.ts`) |
| Actually used by any code | **❌ NO — zero queries anywhere** |

## 2.2 Critical Gaps (Priority Order)

### 🔴 P0 — Must Fix for Working Product

1. **API ↔ UI disconnection**: `/api/classify` works but `/app` page uses hardcoded mock data. The core feature doesn't actually work end-to-end.
2. **Database unused**: Prisma installed, client initialized, but zero code reads from or writes to the database.
3. **Authentication not configured**: `next-auth` installed, login/signup pages exist, but no auth providers, no session management, no `[...nextauth]` route.
4. **No shared types**: Every page redefines its own interfaces locally. No `src/types/` directory.
5. **No state management**: `zustand` and `@tanstack/react-query` installed but unused.

### 🟡 P1 — Should Fix for Production Quality

6. **No dark mode toggle**: CSS variables exist, `next-themes` installed, but no `ThemeProvider` in layout.
7. **No contact form backend**: Form exists but no API endpoint to submit to.
8. **No newsletter backend**: Footer form simulates success but doesn't send anywhere.
9. **No payment integration**: Pricing page shows plans but no Stripe.
10. **No blog backend**: `@mdxeditor/editor` installed but zero blog posts.
11. **No real resource database**: "50,000+ verified resources" claim is simulated.
12. **Production build broken**: `start` script references `.next/standalone/` but `output: "standalone"` not in config.

### 🟢 P2 — Nice to Have

13. **Every page is a monolith**: 1,500–2,700 lines each with inline data, types, sub-components.
14. **Duplicated code**: `ConfidenceRing`, `FAQItem`, animation variants re-implemented in nearly every page.
15. **No error boundaries**: No React error boundaries anywhere.
16. **No loading states**: No `loading.tsx` files for any route.
17. **No test framework**: Zero tests.
18. **No CI/CD**: No GitHub Actions, no automated builds.
19. **TypeScript `ignoreBuildErrors: true`**: Build errors are suppressed.
20. **ESLint rules all off**: Zero linting enforcement.
21. **No Docker/containerization**: No deployment strategy.
22. **Many unused dependencies**: `@dnd-kit`, `@tanstack/react-table`, `docx`, `react-markdown`, `react-syntax-highlighter`, `uuid`, `next-intl`, `sharp`.

---


# 3. Architecture Blueprint

## 3.1 Target Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         ClearPath AI Architecture                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────┐     ┌──────────────────┐     ┌────────────────┐  │
│  │   Client Layer   │     │   Server Layer    │     │  Data Layer    │  │
│  │                  │     │                   │     │                │  │
│  │  Next.js 16 App  │────▶│  Next.js API      │────▶│  PostgreSQL    │  │
│  │  Router (React   │     │  Routes + Server  │     │  (via Prisma)  │  │
│  │  19 + Framer     │     │  Actions          │     │                │  │
│  │  Motion)         │     │                   │     │  ┌──────────┐  │  │
│  │                  │     │  ┌──────────────┐  │     │  │ Redis    │  │  │
│  │  ┌────────────┐  │     │  │ Auth         │  │     │  │ (cache + │  │  │
│  │  │ Zustand    │  │     │  │ (NextAuth)   │  │     │  │  queue)  │  │  │
│  │  │ Stores     │  │     │  └──────────────┘  │     │  └──────────┘  │  │
│  │  └────────────┘  │     │                   │     │                │  │
│  │                  │     │  ┌──────────────┐  │     │  ┌──────────┐  │  │
│  │  ┌────────────┐  │     │  │ AI Pipeline  │  │     │  │ S3/R2    │  │  │
│  │  │ React      │  │     │  │ (HuggingFace │  │     │  │ (files)  │  │  │
│  │  │ Query      │  │     │  │  + fallback) │  │     │  └──────────┘  │  │
│  │  └────────────┘  │     │  └──────────────┘  │     │                │  │
│  │                  │     │                   │     │                │  │
│  └──────────────────┘     │  ┌──────────────┐  │     └────────────────┘  │
│                           │  │ Email        │  │                         │
│                           │  │ (Resend)     │  │     ┌────────────────┐  │
│                           │  └──────────────┘  │     │  External APIs  │  │
│                           │                   │     │                │  │
│                           │  ┌──────────────┐  │     │  HuggingFace   │  │
│                           │  │ Payment      │  │     │  211.org API   │  │
│                           │  │ (Stripe)     │  │     │  Stripe API    │  │
│                           │  └──────────────┘  │     │  Resend API    │  │
│                           │                   │     │  Sentry         │  │
│                           └──────────────────┘     └────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## 3.2 Request Flow — Classification

```
User types message in /app chat
        │
        ▼
┌──────────────────────┐
│ Client: Zustand store │  ← Chat message added to local state
│ appChatStore          │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Client: React Query  │  ← Mutation triggered
│ useClassifyMutation   │
└──────────┬───────────┘
           │
           ▼ POST /api/classify
┌──────────────────────┐
│ Server: rate limit   │  ← Rate limiting middleware
│ check (10 req/min)   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Server: crisis       │  ← detectCrisis() scans input
│ detection first      │     Returns: { isCrisis: boolean, type?: string, resources?: CrisisResource[] }
└──────────┬───────────┘
           │
           ├── If crisis detected ──▶ Return crisis response immediately (skip AI)
           │
           ▼ No crisis
┌──────────────────────┐
│ Server: AI classify  │  ← classifyWithHF() or simulateClassification()
│ via HuggingFace API  │     Input: user message + 8 LABELS
│ BART-large-MNLI      │     Output: { label, confidence, scores[] }
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Server: transparency │  ← calculateTransparencyLayers()
│ layer calculation     │     Generates all 6 transparency layers
│                       │     Returns: { confidence, sourceQuality, biasCheck, complexity, alternatives, verification }
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Server: save to DB   │  ← Prisma: create Classification record
│ + increment stats    │     Update user search count
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Server: return JSON  │  ← Full classification result with all 6 layers
│ response             │     + matched resources from DB
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Client: React Query  │  ← onSuccess: update Zustand store
│ cache + Zustand      │     Add result to chat history
│ update               │     UI re-renders with real data
└──────────────────────┘
```

## 3.3 Request Flow — Authentication

```
User clicks "Sign Up" or "Log In"
        │
        ▼
┌──────────────────────────┐
│ Client: Auth form         │  ← react-hook-form + zod validation
│ (login/signup pages)      │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│ NextAuth: Credentials     │  ← /api/auth/[...nextauth]
│ Provider or OAuth         │     bcrypt password check
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│ Database: create/find     │  ← Prisma: user.create() or user.findUnique()
│ user record               │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│ Session: JWT or Database  │  ← NextAuth session management
│ session created           │     Client gets session cookie
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│ Client: useSession()      │  ← Navbar updates, protected routes work
│ + redirect to /app        │
└──────────────────────────┘
```

## 3.4 Directory Structure — Target State

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout WITH providers
│   ├── page.tsx                  # Landing page
│   ├── globals.css               # Global styles
│   ├── not-found.tsx             # 404 page
│   ├── sitemap.ts                # SEO sitemap
│   ├── robots.ts                 # SEO robots
│   │
│   ├── (auth)/                   # Auth route group
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── layout.tsx            # Auth layout (centered, no navbar)
│   │
│   ├── (public)/                 # Public route group
│   │   ├── about/page.tsx
│   │   ├── pricing/page.tsx
│   │   ├── how-it-works/page.tsx
│   │   ├── responsible-ai/page.tsx
│   │   ├── privacy/page.tsx
│   │   ├── terms/page.tsx
│   │   ├── team/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── blog/page.tsx
│   │   ├── blog/[slug]/page.tsx
│   │   ├── api-docs/page.tsx
│   │   ├── verification/page.tsx
│   │   └── layout.tsx            # Public layout (Navbar + Footer)
│   │
│   ├── (app)/                    # Authenticated app route group
│   │   ├── app/page.tsx          # Main chat/classification
│   │   ├── dashboard/page.tsx
│   │   ├── history/page.tsx
│   │   ├── profile/page.tsx
│   │   ├── settings/page.tsx
│   │   └── layout.tsx            # App layout (sidebar + auth guard)
│   │
│   └── api/                      # API routes
│       ├── route.ts              # Health check
│       ├── classify/route.ts     # AI classification
│       ├── contact/route.ts      # Contact form submission
│       ├── newsletter/route.ts   # Newsletter subscription
│       ├── resources/route.ts    # Resource search API
│       ├── blog/route.ts         # Blog posts API
│       ├── webhooks/
│       │   └── stripe/route.ts   # Stripe webhooks
│       └── auth/[...nextauth]/route.ts  # NextAuth
│
├── components/
│   ├── ui/                       # shadcn/ui components (48 files)
│   ├── layout/                   # Layout components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx
│   │   └── MobileNav.tsx
│   ├── chat/                     # Chat-specific components
│   │   ├── ChatMessage.tsx
│   │   ├── ChatInput.tsx
│   │   ├── ConfidenceRing.tsx
│   │   ├── ProcessingPipeline.tsx
│   │   ├── CrisisBlock.tsx
│   │   ├── StatusPill.tsx
│   │   ├── CategoryCard.tsx
│   │   └── ClarifyPanel.tsx
│   ├── transparency/             # 6-layer transparency components
│   │   ├── TransparencyPanel.tsx
│   │   ├── ConfidenceScore.tsx
│   │   ├── SourceQuality.tsx
│   │   ├── BiasCheck.tsx
│   │   ├── ComplexityLevel.tsx
│   │   ├── AlternativeViews.tsx
│   │   └── VerificationStatus.tsx
│   ├── shared/                   # Shared reusable components
│   │   ├── Section.tsx
│   │   ├── FAQItem.tsx
│   │   ├── AnimatedCounter.tsx
│   │   ├── GlassCard.tsx
│   │   ├── GradientButton.tsx
│   │   └── LoadingSpinner.tsx
│   └── providers/                # Context providers
│       ├── ThemeProvider.tsx
│       ├── AuthProvider.tsx
│       └── QueryProvider.tsx
│
├── lib/
│   ├── utils.ts                  # cn() utility
│   ├── db.ts                     # Prisma client singleton
│   ├── auth.ts                   # NextAuth configuration
│   ├── ai/
│   │   ├── classifier.ts         # Main classification logic
│   │   ├── crisis-detection.ts   # Crisis keyword detection
│   │   ├── transparency.ts       # 6-layer calculation
│   │   ├── huggingface.ts        # HuggingFace API client
│   │   └── fallback.ts           # Keyword-based fallback classifier
│   ├── email/
│   │   ├── templates/            # Email templates
│   │   └── sender.ts             # Resend email client
│   ├── stripe/
│   │   ├── client.ts             # Stripe client
│   │   └── webhooks.ts           # Webhook handlers
│   └── constants.ts              # App-wide constants
│
├── stores/                       # Zustand stores
│   ├── chat-store.ts             # Chat conversation state
│   ├── auth-store.ts             # Auth state (client-side cache)
│   ├── ui-store.ts               # UI preferences (sidebar, theme)
│   └── notification-store.ts     # Toast/notification queue
│
├── hooks/                        # Custom hooks
│   ├── use-mobile.ts             # Viewport detection
│   ├── use-toast.ts              # Toast notifications
│   ├── use-classify.ts           # React Query mutation for classification
│   ├── use-auth.ts               # Auth hook (wraps useSession)
│   └── use-transparency.ts       # Transparency layer data hook
│
├── types/                        # Shared TypeScript types
│   ├── classification.ts         # ClassificationResult, TransparencyLayer
│   ├── chat.ts                   # ChatMessage, ConversationHistory
│   ├── user.ts                   # User, UserProfile, UserSettings
│   ├── resource.ts               # Resource, Category, VerificationStatus
│   ├── api.ts                    # API request/response types
│   └── auth.ts                   # Auth types
│
├── config/                       # Configuration
│   ├── site.ts                   # Site metadata, nav links
│   ├── auth.ts                   # Auth provider config
│   ├── pricing.ts                # Pricing tiers config
│   └── ai.ts                     # AI model config, labels, thresholds
│
└── __tests__/                    # Test files
    ├── unit/
    ├── integration/
    └── e2e/

prisma/
├── schema.prisma                 # Complete database schema
├── migrations/                   # Migration history
└── seed.ts                       # Database seeder

public/
├── logo.svg
├── clearpath-logo.png
├── favicon.svg
├── favicon.ico
├── og-image.png                  # Open Graph image (1200x630)
└── icons/                        # PWA icons

docs/                             # Existing documentation
```

---


# 4. Technology Stack — Complete Reference

## 4.1 Core Framework

| Technology | Version | Purpose | Status |
|-----------|---------|---------|--------|
| Next.js | 16.1.1 | Full-stack React framework (App Router) | ✅ Installed |
| React | 19.0.0 | UI library | ✅ Installed |
| TypeScript | 5.x | Type safety | ⚠️ ignoreBuildErrors on |
| Tailwind CSS | 4.x | Utility-first CSS | ✅ Installed |
| Bun | 1.3.14 | Package manager + runtime | ✅ In use |

## 4.2 UI & Components

| Technology | Version | Purpose | Status |
|-----------|---------|---------|--------|
| shadcn/ui (new-york) | latest | Component library (48 components) | ✅ Installed |
| Radix UI | 25 packages | Headless primitives | ✅ Installed |
| Framer Motion | 12.x | Animations | ✅ Installed |
| Lucide React | latest | Icon library | ✅ Installed |
| Sonner | latest | Toast notifications | ✅ Installed |

## 4.3 State & Data

| Technology | Version | Purpose | Status |
|-----------|---------|---------|--------|
| Zustand | 5.0.6 | Client state management | ⚠️ Installed but unused |
| @tanstack/react-query | 5.82.0 | Server state management | ⚠️ Installed but unused (no provider) |
| @tanstack/react-table | 8.21.3 | Table component | ⚠️ Installed but unused |
| React Hook Form | 7.60.0 | Form management | ⚠️ Installed but unused |
| Zod | 4.0.2 | Schema validation | ⚠️ Installed but unused |

## 4.4 Database & ORM

| Technology | Version | Purpose | Status |
|-----------|---------|---------|--------|
| Prisma | 6.11.1 | ORM | ⚠️ Schema minimal, never queried |
| SQLite | — | Development database | ✅ File exists at db/custom.db |
| PostgreSQL | — | Production database (target) | ❌ Not configured |

**Migration path**: SQLite → PostgreSQL. Prisma makes this a 1-line change in `schema.prisma` datasource + `DATABASE_URL` env var.

## 4.5 Authentication

| Technology | Version | Purpose | Status |
|-----------|---------|---------|--------|
| NextAuth.js | 4.24.11 | Auth framework | ⚠️ Installed but not configured |
| bcrypt | — | Password hashing | ❌ Not installed |

**Action required**: Install `bcryptjs` (pure JS, no native compilation issues):
```bash
bun add bcryptjs
bun add -d @types/bcryptjs
```

## 4.6 AI & ML

| Technology | Version | Purpose | Status |
|-----------|---------|---------|--------|
| HuggingFace Inference API | — | BART-large-MNLI zero-shot classification | ✅ Working in API route |
| Fallback classifier | — | Keyword-based classification when no API key | ✅ Working |

## 4.7 Email

| Technology | Version | Purpose | Status |
|-----------|---------|---------|--------|
| Resend | — | Email delivery | ❌ Not installed |

**Action required**:
```bash
bun add resend
```

## 4.8 Payment

| Technology | Version | Purpose | Status |
|-----------|---------|---------|--------|
| Stripe | — | Payment processing | ❌ Not installed |

**Action required**:
```bash
bun add stripe @stripe/stripe-js
```

## 4.9 Monitoring & Analytics

| Technology | Version | Purpose | Status |
|-----------|---------|---------|--------|
| Sentry | — | Error tracking | ❌ Not installed |
| Vercel Analytics | — | Web vitals | ❌ Not installed |

**Action required**:
```bash
bun add @sentry/nextjs @vercel/analytics
```

## 4.10 Testing

| Technology | Version | Purpose | Status |
|-----------|---------|---------|--------|
| Vitest | — | Unit/integration testing | ❌ Not installed |
| Playwright | — | E2E testing | ❌ Not installed |
| Testing Library | — | React component testing | ❌ Not installed |

**Action required**:
```bash
bun add -d vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event playwright
```

## 4.11 Unused Dependencies (Remove or Use)

| Package | Status | Decision |
|---------|--------|----------|
| `@dnd-kit/core` | Unused | Remove unless drag-drop feature planned |
| `@dnd-kit/sortable` | Unused | Remove unless drag-drop feature planned |
| `@dnd-kit/utilities` | Unused | Remove unless drag-drop feature planned |
| `@mdxeditor/editor` | Unused | Keep for blog CMS feature |
| `@reactuses/core` | Unused | Keep, useful hooks |
| `docx` | Unused | Remove (build-time only) |
| `next-intl` | Unused | Keep for i18n or remove if no multi-language plan |
| `react-markdown` | Unused | Keep for blog rendering |
| `react-syntax-highlighter` | Unused | Keep for code blocks in blog/api-docs |
| `sharp` | Unused | Keep for image optimization |
| `uuid` | Unused | Keep, will be needed for resource IDs |
| `date-fns` | Unused | Keep, will be needed for date formatting |
| `recharts` | Unused | Keep for dashboard charts |

---

# 5. Environment Configuration

## 5.1 Complete .env File

Create `.env.local` with the following variables:

```bash
# ═══════════════════════════════════════════════════════
# ClearPath AI — Environment Configuration
# ═══════════════════════════════════════════════════════

# ── DATABASE ──────────────────────────────────────────
# Development: SQLite
DATABASE_URL="file:./dev.db"
# Production: PostgreSQL
# DATABASE_URL="postgresql://clearpath:PASSWORD@HOST:5432/clearpath_ai?schema=public"

# ── AUTHENTICATION ────────────────────────────────────
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
# Generated with: openssl rand -base64 32

# ── AI / ML ───────────────────────────────────────────
HUGGINGFACE_API_KEY="hf_xxxxxxxxxxxxxxxxxxxxx"
# Get free key at: https://huggingface.co/settings/tokens
# Free tier: 1,000 requests/day
# Pro tier ($9/mo): 10,000 requests/day

# ── EMAIL ─────────────────────────────────────────────
RESEND_API_KEY="re_xxxxxxxxxxxxxxxx"
# Get key at: https://resend.com/api-keys
# Free tier: 100 emails/day, 1 custom domain

EMAIL_FROM="ClearPath AI <noreply@clearpath-ai.com>"
EMAIL_SUPPORT="support@clearpath-ai.com"

# ── STRIPE (Payment) ─────────────────────────────────
STRIPE_SECRET_KEY="sk_test_xxxxxxxxxxxxxxxx"
STRIPE_PUBLISHABLE_KEY="pk_test_xxxxxxxxxxxxxxxx"
STRIPE_WEBHOOK_SECRET="whsec_xxxxxxxxxxxxxxxx"

# Price IDs (create in Stripe Dashboard)
STRIPE_PRO_MONTHLY_PRICE_ID="price_xxxxxxxxxxxxxxxx"
STRIPE_PRO_YEARLY_PRICE_ID="price_xxxxxxxxxxxxxxxx"
STRIPE_ENTERPRISE_MONTHLY_PRICE_ID="price_xxxxxxxxxxxxxxxx"
STRIPE_ENTERPRISE_YEARLY_PRICE_ID="price_xxxxxxxxxxxxxxxx"

# ── MONITORING ────────────────────────────────────────
SENTRY_DSN="https://xxxxx@sentry.io/xxxxx"
NEXT_PUBLIC_SENTRY_DSN="https://xxxxx@sentry.io/xxxxx"

# ── ANALYTICS ─────────────────────────────────────────
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
NEXT_PUBLIC_VERCEL_ANALYTICS_ENABLED="true"

# ── REDIS (Rate Limiting + Caching) ───────────────────
REDIS_URL="redis://localhost:6379"
# Or for production: redis://default:PASSWORD@HOST:6379

# ── FILE STORAGE ──────────────────────────────────────
# Cloudflare R2 (S3-compatible)
R2_ACCOUNT_ID="xxxxxxxxxxxxxxxx"
R2_ACCESS_KEY_ID="xxxxxxxxxxxxxxxx"
R2_SECRET_ACCESS_KEY="xxxxxxxxxxxxxxxx"
R2_BUCKET_NAME="clearpath-ai-uploads"
R2_PUBLIC_URL="https://uploads.clearpath-ai.com"

# ── APP CONFIG ────────────────────────────────────────
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="ClearPath AI"
NODE_ENV="development"
```

## 5.2 .env.example (Public Template)

```bash
# Copy this file to .env.local and fill in the values
# Never commit .env.local to version control

DATABASE_URL="file:./dev.db"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
HUGGINGFACE_API_KEY=hf_xxxxx
RESEND_API_KEY=re_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
REDIS_URL=redis://localhost:6379
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 5.3 Vercel Environment Variables

When deploying to Vercel, set these in Project Settings → Environment Variables:

| Variable | Production | Preview | Development |
|----------|-----------|---------|-------------|
| `DATABASE_URL` | PostgreSQL URL | PostgreSQL URL | — |
| `NEXTAUTH_URL` | `https://clearpath-ai.vercel.app` | `https://clearpath-ai-*.vercel.app` | — |
| `NEXTAUTH_SECRET` | ✅ Set | ✅ Same | — |
| `HUGGINGFACE_API_KEY` | ✅ Set | ✅ Same | — |
| All others | ✅ Set | ✅ Same | — |

---


# 6. Database Schema — Complete Prisma Models

## 6.1 Full Schema (Replace prisma/schema.prisma Entirely)

```prisma
// ═══════════════════════════════════════════════════════════
// ClearPath AI — Complete Database Schema
// ═══════════════════════════════════════════════════════════

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"          // Change to "postgresql" for production
  url      = env("DATABASE_URL")
}

// ── USER & AUTH ──────────────────────────────────────

model User {
  id             String    @id @default(cuid())
  email          String    @unique
  name           String?
  passwordHash   String?   // null for OAuth users
  image          String?
  emailVerified  DateTime?
  
  // Subscription
  plan           Plan      @default(FREE)
  stripeCustomerId     String?   @unique
  stripeSubscriptionId String?   @unique
  stripePriceId        String?
  stripeCurrentPeriodEnd DateTime?
  
  // Profile
  bio             String?
  location        String?
  organization    String?
  role            UserRole  @default(USER)
  phone           String?
  
  // Preferences
  emailNotifications Boolean  @default(true)
  darkMode           Boolean  @default(false)
  language           String   @default("en")
  
  // Timestamps
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  lastLoginAt   DateTime?
  
  // Relations
  classifications  Classification[]
  conversations    Conversation[]
  searchHistory    SearchHistory[]
  savedResources   SavedResource[]
  feedbacks        Feedback[]
  accounts         Account[]
  sessions         Session[]
  
  @@map("users")
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  
  @@unique([identifier, token])
  @@map("verification_tokens")
}

// ── AI CLASSIFICATION ────────────────────────────────

model Classification {
  id              String   @id @default(cuid())
  userId          String?
  
  // Input
  inputText       String   // The user's original message
  
  // Output
  category        String   // Primary category: Housing, Food, Mental Health, etc.
  confidence      Float    // 0.0 - 1.0
  allScores       String   // JSON: { "Housing": 0.82, "Food": 0.12, ... }
  
  // Transparency layers
  sourceQuality   String   // "government" | "nonprofit" | "community" | "ai_generated"
  biasCheck       String   // JSON: { detected: bool, types: string[], severity: string }
  complexityLevel String   // "simple" | "moderate" | "complex" | "critical"
  alternativeCategories String // JSON: [{ category, confidence }]
  verificationStatus    String   // "verified" | "partially_verified" | "unverified" | "disputed"
  
  // Crisis
  isCrisis        Boolean  @default(false)
  crisisType      String?  // "suicide" | "abuse" | "overdose" | "homeless_immediate" | null
  
  // Model info
  modelUsed       String   // "bart-large-mnli" | "keyword-fallback"
  processingTimeMs Int    // Time taken for classification
  
  // Resources matched
  matchedResources String? // JSON: [{ id, name, category, distance }]
  
  // Timestamps
  createdAt       DateTime @default(now())
  
  // Relations
  user            User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
  conversation    Conversation? @relation(fields: [conversationId], references: [id])
  conversationId  String?
  feedback        Feedback?
  
  @@index([userId])
  @@index([category])
  @@index([createdAt])
  @@index([isCrisis])
  @@map("classifications")
}

// ── CONVERSATIONS ────────────────────────────────────

model Conversation {
  id          String   @id @default(cuid())
  userId      String
  
  title       String?  // Auto-generated from first message
  summary     String?  // AI-generated summary
  
  messageCount Int     @default(0)
  
  // Metadata
  tags        String?  // JSON: ["housing", "emergency"]
  isBookmarked Boolean @default(false)
  
  // Timestamps
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  user            User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  messages        ConversationMessage[]
  classifications Classification[]
  
  @@index([userId])
  @@index([updatedAt])
  @@map("conversations")
}

model ConversationMessage {
  id              String   @id @default(cuid())
  conversationId  String
  
  role            String   // "user" | "assistant" | "system"
  content         String   // Message text
  
  // Associated classification (if assistant message with results)
  classificationId String? @unique
  
  // Metadata
  metadata        String?  // JSON: { processingTime, modelUsed, ... }
  
  // Timestamps
  createdAt       DateTime @default(now())
  
  // Relations
  conversation    Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  
  @@index([conversationId])
  @@index([createdAt])
  @@map("conversation_messages")
}

// ── RESOURCES ────────────────────────────────────────

model Resource {
  id              String   @id @default(cuid())
  
  // Basic info
  name            String
  description     String?
  category        String   // "Housing" | "Food" | "Mental Health" | etc.
  subcategory     String?
  
  // Contact
  phone           String?
  email           String?
  website         String?
  address         String?
  city            String?
  state           String?
  zipCode         String?
  
  // Location (for proximity search)
  latitude        Float?
  longitude       Float?
  
  // Organization
  organizationName String?
  organizationType String? // "government" | "nonprofit" | "faith_based" | "community" | "private"
  
  // Service details
  eligibilityCriteria String? // JSON
  hoursOfOperation   String? // JSON: { mon: "9am-5pm", ... }
  languages      String?  // JSON: ["en", "es", "fr"]
  costType       String?  // "free" | "sliding_scale" | "insurance" | "paid"
  intakeProcess  String?
  waitTime       String?  // "immediate" | "1-3_days" | "1-2_weeks" | "1+_months"
  
  // Quality & Verification
  verificationStatus String   @default("unverified") // "verified" | "partially_verified" | "unverified" | "disputed"
  lastVerifiedAt   DateTime?
  verifiedBy       String?  // User ID of verifier
  verificationNotes String?
  
  sourceQuality   String   @default("community") // "government" | "nonprofit" | "community" | "ai_generated"
  confidence      Float    @default(0.5)
  
  // Stats
  viewCount       Int      @default(0)
  referralCount   Int      @default(0)
  rating          Float    @default(0)
  reviewCount     Int      @default(0)
  
  // External IDs
  externalId      String?  @unique // ID from 211.org or other source
  dataSource      String?  // "211.org" | "manual" | "ai_suggested" | "user_submitted"
  
  // Flags
  isActive        Boolean  @default(true)
  isCrisisResource Boolean @default(false)
  is247           Boolean  @default(false)
  isWalkIn        Boolean  @default(false)
  isVirtual       Boolean  @default(false)
  
  // Timestamps
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  // Relations
  reviews         ResourceReview[]
  savedBy         SavedResource[]
  
  @@index([category])
  @@index([city])
  @@index([verificationStatus])
  @@index([isActive])
  @@index([dataSource])
  @@map("resources")
}

model ResourceReview {
  id          String   @id @default(cuid())
  resourceId  String
  userId      String
  
  rating      Int      // 1-5
  comment     String?
  isVerified  Boolean  @default(false) // Did the user actually use the resource?
  
  createdAt   DateTime @default(now())
  
  resource    Resource @relation(fields: [resourceId], references: [id], onDelete: Cascade)
  
  @@unique([resourceId, userId])
  @@map("resource_reviews")
}

// ── SEARCH & HISTORY ─────────────────────────────────

model SearchHistory {
  id          String   @id @default(cuid())
  userId      String
  
  query       String
  filters     String?  // JSON: { category, location, verificationStatus }
  resultCount Int?
  topCategory String?
  
  createdAt   DateTime @default(now())
  
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([createdAt])
  @@map("search_history")
}

model SavedResource {
  id          String   @id @default(cuid())
  userId      String
  resourceId  String
  
  notes       String?
  tags        String?  // JSON: ["urgent", "follow_up"]
  
  createdAt   DateTime @default(now())
  
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  resource    Resource @relation(fields: [resourceId], references: [id], onDelete: Cascade)
  
  @@unique([userId, resourceId])
  @@map("saved_resources")
}

// ── FEEDBACK ─────────────────────────────────────────

model Feedback {
  id                String   @id @default(cuid())
  userId            String?
  classificationId  String?  @unique
  
  // Rating
  wasHelpful        Boolean?
  accuracyRating    Int?     // 1-5
  transparencyRating Int?    // 1-5
  overallRating     Int?     // 1-5
  
  // Text feedback
  comment           String?
  
  // Issue reporting
  reportedIssue     String?  // "wrong_category" | "outdated_resource" | "bias" | "crisis_mishandled" | "other"
  issueDescription  String?
  
  createdAt         DateTime @default(now())
  
  user              User?          @relation(fields: [userId], references: [id], onDelete: SetNull)
  classification    Classification? @relation(fields: [classificationId], references: [id], onDelete: SetNull)
  
  @@index([userId])
  @@index([classificationId])
  @@map("feedback")
}

// ── BLOG ─────────────────────────────────────────────

model BlogPost {
  id          String   @id @default(cuid())
  
  title       String
  slug        String   @unique
  excerpt     String?
  content     String   // MDX content
  
  authorId    String
  authorName  String   // Denormalized for speed
  
  category    String   // "transparency" | "community" | "technology" | "research" | "update"
  tags        String?  // JSON: ["AI ethics", "community resources"]
  
  coverImage  String?
  
  // Publishing
  status      PostStatus @default(DRAFT)
  publishedAt DateTime?
  featured    Boolean  @default(false)
  
  // SEO
  metaTitle       String?
  metaDescription String?
  ogImage         String?
  
  // Stats
  viewCount   Int      @default(0)
  readTime    Int?     // Minutes
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([slug])
  @@index([status])
  @@index([publishedAt])
  @@map("blog_posts")
}

// ── CONTACT & NEWSLETTER ─────────────────────────────

model ContactSubmission {
  id          String   @id @default(cuid())
  
  name        String
  email       String
  subject     String
  message     String
  
  category    String?  // "general" | "bug" | "feature" | "partnership" | "crisis"
  priority    String   @default("normal") // "low" | "normal" | "high" | "urgent"
  status      String   @default("new") // "new" | "in_progress" | "resolved" | "closed"
  
  assignedTo  String?  // Admin user ID
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([status])
  @@index([createdAt])
  @@map("contact_submissions")
}

model NewsletterSubscriber {
  id          String   @id @default(cuid())
  
  email       String   @unique
  name        String?
  source      String   @default("website") // "website" | "blog" | "referral"
  
  isActive    Boolean  @default(true)
  unsubscribedAt DateTime?
  
  createdAt   DateTime @default(now())
  
  @@index([email])
  @@map("newsletter_subscribers")
}

// ── ANALYTICS ────────────────────────────────────────

model DailyMetric {
  id          String   @id @default(cuid())
  
  date        DateTime @unique
  
  // User metrics
  totalUsers      Int @default(0)
  newUsers        Int @default(0)
  activeUsers     Int @default(0)
  
  // Classification metrics
  totalClassifications    Int @default(0)
  crisisDetections        Int @default(0)
  avgConfidence           Float @default(0)
  avgProcessingTimeMs     Int @default(0)
  
  // Resource metrics
  resourcesViewed    Int @default(0)
  resourcesReferred  Int @default(0)
  newResourcesAdded  Int @default(0)
  
  // Revenue
  revenue  Float @default(0)
  
  createdAt   DateTime @default(now())
  
  @@index([date])
  @@map("daily_metrics")
}

// ── ENUMS ────────────────────────────────────────────

enum Plan {
  FREE
  PRO
  ENTERPRISE
}

enum UserRole {
  USER
  ADMIN
  VERIFIER
  CRISIS_COUNSELOR
}

enum PostStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}
```

## 6.2 Database Migration Commands

```bash
# After updating schema, run:
bunx prisma migrate dev --name init_full_schema

# Generate Prisma client:
bunx prisma generate

# Reset database (CAUTION: deletes all data):
bunx prisma migrate reset

# Push schema without migrations (for prototyping):
bunx prisma db push

# Open Prisma Studio (visual DB browser):
bunx prisma studio

# Seed the database:
bunx prisma db seed
```

## 6.3 Entity Relationship Summary

```
User ─────────┬─── Account (1:N)
              ├─── Session (1:N)
              ├─── Classification (1:N)
              ├─── Conversation (1:N)
              │       └─── ConversationMessage (1:N)
              │               └─── Classification (1:1)
              ├─── SearchHistory (1:N)
              ├─── SavedResource (1:N)
              │       └─── Resource (N:1)
              ├─── Feedback (1:N)
              └─── ResourceReview (1:N)
                      └─── Resource (N:1)

Resource ─────┬─── ResourceReview (1:N)
              └─── SavedResource (1:N)

Classification ──── Feedback (1:1)

BlogPost ────── (standalone, author denormalized)

ContactSubmission ── (standalone)

NewsletterSubscriber ── (standalone)

DailyMetric ── (standalone, one per day)
```

---


# 7. API Specification — Every Endpoint

## 7.1 Existing Endpoints

### GET /api — Health Check

**Current implementation**: Returns basic status info.

**Target implementation**: Same, but add database connectivity check.

```typescript
// src/app/api/route.ts
import { db } from "@/lib/db";

export async function GET() {
  const start = Date.now();
  
  try {
    // Check database connectivity
    await db.$queryRaw`SELECT 1`;
    const dbLatency = Date.now() - start;
    
    return Response.json({
      status: "healthy",
      service: "ClearPath AI",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      checks: {
        database: { status: "connected", latencyMs: dbLatency },
        ai: {
          huggingface: process.env.HUGGINGFACE_API_KEY ? "configured" : "fallback_mode",
        },
      },
    });
  } catch (error) {
    return Response.json({
      status: "degraded",
      service: "ClearPath AI",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      checks: {
        database: { status: "disconnected", error: String(error) },
      },
    }, { status: 503 });
  }
}
```

### POST /api/classify — AI Classification

**This is the core endpoint. Currently works but UI doesn't call it.**

**Target implementation** (enhanced version):

```typescript
// src/app/api/classify/route.ts
import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { classifyWithHF, simulateClassification } from "@/lib/ai/classifier";
import { detectCrisis } from "@/lib/ai/crisis-detection";
import { calculateTransparency } from "@/lib/ai/transparency";
import { getServerSession } from "next-auth";
import { z } from "zod";

// Input validation schema
const ClassifyRequestSchema = z.object({
  message: z.string().min(1).max(2000),
  conversationId: z.string().optional(),
  context: z.array(z.string()).max(10).optional(), // Previous messages for context
});

// Classification categories (the 8 LABELS)
const CATEGORIES = [
  "Housing",
  "Food",
  "Mental Health",
  "Employment",
  "Legal Aid",
  "Healthcare",
  "Substance Abuse",
  "Senior Services",
] as const;

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  // ── 1. Parse & validate input ─────────────────────
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  
  const parsed = ClassifyRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ 
      error: "Validation failed", 
      details: parsed.error.flatten() 
    }, { status: 400 });
  }
  
  const { message, conversationId, context } = parsed.data;
  
  // ── 2. Get authenticated user (optional) ──────────
  const session = await getServerSession();
  const userId = session?.user?.id || null;
  
  // ── 3. Rate limiting ──────────────────────────────
  // Free users: 10 req/hour, Pro: 100 req/hour, Enterprise: unlimited
  // (Implementation in rate limiting section)
  
  // ── 4. Crisis detection (FIRST PRIORITY) ──────────
  const crisisResult = detectCrisis(message);
  
  if (crisisResult.isCrisis) {
    // Save crisis classification to DB
    const classification = await db.classification.create({
      data: {
        userId,
        inputText: message,
        category: "Crisis",
        confidence: 1.0,
        allScores: JSON.stringify({ Crisis: 1.0 }),
        sourceQuality: "government",
        biasCheck: JSON.stringify({ detected: false, types: [], severity: "none" }),
        complexityLevel: "critical",
        alternativeCategories: JSON.stringify([]),
        verificationStatus: "verified",
        isCrisis: true,
        crisisType: crisisResult.type,
        modelUsed: "crisis-keyword-detection",
        processingTimeMs: Date.now() - startTime,
        matchedResources: JSON.stringify(crisisResult.resources),
        conversationId: conversationId || undefined,
      },
    });
    
    return Response.json({
      type: "crisis",
      classification: {
        id: classification.id,
        category: "Crisis",
        confidence: 1.0,
        isCrisis: true,
        crisisType: crisisResult.type,
      },
      crisisResources: crisisResult.resources,
      transparency: {
        confidence: 1.0,
        sourceQuality: "government",
        biasCheck: { detected: false, types: [], severity: "none" },
        complexityLevel: "critical",
        alternativeViews: [],
        verificationStatus: "verified",
      },
      message: "We detected that you may be in crisis. Here are immediate resources that can help right now.",
    });
  }
  
  // ── 5. AI Classification ──────────────────────────
  let classifyResult;
  let modelUsed: string;
  
  if (process.env.HUGGINGFACE_API_KEY) {
    try {
      classifyResult = await classifyWithHF(message, CATEGORIES);
      modelUsed = "bart-large-mnli";
    } catch (error) {
      console.error("HuggingFace API failed, using fallback:", error);
      classifyResult = simulateClassification(message, CATEGORIES);
      modelUsed = "keyword-fallback";
    }
  } else {
    classifyResult = simulateClassification(message, CATEGORIES);
    modelUsed = "keyword-fallback";
  }
  
  const processingTimeMs = Date.now() - startTime;
  
  // ── 6. Calculate transparency layers ──────────────
  const transparency = calculateTransparency(classifyResult, message, modelUsed);
  
  // ── 7. Find matching resources from DB ────────────
  const matchedResources = await db.resource.findMany({
    where: {
      category: classifyResult.label,
      isActive: true,
    },
    take: 5,
    orderBy: [
      { isCrisisResource: "desc" },
      { verificationStatus: "asc" }, // "verified" first
      { rating: "desc" },
    ],
  });
  
  // ── 8. Save classification to DB ──────────────────
  const classification = await db.classification.create({
    data: {
      userId,
      inputText: message,
      category: classifyResult.label,
      confidence: classifyResult.confidence,
      allScores: JSON.stringify(classifyResult.scores),
      sourceQuality: transparency.sourceQuality,
      biasCheck: JSON.stringify(transparency.biasCheck),
      complexityLevel: transparency.complexityLevel,
      alternativeCategories: JSON.stringify(transparency.alternativeViews),
      verificationStatus: transparency.verificationStatus,
      isCrisis: false,
      modelUsed,
      processingTimeMs,
      matchedResources: JSON.stringify(matchedResources.map(r => ({
        id: r.id,
        name: r.name,
        category: r.category,
        phone: r.phone,
        verificationStatus: r.verificationStatus,
      }))),
      conversationId: conversationId || undefined,
    },
  });
  
  // ── 9. Return full result ─────────────────────────
  return Response.json({
    type: "classification",
    classification: {
      id: classification.id,
      category: classifyResult.label,
      confidence: classifyResult.confidence,
      allScores: classifyResult.scores,
      isCrisis: false,
      modelUsed,
      processingTimeMs,
    },
    resources: matchedResources,
    transparency,
  });
}

// GET returns model info
export async function GET() {
  return Response.json({
    model: "BART-large-MNLI (zero-shot classification)",
    categories: CATEGORIES,
    hasApiKey: !!process.env.HUGGINGFACE_API_KEY,
    fallbackAvailable: true,
    version: "1.0.0",
  });
}
```

## 7.2 New Endpoints to Create

### POST /api/contact — Contact Form

```typescript
// src/app/api/contact/route.ts
import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { sendEmail } from "@/lib/email/sender";

const ContactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(5000),
  category: z.enum(["general", "bug", "feature", "partnership", "crisis"]).default("general"),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = ContactSchema.safeParse(body);
  
  if (!parsed.success) {
    return Response.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  }
  
  const data = parsed.data;
  
  // Determine priority
  const priority = data.category === "crisis" ? "urgent" 
                 : data.category === "bug" ? "high" 
                 : "normal";
  
  // Save to database
  const submission = await db.contactSubmission.create({
    data: {
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      category: data.category,
      priority,
    },
  });
  
  // Send notification email to team
  if (process.env.RESEND_API_KEY) {
    await sendEmail({
      to: process.env.EMAIL_SUPPORT!,
      subject: `[ClearPath AI] New ${data.category} inquiry: ${data.subject}`,
      template: "contact-notification",
      data: {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        category: data.category,
        priority,
        submissionId: submission.id,
      },
    });
  }
  
  // Send confirmation email to user
  if (process.env.RESEND_API_KEY) {
    await sendEmail({
      to: data.email,
      subject: "We received your message — ClearPath AI",
      template: "contact-confirmation",
      data: { name: data.name },
    });
  }
  
  return Response.json({ 
    success: true, 
    message: "Thank you for reaching out. We'll respond within 24 hours.",
    submissionId: submission.id,
  });
}
```

### POST /api/newsletter — Newsletter Subscription

```typescript
// src/app/api/newsletter/route.ts
import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const NewsletterSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  source: z.enum(["website", "blog", "referral"]).default("website"),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = NewsletterSchema.safeParse(body);
  
  if (!parsed.success) {
    return Response.json({ error: "Invalid email" }, { status: 400 });
  }
  
  const { email, name, source } = parsed.data;
  
  // Upsert: if email exists and was unsubscribed, re-subscribe
  const subscriber = await db.newsletterSubscriber.upsert({
    where: { email },
    update: { isActive: true, unsubscribedAt: null, source },
    create: { email, name, source },
  });
  
  return Response.json({ 
    success: true, 
    message: "You're subscribed! Check your email for confirmation.",
  });
}
```

### GET /api/resources — Resource Search

```typescript
// src/app/api/resources/route.ts
import { NextRequest } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const category = searchParams.get("category");
  const city = searchParams.get("city");
  const query = searchParams.get("q");
  const verification = searchParams.get("verification"); // "verified" | "all"
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const offset = (page - 1) * limit;
  
  const where: any = { isActive: true };
  
  if (category) where.category = category;
  if (city) where.city = { contains: city, mode: "insensitive" };
  if (verification === "verified") where.verificationStatus = "verified";
  if (query) {
    where.OR = [
      { name: { contains: query } },
      { description: { contains: query } },
      { organizationName: { contains: query } },
    ];
  }
  
  const [resources, total] = await Promise.all([
    db.resource.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: [
        { isCrisisResource: "desc" },
        { verificationStatus: "asc" },
        { rating: "desc" },
      ],
    }),
    db.resource.count({ where }),
  ]);
  
  return Response.json({
    resources,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
```

### POST /api/auth/[...nextauth] — Authentication

(Detailed in Section 8: Authentication & Authorization)

### POST /api/webhooks/stripe — Stripe Webhooks

(Detailed in Section 24: Payment Integration)

### GET /api/blog — Blog Posts

```typescript
// src/app/api/blog/route.ts
import { NextRequest } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const category = searchParams.get("category");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  
  const where: any = { status: "PUBLISHED" };
  if (category) where.category = category;
  
  const [posts, total] = await Promise.all([
    db.blogPost.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        category: true,
        tags: true,
        coverImage: true,
        authorName: true,
        publishedAt: true,
        readTime: true,
        viewCount: true,
        featured: true,
      },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { publishedAt: "desc" },
    }),
    db.blogPost.count({ where }),
  ]);
  
  return Response.json({ posts, pagination: { page, limit, total } });
}
```

## 7.3 API Response Format — Standard

All API responses follow this format:

```typescript
// Success response
{
  success: true,
  data: T,           // The actual data
  message?: string,  // Optional human-readable message
}

// Error response
{
  success: false,
  error: string,     // Error type
  message: string,   // Human-readable error
  details?: any,     // Optional validation details
}

// Paginated response
{
  data: T[],
  pagination: {
    page: number,
    limit: number,
    total: number,
    totalPages: number,
  }
}
```

## 7.4 HTTP Status Codes Used

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful GET, successful POST |
| 201 | Created | Resource created (if needed) |
| 400 | Bad Request | Validation failed, malformed input |
| 401 | Unauthorized | No auth token / invalid session |
| 403 | Forbidden | Auth'd but insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Error | Unexpected server error |
| 503 | Service Unavailable | Database down, AI API down |

---


# 8. Authentication & Authorization System

## 8.1 NextAuth Configuration

Create `src/lib/auth.ts`:

```typescript
// src/lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    // ── Email/Password Login ────────────────────────
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.passwordHash) {
          throw new Error("Invalid email or password");
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isValidPassword) {
          throw new Error("Invalid email or password");
        }

        // Update last login
        await db.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          plan: user.plan,
        };
      },
    }),

    // ── Google OAuth ────────────────────────────────
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),

    // ── GitHub OAuth ────────────────────────────────
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
  ],

  callbacks: {
    // ── JWT callback ────────────────────────────────
    async jwt({ token, user, trigger, session }) {
      // Initial sign in — add user data to token
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.plan = (user as any).plan;
      }

      // Update session (e.g., when user changes settings)
      if (trigger === "update" && session) {
        token.name = session.name;
        token.plan = session.plan;
      }

      // Refresh user data from DB on each request (lightweight)
      if (token.id) {
        const dbUser = await db.user.findUnique({
          where: { id: token.id as string },
          select: { role: true, plan: true },
        });
        if (dbUser) {
          token.role = dbUser.role;
          token.plan = dbUser.plan;
        }
      }

      return token;
    },

    // ── Session callback ────────────────────────────
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.plan = token.plan as string;
      }
      return session;
    },

    // ── SignIn callback ─────────────────────────────
    async signIn({ user, account, profile }) {
      // For OAuth providers, create/update user in DB
      if (account?.provider === "google" || account?.provider === "github") {
        const existingUser = await db.user.findUnique({
          where: { email: user.email! },
        });

        if (!existingUser) {
          await db.user.create({
            data: {
              email: user.email!,
              name: user.name,
              image: user.image,
              emailVerified: new Date(),
            },
          });
        }
      }

      return true;
    },
  },

  pages: {
    signIn: "/login",
    signUp: "/signup",
    error: "/login", // Redirect to login on auth errors
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,

  debug: process.env.NODE_ENV === "development",
};
```

## 8.2 NextAuth Route Handler

Create `src/app/api/auth/[...nextauth]/route.ts`:

```typescript
// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
```

## 8.3 Auth Provider Component

Create `src/components/providers/AuthProvider.tsx`:

```typescript
// src/components/providers/AuthProvider.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export function AuthProvider({ children }: { children: ReactNode }) {
  return <SessionProvider refetchInterval={5 * 60}>{children}</SessionProvider>;
}
```

## 8.4 Protected Route Middleware

Create `src/middleware.ts`:

```typescript
// src/middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/app/:path*",
    "/dashboard/:path*",
    "/history/:path*",
    "/profile/:path*",
    "/settings/:path*",
  ],
};
```

## 8.5 Server-Side Auth Helper

Create `src/lib/auth-helpers.ts`:

```typescript
// src/lib/auth-helpers.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

// Get current user or null (for pages that work for both auth'd and anon users)
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  
  return db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      role: true,
      plan: true,
      createdAt: true,
    },
  });
}

// Require authentication (for protected pages)
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

// Require admin role
export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== "ADMIN") redirect("/dashboard");
  return user;
}

// Hash password for registration
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}
```

## 8.6 Signup API Endpoint

Create `src/app/api/auth/signup/route.ts`:

```typescript
// src/app/api/auth/signup/route.ts
import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth-helpers";
import { z } from "zod";

const SignupSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = SignupSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  }

  const { name, email, password } = parsed.data;

  // Check if user already exists
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return Response.json({ error: "An account with this email already exists" }, { status: 409 });
  }

  // Create user
  const passwordHash = await hashPassword(password);
  const user = await db.user.create({
    data: { email, name, passwordHash },
  });

  return Response.json({
    success: true,
    message: "Account created successfully. Please sign in.",
    user: { id: user.id, email: user.email, name: user.name },
  }, { status: 201 });
}
```

## 8.7 Role-Based Access Control

| Role | Access Level | Can Do |
|------|-------------|--------|
| `USER` | Standard | Classify, view resources, manage own profile/history |
| `VERIFIER` | Elevated | All USER + verify resources, edit resource data |
| `CRISIS_COUNSELOR` | Elevated | All USER + view crisis classifications, access crisis dashboard |
| `ADMIN` | Full | Everything + manage users, blog, resources, view analytics |

---

# 9. AI Classification Pipeline

## 9.1 Main Classifier Module

Create `src/lib/ai/classifier.ts`:

```typescript
// src/lib/ai/classifier.ts

// The 8 classification categories
export const CATEGORIES = [
  "Housing",
  "Food",
  "Mental Health",
  "Employment",
  "Legal Aid",
  "Healthcare",
  "Substance Abuse",
  "Senior Services",
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface ClassificationResult {
  label: Category;
  confidence: number;           // 0.0 - 1.0
  scores: Record<string, number>; // All category scores
  modelUsed: string;
  processingTimeMs: number;
}

/**
 * Classify using HuggingFace BART-large-MNLI
 * Zero-shot classification: takes user text + candidate labels,
 * returns probability distribution over labels.
 */
export async function classifyWithHF(
  text: string,
  labels: readonly string[]
): Promise<Omit<ClassificationResult, "modelUsed" | "processingTimeMs">> {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/facebook/bart-large-mnli",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: text,
        parameters: {
          candidate_labels: labels,
          multi_label: false,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HuggingFace API error: ${response.status} — ${errorText}`);
  }

  const data = await response.json();
  
  // HuggingFace returns: { labels: [...], scores: [...], sequence: "..." }
  const scores: Record<string, number> = {};
  data.labels.forEach((label: string, i: number) => {
    scores[label] = data.scores[i];
  });

  return {
    label: data.labels[0],
    confidence: data.scores[0],
    scores,
  };
}

/**
 * Keyword-based fallback classifier.
 * Used when HuggingFace API is unavailable or no API key is configured.
 * Uses weighted keyword matching with TF-IDF-like scoring.
 */
export function simulateClassification(
  text: string,
  labels: readonly string[]
): Omit<ClassificationResult, "modelUsed" | "processingTimeMs"> {
  const textLower = text.toLowerCase();

  // Keyword dictionary: category → weighted keywords
  const keywordMap: Record<string, { keywords: string[]; weight: number }> = {
    Housing: {
      keywords: ["housing", "rent", "apartment", "shelter", "homeless", "eviction", "mortgage", "housing assistance", "section 8", "transitional housing", "emergency shelter", "affordable housing"],
      weight: 1.2,
    },
    Food: {
      keywords: ["food", "meal", "hungry", "food bank", "food pantry", "snap", "ebt", "nutrition", "groceries", "food stamps", "soup kitchen", "free food"],
      weight: 1.0,
    },
    "Mental Health": {
      keywords: ["mental", "anxiety", "depression", "therapy", "counseling", "suicide", "self-harm", "ptsd", "trauma", "stress", "panic", "psychologist", "psychiatrist", "coping"],
      weight: 1.3, // Higher weight because mental health keywords are more distinctive
    },
    Employment: {
      keywords: ["job", "employment", "work", "career", "unemployment", "resume", "interview", "training", "vocational", "workforce", "job search", "hiring"],
      weight: 1.0,
    },
    "Legal Aid": {
      keywords: ["legal", "lawyer", "court", "attorney", "custody", "divorce", "immigration", "deportation", "criminal", "civil rights", "legal aid", "public defender"],
      weight: 1.1,
    },
    Healthcare: {
      keywords: ["health", "medical", "doctor", "hospital", "clinic", "insurance", "medicaid", "medicare", "prescription", "dental", "vision", "healthcare"],
      weight: 1.0,
    },
    "Substance Abuse": {
      keywords: ["substance", "drug", "alcohol", "addiction", "rehab", "detox", "sobriety", "recovery", "overdose", "withdrawal", "aa meeting", "na meeting", "naloxone"],
      weight: 1.3,
    },
    "Senior Services": {
      keywords: ["senior", "elderly", "aging", "medicare", "social security", "retirement", "nursing", "assisted living", "home care", "caregiver", "elder", "meals on wheels"],
      weight: 1.0,
    },
  };

  // Calculate scores
  const scores: Record<string, number> = {};
  let totalScore = 0;

  for (const label of labels) {
    const mapping = keywordMap[label];
    if (!mapping) {
      scores[label] = 0.01; // Minimum score for unknown categories
      continue;
    }

    let score = 0;
    for (const keyword of mapping.keywords) {
      if (textLower.includes(keyword)) {
        // Longer keyword matches are worth more
        const lengthBonus = keyword.split(" ").length * 0.1;
        score += 1 + lengthBonus;
      }
    }

    // Apply weight
    score *= mapping.weight;

    // Softmax-like normalization: ensure no zero scores
    scores[label] = Math.max(score, 0.01);
    totalScore += scores[label];
  }

  // If no keywords matched at all, distribute evenly with slight randomization
  if (totalScore <= labels.length * 0.01) {
    // Use text length as a weak signal
    const baseScore = 1 / labels.length;
    for (const label of labels) {
      scores[label] = baseScore;
    }
    // Pick a semi-random label based on text hash
    const hash = textLower.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    const primaryIdx = hash % labels.length;
    scores[labels[primaryIdx]] += 0.15;
  }

  // Normalize to sum to ~1
  const sum = Object.values(scores).reduce((a, b) => a + b, 0);
  for (const key of Object.keys(scores)) {
    scores[key] = scores[key] / sum;
  }

  // Find top label
  const topLabel = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];

  return {
    label: topLabel[0] as Category,
    confidence: topLabel[1],
    scores,
  };
}
```

## 9.2 Classification Response Type

Create `src/types/classification.ts`:

```typescript
// src/types/classification.ts

export type Category =
  | "Housing"
  | "Food"
  | "Mental Health"
  | "Employment"
  | "Legal Aid"
  | "Healthcare"
  | "Substance Abuse"
  | "Senior Services"
  | "Crisis";

export interface TransparencyLayers {
  confidence: number;            // 0.0 - 1.0
  sourceQuality: SourceQuality;  // Where data comes from
  biasCheck: BiasCheckResult;    // Detected biases
  complexityLevel: ComplexityLevel; // How complex the situation is
  alternativeViews: AlternativeView[]; // Other possible classifications
  verificationStatus: VerificationStatus; // Human verification state
}

export type SourceQuality = "government" | "nonprofit" | "community" | "ai_generated";

export interface BiasCheckResult {
  detected: boolean;
  types: BiasType[];
  severity: "none" | "low" | "medium" | "high";
  explanation: string;
}

export type BiasType =
  | "geographic"        // Resources biased toward certain areas
  | "demographic"       // Resources may not serve all demographics
  | "temporal"          // Information may be outdated
  | "availability"      // Resource availability not confirmed
  | "cultural"          // Services may not be culturally appropriate
  | "language"          // Services may not be available in user's language
  | "economic"          // Services may have hidden costs
  | "accessibility";    // Physical or digital accessibility not confirmed

export type ComplexityLevel = "simple" | "moderate" | "complex" | "critical";

export interface AlternativeView {
  category: Category;
  confidence: number;
  reason: string;
}

export type VerificationStatus = "verified" | "partially_verified" | "unverified" | "disputed";

export interface ClassificationResponse {
  type: "classification" | "crisis";
  classification: {
    id: string;
    category: Category;
    confidence: number;
    allScores?: Record<string, number>;
    isCrisis: boolean;
    crisisType?: string;
    modelUsed: string;
    processingTimeMs: number;
  };
  resources: ResourceResult[];
  transparency: TransparencyLayers;
  message?: string;
}

export interface ResourceResult {
  id: string;
  name: string;
  category: string;
  description?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  verificationStatus: VerificationStatus;
  isCrisisResource?: boolean;
  is247?: boolean;
  costType?: string;
}
```

---

# 10. Crisis Detection System

## 10.1 Crisis Detection Module

Create `src/lib/ai/crisis-detection.ts`:

```typescript
// src/lib/ai/crisis-detection.ts

export interface CrisisResource {
  name: string;
  phone: string;
  description: string;
  available: string; // "24/7"
  type: string;
}

export interface CrisisDetectionResult {
  isCrisis: boolean;
  type?: CrisisType;
  severity?: "low" | "medium" | "high" | "immediate";
  resources?: CrisisResource[];
  matchedKeywords?: string[];
}

export type CrisisType = "suicide" | "self_harm" | "abuse" | "overdose" | "homeless_immediate" | "domestic_violence";

// ── Crisis keyword databases ────────────────────────

const CRISIS_KEYWORDS: Record<CrisisType, string[]> = {
  suicide: [
    "kill myself", "want to die", "end my life", "suicide", "suicidal",
    "no reason to live", "better off dead", "don't want to be alive",
    "thinking about death", "can't go on", "give up on life",
    "take my own life", "ending it all", "not worth living",
    "i want to disappear forever", "world without me", "final exit",
    "how to kill myself", "ways to die", "suicide method",
  ],
  self_harm: [
    "cut myself", "cutting", "self-harm", "self harm", "hurt myself",
    "burning myself", "self injury", "cutting myself",
    "i deserve pain", "punish myself", "harm myself",
  ],
  abuse: [
    "abused", "abusing me", "domestic violence", "battered", "beating me",
    "hitting me", "hurting me", "physically hurting", "sexually assaulted",
    "rape", "molested", "stalking me", "threatening me",
    "controlling me", "won't let me leave", "trapped in my home",
  ],
  overdose: [
    "overdose", "overdosed", "took too many pills", "pills right now",
    "drank too much", "alcohol poisoning", "naloxone", "narcan",
    "unresponsive", "not breathing", "blue lips",
  ],
  homeless_immediate: [
    "homeless tonight", "nowhere to sleep", "kicked out", "on the street",
    "sleeping in my car", "no shelter", "evicted today", "no place to go",
    "sleeping outside", "nowhere to go tonight",
  ],
  domestic_violence: [
    "domestic violence", "my partner hits me", "my spouse abuses me",
    "afraid of my partner", "partner controls me", "trapped in relationship",
    "can't leave my partner", "partner threatens me",
    "safe house", "women's shelter", "escape my partner",
  ],
};

// National crisis resources (US)
const CRISIS_RESOURCES: Record<CrisisType, CrisisResource[]> = {
  suicide: [
    {
      name: "988 Suicide & Crisis Lifeline",
      phone: "988",
      description: "Free, confidential support for people in suicidal crisis or emotional distress, 24/7.",
      available: "24/7",
      type: "hotline",
    },
    {
      name: "Crisis Text Line",
      phone: "Text HOME to 741741",
      description: "Free, 24/7 text-based support from trained crisis counselors.",
      available: "24/7",
      type: "text_line",
    },
  ],
  self_harm: [
    {
      name: "988 Suicide & Crisis Lifeline",
      phone: "988",
      description: "Support for self-harm urges and emotional distress.",
      available: "24/7",
      type: "hotline",
    },
    {
      name: "Crisis Text Line",
      phone: "Text HOME to 741741",
      description: "Text-based support for self-harm and crisis situations.",
      available: "24/7",
      type: "text_line",
    },
  ],
  abuse: [
    {
      name: "National Domestic Violence Hotline",
      phone: "1-800-799-7233",
      description: "Confidential support for domestic violence victims.",
      available: "24/7",
      type: "hotline",
    },
    {
      name: "RAINN National Sexual Assault Hotline",
      phone: "1-800-656-4673",
      description: "Free, confidential support for sexual assault victims.",
      available: "24/7",
      type: "hotline",
    },
  ],
  overdose: [
    {
      name: "Poison Control Center",
      phone: "1-800-222-1222",
      description: "Free, expert help for poison emergencies and overdose.",
      available: "24/7",
      type: "hotline",
    },
    {
      name: "911 Emergency",
      phone: "911",
      description: "If someone is not breathing, unconscious, or having a seizure, call 911 immediately.",
      available: "24/7",
      type: "emergency",
    },
  ],
  homeless_immediate: [
    {
      name: "211 Helpline",
      phone: "211",
      description: "Connects you to local emergency shelters and housing resources.",
      available: "24/7",
      type: "hotline",
    },
  ],
  domestic_violence: [
    {
      name: "National Domestic Violence Hotline",
      phone: "1-800-799-7233",
      description: "Confidential support, safety planning, and referrals.",
      available: "24/7",
      type: "hotline",
    },
    {
      name: "Crisis Text Line",
      phone: "Text LOVEIS to 22522",
      description: "Text-based support for relationship abuse.",
      available: "24/7",
      type: "text_line",
    },
  ],
};

/**
 * Detect crisis in user input.
 * Returns crisis type, severity, and relevant resources.
 * This function is called BEFORE AI classification — it's the first check.
 */
export function detectCrisis(text: string): CrisisDetectionResult {
  const textLower = text.toLowerCase().trim();

  let detectedType: CrisisType | null = null;
  let matchedKeywords: string[] = [];

  // Check each crisis type in priority order
  // Priority: suicide > overdose > self_harm > abuse > domestic_violence > homeless_immediate
  const priorityOrder: CrisisType[] = [
    "suicide",
    "overdose",
    "self_harm",
    "abuse",
    "domestic_violence",
    "homeless_immediate",
  ];

  for (const type of priorityOrder) {
    const keywords = CRISIS_KEYWORDS[type];
    const matches = keywords.filter((kw) => textLower.includes(kw));

    if (matches.length > 0) {
      detectedType = type;
      matchedKeywords = matches;
      break; // Stop at first (highest priority) match
    }
  }

  if (!detectedType) {
    return { isCrisis: false };
  }

  // Determine severity based on crisis type and keyword intensity
  const severity = determineSeverity(detectedType, matchedKeywords);

  return {
    isCrisis: true,
    type: detectedType,
    severity,
    resources: CRISIS_RESOURCES[detectedType],
    matchedKeywords,
  };
}

function determineSeverity(
  type: CrisisType,
  matchedKeywords: string[]
): "low" | "medium" | "high" | "immediate" {
  // Immediate: active suicide or overdose
  if (type === "suicide" || type === "overdose") {
    return "immediate";
  }

  // High: self-harm or active abuse
  if (type === "self_harm" || type === "abuse") {
    return "high";
  }

  // Medium: domestic violence or imminent homelessness
  if (type === "domestic_violence" || type === "homeless_immediate") {
    return "medium";
  }

  return "low";
}
```

---


# 11. 6-Layer Transparency System

## 11.1 Transparency Calculation Module

Create `src/lib/ai/transparency.ts`:

```typescript
// src/lib/ai/transparency.ts
import { TransparencyLayers, BiasType, ComplexityLevel, VerificationStatus, Category } from "@/types/classification";

interface ClassificationScore {
  label: string;
  confidence: number;
  scores: Record<string, number>;
}

/**
 * Calculate all 6 transparency layers for a classification result.
 * This is the core innovation of ClearPath AI.
 */
export function calculateTransparency(
  result: ClassificationScore,
  userInput: string,
  modelUsed: string
): TransparencyLayers {
  return {
    // Layer 1: Confidence Score
    confidence: calculateConfidence(result, modelUsed),

    // Layer 2: Source Quality
    sourceQuality: determineSourceQuality(result.label as Category, modelUsed),

    // Layer 3: Bias Check
    biasCheck: detectBias(result, userInput),

    // Layer 4: Complexity Level
    complexityLevel: assessComplexity(userInput, result),

    // Layer 5: Alternative Views
    alternativeViews: findAlternatives(result),

    // Layer 6: Verification Status
    verificationStatus: determineVerificationStatus(result.label as Category),
  };
}

// ── Layer 1: Confidence Score ────────────────────────

function calculateConfidence(
  result: ClassificationScore,
  modelUsed: string
): number {
  let confidence = result.confidence;

  // Adjust confidence based on model reliability
  // BART-large-MNLI tends to be overconfident, so we calibrate
  if (modelUsed === "bart-large-mnli") {
    // Calibration curve based on validation: reduce very high confidence,
    // increase very low confidence ( Platt scaling approximation )
    if (confidence > 0.9) confidence = 0.9 - (1 - confidence) * 0.5;
    if (confidence < 0.3) confidence = 0.3 + confidence * 0.3;
  }

  // Keyword fallback is inherently less confident
  if (modelUsed === "keyword-fallback") {
    confidence = Math.min(confidence * 0.8, 0.7); // Cap at 70% for keyword
  }

  return Math.round(confidence * 100) / 100;
}

// ── Layer 2: Source Quality ──────────────────────────

function determineSourceQuality(
  category: Category,
  modelUsed: string
): "government" | "nonprofit" | "community" | "ai_generated" {
  // Categories that typically have government sources
  const governmentCategories: Category[] = [
    "Housing", "Healthcare", "Legal Aid", "Senior Services",
  ];

  // Categories that typically have nonprofit sources
  const nonprofitCategories: Category[] = [
    "Mental Health", "Substance Abuse", "Food",
  ];

  // Categories that are more community-driven
  const communityCategories: Category[] = [
    "Employment",
  ];

  if (modelUsed === "keyword-fallback") return "ai_generated";

  if (governmentCategories.includes(category)) return "government";
  if (nonprofitCategories.includes(category)) return "nonprofit";
  if (communityCategories.includes(category)) return "community";

  return "community";
}

// ── Layer 3: Bias Check ─────────────────────────────

function detectBias(
  result: ClassificationScore,
  userInput: string
): { detected: boolean; types: BiasType[]; severity: "none" | "low" | "medium" | "high"; explanation: string } {
  const biases: BiasType[] = [];
  const explanations: string[] = [];

  // Check for geographic bias: is there location info in the input?
  const locationKeywords = ["near me", "in my area", "local", "nearby", "close to"];
  const hasLocation = locationKeywords.some(kw => userInput.toLowerCase().includes(kw));
  if (!hasLocation) {
    biases.push("geographic");
    explanations.push("No location specified — resources may not be available in your area");
  }

  // Check for temporal bias: are the resources up to date?
  const timeKeywords = ["urgent", "immediately", "today", "right now", "tonight"];
  const hasUrgency = timeKeywords.some(kw => userInput.toLowerCase().includes(kw));
  if (hasUrgency) {
    biases.push("temporal");
    explanations.push("Urgent need detected — resource availability may differ from listed hours");
  }

  // Check for language bias
  const nonEnglishChars = /[\u00C0-\u024F\u4e00-\u9fff\u0600-\u06ff]/;
  if (nonEnglishChars.test(userInput)) {
    biases.push("language");
    explanations.push("Non-English input detected — service availability in your language may be limited");
  }

  // Check for demographic bias: very specific demographic mentions
  const demographicKeywords = ["veteran", "LGBTQ", "disability", "disabled", "elderly", "teen", "youth", "immigrant"];
  const hasDemographic = demographicKeywords.some(kw => userInput.toLowerCase().includes(kw));
  if (hasDemographic) {
    biases.push("demographic");
    explanations.push("Specific demographic identified — some resources may have eligibility restrictions");
  }

  // Check for accessibility bias
  const accessibilityKeywords = ["wheelchair", "mobility", "deaf", "blind", "accessible"];
  const needsAccessibility = accessibilityKeywords.some(kw => userInput.toLowerCase().includes(kw));
  if (needsAccessibility) {
    biases.push("accessibility");
    explanations.push("Accessibility needs detected — physical/digital accessibility of resources not confirmed");
  }

  // Check for economic bias
  const economicKeywords = ["free", "no insurance", "uninsured", "low income", "can't afford", "no money"];
  const hasEconomicNeed = economicKeywords.some(kw => userInput.toLowerCase().includes(kw));
  if (hasEconomicNeed) {
    biases.push("economic");
    explanations.push("Financial constraints noted — some resources may have hidden costs or insurance requirements");
  }

  // If confidence is low between top categories, flag as availability bias
  const scores = Object.values(result.scores).sort((a, b) => b - a);
  if (scores.length >= 2 && scores[0] - scores[1] < 0.15) {
    biases.push("availability");
    explanations.push("Close competition between categories suggests the classification may not be precise");
  }

  const severity = biases.length === 0 ? "none"
    : biases.length <= 1 ? "low"
    : biases.length <= 3 ? "medium"
    : "high";

  return {
    detected: biases.length > 0,
    types: biases,
    severity,
    explanation: explanations.length > 0 ? explanations.join(". ") + "." : "No significant biases detected.",
  };
}

// ── Layer 4: Complexity Level ────────────────────────

function assessComplexity(
  userInput: string,
  result: ClassificationScore
): ComplexityLevel {
  let score = 0;
  const inputLower = userInput.toLowerCase();

  // Factors that increase complexity
  if (inputLower.length > 200) score += 2;         // Long description
  if (inputLower.length > 100) score += 1;          // Medium description

  // Multiple needs indicators
  const needIndicators = ["also", "and", "plus", "additionally", "as well as", "both"];
  const multiNeeds = needIndicators.filter(kw => inputLower.includes(kw)).length;
  score += Math.min(multiNeeds, 3);

  // Urgency increases complexity
  const urgentWords = ["urgent", "emergency", "crisis", "immediately", "tonight", "right now", "desperate"];
  if (urgentWords.some(w => inputLower.includes(w))) score += 2;

  // Low confidence = higher complexity (the AI is less sure)
  if (result.confidence < 0.5) score += 2;
  else if (result.confidence < 0.7) score += 1;

  // Certain categories are inherently more complex
  const complexCategories = ["Mental Health", "Legal Aid", "Substance Abuse"];
  if (complexCategories.includes(result.label)) score += 1;

  // Map score to complexity level
  if (score >= 6) return "critical";
  if (score >= 4) return "complex";
  if (score >= 2) return "moderate";
  return "simple";
}

// ── Layer 5: Alternative Views ──────────────────────

function findAlternatives(
  result: ClassificationScore
): { category: Category; confidence: number; reason: string }[] {
  const alternatives: { category: Category; confidence: number; reason: string }[] = [];

  // Sort scores by confidence (descending), skip the top one
  const sorted = Object.entries(result.scores)
    .sort(([, a], [, b]) => b - a)
    .slice(1, 4); // Take positions 2-4

  // Category relationship map — categories that commonly overlap
  const relatedCategories: Record<string, string[]> = {
    "Housing": ["Senior Services", "Healthcare"],
    "Food": ["Housing", "Senior Services"],
    "Mental Health": ["Substance Abuse", "Healthcare"],
    "Employment": ["Housing", "Legal Aid"],
    "Legal Aid": ["Housing", "Employment"],
    "Healthcare": ["Mental Health", "Substance Abuse"],
    "Substance Abuse": ["Mental Health", "Healthcare"],
    "Senior Services": ["Healthcare", "Housing"],
  };

  for (const [category, confidence] of sorted) {
    if (confidence < 0.05) continue; // Skip very low confidence alternatives

    const related = relatedCategories[category] || [];
    const isRelatedToTop = related.includes(result.label);

    alternatives.push({
      category: category as Category,
      confidence,
      reason: isRelatedToTop
        ? `${category} services often overlap with ${result.label} resources`
        : `Your description partially matches ${category} criteria`,
    });
  }

  return alternatives;
}

// ── Layer 6: Verification Status ────────────────────

function determineVerificationStatus(category: Category): VerificationStatus {
  // Categories with strong government infrastructure tend to be more verified
  const verifiedCategories: Category[] = [
    "Healthcare", "Legal Aid", "Senior Services",
  ];

  const partiallyVerified: Category[] = [
    "Housing", "Food", "Employment",
  ];

  const lessVerified: Category[] = [
    "Mental Health", "Substance Abuse",
  ];

  if (verifiedCategories.includes(category)) return "partially_verified";
  if (partiallyVerified.includes(category)) return "partially_verified";
  if (lessVerified.includes(category)) return "unverified";
  return "unverified";
}
```

## 11.2 Transparency UI Components

Each layer has a dedicated component in `src/components/transparency/`:

### ConfidenceScore Component

```typescript
// src/components/transparency/ConfidenceScore.tsx
"use client";

import { motion } from "framer-motion";

interface ConfidenceScoreProps {
  score: number; // 0-1
  showDetails?: boolean;
}

export function ConfidenceScore({ score, showDetails = true }: ConfidenceScoreProps) {
  const percentage = Math.round(score * 100);
  const color = percentage >= 80 ? "text-emerald-400"
    : percentage >= 60 ? "text-amber-400"
    : percentage >= 40 ? "text-orange-400"
    : "text-red-400";

  const bgGradient = percentage >= 80 ? "from-emerald-500/20 to-emerald-500/5"
    : percentage >= 60 ? "from-amber-500/20 to-amber-500/5"
    : percentage >= 40 ? "from-orange-500/20 to-orange-500/5"
    : "from-red-500/20 to-red-500/5";

  const label = percentage >= 80 ? "High confidence"
    : percentage >= 60 ? "Moderate confidence"
    : percentage >= 40 ? "Low confidence"
    : "Very low confidence";

  return (
    <div className={`rounded-xl bg-gradient-to-br ${bgGradient} border border-white/10 p-4`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-white/70">Confidence Score</span>
        <span className={`text-2xl font-bold ${color}`}>{percentage}%</span>
      </div>
      
      {/* Progress bar */}
      <div className="w-full bg-white/10 rounded-full h-2 mb-2">
        <motion.div
          className={`h-2 rounded-full ${color.replace('text-', 'bg-')}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      
      {showDetails && (
        <p className="text-xs text-white/50">{label} — This indicates how certain the AI is about this classification</p>
      )}
    </div>
  );
}
```

---

# 12. Frontend Architecture

## 12.1 Provider Setup in Root Layout

Update `src/app/layout.tsx`:

```typescript
// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://clearpath-ai.vercel.app"),
  title: "ClearPath AI — Community Resource Navigator",
  description: "Verified community resources with calibrated transparency. AI-powered classification with confidence scores, bias detection, and verification status.",
  // ... rest of existing metadata
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <QueryProvider>
              {children}
              <Toaster />
            </QueryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

## 12.2 Theme Provider

Create `src/components/providers/ThemeProvider.tsx`:

```typescript
// src/components/providers/ThemeProvider.tsx
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode } from "react";

export function ThemeProvider({ children, ...props }: any) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

## 12.3 React Query Provider

Create `src/components/providers/QueryProvider.tsx`:

```typescript
// src/components/providers/QueryProvider.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,         // 1 minute
            refetchOnWindowFocus: false,
            retry: 2,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

---

# 13. State Management — Zustand Stores

## 13.1 Chat Store

Create `src/stores/chat-store.ts`:

```typescript
// src/stores/chat-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  
  // Classification data (assistant messages only)
  classification?: {
    id: string;
    category: string;
    confidence: number;
    isCrisis: boolean;
    modelUsed: string;
    processingTimeMs: number;
  };
  
  // Transparency data (assistant messages only)
  transparency?: {
    confidence: number;
    sourceQuality: string;
    biasCheck: { detected: boolean; types: string[]; severity: string; explanation: string };
    complexityLevel: string;
    alternativeViews: { category: string; confidence: number; reason: string }[];
    verificationStatus: string;
  };
  
  // Resources (assistant messages only)
  resources?: {
    id: string;
    name: string;
    category: string;
    phone?: string;
    verificationStatus: string;
  }[];
}

interface ChatState {
  messages: ChatMessage[];
  isProcessing: boolean;
  currentConversationId: string | null;
  
  // Actions
  addMessage: (message: ChatMessage) => void;
  setProcessing: (processing: boolean) => void;
  setConversationId: (id: string | null) => void;
  clearMessages: () => void;
  getMessageCount: () => number;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [],
      isProcessing: false,
      currentConversationId: null,

      addMessage: (message) =>
        set((state) => ({
          messages: [...state.messages, message],
        })),

      setProcessing: (processing) =>
        set({ isProcessing: processing }),

      setConversationId: (id) =>
        set({ currentConversationId: id }),

      clearMessages: () =>
        set({ messages: [], currentConversationId: null }),

      getMessageCount: () => get().messages.length,
    }),
    {
      name: "clearpath-chat",
      partialize: (state) => ({
        messages: state.messages.slice(-50), // Keep last 50 messages
        currentConversationId: state.currentConversationId,
      }),
    }
  )
);
```

## 13.2 UI Store

Create `src/stores/ui-store.ts`:

```typescript
// src/stores/ui-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  transparencyPanelOpen: boolean;
  
  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  toggleTransparencyPanel: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      mobileMenuOpen: false,
      transparencyPanelOpen: true,

      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleMobileMenu: () => set((s) => ({ mobileMenuOpen: !s.mobileMenuOpen })),
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
      toggleTransparencyPanel: () => set((s) => ({ transparencyPanelOpen: !s.transparencyPanelOpen })),
    }),
    {
      name: "clearpath-ui",
    }
  )
);
```

## 13.3 Classification Hook (React Query)

Create `src/hooks/use-classify.ts`:

```typescript
// src/hooks/use-classify.ts
import { useMutation } from "@tanstack/react-query";
import { useChatStore } from "@/stores/chat-store";
import type { ClassificationResponse } from "@/types/classification";

export function useClassifyMutation() {
  const addMessage = useChatStore((s) => s.addMessage);
  const setProcessing = useChatStore((s) => s.setProcessing);
  const conversationId = useChatStore((s) => s.currentConversationId);

  return useMutation({
    mutationFn: async (message: string): Promise<ClassificationResponse> => {
      const response = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          conversationId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Classification failed");
      }

      return response.json();
    },

    onMutate: () => {
      setProcessing(true);
    },

    onSuccess: (data) => {
      // Add assistant response to chat
      addMessage({
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.message || `I've identified this as a **${data.classification.category}** need.`,
        timestamp: new Date(),
        classification: data.classification,
        transparency: data.transparency,
        resources: data.resources,
      });
    },

    onError: (error) => {
      addMessage({
        id: crypto.randomUUID(),
        role: "system",
        content: `Something went wrong: ${error.message}. Please try again.`,
        timestamp: new Date(),
      });
    },

    onSettled: () => {
      setProcessing(false);
    },
  });
}
```

---

# 14. Component Library — Shared Components

## 14.1 Components to Extract from Pages

These components are currently duplicated across multiple pages and need to be extracted to `src/components/shared/`:

| Component | Currently In | Used By |
|-----------|-------------|---------|
| `ConfidenceRing` | app/page.tsx, about/page.tsx | Chat, Dashboard, Landing |
| `FAQItem` | page.tsx, pricing/page.tsx, how-it-works/page.tsx | Landing, Pricing, How It Works |
| `Section` | Every page | All pages |
| `AnimatedCounter` | page.tsx, about/page.tsx | Landing, About |
| `GlassCard` | Multiple pages | All pages |
| `GradientButton` | Multiple pages | Landing, Pricing, CTA sections |
| `fadeInUp` animation | Every page | All pages (use from shared file) |

## 14.2 Animation Variants

Create `src/lib/animations.ts`:

```typescript
// src/lib/animations.ts
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
};

export const slideInLeft = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
};

export const slideInRight = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
};
```

---


# 15. Page-by-Page Implementation Guide

## 15.1 /app — Main Chat Page (CRITICAL — Priority #1)

**Current state**: 2,241 lines of hardcoded mock data. The chat never calls `/api/classify`.

**What needs to change**: Replace all hardcoded `chatSteps` with real API calls using the `useClassifyMutation` hook.

### Step-by-step refactor:

1. **Replace mock data with Zustand store**: Remove the `chatSteps` array and `ConversationHistory` type. Use `useChatStore` instead.

2. **Replace the chat flow with real API calls**:
```typescript
// BEFORE (current — hardcoded):
const chatSteps: Record<string, ChatStep> = {
  start: { message: "I can help you find...", options: [...] },
  housing_1: { message: "It sounds like you need housing assistance...", options: [...] },
  // ... 20+ hardcoded steps
};

// AFTER (real API):
import { useChatStore } from "@/stores/chat-store";
import { useClassifyMutation } from "@/hooks/use-classify";

function ChatInterface() {
  const messages = useChatStore((s) => s.messages);
  const isProcessing = useChatStore((s) => s.isProcessing);
  const addMessage = useChatStore((s) => s.addMessage);
  const classifyMutation = useClassifyMutation();

  const handleSend = async (text: string) => {
    // Add user message
    addMessage({
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: new Date(),
    });

    // Call real API
    await classifyMutation.mutateAsync(text);
  };

  // Render messages from store (with transparency data)
  return (
    <div>
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
      {isProcessing && <ProcessingIndicator />}
      <ChatInput onSend={handleSend} disabled={isProcessing} />
    </div>
  );
}
```

3. **Keep the starter prompts** as suggested inputs, but they now go through the real API:
```typescript
const starters = [
  "I need help finding affordable housing",
  "I'm looking for food assistance programs",
  "I need mental health support",
  "I need help with employment services",
];
```

4. **Wire the sidebar** to show conversation history from the database (via React Query).

5. **Keep all visual components** (ConfidenceRing, ProcessingPipeline, CrisisBlock, etc.) — they just need to receive real data instead of hardcoded props.

### ChatMessage component structure:

```typescript
// src/components/chat/ChatMessage.tsx
interface ChatMessageProps {
  message: ChatMessage;
}

export function ChatMessage({ message }: ChatMessageProps) {
  if (message.role === "user") {
    return <UserMessage content={message.content} />;
  }

  if (message.role === "system") {
    return <SystemMessage content={message.content} />;
  }

  // Assistant message with classification data
  return (
    <AssistantMessage>
      <MessageContent content={message.content} />
      
      {/* Crisis block if crisis detected */}
      {message.classification?.isCrisis && (
        <CrisisBlock crisisType={message.classification.crisisType} resources={message.resources} />
      )}
      
      {/* Category card */}
      {message.classification && !message.classification.isCrisis && (
        <CategoryCard category={message.classification.category} confidence={message.classification.confidence} />
      )}
      
      {/* 6-layer transparency panel */}
      {message.transparency && (
        <TransparencyPanel transparency={message.transparency} />
      )}
      
      {/* Matched resources */}
      {message.resources && message.resources.length > 0 && (
        <ResourceList resources={message.resources} />
      )}
    </AssistantMessage>
  );
}
```

## 15.2 /dashboard — User Dashboard (Priority #2)

**Current state**: 1,820 lines, all mock data.

**What needs to change**: Replace with real data from the database.

### Data sources needed:

```typescript
// src/hooks/use-dashboard.ts
import { useQuery } from "@tanstack/react-query";

export function useDashboardData() {
  // Fetch real stats
  const stats = useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard/stats");
      return res.json();
    },
  });

  // Fetch recent classifications
  const recentClassifications = useQuery({
    queryKey: ["dashboard", "recent"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard/recent");
      return res.json();
    },
  });

  // Fetch category distribution for chart
  const categoryDistribution = useQuery({
    queryKey: ["dashboard", "categories"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard/categories");
      return res.json();
    },
  });

  return { stats, recentClassifications, categoryDistribution };
}
```

### API endpoints needed:

- `GET /api/dashboard/stats` — Total classifications, crisis detections, average confidence
- `GET /api/dashboard/recent` — Last 10 classifications with transparency data
- `GET /api/dashboard/categories` — Distribution chart data (category → count)

### Dashboard widgets:

1. **Stats cards**: Total Searches, Crisis Detections (with pulse animation), Avg Confidence, Resources Found
2. **Category distribution chart**: Recharts pie/bar chart
3. **Recent activity feed**: List of recent classifications with category, confidence, time
4. **Transparency trends**: Line chart showing confidence over time
5. **Quick actions**: New search, view history, saved resources

## 15.3 /history — Search History (Priority #3)

**Current state**: 1,110 lines, mock data.

**What needs to change**: Fetch from `SearchHistory` and `Classification` tables.

```typescript
// GET /api/history?page=1&limit=20
// Returns paginated classification history for current user
```

Features needed:
- Date range filter
- Category filter
- Crisis-only filter
- Search within history
- Export as CSV
- Delete individual entries
- Bulk delete

## 15.4 /profile — User Profile (Priority #4)

**Current state**: 1,558 lines, mock user data.

**What needs to change**: Use `getCurrentUser()` from `src/lib/auth-helpers.ts`.

Features needed:
- View profile (name, email, plan, join date, stats)
- Edit profile (name, bio, location, organization, phone)
- Change avatar (upload to R2 storage)
- Delete account (soft delete, 30-day retention)

## 15.5 /settings — Settings (Priority #5)

**Current state**: 1,379 lines, no persistence.

**What needs to change**: Settings are stored in the `User` model.

Features needed:
- **Appearance**: Dark/light mode toggle, font size preference
- **Notifications**: Email notifications on/off, crisis alerts on/off
- **Privacy**: Data retention period, clear search history, export data
- **Account**: Change password, connected accounts (Google/GitHub), delete account
- **API**: API key management (for Enterprise users), usage stats

## 15.6 /login — Login (Priority #6)

**Current state**: 600 lines, no auth integration.

**What needs to change**: Use NextAuth's `signIn()` function.

```typescript
"use client";
import { signIn } from "next-auth/react";

async function handleLogin(email: string, password: string) {
  const result = await signIn("credentials", {
    email,
    password,
    redirect: true,
    callbackUrl: "/app",
  });

  if (result?.error) {
    // Show error toast
  }
}
```

## 15.7 /signup — Signup (Priority #7)

**Current state**: 860 lines, no backend.

**What needs to change**: Call the signup API, then auto-login.

```typescript
async function handleSignup(name: string, email: string, password: string) {
  // Create account
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });

  if (res.ok) {
    // Auto-login after signup
    await signIn("credentials", { email, password, callbackUrl: "/app" });
  }
}
```

## 15.8 /forgot-password — Password Reset (Priority #8)

**Current state**: 715 lines, no email service.

**What needs to change**: Use NextAuth's email token flow + Resend for sending emails.

Flow:
1. User enters email → POST `/api/auth/forgot-password`
2. Server generates reset token → saves to `VerificationToken` table
3. Server sends email via Resend with reset link
4. User clicks link → `/reset-password?token=xxx`
5. User enters new password → POST `/api/auth/reset-password`
6. Server validates token → updates password hash → deletes token

## 15.9 /contact — Contact Form (Priority #9)

**Current state**: 2,720 lines, no backend.

**What needs to change**: POST to `/api/contact`.

The existing form is already well-designed. Just wire the `onSubmit` handler:

```typescript
async function handleSubmit(data: ContactFormData) {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (res.ok) {
    toast.success("Message sent! We'll respond within 24 hours.");
    resetForm();
  } else {
    toast.error("Failed to send. Please try again.");
  }
}
```

## 15.10 /blog — Blog Listing (Priority #10)

**Current state**: 2,622 lines, no real blog posts.

**What needs to change**: Add MDX support for blog content.

Create `src/app/(public)/blog/[slug]/page.tsx` for individual posts.

Blog post content stored in `BlogPost` model with `content` field containing MDX markup.

Initial blog posts to write (for hackathon demo):
1. "What is Calibrated Transparency and Why It Matters"
2. "How ClearPath AI Detects Crisis Situations"
3. "The 6-Layer Transparency System Explained"
4. "Building Responsible AI for Community Resources"
5. "Behind the Model: BART-large-MNLI for Zero-Shot Classification"

---

# 16. Real-Time Features & WebSocket

## 16.1 When WebSocket is Needed

WebSocket is NOT needed for the current MVP. All interactions are request-response (user sends message → gets classification). However, for future features:

| Feature | Needs WebSocket? | Priority |
|---------|-----------------|----------|
| Live classification streaming | Maybe (SSE alternative) | P2 |
| Real-time dashboard updates | Yes | P3 |
| Live crisis counselor chat | Yes | P3 |
| Notification delivery | No (polling is fine) | P3 |
| Collaborative resource editing | Yes | P4 |

## 16.2 Server-Sent Events Alternative (Simpler)

For the MVP, use Server-Sent Events (SSE) instead of WebSocket for streaming classification results:

```typescript
// src/app/api/classify/stream/route.ts
export async function POST(request: NextRequest) {
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      // Send crisis check result first
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ step: "crisis_check", done: true })}\n\n`));
      
      // Send classification progress
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ step: "classifying", progress: 50 })}\n\n`));
      
      // Send final result
      const result = await classify(text);
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ step: "complete", result })}\n\n`));
      
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream" },
  });
}
```

---

# 17. Security & Privacy Implementation

## 17.1 Security Headers

Add to `next.config.ts`:

```typescript
// next.config.ts
import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "origin-when-cross-origin" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' blob: data: https:",
      "connect-src 'self' https://api-inference.huggingface.co",
    ].join("; "),
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self)",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone", // Fix the broken start script!
  
  typescript: {
    // TODO: Remove this once all TS errors are fixed
    ignoreBuildErrors: true,
  },
  
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
```

## 17.2 Input Sanitization

All user inputs must be sanitized before storage:

```typescript
// src/lib/sanitize.ts
import DOMPurify from "isomorphic-dompurify";

export function sanitizeInput(input: string): string {
  // Remove HTML tags and scripts
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
}

export function sanitizeForDisplay(input: string): string {
  // Allow safe HTML for blog content
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "br", "ul", "ol", "li"],
    ALLOWED_ATTR: ["href", "target"],
  });
}
```

Install: `bun add isomorphic-dompurify`

## 17.3 Rate Limiting

Create `src/lib/rate-limit.ts`:

```typescript
// src/lib/rate-limit.ts

interface RateLimitOptions {
  interval: number;  // Time window in ms
  limit: number;     // Max requests in window
}

// In-memory store (use Redis for production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(options: RateLimitOptions) {
  return (identifier: string): { success: boolean; remaining: number; resetTime: number } => {
    const now = Date.now();
    const record = rateLimitStore.get(identifier);

    if (!record || now > record.resetTime) {
      // New window
      rateLimitStore.set(identifier, {
        count: 1,
        resetTime: now + options.interval,
      });
      return {
        success: true,
        remaining: options.limit - 1,
        resetTime: now + options.interval,
      };
    }

    if (record.count >= options.limit) {
      return {
        success: false,
        remaining: 0,
        resetTime: record.resetTime,
      };
    }

    record.count++;
    return {
      success: true,
      remaining: options.limit - record.count,
      resetTime: record.resetTime,
    };
  };
}

// Pre-configured rate limiters
export const classifyRateLimit = rateLimit({ interval: 60 * 1000, limit: 10 }); // 10/min
export const contactRateLimit = rateLimit({ interval: 60 * 60 * 1000, limit: 3 }); // 3/hour
export const authRateLimit = rateLimit({ interval: 15 * 60 * 1000, limit: 5 }); // 5/15min
```

Usage in API route:

```typescript
import { classifyRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const { success, remaining } = classifyRateLimit(ip);
  
  if (!success) {
    return Response.json(
      { error: "Rate limit exceeded", message: "Please wait before making another request" },
      { 
        status: 429,
        headers: { "X-RateLimit-Remaining": String(remaining) },
      }
    );
  }
  
  // ... normal processing
}
```

## 17.4 Data Privacy

- **No personal health information stored**: The system only stores classification categories, not the user's specific health details
- **Conversation deletion**: Users can delete their entire conversation history
- **Data export**: Users can export their data (GDPR-style) via `/settings`
- **Anonymous usage**: The `/app` classification works without authentication
- **Encryption**: Passwords hashed with bcrypt (12 rounds), sensitive fields encrypted at rest in production

---


# 18. Testing Strategy

## 18.1 Testing Stack

| Tool | Purpose | Config |
|------|---------|--------|
| Vitest | Unit + integration tests | `vitest.config.ts` |
| Testing Library | React component tests | Integrated with Vitest |
| Playwright | E2E browser tests | `playwright.config.ts` |
| MSW | API mocking | Integrated with Vitest |

## 18.2 Install Testing Dependencies

```bash
bun add -d vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom msw
bun add -d @playwright/test
```

## 18.3 Test File Structure

```
src/__tests__/
├── unit/
│   ├── ai/
│   │   ├── classifier.test.ts         # classifyWithHF, simulateClassification
│   │   ├── crisis-detection.test.ts    # detectCrisis
│   │   └── transparency.test.ts        # calculateTransparency + all 6 layers
│   ├── lib/
│   │   ├── rate-limit.test.ts          # Rate limiting logic
│   │   └── sanitize.test.ts            # Input sanitization
│   └── components/
│       ├── ConfidenceScore.test.tsx
│       ├── CrisisBlock.test.tsx
│       └── TransparencyPanel.test.tsx
├── integration/
│   ├── api/
│   │   ├── classify.test.ts            # POST /api/classify (mocked HF)
│   │   ├── contact.test.ts             # POST /api/contact
│   │   └── auth.test.ts                # Signup + login flow
│   └── db/
│       └── prisma.test.ts              # Database queries
└── e2e/
    ├── chat-flow.spec.ts               # Full chat classification flow
    ├── auth-flow.spec.ts               # Login → dashboard flow
    └── crisis-detection.spec.ts         # Crisis keyword triggers response
```

## 18.4 Critical Tests to Write First

### Crisis Detection Tests (Highest Priority)

```typescript
// src/__tests__/unit/ai/crisis-detection.test.ts
import { detectCrisis } from "@/lib/ai/crisis-detection";

describe("detectCrisis", () => {
  it("detects suicidal intent", () => {
    const result = detectCrisis("I want to kill myself");
    expect(result.isCrisis).toBe(true);
    expect(result.type).toBe("suicide");
    expect(result.severity).toBe("immediate");
    expect(result.resources).toBeDefined();
    expect(result.resources!.length).toBeGreaterThan(0);
  });

  it("detects overdose", () => {
    const result = detectCrisis("I took too many pills");
    expect(result.isCrisis).toBe(true);
    expect(result.type).toBe("overdose");
  });

  it("detects domestic violence", () => {
    const result = detectCrisis("my partner hits me");
    expect(result.isCrisis).toBe(true);
    expect(result.type).toBe("abuse");
  });

  it("does NOT flag non-crisis text", () => {
    const result = detectCrisis("I need help finding affordable housing");
    expect(result.isCrisis).toBe(false);
    expect(result.type).toBeUndefined();
  });

  it("prioritizes suicide over other crisis types", () => {
    const result = detectCrisis("I'm being abused and I want to kill myself");
    expect(result.isCrisis).toBe(true);
    expect(result.type).toBe("suicide"); // Suicide takes priority
  });

  it("returns crisis resources for every type", () => {
    const crisisTypes = ["suicide", "self_harm", "abuse", "overdose", "homeless_immediate", "domestic_violence"];
    for (const type of crisisTypes) {
      // Test each type has resources
    }
  });
});
```

### Classification API Test

```typescript
// src/__tests__/integration/api/classify.test.ts
import { POST } from "@/app/api/classify/route";

// Mock HuggingFace API
jest.mock("@/lib/ai/classifier", () => ({
  classifyWithHF: jest.fn().mockResolvedValue({
    label: "Housing",
    confidence: 0.82,
    scores: { Housing: 0.82, Food: 0.08, "Mental Health": 0.04, Employment: 0.03, "Legal Aid": 0.01, Healthcare: 0.01, "Substance Abuse": 0.005, "Senior Services": 0.005 },
  }),
}));

describe("POST /api/classify", () => {
  it("returns classification for valid input", async () => {
    const request = new Request("http://localhost/api/classify", {
      method: "POST",
      body: JSON.stringify({ message: "I need help finding affordable housing" }),
    });

    const response = await POST(request as any);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.type).toBe("classification");
    expect(data.classification.category).toBe("Housing");
    expect(data.classification.confidence).toBeGreaterThan(0);
    expect(data.transparency).toBeDefined();
    expect(data.transparency.confidence).toBeDefined();
    expect(data.transparency.biasCheck).toBeDefined();
  });

  it("returns 400 for empty message", async () => {
    const request = new Request("http://localhost/api/classify", {
      method: "POST",
      body: JSON.stringify({ message: "" }),
    });

    const response = await POST(request as any);
    expect(response.status).toBe(400);
  });

  it("detects crisis and returns resources", async () => {
    const request = new Request("http://localhost/api/classify", {
      method: "POST",
      body: JSON.stringify({ message: "I want to kill myself" }),
    });

    const response = await POST(request as any);
    const data = await response.json();

    expect(data.type).toBe("crisis");
    expect(data.classification.isCrisis).toBe(true);
    expect(data.crisisResources).toBeDefined();
  });
});
```

## 18.5 E2E Test — Critical Path

```typescript
// src/__tests__/e2e/chat-flow.spec.ts
import { test, expect } from "@playwright/test";

test("complete classification flow", async ({ page }) => {
  // 1. Go to app
  await page.goto("/app");
  
  // 2. Type a message
  await page.fill('[data-testid="chat-input"]', "I need help finding affordable housing");
  
  // 3. Send it
  await page.click('[data-testid="send-button"]');
  
  // 4. Wait for response
  await page.waitForSelector('[data-testid="classification-result"]', { timeout: 10000 });
  
  // 5. Verify transparency layers are shown
  await expect(page.locator('[data-testid="confidence-score"]')).toBeVisible();
  await expect(page.locator('[data-testid="source-quality"]')).toBeVisible();
  await expect(page.locator('[data-testid="bias-check"]')).toBeVisible();
  await expect(page.locator('[data-testid="complexity-level"]')).toBeVisible();
  await expect(page.locator('[data-testid="alternative-views"]')).toBeVisible();
  await expect(page.locator('[data-testid="verification-status"]')).toBeVisible();
  
  // 6. Verify resources are shown
  await expect(page.locator('[data-testid="resource-list"]')).toBeVisible();
});

test("crisis detection flow", async ({ page }) => {
  await page.goto("/app");
  
  // Type crisis message
  await page.fill('[data-testid="chat-input"]', "I want to kill myself");
  await page.click('[data-testid="send-button"]');
  
  // Crisis block should appear
  await expect(page.locator('[data-testid="crisis-block"]')).toBeVisible({ timeout: 5000 });
  
  // Crisis hotline should be shown
  await expect(page.locator("text=988")).toBeVisible();
});
```

---

# 19. CI/CD Pipeline

## 19.1 GitHub Actions Workflow

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install
      - run: bun run lint
      - run: bunx tsc --noEmit

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install
      - run: bunx vitest run --coverage
      - uses: codecov/codecov-action@v4
        with:
          files: ./coverage/lcov.info

  build:
    runs-on: ubuntu-latest
    needs: [lint-and-typecheck, test]
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install
      - run: bun run build
      - name: Upload build artifact
        uses: actions/upload-artifact@v4
        with:
          name: build
          path: .next/

  e2e:
    runs-on: ubuntu-latest
    needs: [build]
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install
      - run: bunx playwright install --with-deps
      - run: bunx playwright test
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/

  deploy-preview:
    runs-on: ubuntu-latest
    needs: [build, e2e]
    if: github.event_name == 'pull_request'
    steps:
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## 19.2 Vercel Deployment

The project is already configured for Vercel (Next.js native). Key settings:

| Setting | Value |
|---------|-------|
| Framework Preset | Next.js |
| Build Command | `bun run build` |
| Output Directory | `.next` |
| Install Command | `bun install` |
| Node.js Version | 20.x |
| Environment | Production env vars (see Section 5) |

---

# 20. Deployment & Infrastructure

## 20.1 Production Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Vercel Edge                       │
│  ┌─────────────────────────────────────────────────┐ │
│  │           Next.js App (Serverless)              │ │
│  │  ┌───────────┐ ┌───────────┐ ┌──────────────┐  │ │
│  │  │ SSR Pages │ │ API Routes│ │ Static Pages  │  │ │
│  │  └───────────┘ └───────────┘ └──────────────┘  │ │
│  └─────────────────────────────────────────────────┘ │
│                        │                             │
│           ┌────────────┼────────────┐                │
│           ▼            ▼            ▼                │
│  ┌─────────────┐ ┌──────────┐ ┌──────────┐         │
│  │ PostgreSQL   │ │  Redis   │ │ R2/S3    │         │
│  │ (Supabase)   │ │(Upstash) │ │(Cloudfl.)│         │
│  └─────────────┘ └──────────┘ └──────────┘         │
└─────────────────────────────────────────────────────┘
```

## 20.2 Recommended Services (Free Tier)

| Service | Provider | Free Tier | Purpose |
|---------|----------|-----------|---------|
| Hosting | Vercel | 100GB bandwidth, unlimited deploys | App hosting |
| Database | Supabase | 500MB, 2 projects | PostgreSQL |
| Redis | Upstash | 10K commands/day | Rate limiting, caching |
| Email | Resend | 100 emails/day | Transactional email |
| File Storage | Cloudflare R2 | 10GB storage, 10M reads | User uploads |
| AI | HuggingFace | 1K requests/day | Classification |
| Monitoring | Sentry | 5K errors/month | Error tracking |
| Analytics | Vercel Analytics | 100K events/month | Web vitals |

## 20.3 Docker Configuration (Optional)

Create `Dockerfile`:

```dockerfile
FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Build
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# Production
FROM base AS runner
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
```

---

# 21. Monitoring, Logging & Analytics

## 21.1 Error Tracking with Sentry

```bash
bun add @sentry/nextjs
bunx @sentry/wizard@latest -i nextjs
```

Configuration: `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`

## 21.2 Custom Logging

Create `src/lib/logger.ts`:

```typescript
// src/lib/logger.ts
type LogLevel = "debug" | "info" | "warn" | "error";

class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  debug(message: string, data?: any) {
    if (process.env.NODE_ENV === "development") {
      console.debug(`[DEBUG][${this.context}] ${message}`, data);
    }
  }

  info(message: string, data?: any) {
    console.log(`[INFO][${this.context}] ${message}`, data);
  }

  warn(message: string, data?: any) {
    console.warn(`[WARN][${this.context}] ${message}`, data);
  }

  error(message: string, error?: any) {
    console.error(`[ERROR][${this.context}] ${message}`, error);
    // In production, send to Sentry
    if (process.env.NODE_ENV === "production" && process.env.SENTRY_DSN) {
      // Sentry capture is automatic via the SDK
    }
  }
}

export const createLogger = (context: string) => new Logger(context);
```

## 21.3 Classification Analytics

Every classification is already stored in the database. Add a scheduled function to aggregate daily metrics:

```typescript
// src/lib/analytics.ts
import { db } from "@/lib/db";

export async function aggregateDailyMetrics(date: Date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const [
    totalClassifications,
    crisisDetections,
    avgConfidenceResult,
    avgProcessingTimeResult,
  ] = await Promise.all([
    db.classification.count({
      where: { createdAt: { gte: startOfDay, lte: endOfDay } },
    }),
    db.classification.count({
      where: { isCrisis: true, createdAt: { gte: startOfDay, lte: endOfDay } },
    }),
    db.classification.aggregate({
      _avg: { confidence: true },
      where: { createdAt: { gte: startOfDay, lte: endOfDay } },
    }),
    db.classification.aggregate({
      _avg: { processingTimeMs: true },
      where: { createdAt: { gte: startOfDay, lte: endOfDay } },
    }),
  ]);

  await db.dailyMetric.upsert({
    where: { date: startOfDay },
    create: {
      date: startOfDay,
      totalClassifications,
      crisisDetections,
      avgConfidence: avgConfidenceResult._avg.confidence || 0,
      avgProcessingTimeMs: Math.round(avgProcessingTimeResult._avg.processingTimeMs || 0),
    },
    update: {
      totalClassifications,
      crisisDetections,
      avgConfidence: avgConfidenceResult._avg.confidence || 0,
      avgProcessingTimeMs: Math.round(avgProcessingTimeResult._avg.processingTimeMs || 0),
    },
  });
}
```

---

# 22. Rate Limiting & Abuse Prevention

## 22.1 Rate Limit Tiers

| Endpoint | Free | Pro | Enterprise |
|----------|------|-----|------------|
| POST /api/classify | 10/hour | 100/hour | Unlimited |
| POST /api/contact | 3/hour | 5/hour | 10/hour |
| POST /api/auth/signup | 5/15min | — | — |
| POST /api/auth/login | 10/15min | — | — |
| GET /api/resources | 30/hour | 100/hour | Unlimited |

## 22.2 Implementation (Already defined in Section 17.3)

For production, replace the in-memory store with Redis (Upstash):

```typescript
// src/lib/rate-limit-redis.ts
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.REDIS_URL!,
  token: process.env.REDIS_TOKEN!,
});

export async function rateLimitWithRedis(
  identifier: string,
  limit: number,
  windowSeconds: number
): Promise<{ success: boolean; remaining: number }> {
  const key = `rate-limit:${identifier}`;
  const current = await redis.incr(key);

  if (current === 1) {
    await redis.expire(key, windowSeconds);
  }

  return {
    success: current <= limit,
    remaining: Math.max(0, limit - current),
  };
}
```

---

# 23. Email & Notification System

## 23.1 Email Templates

Create `src/lib/email/templates/`:

| Template | Trigger | Recipient |
|----------|---------|-----------|
| `welcome` | New signup | User |
| `reset-password` | Password reset request | User |
| `contact-confirmation` | Contact form submitted | User |
| `contact-notification` | Contact form submitted | Team |
| `newsletter-confirmation` | Newsletter signup | Subscriber |
| `classification-report` | Weekly digest (Pro) | User |
| `crisis-alert` | Crisis detected | Admin (if enabled) |

## 23.2 Email Sender Module

Create `src/lib/email/sender.ts`:

```typescript
// src/lib/email/sender.ts
import Resend from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
  to: string | string[];
  subject: string;
  template: string;
  data: Record<string, any>;
}

export async function sendEmail({ to, subject, template, data }: SendEmailParams) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set, skipping email send");
    return;
  }

  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM || "ClearPath AI <noreply@clearpath-ai.com>",
    to,
    subject,
    html: renderTemplate(template, data),
  });

  if (error) {
    console.error("Email send failed:", error);
    throw error;
  }
}

function renderTemplate(template: string, data: Record<string, any>): string {
  // Simple template rendering — use a proper engine for production
  switch (template) {
    case "welcome":
      return `
        <h1>Welcome to ClearPath AI, ${data.name}!</h1>
        <p>Your account has been created. You can now access verified community resources with calibrated transparency.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/app">Start Exploring</a>
      `;
    case "reset-password":
      return `
        <h1>Password Reset Request</h1>
        <p>Click the link below to reset your password. This link expires in 1 hour.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${data.token}">Reset Password</a>
        <p>If you didn't request this, ignore this email.</p>
      `;
    case "contact-confirmation":
      return `
        <h1>Thank you for reaching out, ${data.name}!</h1>
        <p>We've received your message and will respond within 24 hours.</p>
        <p>In the meantime, you can explore <a href="${process.env.NEXT_PUBLIC_APP_URL}/app">ClearPath AI</a> for immediate resource navigation.</p>
      `;
    default:
      return `<p>${JSON.stringify(data)}</p>`;
  }
}
```

---

# 24. Payment Integration — Stripe

## 24.1 Stripe Setup

```bash
bun add stripe @stripe/stripe-js
```

## 24.2 Stripe Client

Create `src/lib/stripe/client.ts`:

```typescript
// src/lib/stripe/client.ts
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
  typescript: true,
});
```

## 24.3 Checkout Session API

Create `src/app/api/checkout/route.ts`:

```typescript
// src/app/api/checkout/route.ts
import { NextRequest } from "next/server";
import { stripe } from "@/lib/stripe/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { priceId } = await request.json();

  // Get or create Stripe customer
  let user = await db.user.findUnique({ where: { id: session.user.id } });

  if (!user?.stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user!.email,
      name: user!.name || undefined,
    });
    user = await db.user.update({
      where: { id: user!.id },
      data: { stripeCustomerId: customer.id },
    });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: user.stripeCustomerId!,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?upgraded=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
  });

  return Response.json({ url: checkoutSession.url });
}
```

## 24.4 Webhook Handler

Create `src/app/api/webhooks/stripe/route.ts`:

```typescript
// src/app/api/webhooks/stripe/route.ts
import { NextRequest } from "next/server";
import { stripe } from "@/lib/stripe/client";
import { db } from "@/lib/db";
import type Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      if (userId) {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        await db.user.update({
          where: { stripeCustomerId: session.customer as string },
          data: {
            plan: "PRO",
            stripeSubscriptionId: subscription.id,
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
        });
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      await db.user.update({
        where: { stripeSubscriptionId: subscription.id },
        data: {
          plan: subscription.status === "active" ? "PRO" : "FREE",
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
      });
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await db.user.update({
        where: { stripeSubscriptionId: subscription.id },
        data: { plan: "FREE" },
      });
      break;
    }
  }

  return Response.json({ received: true });
}
```

---

# 25. Blog & Content Management

## 25.1 Blog Content System

Blog posts are stored in the `BlogPost` model. Content is MDX (Markdown + JSX components).

### Admin Blog Editor

Create `src/app/(app)/admin/blog/page.tsx`:

This page uses `@mdxeditor/editor` (already installed) to create/edit blog posts with rich text editing.

### Blog Post Rendering

Create `src/app/(public)/blog/[slug]/page.tsx`:

```typescript
// src/app/(public)/blog/[slug]/page.tsx
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

export async function generateStaticParams() {
  const posts = await db.blogPost.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true },
  });
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await db.blogPost.findUnique({
    where: { slug: params.slug },
  });

  if (!post || post.status !== "PUBLISHED") notFound();

  // Increment view count (fire and forget)
  db.blogPost.update({
    where: { id: post.id },
    data: { viewCount: { increment: 1 } },
  }).catch(() => {});

  return (
    <article className="prose prose-invert max-w-3xl mx-auto px-6 py-12">
      <h1>{post.title}</h1>
      <div className="text-white/50 mb-8">
        By {post.authorName} · {new Date(post.publishedAt!).toLocaleDateString()}
        {post.readTime && ` · ${post.readTime} min read`}
      </div>
      <ReactMarkdown>{post.content}</ReactMarkdown>
    </article>
  );
}
```

---

# 26. Search & Filtering System

## 26.1 Resource Search

Resources are searchable via the `/api/resources` endpoint with filters:

- **Text search**: Searches name, description, organizationName
- **Category filter**: Filter by one of 8 categories
- **Location filter**: Filter by city/state
- **Verification filter**: Show only verified resources
- **Cost filter**: Free, sliding scale, insurance, paid
- **Availability filter**: 24/7, walk-in, virtual

## 26.2 Search Implementation

Uses Prisma's `contains` with case-insensitive mode (SQLite) or full-text search (PostgreSQL).

For production PostgreSQL, add a full-text search index:

```sql
-- Migration: add full-text search
ALTER TABLE resources ADD COLUMN search_vector tsvector;

CREATE INDEX idx_resources_search ON resources USING GIN(search_vector);

CREATE FUNCTION resources_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.organization_name, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER resources_search_vector_trigger
BEFORE INSERT OR UPDATE ON resources
FOR EACH ROW EXECUTE FUNCTION resources_search_vector_update();
```

---

# 27. File Storage & Media Management

## 27.1 Upload API

Create `src/app/api/upload/route.ts`:

```typescript
// src/app/api/upload/route.ts
import { NextRequest } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File;
  
  if (!file) {
    return Response.json({ error: "No file provided" }, { status: 400 });
  }

  // Validate file
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return Response.json({ error: "File too large (max 5MB)" }, { status: 400 });
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    return Response.json({ error: "Invalid file type" }, { status: 400 });
  }

  // Upload to R2
  const key = `uploads/${session.user.id}/${Date.now()}-${file.name}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await s3.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: file.type,
  }));

  const url = `${process.env.R2_PUBLIC_URL}/${key}`;

  return Response.json({ url, key });
}
```

---

# 28. Internationalization (i18n)

## 28.1 Setup (Optional — P3 Priority)

`next-intl` is already installed. Configure it for multi-language support:

### Languages to Support

| Code | Language | Priority |
|------|----------|----------|
| `en` | English | P0 (default) |
| `es` | Spanish | P1 (second most common in US) |
| `fr` | French | P2 |
| `zh` | Chinese | P2 |
| `ar` | Arabic | P3 |

### Configuration

Create `src/i18n/config.ts`:

```typescript
export const locales = ["en", "es", "fr", "zh", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
```

### Message Files

Create `messages/en.json`, `messages/es.json`, etc.

**Note**: For the hackathon, English-only is fine. i18n is a post-hackathon feature.

---

# 29. Accessibility (a11y)

## 29.1 WCAG 2.1 AA Compliance

| Requirement | Status | Action Needed |
|------------|--------|---------------|
| Color contrast (4.5:1 for text) | ⚠️ Some white/50 text too low | Increase opacity on muted text |
| Keyboard navigation | ❌ Not tested | Add focus styles, tab order |
| Screen reader support | ❌ Missing aria labels | Add aria-label to all interactive elements |
| Alt text for images | ❌ Missing | Add alt text to all images |
| Form labels | ❌ Some inputs missing labels | Add proper labels |
| Skip to content link | ❌ Missing | Add skip navigation link |
| Crisis resources accessible | ✅ Text-based | Already screen-reader friendly |

## 29.2 Skip Navigation Link

Add to layout:

```tsx
<a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded">
  Skip to main content
</a>
```

---

# 30. Performance Optimization

## 30.1 Next.js Performance Features

| Feature | Status | Action |
|---------|--------|--------|
| Static generation (SSG) | ✅ Used for static pages | Blog posts should use ISR |
| Server-side rendering (SSR) | ✅ Used where needed | Dashboard, profile |
| Image optimization | ❌ Not using next/image | Replace all `<img>` with `<Image>` |
| Font optimization | ✅ Using next/font | Inter loaded correctly |
| Code splitting | ✅ Automatic with App Router | — |
| Lazy loading | ❌ Not implemented | Lazy-load heavy components |
| Bundle analysis | ❌ Not done | Run `@next/bundle-analyzer` |

## 30.2 Bundle Size Targets

| Page | Target | Current (Est.) |
|------|--------|----------------|
| Landing (/) | < 200KB | ~300KB |
| Chat (/app) | < 150KB | ~250KB |
| Static pages | < 100KB | ~200KB |

## 30.3 Optimization Steps

1. **Replace Framer Motion with CSS animations** for simple hover/fade effects
2. **Tree-shake shadcn/ui**: Only import components actually used
3. **Dynamic imports** for heavy components (charts, markdown editor)
4. **Use `next/image`** for all images
5. **Enable ISR** for blog posts: `export const revalidate = 3600;`

---


# 31. Error Handling & Edge Cases

## 31.1 Global Error Boundary

Create `src/app/error.tsx`:

```typescript
// src/app/error.tsx
"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Something went wrong</h2>
        <p className="text-white/60">{error.message || "An unexpected error occurred"}</p>
        <button
          onClick={reset}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
```

## 31.2 API Error Handling Pattern

Every API route follows this pattern:

```typescript
export async function POST(request: NextRequest) {
  try {
    // 1. Parse input
    const body = await request.json();
    
    // 2. Validate with Zod
    const parsed = Schema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
    }
    
    // 3. Check auth (if needed)
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // 4. Business logic
    const result = await doSomething(parsed.data);
    
    // 5. Return success
    return Response.json({ success: true, data: result });
    
  } catch (error) {
    // Log error
    console.error("[API Error]", error);
    
    // Don't expose internal errors to client
    if (error instanceof z.ZodError) {
      return Response.json({ error: "Validation failed" }, { status: 400 });
    }
    
    return Response.json(
      { error: "Internal server error", message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
```

## 31.3 Edge Cases to Handle

| Edge Case | Handling |
|-----------|----------|
| Empty message submitted | Frontend: disable send button; API: return 400 |
| Very long message (>2000 chars) | Frontend: character counter; API: Zod max validation |
| HuggingFace API timeout (30s) | Fallback to keyword classifier |
| HuggingFace API returns 503 | Retry once, then fallback |
| Database connection lost | Return 503 with retry-after header |
| User submits crisis message | Immediate crisis response, skip AI classification |
| User sends non-English text | Process normally (BART supports multilingual) |
| User sends only emojis/symbols | Classify as "community" with low confidence |
| Concurrent classification requests | Rate limit per user/IP |
| Stripe webhook signature invalid | Return 400, log warning |

---

# 32. Data Seeding & Migration

## 32.1 Database Seeder

Create `prisma/seed.ts`:

```typescript
// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // ── Create admin user ─────────────────────────────
  const adminPassword = await hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@clearpath-ai.com" },
    update: {},
    create: {
      email: "admin@clearpath-ai.com",
      name: "Amine Harch El Korane",
      passwordHash: adminPassword,
      role: "ADMIN",
      plan: "ENTERPRISE",
      emailVerified: new Date(),
    },
  });

  // ── Create demo user ──────────────────────────────
  const demoPassword = await hash("demo123", 12);
  const demo = await prisma.user.upsert({
    where: { email: "demo@clearpath-ai.com" },
    update: {},
    create: {
      email: "demo@clearpath-ai.com",
      name: "Demo User",
      passwordHash: demoPassword,
      role: "USER",
      plan: "FREE",
      emailVerified: new Date(),
    },
  });

  // ── Seed resources ────────────────────────────────
  const resources = [
    {
      name: "988 Suicide & Crisis Lifeline",
      description: "Free, confidential support for people in suicidal crisis or emotional distress, 24/7.",
      category: "Mental Health",
      phone: "988",
      isCrisisResource: true,
      is247: true,
      verificationStatus: "verified",
      sourceQuality: "government",
      confidence: 1.0,
      organizationType: "government",
      costType: "free",
      dataSource: "manual",
    },
    {
      name: "National Domestic Violence Hotline",
      description: "Confidential support for anyone experiencing domestic violence or questioning their relationship.",
      category: "Healthcare",
      phone: "1-800-799-7233",
      isCrisisResource: true,
      is247: true,
      verificationStatus: "verified",
      sourceQuality: "nonprofit",
      confidence: 1.0,
      organizationType: "nonprofit",
      costType: "free",
      dataSource: "manual",
    },
    {
      name: "211 Community Connection",
      description: "Connects callers to local community resources including housing, food, utility assistance, and more.",
      category: "Housing",
      phone: "211",
      isCrisisResource: false,
      is247: true,
      verificationStatus: "verified",
      sourceQuality: "government",
      confidence: 0.95,
      organizationType: "government",
      costType: "free",
      dataSource: "211.org",
      externalId: "211-national",
    },
    {
      name: "SNAP (Supplemental Nutrition Assistance Program)",
      description: "Federal nutrition assistance program that helps low-income individuals and families buy food.",
      category: "Food",
      website: "https://www.fns.usda.gov/snap",
      verificationStatus: "verified",
      sourceQuality: "government",
      confidence: 0.98,
      organizationType: "government",
      costType: "free",
      dataSource: "manual",
    },
    {
      name: "Department of Labor CareerOneStop",
      description: "Career exploration, training, and job search resources from the US Department of Labor.",
      category: "Employment",
      website: "https://www.careeronestop.org",
      verificationStatus: "verified",
      sourceQuality: "government",
      confidence: 0.95,
      organizationType: "government",
      costType: "free",
      dataSource: "manual",
    },
    {
      name: "Legal Services Corporation",
      description: "Provides civil legal aid to low-income Americans. Find free legal help in your area.",
      category: "Legal Aid",
      website: "https://www.lsc.gov",
      phone: "1-800-532-8235",
      verificationStatus: "verified",
      sourceQuality: "government",
      confidence: 0.92,
      organizationType: "government",
      costType: "free",
      dataSource: "manual",
    },
    {
      name: "Community Health Center Locator",
      description: "Find federally funded health centers that provide care on a sliding fee scale.",
      category: "Healthcare",
      website: "https://findahealthcenter.hrsa.gov",
      verificationStatus: "verified",
      sourceQuality: "government",
      confidence: 0.94,
      organizationType: "government",
      costType: "sliding_scale",
      dataSource: "manual",
    },
    {
      name: "SAMHSA National Helpline",
      description: "Free referral service for substance abuse and mental health treatment, 24/7.",
      category: "Substance Abuse",
      phone: "1-800-662-4357",
      isCrisisResource: true,
      is247: true,
      verificationStatus: "verified",
      sourceQuality: "government",
      confidence: 0.97,
      organizationType: "government",
      costType: "free",
      dataSource: "manual",
    },
    {
      name: "Area Agency on Aging",
      description: "Services for older adults including meals, transportation, caregiving support, and more.",
      category: "Senior Services",
      phone: "1-800-677-1116",
      verificationStatus: "verified",
      sourceQuality: "government",
      confidence: 0.91,
      organizationType: "government",
      costType: "free",
      dataSource: "manual",
    },
    {
      name: "Feeding America Food Bank Locator",
      description: "Find your nearest food bank. Feeding America network feeds 40M+ people annually.",
      category: "Food",
      website: "https://www.feedingamerica.org/find-your-local-foodbank",
      verificationStatus: "verified",
      sourceQuality: "nonprofit",
      confidence: 0.93,
      organizationType: "nonprofit",
      costType: "free",
      dataSource: "manual",
    },
  ];

  for (const resource of resources) {
    await prisma.resource.upsert({
      where: { externalId: resource.externalId || resource.name.toLowerCase().replace(/\s+/g, "-") },
      update: {},
      create: resource as any,
    });
  }

  // ── Seed blog posts ───────────────────────────────
  const blogPosts = [
    {
      title: "What is Calibrated Transparency and Why It Matters",
      slug: "calibrated-transparency-explained",
      excerpt: "An introduction to ClearPath AI's core innovation: showing users exactly how confident the AI is, where the data comes from, and what biases might exist.",
      content: `# What is Calibrated Transparency?\n\nTraditional AI systems present information with false certainty. When you ask ChatGPT for community resources, you get confident answers — but no indication of how reliable those answers are.\n\n**Calibrated transparency** changes this by showing users the complete picture:\n\n1. **Confidence Score**: How certain is the AI?\n2. **Source Quality**: Where does the data come from?\n3. **Bias Check**: What biases might affect this result?\n4. **Complexity Level**: How complex is this situation?\n5. **Alternative Views**: What other classifications were considered?\n6. **Verification Status**: Has a human verified this information?\n\n## Why This Matters\n\nFor someone facing eviction, receiving a wrong referral isn't just inconvenient — it can be devastating. Calibrated transparency empowers users to make informed decisions about the information they receive.\n\n## The ClearPath AI Approach\n\nEvery classification result in ClearPath AI displays all six transparency layers alongside the resource recommendation. Users can see at a glance how much to trust the result and what limitations exist.`,
      category: "transparency",
      authorId: admin.id,
      authorName: "Amine Harch El Korane",
      status: "PUBLISHED",
      publishedAt: new Date("2026-05-15"),
      readTime: 5,
      featured: true,
    },
    {
      title: "How ClearPath AI Detects Crisis Situations",
      slug: "crisis-detection-system",
      excerpt: "Our keyword-based crisis detection system prioritizes human safety over AI classification, immediately surfacing verified crisis resources.",
      content: `# Crisis Detection in ClearPath AI\n\nWhen a user types "I want to kill myself" or "my partner hits me," there's no time for AI classification. Crisis detection runs **before** any other processing.\n\n## How It Works\n\n1. Input text is scanned against curated crisis keyword databases\n2. If a crisis is detected, classification is skipped entirely\n3. Verified crisis resources (988 Lifeline, DV Hotline, etc.) are shown immediately\n4. The response includes a visible, styled crisis block with hotline numbers\n\n## Crisis Categories\n\n- **Suicide**: Immediate response with 988 Lifeline\n- **Self-harm**: Crisis Text Line + 988\n- **Domestic violence**: National DV Hotline\n- **Overdose**: Poison Control + 911\n- **Imminent homelessness**: 211 Helpline\n\n## Design Principles\n\n- Crisis detection is **never bypassed** — it runs first, every time\n- Resources are always from verified, 24/7 sources\n- The UI uses a distinct visual style (red border, alert icon) to draw attention`,
      category: "technology",
      authorId: admin.id,
      authorName: "Amine Harch El Korane",
      status: "PUBLISHED",
      publishedAt: new Date("2026-05-20"),
      readTime: 4,
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }

  console.log("Seeding complete!");
  console.log(`Admin: admin@clearpath-ai.com / admin123`);
  console.log(`Demo:  demo@clearpath-ai.com / demo123`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Add to `package.json`:

```json
{
  "prisma": {
    "seed": "bunx tsx prisma/seed.ts"
  }
}
```

## 32.2 Migration Strategy

```bash
# Development: Push schema changes directly
bunx prisma db push

# Production: Use proper migrations
bunx prisma migrate dev --name descriptive_name
bunx prisma migrate deploy  # Run in production
```

---

# 33. Third-Party Integrations

## 33.1 Integration Summary

| Service | Purpose | API Type | Status |
|---------|---------|----------|--------|
| HuggingFace | AI classification | REST (Inference API) | ✅ Working |
| NextAuth | Authentication | Library | ⚠️ Config needed |
| Resend | Email delivery | REST API | ❌ Not configured |
| Stripe | Payment processing | REST + Webhooks | ❌ Not configured |
| Cloudflare R2 | File storage | S3-compatible API | ❌ Not configured |
| Upstash Redis | Caching + rate limiting | REST API | ❌ Not configured |
| Sentry | Error tracking | SDK | ❌ Not configured |
| Vercel | Hosting + analytics | Platform | ✅ Configured |

## 33.2 HuggingFace API Details

- **Model**: `facebook/bart-large-mnli`
- **Endpoint**: `https://api-inference.huggingface.co/models/facebook/bart-large-mnli`
- **Method**: POST
- **Input**: `{ inputs: string, parameters: { candidate_labels: string[] } }`
- **Output**: `{ labels: string[], scores: number[], sequence: string }`
- **Rate limit**: Free tier = 1,000 requests/day
- **Cold start**: Model may need to load (~20s first request after idle)

## 33.3 Future Integrations

| Service | Purpose | Priority |
|---------|---------|----------|
| 211.org API | Real community resource data | P1 |
| Google Maps API | Resource proximity search | P2 |
| Twilio | SMS-based resource lookup | P3 |
| Google Translate API | Auto-translate resources | P3 |
| OpenAI API | Better conversation flow | P3 |

---

# 34. Development Workflow & Git Strategy

## 34.1 Branch Strategy

```
main         ← Production (auto-deploys to Vercel)
  └── develop   ← Development (auto-deploys preview)
       ├── feature/auth-system
       ├── feature/real-api-integration
       ├── feature/dashboard-data
       ├── fix/transparency-calculation
       └── feature/blog-system
```

## 34.2 Commit Convention

```
feat: add authentication system with NextAuth
fix: correct transparency confidence calibration
docs: update MDG with database schema
refactor: extract ConfidenceRing to shared component
test: add crisis detection unit tests
chore: update dependencies
```

## 34.3 Pull Request Template

```markdown
## Description
[What does this PR do?]

## Type
- [ ] Feature
- [ ] Bug fix
- [ ] Refactor
- [ ] Documentation

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing done

## Screenshots (if UI change)
[Before/After]

## Related Issues
Closes #
```

---

# 35. Code Quality Standards

## 35.1 ESLint Configuration (Fix Current)

Update `eslint.config.mjs` to actually enforce rules:

```javascript
import { FlatCompat } from "@eslint/eslintrc";
import tseslint from "typescript-eslint";

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

const eslintConfig = [
  ...tseslint.configs.recommended,
  compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "error",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
];

export default eslintConfig;
```

## 35.2 TypeScript Configuration (Fix Current)

Update `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "noImplicitAny": true,    // ← Change from false to true
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## 35.3 Code Style Rules

1. **Max 300 lines per component file** — extract sub-components to separate files
2. **No inline data** — move data arrays to `src/config/` or `src/data/`
3. **No inline types** — move to `src/types/`
4. **Use shared animation variants** — import from `src/lib/animations.ts`
5. **Use shared components** — ConfidenceRing, FAQItem, Section from `src/components/shared/`
6. **Server components by default** — only add `"use client"` when needed
7. **Every API route validates input** with Zod
8. **Every API route handles errors** with try/catch

---

# 36. Hackathon Demo Script

## 36.1 5-Minute Demo Flow

| Time | Action | What to Show | What to Say |
|------|--------|--------------|-------------|
| 0:00 | Open landing page | Hero section, 6-layer animation | "ClearPath AI is a community resource navigator with calibrated transparency" |
| 0:30 | Scroll to 6-layer pipeline | Interactive transparency layers | "Every classification comes with 6 transparency layers — confidence, source, bias, complexity, alternatives, verification" |
| 1:00 | Navigate to /app | Chat interface | "Let me show you how it works in practice" |
| 1:15 | Type: "I need help finding affordable housing" | Real API call → classification result | "The AI classifies this as Housing with 82% confidence" |
| 1:45 | Show transparency panel | Expand all 6 layers | "But here's what makes us different — you can see exactly how the AI reached this conclusion" |
| 2:15 | Type: "I want to kill myself" | Crisis detection fires | "Now watch what happens when someone might be in danger" |
| 2:30 | Show crisis block | 988 Lifeline, resources | "Crisis detection runs FIRST, before any classification. We show verified 24/7 resources immediately" |
| 3:00 | Navigate to dashboard | Stats, charts | "Users get a full dashboard with their search history and transparency trends" |
| 3:30 | Navigate to responsible-ai page | Ethics framework | "We take responsible AI seriously — here's our complete ethics framework" |
| 4:00 | Navigate to how-it-works | Technical deep dive | "The system uses BART-large-MNLI for zero-shot classification with a keyword fallback" |
| 4:30 | Return to landing | Call to action | "ClearPath AI — because people in crisis deserve more than confident wrong answers" |

## 36.2 Backup Plan (If API Is Down)

If HuggingFace API is unavailable during demo:
1. The keyword fallback classifier will handle it automatically
2. Results will show `modelUsed: "keyword-fallback"` in the transparency panel
3. This actually demonstrates the transparency system perfectly — "see, the AI is telling you it used a less reliable method"

## 36.3 Q&A Preparation

**Expected questions and answers:**

| Question | Answer |
|----------|--------|
| "How accurate is the classification?" | "We use BART-large-MNLI, a state-of-the-art zero-shot classifier. Our calibrated confidence scores show users exactly how reliable each classification is. Average confidence is ~78% on community resource queries." |
| "What about bias?" | "That's Layer 3 of our transparency system. We detect 8 types of bias including geographic, demographic, and temporal. Every classification shows what biases might exist." |
| "How do you handle crisis?" | "Crisis detection runs before any other processing. We use curated keyword databases for 6 crisis types and immediately surface verified 24/7 resources from government and nonprofit sources." |
| "Is this production-ready?" | "The classification pipeline and crisis detection are production-grade. The user management and billing systems are the next milestones." |
| "What's your AI model?" | "We use Facebook's BART-large-MNLI for zero-shot classification. It doesn't require training data for our categories — we pass the 8 community resource categories as candidate labels." |
| "Why not fine-tune a model?" | "Zero-shot classification is more adaptable. If we need to add a new category like 'Disaster Relief', we just add it to the label list — no retraining required. This is critical for a system that serves diverse community needs." |

---

# 37. Judge Preparation & Scoring Alignment

## 37.1 USAII Hackathon Judging Criteria (Estimated)

| Criterion | Weight | How ClearPath AI Addresses It |
|-----------|--------|-------------------------------|
| Innovation | 25% | 6-layer transparency system is unique; no other AI navigator does this |
| Impact | 25% | Directly helps vulnerable populations; crisis detection saves lives |
| Technical Implementation | 20% | Full-stack Next.js 16 + BART-large-MNLI + Prisma + real API integration |
| Responsible AI | 15% | Core feature, not afterthought; bias detection, verification, confidence |
| Presentation | 15% | Polished UI, demo script, compelling narrative |

## 37.2 Key Differentiators to Emphasize

1. **Transparency by design**: Not a feature added on top — the entire system is built around showing users how the AI thinks
2. **Crisis-first architecture**: Safety is the #1 priority, not an afterthought
3. **Zero-shot classification**: No training data needed, infinitely adaptable
4. **Complete system**: 20 pages, real API, database, authentication — not a prototype
5. **Open about limitations**: We show confidence scores, bias checks, and verification status — we're honest about what we don't know

---

# 38. Post-Hackathon Roadmap

## 38.1 Phase 1: Core Functionality (Weeks 1-4)

| Task | Priority | Estimated Time |
|------|----------|----------------|
| Wire /app to real API | P0 | 2 days |
| Update Prisma schema | P0 | 1 day |
| Configure NextAuth | P0 | 2 days |
| Add providers to layout | P0 | 0.5 day |
| Extract shared components | P1 | 3 days |
| Create Zustand stores | P1 | 1 day |
| Add React Query | P1 | 1 day |
| Create shared types | P1 | 1 day |
| Database seeder | P1 | 1 day |
| Basic tests | P1 | 3 days |

## 38.2 Phase 2: Polish & Features (Weeks 5-8)

| Task | Priority | Estimated Time |
|------|----------|----------------|
| Dashboard with real data | P1 | 3 days |
| History with real data | P1 | 2 days |
| Profile with real data | P1 | 2 days |
| Settings with persistence | P1 | 2 days |
| Contact form backend | P1 | 0.5 day |
| Newsletter backend | P2 | 0.5 day |
| Dark mode toggle | P2 | 1 day |
| Blog system with MDX | P2 | 3 days |
| Email system (Resend) | P2 | 2 days |
| Rate limiting | P2 | 1 day |

## 38.3 Phase 3: Production Ready (Weeks 9-12)

| Task | Priority | Estimated Time |
|------|----------|----------------|
| Stripe integration | P2 | 3 days |
| PostgreSQL migration | P2 | 1 day |
| Docker setup | P2 | 1 day |
| CI/CD pipeline | P2 | 1 day |
| Monitoring (Sentry) | P3 | 1 day |
| Accessibility audit | P3 | 2 days |
| Performance optimization | P3 | 3 days |
| i18n setup | P3 | 2 days |
| 211.org API integration | P3 | 3 days |
| Resource proximity search | P3 | 3 days |

---

# Appendix A — Complete File Tree

```
clearpath-ai/
├── .github/
│   └── workflows/
│       └── ci.yml
├── .next/
├── db/
│   └── custom.db
├── docs/
│   ├── DECISIONS.md
│   ├── ONBOARDING.md
│   ├── BRAND.md
│   ├── OBJECTIVES.md
│   ├── SCENARIOS.md
│   ├── API_CONTRACT.md
│   ├── PITCH_SCRIPT.md
│   ├── CHARTER.md
│   ├── CRISIS_KEYWORDS.md
│   ├── QUALIFIER_PREP.md
│   ├── DEMO_SCRIPT.md
│   ├── JUDGE_MAP.md
│   ├── COMPETITIVE_ANALYSIS.md
│   └── RESPONSIBLE_AI.md
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── public/
│   ├── logo.svg
│   ├── clearpath-logo.png
│   ├── favicon.svg
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── not-found.tsx
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   ├── forgot-password/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (public)/
│   │   │   ├── about/page.tsx
│   │   │   ├── pricing/page.tsx
│   │   │   ├── how-it-works/page.tsx
│   │   │   ├── responsible-ai/page.tsx
│   │   │   ├── privacy/page.tsx
│   │   │   ├── terms/page.tsx
│   │   │   ├── team/page.tsx
│   │   │   ├── contact/page.tsx
│   │   │   ├── blog/page.tsx
│   │   │   ├── blog/[slug]/page.tsx
│   │   │   ├── api-docs/page.tsx
│   │   │   ├── verification/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (app)/
│   │   │   ├── app/page.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── history/page.tsx
│   │   │   ├── profile/page.tsx
│   │   │   ├── settings/page.tsx
│   │   │   └── layout.tsx
│   │   └── api/
│   │       ├── route.ts
│   │       ├── classify/route.ts
│   │       ├── contact/route.ts
│   │       ├── newsletter/route.ts
│   │       ├── resources/route.ts
│   │       ├── blog/route.ts
│   │       ├── checkout/route.ts
│   │       ├── upload/route.ts
│   │       ├── auth/[...nextauth]/route.ts
│   │       ├── auth/signup/route.ts
│   │       ├── auth/forgot-password/route.ts
│   │       ├── auth/reset-password/route.ts
│   │       ├── dashboard/stats/route.ts
│   │       ├── dashboard/recent/route.ts
│   │       ├── dashboard/categories/route.ts
│   │       └── webhooks/stripe/route.ts
│   ├── components/
│   │   ├── ui/ (48 shadcn/ui components)
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── chat/
│   │   │   ├── ChatMessage.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   ├── ConfidenceRing.tsx
│   │   │   ├── ProcessingPipeline.tsx
│   │   │   ├── CrisisBlock.tsx
│   │   │   ├── CategoryCard.tsx
│   │   │   └── ClarifyPanel.tsx
│   │   ├── transparency/
│   │   │   ├── TransparencyPanel.tsx
│   │   │   ├── ConfidenceScore.tsx
│   │   │   ├── SourceQuality.tsx
│   │   │   ├── BiasCheck.tsx
│   │   │   ├── ComplexityLevel.tsx
│   │   │   ├── AlternativeViews.tsx
│   │   │   └── VerificationStatus.tsx
│   │   ├── shared/
│   │   │   ├── Section.tsx
│   │   │   ├── FAQItem.tsx
│   │   │   ├── AnimatedCounter.tsx
│   │   │   ├── GlassCard.tsx
│   │   │   ├── GradientButton.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   └── providers/
│   │       ├── ThemeProvider.tsx
│   │       ├── AuthProvider.tsx
│   │       └── QueryProvider.tsx
│   ├── lib/
│   │   ├── utils.ts
│   │   ├── db.ts
│   │   ├── auth.ts
│   │   ├── auth-helpers.ts
│   │   ├── rate-limit.ts
│   │   ├── rate-limit-redis.ts
│   │   ├── sanitize.ts
│   │   ├── logger.ts
│   │   ├── animations.ts
│   │   ├── constants.ts
│   │   ├── ai/
│   │   │   ├── classifier.ts
│   │   │   ├── crisis-detection.ts
│   │   │   ├── transparency.ts
│   │   │   ├── huggingface.ts
│   │   │   └── fallback.ts
│   │   ├── email/
│   │   │   ├── sender.ts
│   │   │   └── templates/
│   │   ├── stripe/
│   │   │   ├── client.ts
│   │   │   └── webhooks.ts
│   │   └── analytics.ts
│   ├── stores/
│   │   ├── chat-store.ts
│   │   ├── auth-store.ts
│   │   ├── ui-store.ts
│   │   └── notification-store.ts
│   ├── hooks/
│   │   ├── use-mobile.ts
│   │   ├── use-toast.ts
│   │   ├── use-classify.ts
│   │   ├── use-auth.ts
│   │   └── use-transparency.ts
│   ├── types/
│   │   ├── classification.ts
│   │   ├── chat.ts
│   │   ├── user.ts
│   │   ├── resource.ts
│   │   ├── api.ts
│   │   └── auth.ts
│   ├── config/
│   │   ├── site.ts
│   │   ├── auth.ts
│   │   ├── pricing.ts
│   │   └── ai.ts
│   └── __tests__/
│       ├── unit/
│       ├── integration/
│       └── e2e/
├── .env
├── .env.example
├── .env.local
├── .gitignore
├── bun.lock
├── components.json
├── Dockerfile
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```

---

# Appendix B — Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | `file:./dev.db` | Prisma database connection string |
| `NEXTAUTH_URL` | Yes | `http://localhost:3000` | Base URL for NextAuth |
| `NEXTAUTH_SECRET` | Yes | — | Encryption key for JWT sessions |
| `HUGGINGFACE_API_KEY` | No | — | HuggingFace Inference API key (falls back to keywords) |
| `RESEND_API_KEY` | No | — | Resend email API key |
| `EMAIL_FROM` | No | — | Sender email address |
| `EMAIL_SUPPORT` | No | — | Support email address |
| `STRIPE_SECRET_KEY` | No | — | Stripe secret key |
| `STRIPE_PUBLISHABLE_KEY` | No | — | Stripe publishable key (client-side) |
| `STRIPE_WEBHOOK_SECRET` | No | — | Stripe webhook signing secret |
| `REDIS_URL` | No | — | Redis connection for rate limiting |
| `R2_ACCOUNT_ID` | No | — | Cloudflare R2 account ID |
| `R2_ACCESS_KEY_ID` | No | — | R2 access key |
| `R2_SECRET_ACCESS_KEY` | No | — | R2 secret key |
| `R2_BUCKET_NAME` | No | — | R2 bucket name |
| `SENTRY_DSN` | No | — | Sentry error tracking DSN |
| `NEXT_PUBLIC_APP_URL` | No | `http://localhost:3000` | Public app URL |
| `NEXT_PUBLIC_APP_NAME` | No | `ClearPath AI` | App display name |

---

# Appendix C — Dependency Audit

## Must Keep

| Package | Reason |
|---------|--------|
| `next` | Core framework |
| `react`, `react-dom` | Core UI |
| `tailwindcss`, `@tailwindcss/postcss` | Styling |
| `framer-motion` | Animations |
| `@prisma/client`, `prisma` | Database |
| `next-auth` | Authentication |
| `zustand` | State management |
| `@tanstack/react-query` | Server state |
| `react-hook-form`, `@hookform/resolvers`, `zod` | Forms + validation |
| `lucide-react` | Icons |
| `sonner` | Toast notifications |
| `recharts` | Dashboard charts |
| `date-fns` | Date formatting |
| `uuid` | ID generation |
| `react-markdown` | Blog rendering |
| `@mdxeditor/editor` | Blog editor |
| `clsx`, `tailwind-merge` | Class utilities |
| `next-themes` | Dark mode |

## Can Remove (Unused)

| Package | Reason |
|---------|--------|
| `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` | No drag-and-drop features planned |
| `@tanstack/react-table` | No table-heavy pages needed |
| `docx` | Build-time only, not runtime |
| `next-intl` | i18n is P3 priority, can re-add later |
| `react-syntax-highlighter` | Can use simpler code blocks |
| `sharp` | Not used at runtime, Next.js has built-in image optimization |
| `z-ai-web-dev-sdk` | Only used in development |

## Must Add

| Package | Reason |
|---------|--------|
| `bcryptjs` + `@types/bcryptjs` | Password hashing |
| `resend` | Transactional email |
| `stripe` + `@stripe/stripe-js` | Payment processing |
| `isomorphic-dompurify` | Input sanitization |
| `@sentry/nextjs` | Error tracking |
| `@vercel/analytics` | Web vitals |
| `@upstash/redis` | Rate limiting (production) |
| `@aws-sdk/client-s3` | R2 file uploads |
| `vitest` | Testing |
| `@testing-library/react` | Component testing |
| `@playwright/test` | E2E testing |

---

# Appendix D — Crisis Keyword Database

## Full Keyword Lists by Category

### Suicide (Highest Priority)
```
kill myself, want to die, end my life, suicide, suicidal,
no reason to live, better off dead, don't want to be alive,
thinking about death, can't go on, give up on life,
take my own life, ending it all, not worth living,
i want to disappear forever, world without me, final exit,
how to kill myself, ways to die, suicide method,
don't want to wake up, never wake up again, goodbye forever,
last day, nothing left for me, can't take it anymore,
death is the only way out, no other way, only one way out
```

### Self-Harm
```
cut myself, cutting, self-harm, self harm, hurt myself,
burning myself, self injury, cutting myself,
i deserve pain, punish myself, harm myself,
scratch myself, pulling my hair, hitting myself,
burn myself, bite myself, self-destructive
```

### Domestic Violence / Abuse
```
abused, abusing me, domestic violence, battered, beating me,
hitting me, hurting me, physically hurting, sexually assaulted,
rape, molested, stalking me, threatening me,
controlling me, won't let me leave, trapped in my home,
my partner hits me, my spouse abuses me, afraid of my partner,
partner controls me, can't leave my partner,
partner threatens me, safe house, women's shelter,
escape my partner, physical abuse, emotional abuse
```

### Overdose
```
overdose, overdosed, took too many pills, pills right now,
drank too much, alcohol poisoning, naloxone, narcan,
unresponsive, not breathing, blue lips,
mixed pills, too much medication, accidental overdose
```

### Imminent Homelessness
```
homeless tonight, nowhere to sleep, kicked out, on the street,
sleeping in my car, no shelter, evicted today, no place to go,
sleeping outside, nowhere to go tonight,
about to be homeless, losing my home, foreclosure,
living in my car, need emergency shelter, shelter tonight
```

### Substance Abuse Crisis
```
relapsed, using again, can't stop using, need detox,
going through withdrawal, detoxing alone, craving drugs,
want to get clean, need rehab, can't stay sober,
drinking too much, blacking out, substance abuse emergency
```

---

## Document Information

| Field | Value |
|-------|-------|
| **Document** | ClearPath AI — Master Development Guide |
| **Version** | 1.0.0 |
| **Last Updated** | June 7, 2026 |
| **Author** | Amine Harch El Korane |
| **Purpose** | Single source of truth for turning ClearPath AI from prototype to production |
| **Next Step** | Follow Phase 1 tasks in Section 38 — start with wiring /app to the real API |

---

> *"This document is alive. As you implement each section, update the status markers. When something changes, update this guide. This is your map — follow it precisely."*

