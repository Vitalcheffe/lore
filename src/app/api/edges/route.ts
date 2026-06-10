import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthenticatedUserId } from '@/lib/auth-helpers'

// GET /api/edges — Return all edges for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(request)

    if (!userId) {
      return NextResponse.json({ edges: [] })
    }

    const edges = await db.knowledgeEdge.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ edges })
  } catch (error) {
    console.error('Failed to fetch edges:', error)
    return NextResponse.json(
      { error: 'Failed to fetch edges' },
      { status: 500 }
    )
  }
}

// POST /api/edges — Create a new edge between nodes
export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(request)

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { sourceId, targetId, label, type, strength } = body

    if (!sourceId || !targetId) {
      return NextResponse.json(
        { error: 'sourceId and targetId are required' },
        { status: 400 }
      )
    }

    if (sourceId === targetId) {
      return NextResponse.json(
        { error: 'Cannot create self-referencing edge' },
        { status: 400 }
      )
    }

    // Verify both nodes belong to the user
    const sourceNode = await db.knowledgeNode.findUnique({ where: { id: sourceId } })
    const targetNode = await db.knowledgeNode.findUnique({ where: { id: targetId } })

    if (!sourceNode || sourceNode.userId !== userId) {
      return NextResponse.json(
        { error: 'Source node not found' },
        { status: 404 }
      )
    }

    if (!targetNode || targetNode.userId !== userId) {
      return NextResponse.json(
        { error: 'Target node not found' },
        { status: 404 }
      )
    }

    // Check for duplicate edge
    const existingEdge = await db.knowledgeEdge.findFirst({
      where: { sourceId, targetId, userId },
    })

    if (existingEdge) {
      return NextResponse.json(
        { error: 'Edge already exists between these nodes' },
        { status: 409 }
      )
    }

    const edge = await db.knowledgeEdge.create({
      data: {
        userId,
        sourceId,
        targetId,
        label: label || null,
        type: type || 'related',
        strength: strength || 5,
      },
    })

    return NextResponse.json({ edge }, { status: 201 })
  } catch (error) {
    console.error('Failed to create edge:', error)
    return NextResponse.json(
      { error: 'Failed to create edge' },
      { status: 500 }
    )
  }
}

// DELETE /api/edges — Delete an edge
export async function DELETE(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(request)

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const edgeId = searchParams.get('id')

    if (!edgeId) {
      return NextResponse.json(
        { error: 'Edge ID is required as query parameter' },
        { status: 400 }
      )
    }

    // Verify ownership
    const existing = await db.knowledgeEdge.findUnique({ where: { id: edgeId } })
    if (!existing || existing.userId !== userId) {
      return NextResponse.json(
        { error: 'Edge not found' },
        { status: 404 }
      )
    }

    await db.knowledgeEdge.delete({ where: { id: edgeId } })

    return NextResponse.json({ success: true, deletedId: edgeId })
  } catch (error) {
    console.error('Failed to delete edge:', error)
    return NextResponse.json(
      { error: 'Failed to delete edge' },
      { status: 500 }
    )
  }
}
