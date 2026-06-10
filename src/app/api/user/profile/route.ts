import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { requireSameUser, getAuthenticatedUserId } from "@/lib/auth-helpers";

// GET /api/user/profile — Get user profile with settings and stats
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Verify the authenticated user matches the requested userId
    const authError = await requireSameUser(request, userId);
    if (authError) return authError;

    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        userSettings: true,
        accounts: {
          select: { id: true, provider: true }
        },
        sessions: {
          select: { id: true, sessionToken: true, expires: true },
          orderBy: { expires: 'desc' },
        },
        _count: {
          select: {
            knowledgeNodes: true,
            notes: true,
            chatConversations: true,
            digests: true,
            knowledgeEdges: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Calculate stats for LORE context
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayChatMessages = await db.chatMessage.count({
      where: {
        conversation: { userId },
        role: "user",
        createdAt: { gte: todayStart },
      },
    });

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      image: user.image,
      plan: user.plan,
      onboardingComplete: user.onboardingComplete,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      settings: user.userSettings,
      connectedProviders: user.accounts.map((a) => a.provider),
      sessions: user.sessions.map((s) => ({
        id: s.id,
        expires: s.expires,
      })),
      stats: {
        totalNodes: user._count.knowledgeNodes,
        totalNotes: user._count.notes,
        totalChatConversations: user._count.chatConversations,
        totalDigests: user._count.digests,
        totalEdges: user._count.knowledgeEdges,
        aiQueriesToday: todayChatMessages,
      },
    });
  } catch (error) {
    console.error("Get user profile error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/user/profile — Update user profile
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, name, email, username, image, plan, currentPassword, newPassword, bio } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Verify the authenticated user matches the requested userId
    const authError = await requireSameUser(request, userId);
    if (authError) return authError;

    // Verify user exists
    const existingUser = await db.user.findUnique({ where: { id: userId } });
    if (!existingUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // If email is being changed, check uniqueness
    if (email && email !== existingUser.email) {
      const emailTaken = await db.user.findUnique({ where: { email } });
      if (emailTaken) {
        return NextResponse.json(
          { error: "Email is already in use" },
          { status: 409 }
        );
      }
    }

    // If username is being changed, check uniqueness
    if (username && username !== existingUser.username) {
      const usernameTaken = await db.user.findUnique({ where: { username } });
      if (usernameTaken) {
        return NextResponse.json(
          { error: "Username is already taken" },
          { status: 409 }
        );
      }
    }

    // Build update data with only provided fields
    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (username !== undefined) updateData.username = username;
    if (image !== undefined) updateData.image = image;
    if (plan !== undefined) updateData.plan = plan;

    // Handle password change
    if (currentPassword && newPassword) {
      const existingUserData = await db.user.findUnique({ where: { id: userId } });
      if (!existingUserData?.passwordHash) {
        return NextResponse.json(
          { error: "No password set for this account. Use OAuth instead." },
          { status: 400 }
        );
      }
      const passwordMatch = await bcrypt.compare(currentPassword, existingUserData.passwordHash);
      if (!passwordMatch) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 401 }
        );
      }
      if (newPassword.length < 8) {
        return NextResponse.json(
          { error: "New password must be at least 8 characters" },
          { status: 400 }
        );
      }
      updateData.passwordHash = await bcrypt.hash(newPassword, 12);
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      username: updatedUser.username,
      image: updatedUser.image,
      plan: updatedUser.plan,
      updatedAt: updatedUser.updatedAt,
    });
  } catch (error) {
    console.error("Update user profile error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
