import { NextRequest } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    const zai = await ZAI.create()

    const systemPrompt = `You are Lore's AI assistant. You help users query and understand their team's knowledge base. 
You have access to the team's knowledge graph with nodes about: API Design, Authentication, Database Schema, Knowledge Graph, Morning Digest, AI Chat Engine, and more.
Always reference which knowledge nodes your answers come from. Be concise but thorough.
If you're unsure, say so and suggest which nodes might have the answer.`

    const response = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map((m: { role: string; content: string }) => ({ role: m.role, content: m.content })),
      ],
    })

    const content = response.choices[0]?.message?.content || "I couldn't generate a response."

    return Response.json({ content })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return Response.json({ error: message }, { status: 500 })
  }
}
