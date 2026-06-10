import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthenticatedUserId } from '@/lib/auth-helpers'

// GET /api/nodes/[id] — Return a specific node with its connections
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getAuthenticatedUserId(request)
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { id } = await params

    const node = await db.knowledgeNode.findUnique({
      where: { id },
      include: {
        sourceEdges: { include: { target: true } },
        targetEdges: { include: { source: true } },
      },
    })

    if (!node || node.userId !== userId) {
      return NextResponse.json(
        { error: 'Node not found' },
        { status: 404 }
      )
    }

    // Collect all connected node IDs
    const connectedIds = new Set<string>()
    for (const edge of node.sourceEdges) {
      connectedIds.add(edge.targetId)
    }
    for (const edge of node.targetEdges) {
      connectedIds.add(edge.sourceId)
    }

    return NextResponse.json({
      node: {
        id: node.id,
        title: node.title,
        content: node.content,
        type: node.type,
        color: node.color,
        icon: node.icon,
        source: node.source,
        tags: node.tags,
        isFavorite: node.isFavorite,
        x: node.x,
        y: node.y,
        createdAt: node.createdAt.toISOString(),
        updatedAt: node.updatedAt.toISOString(),
      },
      connections: Array.from(connectedIds),
      edges: [
        ...node.sourceEdges.map(e => ({
          id: e.id,
          sourceId: e.sourceId,
          targetId: e.targetId,
          label: e.label,
          type: e.type,
          strength: e.strength,
        })),
        ...node.targetEdges.map(e => ({
          id: e.id,
          sourceId: e.sourceId,
          targetId: e.targetId,
          label: e.label,
          type: e.type,
          strength: e.strength,
        })),
      ],
    })
  } catch (error) {
    console.error('Failed to fetch node:', error)
    return NextResponse.json(
      { error: 'Failed to fetch node' },
      { status: 500 }
    )
  }
}

// PUT /api/nodes/[id] — Update a node
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getAuthenticatedUserId(request)
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    // Verify ownership
    const existing = await db.knowledgeNode.findUnique({ where: { id } })
    if (!existing || existing.userId !== userId) {
      return NextResponse.json(
        { error: 'Node not found' },
        { status: 404 }
      )
    }

    // Filter allowed fields
    const allowedFields = ['title', 'content', 'type', 'color', 'icon', 'source', 'tags', 'isFavorite', 'x', 'y']
    const updateData: Record<string, unknown> = {}
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }

    const node = await db.knowledgeNode.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ node })
  } catch (error) {
    console.error('Failed to update node:', error)
    return NextResponse.json(
      { error: 'Failed to update node' },
      { status: 500 }
    )
  }
}

// DELETE /api/nodes/[id] — Delete a node
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getAuthenticatedUserId(request)
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { id } = await params

    // Verify ownership
    const existing = await db.knowledgeNode.findUnique({ where: { id } })
    if (!existing || existing.userId !== userId) {
      return NextResponse.json(
        { error: 'Node not found' },
        { status: 404 }
      )
    }

    // Cascade deletes edges automatically via schema
    await db.knowledgeNode.delete({ where: { id } })

    return NextResponse.json({ success: true, deletedId: id })
  } catch (error) {
    console.error('Failed to delete node:', error)
    return NextResponse.json(
      { error: 'Failed to delete node' },
      { status: 500 }
    )
  }
}
