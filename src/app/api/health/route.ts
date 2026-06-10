import { db } from '@/lib/db'

export async function GET() {
  const startTime = Date.now()

  try {
    // Check database connection
    await db.$queryRaw`SELECT 1`

    return Response.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'connected',
      responseTime: `${Date.now() - startTime}ms`,
      version: '1.0.0',
    })
  } catch (error) {
    return Response.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      responseTime: `${Date.now() - startTime}ms`,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 503 })
  }
}
