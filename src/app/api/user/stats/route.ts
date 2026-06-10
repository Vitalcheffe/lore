import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireSameUser } from "@/lib/auth-helpers";

// GET /api/user/stats — Get user stats for LORE
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Verify the authenticated user matches the requested userId
    const authError = await requireSameUser(request, userId);
    if (authError) return authError;

    // Verify user exists
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const plan = (user.plan || "free").toLowerCase();

    // Count knowledge nodes
    const totalNodes = await db.knowledgeNode.count({
      where: { userId },
    });

    // Count notes
    const totalNotes = await db.note.count({
      where: { userId },
    });

    // Count chat conversations
    const totalChatConversations = await db.chatConversation.count({
      where: { userId },
    });

    // Count digests
    const totalDigests = await db.digest.count({
      where: { userId },
    });

    // Count edges
    const totalEdges = await db.knowledgeEdge.count({
      where: { userId },
    });

    // Count AI queries today (user messages in chat)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const aiQueriesToday = await db.chatMessage.count({
      where: {
        conversation: { userId },
        role: "user",
        createdAt: { gte: todayStart },
      },
    });

    // Plan limits
    const limits = {
      free: { nodesLimit: 50, aiQueriesLimit: 10, storageLimitMB: 100 },
      pro: { nodesLimit: -1, aiQueriesLimit: -1, storageLimitMB: 10240 },
      enterprise: { nodesLimit: -1, aiQueriesLimit: -1, storageLimitMB: -1 },
    };

    const planLimits = limits[plan as keyof typeof limits] || limits.free;

    // Estimate storage: rough estimate based on content length
    // Each node ~2KB, each note ~2KB, each message ~1KB
    const estimatedStorageKB = (totalNodes * 2) + (totalNotes * 2) + (totalChatConversations * 1);
    const storageUsedMB = Math.max(1, Math.round(estimatedStorageKB / 1024 * 10) / 10);

    return NextResponse.json({
      totalNodes,
      totalNotes,
      totalChatConversations,
      totalDigests,
      totalEdges,
      aiQueriesToday,
      nodesLimit: planLimits.nodesLimit,
      aiQueriesLimit: planLimits.aiQueriesLimit,
      storageUsedMB,
      storageLimitMB: planLimits.storageLimitMB,
    });
  } catch (error) {
    console.error("Get user stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
