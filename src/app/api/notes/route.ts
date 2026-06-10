import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthenticatedUserId } from '@/lib/auth-helpers'

// GET /api/notes — Return all notes for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(request)

    if (!userId) {
      return NextResponse.json({ notes: [] })
    }

    const notes = await db.note.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json({ notes })
  } catch (error) {
    console.error('Failed to fetch notes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notes' },
      { status: 500 }
    )
  }
}

// POST /api/notes — Create a new note
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
    const { title, content, type, category, tags, pinned, sourceUrl } = body

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    const note = await db.note.create({
      data: {
        userId,
        title,
        content: content || '',
        type: type || 'note',
        category: category || null,
        tags: tags || null,
        pinned: pinned || false,
        aiSummary: null,
        sourceUrl: sourceUrl || null,
      },
    })

    return NextResponse.json({ note }, { status: 201 })
  } catch (error) {
    console.error('Failed to create note:', error)
    return NextResponse.json(
      { error: 'Failed to create note' },
      { status: 500 }
    )
  }
}
