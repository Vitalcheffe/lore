import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthenticatedUserId } from '@/lib/auth-helpers'

// GET /api/nodes — Return all knowledge nodes for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(request)

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const nodes = await db.knowledgeNode.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json({ nodes })
  } catch (error) {
    console.error('Failed to fetch nodes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch nodes' },
      { status: 500 }
    )
  }
}

// POST /api/nodes — Create a new knowledge node
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
    const { title, content, type, color, icon, source, tags, isFavorite, x, y } = body

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    const node = await db.knowledgeNode.create({
      data: {
        userId,
        title,
        content: content || '',
        type: type || 'concept',
        color: color || '#059669',
        icon: icon || null,
        source: source || 'manual',
        tags: tags || '',
        isFavorite: isFavorite || false,
        x: x ?? Math.random() * 600,
        y: y ?? Math.random() * 500,
      },
    })

    return NextResponse.json({ node }, { status: 201 })
  } catch (error) {
    console.error('Failed to create node:', error)
    return NextResponse.json(
      { error: 'Failed to create node' },
      { status: 500 }
    )
  }
}
