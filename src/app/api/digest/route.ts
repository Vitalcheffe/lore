import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthenticatedUserId } from '@/lib/auth-helpers'
import ZAI from 'z-ai-web-dev-sdk'

// GET /api/digest — Return today's digest (real DB + AI generation)
export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(request)

    if (!userId) {
      return NextResponse.json({ digest: null, pastDigests: [] })
    }

    const today = new Date().toISOString().split('T')[0]

    // Try to find today's digest in DB
    let digest = await db.digest.findUnique({
      where: { userId_date: { userId, date: today } },
    })

    // If no digest exists for today, generate one
    if (!digest) {
      digest = await generateDigest(userId, today)
    }

    // Get past digests (last 7 days, excluding today)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const pastDigestsRaw = await db.digest.findMany({
      where: {
        userId,
        date: { not: today },
        createdAt: { gte: sevenDaysAgo },
      },
      orderBy: { date: 'desc' },
      take: 7,
    })

    const pastDigests = pastDigestsRaw.map(d => ({
      id: d.id,
      date: d.date,
      day: new Date(d.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long' }),
      summary: d.summary,
    }))

    // Format today's digest with computed fields
    const todayDigest = formatDigest(digest, userId)

    return NextResponse.json({
      digest: todayDigest,
      pastDigests,
    })
  } catch (error) {
    console.error('Failed to fetch digest:', error)
    return NextResponse.json(
      { error: 'Failed to fetch digest' },
      { status: 500 }
    )
  }
}

// POST /api/digest — Force regenerate today's digest
export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(request)

    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const today = new Date().toISOString().split('T')[0]

    // Delete existing digest for today if any
    await db.digest.deleteMany({
      where: { userId, date: today },
    })

    const digest = await generateDigest(userId, today)
    const todayDigest = formatDigest(digest, userId)

    return NextResponse.json({ digest: todayDigest })
  } catch (error) {
    console.error('Failed to regenerate digest:', error)
    return NextResponse.json(
      { error: 'Failed to regenerate digest' },
      { status: 500 }
    )
  }
}

// ── Helper: Generate a digest from user's real data ─────────
async function generateDigest(userId: string, date: string) {
  // Fetch user's recent data
  const nodes = await db.knowledgeNode.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })

  const edges = await db.knowledgeEdge.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })

  const notes = await db.note.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 10,
  })

  // Calculate recent activity (last 24 hours)
  const oneDayAgo = new Date()
  oneDayAgo.setDate(oneDayAgo.getDate() - 1)

  const recentNodes = nodes.filter(n => new Date(n.createdAt) >= oneDayAgo)
  const recentEdges = edges.filter(e => new Date(e.createdAt) >= oneDayAgo)
  const recentNotes = notes.filter(n => new Date(n.createdAt) >= oneDayAgo)

  // Build context for AI
  const nodeTitles = nodes.map(n => n.title).join(', ')
  const recentNodeTitles = recentNodes.map(n => `"${n.title}" (${n.type})`).join(', ')
  const recentEdgeLabels = recentEdges.map(e => {
    const source = nodes.find(n => n.id === e.sourceId)?.title || e.sourceId
    const target = nodes.find(n => n.id === e.targetId)?.title || e.targetId
    return `${source} → ${target} (${e.label || e.type})`
  }).join(', ')

  // Determine mood based on activity
  let mood = 'neutral'
  if (recentNodes.length >= 3 || recentEdges.length >= 2) {
    mood = 'productive'
  } else if (recentNodes.length === 0 && recentEdges.length === 0) {
    mood = 'slow'
  }

  // Calculate focus areas from node types
  const typeMap = new Map<string, number>()
  for (const node of nodes) {
    const cat = node.type || 'concept'
    typeMap.set(cat, (typeMap.get(cat) || 0) + 1)
  }
  const focusAreas = Array.from(typeMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([name, count]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      progress: Math.min(Math.round((count / Math.max(nodes.length, 1)) * 100), 100),
    }))

  // Generate AI commentary
  let aiComment = ''
  let summary = ''
  let keyInsights: string[] = []

  try {
    const zai = await ZAI.create()

    const aiPrompt = `You are Lore's morning digest AI. Based on the user's knowledge graph data, generate a brief morning digest.

Current knowledge base: ${nodeTitles || 'No nodes yet'}
New nodes (last 24h): ${recentNodeTitles || 'None'}
New connections (last 24h): ${recentEdgeLabels || 'None'}
Total nodes: ${nodes.length}, Total edges: ${edges.length}, Recent notes: ${notes.length}

Generate a JSON object with:
- "summary": 2-3 sentence overview of the user's knowledge activity
- "keyInsights": array of 2-3 actionable insights about their knowledge graph
- "aiComment": 1-2 sentence personalized encouragement or suggestion

Keep it concise and helpful. If the knowledge base is new/empty, encourage them to start adding nodes.`

    const response = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a knowledge management AI assistant. Always respond with valid JSON only, no markdown.' },
        { role: 'user', content: aiPrompt },
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const content = response.choices[0]?.message?.content || ''
    try {
      // Try to parse JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        summary = parsed.summary || ''
        keyInsights = parsed.keyInsights || []
        aiComment = parsed.aiComment || ''
      }
    } catch {
      // Fallback if AI doesn't return valid JSON
      summary = content.slice(0, 200)
    }
  } catch {
    // AI unavailable — use computed fallback
  }

  // Fallbacks if AI didn't return content
  if (!summary) {
    if (nodes.length === 0) {
      summary = 'Welcome to Lore! Your knowledge base is empty. Start by adding your first knowledge node to begin building your team memory.'
    } else {
      summary = `Your knowledge base has ${nodes.length} nodes and ${edges.length} connections. ${recentNodes.length > 0 ? `${recentNodes.length} new nodes were added recently.` : 'No new nodes in the last 24 hours.'}`
    }
  }

  if (keyInsights.length === 0) {
    if (recentNodes.length > 0) {
      keyInsights.push(`${recentNodes.length} new node${recentNodes.length > 1 ? 's were' : ' was'} added recently — your knowledge graph is growing`)
    }
    if (recentEdges.length > 0) {
      keyInsights.push(`${recentEdges.length} new connection${recentEdges.length > 1 ? 's were' : ' was'} created — nodes are becoming interlinked`)
    }
    if (nodes.length > 0 && edges.length === 0) {
      keyInsights.push('Your nodes have no connections yet — consider linking related concepts')
    }
  }

  if (!aiComment) {
    if (nodes.length === 0) {
      aiComment = 'Get started by adding your first knowledge node. Every great knowledge graph starts with a single idea!'
    } else if (recentNodes.length > 2) {
      aiComment = 'Great momentum! Your team is actively building the knowledge base. Keep it up!'
    } else {
      aiComment = 'Consider adding a few more connections between your existing nodes to unlock new insights.'
    }
  }

  // Build connections for digest
  const connections = recentEdges.map(e => {
    const source = nodes.find(n => n.id === e.sourceId)?.title || 'Unknown'
    const target = nodes.find(n => n.id === e.targetId)?.title || 'Unknown'
    return {
      source,
      target,
      type: e.source === 'ai' ? 'auto' : 'manual',
      confidence: Math.round(e.strength / 10 * 100),
    }
  })

  // Build timeline from recent activity
  const timeline = [
    ...recentNodes.map(n => ({
      time: new Date(n.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      description: `Added '${n.title}' node`,
      affected: n.type || 'General',
      type: 'add' as const,
    })),
    ...recentEdges.map(e => {
      const source = nodes.find(n => n.id === e.sourceId)?.title || 'Node'
      const target = nodes.find(n => n.id === e.targetId)?.title || 'Node'
      return {
        time: new Date(e.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        description: `Linked '${source}' → '${target}'`,
        affected: `${source}, ${target}`,
        type: 'link' as const,
      }
    }),
    ...recentNotes.map(n => ({
      time: new Date(n.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      description: `Note: ${n.title}`,
      affected: n.category || 'Notes',
      type: 'edit' as const,
    })),
  ].sort((a, b) => a.time.localeCompare(b.time)).slice(0, 5)

  // Build action items from pinned notes
  const pinnedNotes = notes.filter(n => n.pinned)
  const actionItems = pinnedNotes.slice(0, 3).map((n, i) => ({
    id: String(i + 1),
    label: `Review: ${n.title}`,
    checked: false,
  }))

  // Save digest to database
  const digest = await db.digest.create({
    data: {
      userId,
      date,
      summary,
      keyInsights: JSON.stringify(keyInsights),
      connections: JSON.stringify(connections),
      mood,
      focusAreas: JSON.stringify(focusAreas),
      aiComment,
      read: false,
    },
  })

  // Attach computed fields for the response (not stored in DB)
  return Object.assign(digest, {
    quickStats: {
      nodesAddedToday: recentNodes.length,
      connections: recentEdges.length,
      activeMembers: 1,
      queriesAnswered: 0,
    },
    timeline,
    actionItems,
  })
}

// ── Helper: Format a digest record for API response ─────────
function formatDigest(digest: any, userId: string) {
  // Parse JSON fields
  let keyInsights: string[] = []
  try {
    keyInsights = JSON.parse(digest.keyInsights || '[]')
  } catch { /* empty */ }

  let connections: any[] = []
  try {
    connections = JSON.parse(digest.connections || '[]')
  } catch { /* empty */ }

  let focusAreas: any[] = []
  try {
    focusAreas = JSON.parse(digest.focusAreas || '[]')
  } catch { /* empty */ }

  return {
    id: digest.id,
    date: digest.date,
    summary: digest.summary,
    keyInsights,
    connections,
    mood: digest.mood,
    focusAreas,
    aiComment: digest.aiComment,
    quickStats: digest.quickStats || {
      nodesAddedToday: 0,
      connections: 0,
      activeMembers: 1,
      queriesAnswered: 0,
    },
    timeline: digest.timeline || [],
    actionItems: digest.actionItems || [],
    read: digest.read,
    createdAt: digest.createdAt.toISOString(),
  }
}
