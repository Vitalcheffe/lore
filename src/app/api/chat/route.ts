import { NextRequest } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'
import { db } from '@/lib/db'
import { getAuthenticatedUserId } from '@/lib/auth-helpers'

export async function POST(req: NextRequest) {
  try {
    // Require authentication to use AI chat
    const userId = await getAuthenticatedUserId(req)
    if (!userId) {
      return Response.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await req.json()
    const { messages } = body

    // Validate messages input
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: 'Messages array is required' }, { status: 400 })
    }

    // Limit messages to last 20 to control costs
    const trimmedMessages = messages.slice(-20)

    // Validate each message has role and content
    for (const m of trimmedMessages) {
      if (!m.role || !m.content || typeof m.content !== 'string') {
        return Response.json({ error: 'Each message must have a role and content string' }, { status: 400 })
      }
    }

    // Fetch user's real knowledge nodes to include in the AI context
    let nodeContext = ''

    const nodes = await db.knowledgeNode.findMany({
      where: { userId },
      select: { title: true, type: true, content: true, tags: true },
      orderBy: { updatedAt: 'desc' },
      take: 50,
    })

    if (nodes.length > 0) {
      const nodeDescriptions = nodes.map(n => {
        const tagStr = n.tags ? ` [${n.tags}]` : ''
        return `- ${n.title} (${n.type})${tagStr}: ${(n.content || '').slice(0, 200)}`
      }).join('\n')
      nodeContext = `\n\nHere are the user's knowledge nodes:\n${nodeDescriptions}`
    }

    const zai = await ZAI.create()

    const systemPrompt = `You are Lore's AI assistant. You help users query and understand their knowledge base.${nodeContext}

Always reference which knowledge nodes your answers come from. Be concise but thorough.
If you're unsure, say so and suggest which nodes might have the answer.`

    const response = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        ...trimmedMessages.map((m: { role: string; content: string }) => ({ role: m.role, content: m.content })),
      ],
    })

    const content = response.choices[0]?.message?.content || "I couldn't generate a response."

    return Response.json({ content })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return Response.json({ error: message }, { status: 500 })
  }
}
