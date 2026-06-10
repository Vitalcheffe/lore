// ═══════════════════════════════════════════════════════════
// LORE — User Activity History API
// GET: Return user's recent activity (nodes, notes, edges)
// DELETE: Clear old activity data
// ═══════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUserId } from '@/lib/auth-helpers';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(request);

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get('page')) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(searchParams.get('pageSize')) || 20));

    // Get recent activity from various models
    const [recentNodes, recentNotes, recentEdges] = await Promise.all([
      db.knowledgeNode.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: { id: true, title: true, type: true, createdAt: true },
      }),
      db.note.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: { id: true, title: true, type: true, createdAt: true },
      }),
      db.knowledgeEdge.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: { id: true, label: true, type: true, createdAt: true, sourceId: true, targetId: true },
      }),
    ]);

    // Combine into a unified activity feed
    const activities = [
      ...recentNodes.map(n => ({
        id: n.id,
        type: 'node' as const,
        title: n.title,
        category: n.type,
        createdAt: n.createdAt,
      })),
      ...recentNotes.map(n => ({
        id: n.id,
        type: 'note' as const,
        title: n.title,
        category: n.type,
        createdAt: n.createdAt,
      })),
      ...recentEdges.map(e => ({
        id: e.id,
        type: 'edge' as const,
        title: e.label || e.type,
        category: e.type,
        createdAt: e.createdAt,
      })),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = activities.length;
    const paginatedActivities = activities.slice((page - 1) * pageSize, page * pageSize);
    const hasNext = page * pageSize < total;

    return NextResponse.json({
      data: paginatedActivities,
      total,
      page,
      pageSize,
      hasNext,
    });
  } catch (error) {
    console.error('History fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activity history' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(request);

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Only delete edges and nodes, not the user's core data
    const deletedEdges = await db.knowledgeEdge.deleteMany({
      where: { userId },
    });

    return NextResponse.json({
      success: true,
      message: `Deleted ${deletedEdges.count} edge(s) from history.`,
    });
  } catch (error) {
    console.error('History clear error:', error);
    return NextResponse.json(
      { error: 'Failed to clear activity history' },
      { status: 500 }
    );
  }
}
