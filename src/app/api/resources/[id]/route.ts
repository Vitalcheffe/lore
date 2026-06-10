// ═══════════════════════════════════════════════════════════
// ClearPath AI — Single Resource API
// GET: Retrieve a single resource by ID
// ═══════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const resource = await db.resource.findUnique({
      where: { id },
    });

    if (!resource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: resource });
  } catch (error) {
    console.error('Resource fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resource' },
      { status: 500 }
    );
  }
}
