import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthenticatedUserId } from '@/lib/auth-helpers'

export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(req)
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q')

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ results: [] })
    }

    const searchTerm = query.trim().toLowerCase()

    // Search across nodes, notes, and conversations
    const [nodes, notes, conversations] = await Promise.all([
      db.knowledgeNode.findMany({
        where: {
          userId,
          OR: [
            { title: { contains: searchTerm, mode: 'insensitive' } },
            { content: { contains: searchTerm, mode: 'insensitive' } },
            { tags: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        take: 5,
        orderBy: { updatedAt: 'desc' },
      }),
      db.note.findMany({
        where: {
          userId,
          OR: [
            { title: { contains: searchTerm, mode: 'insensitive' } },
            { content: { contains: searchTerm, mode: 'insensitive' } },
            { category: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        take: 5,
        orderBy: { updatedAt: 'desc' },
      }),
      db.chatConversation.findMany({
        where: {
          userId,
          OR: [
            { title: { contains: searchTerm, mode: 'insensitive' } },
            { preview: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        take: 3,
        orderBy: { updatedAt: 'desc' },
      }),
    ])

    const results = [
      ...nodes.map(n => ({
        id: n.id,
        type: 'node' as const,
        title: n.title,
        description: n.content.slice(0, 100) || n.type,
        href: '/app/graph',
        icon: 'Network',
      })),
      ...notes.map(n => ({
        id: n.id,
        type: 'note' as const,
        title: n.title,
        description: n.content.slice(0, 100) || n.type,
        href: '/app/memory',
        icon: 'BookOpen',
      })),
      ...conversations.map(c => ({
        id: c.id,
        type: 'conversation' as const,
        title: c.title,
        description: c.preview || 'Chat conversation',
        href: '/app/chat',
        icon: 'MessageSquare',
      })),
    ]

    return NextResponse.json({ results, total: results.length })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
