// Simple in-memory rate limiter
// In production, you'd use Redis or a similar persistent store

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()

// Clean up old entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of rateLimitMap.entries()) {
      if (now > entry.resetTime) {
        rateLimitMap.delete(key)
      }
    }
  }, 5 * 60 * 1000)
}

export interface RateLimitOptions {
  /** Time window in milliseconds */
  windowMs: number
  /** Maximum number of requests in the window */
  maxRequests: number
}

export function rateLimit(
  identifier: string,
  options: RateLimitOptions = { windowMs: 60 * 1000, maxRequests: 30 }
): { success: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const entry = rateLimitMap.get(identifier)

  if (!entry || now > entry.resetTime) {
    // New window
    const resetTime = now + options.windowMs
    rateLimitMap.set(identifier, { count: 1, resetTime })
    return { success: true, remaining: options.maxRequests - 1, resetTime }
  }

  if (entry.count >= options.maxRequests) {
    return { success: false, remaining: 0, resetTime: entry.resetTime }
  }

  entry.count++
  return {
    success: true,
    remaining: options.maxRequests - entry.count,
    resetTime: entry.resetTime,
  }
}

// Pre-configured rate limiters
export const authRateLimit = (identifier: string) =>
  rateLimit(identifier, { windowMs: 15 * 60 * 1000, maxRequests: 5 }) // 5 attempts per 15 min

export const apiRateLimit = (identifier: string) =>
  rateLimit(identifier, { windowMs: 60 * 1000, maxRequests: 30 }) // 30 requests per minute

export const chatRateLimit = (identifier: string) =>
  rateLimit(identifier, { windowMs: 60 * 1000, maxRequests: 10 }) // 10 chat messages per minute
