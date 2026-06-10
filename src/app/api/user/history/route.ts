// ═══════════════════════════════════════════════════════════
// ClearPath AI — User Classification History API
// GET: Return user's classification history (paginated, requires auth)
// DELETE: Clear all classification history (requires auth)
// ═══════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/lib/db';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get('page')) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(searchParams.get('pageSize')) || 20));

    const [classifications, total] = await Promise.all([
      db.classification.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      db.classification.count({
        where: { userId: session.user.id },
      }),
    ]);

    const hasNext = page * pageSize < total;

    return NextResponse.json({
      data: classifications,
      total,
      page,
      pageSize,
      hasNext,
    });
  } catch (error) {
    console.error('History fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch classification history' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const result = await db.classification.deleteMany({
      where: { userId: session.user.id },
    });

    return NextResponse.json({
      success: true,
      message: `Deleted ${result.count} classification(s) from history.`,
    });
  } catch (error) {
    console.error('History clear error:', error);
    return NextResponse.json(
      { error: 'Failed to clear classification history' },
      { status: 500 }
    );
  }
}
