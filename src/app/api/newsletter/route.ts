// ═══════════════════════════════════════════════════════════
// ClearPath AI — Newsletter Subscription API
// POST: Subscribe to newsletter (upsert — always say "subscribed")
// ═══════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

const newsletterSchema = z.object({
  email: z.string().email('Valid email is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = newsletterSchema.safeParse(body);

    if (!validated.success) {
      const errors = validated.error.issues.map((issue) => issue.message);
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    const { email } = validated.data;

    // Upsert: create if new, update active=true if existing but inactive
    await db.newsletterSubscription.upsert({
      where: { email },
      update: { active: true },
      create: { email, active: true },
    });

    // Always say "subscribed" — don't reveal if already subscribed
    return NextResponse.json(
      { success: true, message: 'You have been subscribed to the newsletter.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter' },
      { status: 500 }
    );
  }
}
