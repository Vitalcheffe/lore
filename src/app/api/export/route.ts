import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getAuthenticatedUserId } from '@/lib/auth-helpers'

export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(req)
    if (!userId) {
      return Response.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type') || 'all'

    const exportData: Record<string, unknown> = {
      exportedAt: new Date().toISOString(),
      userId,
      type,
      counts: {} as Record<string, number>,
    }

    if (type === 'nodes' || type === 'all') {
      const nodes = await db.knowledgeNode.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } })
      exportData.nodes = nodes
      ;(exportData.counts as Record<string, number>).nodes = nodes.length
    }

    if (type === 'notes' || type === 'all') {
      const notes = await db.note.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } })
      exportData.notes = notes
      ;(exportData.counts as Record<string, number>).notes = notes.length
    }

    const date = new Date().toISOString().split('T')[0]

    return new Response(JSON.stringify(exportData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="lore-export-${type}-${date}.json"`,
      },
    })
  } catch (error) {
    console.error('Export error:', error)
    return Response.json({ error: 'Export failed' }, { status: 500 })
  }
}
