# LORE — Vercel Deployment Setup Guide

## The app is code-complete. You just need to add a database. Follow these steps:

---

## Step 1: Create a PostgreSQL Database on Vercel

1. Go to **https://vercel.com/dashboard**
2. Click on your **Lore** project
3. Go to the **Storage** tab
4. Click **Create Database**
5. Select **Postgres** (Neon)
6. Choose the **Free** plan
7. Click **Create**

Vercel will automatically set the following environment variables:
- `DATABASE_URL`
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

---

## Step 2: Add Required Environment Variables

Still in your Vercel project, go to **Settings → Environment Variables** and add these:

### Required:
| Variable | Value |
|----------|-------|
| `NEXTAUTH_SECRET` | Generate one: run `openssl rand -base64 32` in your terminal, paste the result |
| `NEXTAUTH_URL` | `https://lore-black.vercel.app` |

### Optional (for Google OAuth login):
| Variable | Value |
|----------|-------|
| `GOOGLE_CLIENT_ID` | From Google Cloud Console → APIs & Services → Credentials |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud Console |

### Optional (for AI features):
| Variable | Value |
|----------|-------|
| `HUGGINGFACE_API_KEY` | From https://huggingface.co/settings/tokens |

### Optional (for Stripe payments):
| Variable | Value |
|----------|-------|
| `STRIPE_SECRET_KEY` | From Stripe Dashboard |
| `STRIPE_WEBHOOK_SECRET` | From Stripe Dashboard → Webhooks |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | From Stripe Dashboard |

---

## Step 3: Deploy (Triggers Automatically)

After adding environment variables, Vercel will automatically redeploy.

The build script runs: `prisma generate && prisma migrate deploy && next build`

This means:
- `prisma generate` → Creates the Prisma client
- `prisma migrate deploy` → Creates all database tables (migrations already exist in the repo)
- `next build` → Builds the Next.js app

---

## Step 4: Verify It Works

1. Go to **https://lore-black.vercel.app/signup**
2. Create an account with email and password
3. You should be redirected to the dashboard
4. Try creating a knowledge node on the Graph page
5. Try the AI Chat
6. Try the Morning Digest

---

## Troubleshooting

### "Something went wrong" on signup
- Check Vercel logs: Project → Deployments → latest → Runtime Logs
- Make sure DATABASE_URL is set correctly
- Make sure NEXTAUTH_SECRET is set

### "Invalid email or password" on login
- Make sure you signed up successfully first
- Check that the user was created in the database

### Database connection errors
- Make sure you created the Vercel Postgres database
- Make sure DATABASE_URL is in the Environment Variables
- Try redeploying: Deployments → latest → ⋯ → Redeploy

### If migrations didn't run
- Go to Vercel Dashboard → Project → Settings → General
- Make sure the Build Command is: `prisma generate && prisma migrate deploy && next build`
- Or add a build hook that runs: `npx prisma migrate deploy`

---

## Quick Test After Setup

```bash
# Test the API health endpoint
curl https://lore-black.vercel.app/api/health

# Test signup
curl -X POST https://lore-black.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"password123"}'
```

---

## What Was Fixed (Summary)

1. **Plan bypass vulnerability** — Users could upgrade their own plan via API. Fixed.
2. **Stripe webhook bugs** — Wrong field for subscription period end, missing line_items expansion. Fixed.
3. **Silent auth failures** — API routes returned 200+empty data instead of 401 for unauthenticated users. Fixed.
4. **Chat API no auth** — Anyone could use AI without logging in. Fixed.
5. **Database mismatch** — Schema used PostgreSQL but .env had SQLite URL. Fixed.
6. **NextAuth config** — Added NEXTAUTH_SECRET generation and proper URL config.
7. **Build script** — Added prisma migrate deploy so database tables are created during build.
8. **Digest source bug** — Referenced Prisma relation instead of field. Fixed.
9. **User history pagination** — Was broken with hardcoded limits. Fixed.
10. **14 other fixes** across API routes for security, correctness, and reliability.
