import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthenticatedUserId } from '@/lib/auth-helpers'

// PUT /api/notes/[id] — Update a note
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
    const existing = await db.note.findUnique({ where: { id } })
    if (!existing || existing.userId !== userId) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      )
    }

    // Filter allowed fields
    const allowedFields = ['title', 'content', 'type', 'category', 'tags', 'pinned', 'aiSummary', 'sourceUrl']
    const updateData: Record<string, unknown> = {}
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }

    const note = await db.note.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ note })
  } catch (error) {
    console.error('Failed to update note:', error)
    return NextResponse.json(
      { error: 'Failed to update note' },
      { status: 500 }
    )
  }
}

// DELETE /api/notes/[id] — Delete a note
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
    const existing = await db.note.findUnique({ where: { id } })
    if (!existing || existing.userId !== userId) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      )
    }

    await db.note.delete({ where: { id } })

    return NextResponse.json({ success: true, deletedId: id })
  } catch (error) {
    console.error('Failed to delete note:', error)
    return NextResponse.json(
      { error: 'Failed to delete note' },
      { status: 500 }
    )
  }
}
