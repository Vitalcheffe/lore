import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthenticatedUserId } from '@/lib/auth-helpers'
import { randomBytes } from 'crypto'

// GET /api/team — Get the current user's team info
export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(request)
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Find the user's team membership
    const membership = await db.teamMember.findFirst({
      where: { userId },
      include: {
        team: {
          include: {
            members: {
              include: {
                user: {
                  select: { id: true, name: true, email: true, image: true, createdAt: true },
                },
              },
            },
            invitations: {
              where: { accepted: false, expiresAt: { gt: new Date() } },
              orderBy: { createdAt: 'desc' },
            },
          },
        },
      },
    })

    if (!membership) {
      // No team yet — return empty state
      const user = await db.user.findUnique({ where: { id: userId } })
      return NextResponse.json({
        hasTeam: false,
        user: { id: user?.id, name: user?.name, email: user?.email, plan: user?.plan },
      })
    }

    const team = membership.team

    // Get per-member stats
    const membersWithStats = await Promise.all(
      team.members.map(async (m) => {
        const nodeCount = await db.knowledgeNode.count({ where: { userId: m.userId } })
        const queryCount = await db.chatConversation.count({ where: { userId: m.userId } })
        const lastSession = await db.session.findFirst({
          where: { userId: m.userId },
          orderBy: { expires: 'desc' },
        })

        return {
          id: m.id,
          userId: m.userId,
          name: m.user.name || m.user.email.split('@')[0],
          email: m.user.email,
          image: m.user.image,
          role: m.role,
          facts: nodeCount,
          queries: queryCount,
          joinedAt: m.joinedAt.toISOString(),
          lastActive: lastSession
            ? getTimeAgo(lastSession.expires)
            : 'Never',
          status: lastSession && new Date(lastSession.expires) > new Date() ? 'online' : 'offline',
        }
      })
    )

    // Compute team stats
    const totalMembers = team.members.length
    const totalFacts = membersWithStats.reduce((sum, m) => sum + m.facts, 0)
    const totalQueries = membersWithStats.reduce((sum, m) => sum + m.queries, 0)
    const activeToday = membersWithStats.filter(m => m.status === 'online').length

    // Format pending invitations
    const pendingInvitations = team.invitations.map(inv => ({
      id: inv.id,
      email: inv.email,
      role: inv.role,
      sentDate: getTimeAgo(inv.createdAt),
    }))

    // Build activity feed from recent team data
    const recentNodes = await db.knowledgeNode.findMany({
      where: { userId: { in: team.members.map(m => m.userId) } },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { user: { select: { name: true, email: true } } },
    })

    const activities = recentNodes.map(n => ({
      text: `${n.user?.name || 'Someone'} added '${n.title}'`,
      time: getTimeAgo(n.createdAt),
      type: 'add',
    }))

    // Count members by role
    const roleCounts = {
      admin: team.members.filter(m => m.role === 'admin').length,
      editor: team.members.filter(m => m.role === 'editor').length,
      viewer: team.members.filter(m => m.role === 'viewer').length,
    }

    return NextResponse.json({
      hasTeam: true,
      team: {
        id: team.id,
        name: team.name,
        slug: team.slug,
        plan: team.plan,
        createdAt: team.createdAt.toISOString(),
      },
      members: membersWithStats,
      invitations: pendingInvitations,
      stats: {
        totalMembers,
        activeToday,
        totalFacts,
        avgQueriesPerDay: Math.round(totalQueries / Math.max(totalMembers, 1)),
      },
      activities,
      roleCounts,
      currentUserRole: membership.role,
    })
  } catch (error) {
    console.error('Failed to fetch team:', error)
    return NextResponse.json({ error: 'Failed to fetch team' }, { status: 500 })
  }
}

// POST /api/team — Create a team or send an invitation
export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(request)
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await request.json()
    const { action, teamName, inviteEmail, inviteRole, inviteMessage } = body

    if (action === 'create') {
      // Create a new team with the current user as admin
      if (!teamName) {
        return NextResponse.json({ error: 'Team name is required' }, { status: 400 })
      }

      const slug = teamName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

      const team = await db.team.create({
        data: {
          name: teamName,
          slug,
          plan: 'free',
          members: {
            create: {
              userId,
              role: 'admin',
            },
          },
        },
      })

      return NextResponse.json({ team }, { status: 201 })
    }

    if (action === 'invite') {
      // Send a team invitation
      if (!inviteEmail) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 })
      }

      // Find user's team
      const membership = await db.teamMember.findFirst({ where: { userId, role: 'admin' } })
      if (!membership) {
        return NextResponse.json({ error: 'Only team admins can send invitations' }, { status: 403 })
      }

      const token = randomBytes(32).toString('hex')
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

      const invitation = await db.teamInvitation.create({
        data: {
          teamId: membership.teamId,
          email: inviteEmail,
          role: inviteRole || 'viewer',
          message: inviteMessage || null,
          token,
          expiresAt,
        },
      })

      return NextResponse.json({ invitation }, { status: 201 })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Team action failed:', error)
    return NextResponse.json({ error: 'Team action failed' }, { status: 500 })
  }
}

// PATCH /api/team — Update team settings
export async function PATCH(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(request)
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await request.json()
    const { name, memberId, role } = body

    // Update team name
    if (name) {
      const membership = await db.teamMember.findFirst({ where: { userId, role: 'admin' } })
      if (!membership) {
        return NextResponse.json({ error: 'Only admins can update team settings' }, { status: 403 })
      }

      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      const team = await db.team.update({
        where: { id: membership.teamId },
        data: { name, slug },
      })

      return NextResponse.json({ team })
    }

    // Update member role
    if (memberId && role) {
      const membership = await db.teamMember.findFirst({ where: { userId, role: 'admin' } })
      if (!membership) {
        return NextResponse.json({ error: 'Only admins can change roles' }, { status: 403 })
      }

      const updated = await db.teamMember.update({
        where: { id: memberId },
        data: { role },
      })

      return NextResponse.json({ member: updated })
    }

    return NextResponse.json({ error: 'No valid update fields provided' }, { status: 400 })
  } catch (error) {
    console.error('Team update failed:', error)
    return NextResponse.json({ error: 'Team update failed' }, { status: 500 })
  }
}

// Helper: get relative time string
function getTimeAgo(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - new Date(date).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return `${Math.floor(days / 30)}mo ago`
}
