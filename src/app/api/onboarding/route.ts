import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthenticatedUserId } from '@/lib/auth-helpers'

// POST /api/onboarding — Complete onboarding & create sample data
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
    const { name } = body

    // Update user name if provided
    if (name && name.trim()) {
      await db.user.update({
        where: { id: userId },
        data: { name: name.trim() },
      })
    }

    // Check if user already has nodes (prevent duplicate sample data)
    const existingNodes = await db.knowledgeNode.count({
      where: { userId },
    })

    if (existingNodes === 0) {
      // Create 3 sample knowledge nodes
      const productRoadmap = await db.knowledgeNode.create({
        data: {
          userId,
          title: 'Product Roadmap',
          content: 'Strategic plan for product development across Q1-Q4. Key focus areas include user experience improvements, performance optimization, and new feature launches.',
          type: 'project',
          color: '#059669',
          icon: '📋',
          source: 'onboarding',
          tags: 'strategy,planning,product',
          x: 300,
          y: 200,
        },
      })

      const userResearch = await db.knowledgeNode.create({
        data: {
          userId,
          title: 'User Research',
          content: 'Insights from user interviews, surveys, and usability testing. Key findings: users want better navigation, faster load times, and more collaboration features.',
          type: 'resource',
          color: '#0891B2',
          icon: '🔍',
          source: 'onboarding',
          tags: 'research,users,insights',
          x: 150,
          y: 350,
        },
      })

      const designSystem = await db.knowledgeNode.create({
        data: {
          userId,
          title: 'Design System',
          content: 'Component library and design tokens that ensure visual consistency across all products. Includes color palette, typography scale, spacing system, and reusable UI patterns.',
          type: 'concept',
          color: '#7C3AED',
          icon: '🎨',
          source: 'onboarding',
          tags: 'design,components,ui',
          x: 450,
          y: 350,
        },
      })

      // Create 2 sample edges
      await db.knowledgeEdge.create({
        data: {
          userId,
          sourceId: productRoadmap.id,
          targetId: userResearch.id,
          label: 'references',
          type: 'references',
          strength: 8,
        },
      })

      await db.knowledgeEdge.create({
        data: {
          userId,
          sourceId: productRoadmap.id,
          targetId: designSystem.id,
          label: 'depends on',
          type: 'depends_on',
          strength: 7,
        },
      })
    }

    // Mark onboarding as complete
    await db.user.update({
      where: { id: userId },
      data: { onboardingComplete: true },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to complete onboarding:', error)
    return NextResponse.json(
      { error: 'Failed to complete onboarding' },
      { status: 500 }
    )
  }
}
