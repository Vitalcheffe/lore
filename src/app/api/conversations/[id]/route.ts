import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthenticatedUserId } from "@/lib/auth-helpers";

// GET /api/conversations/[id] — Get conversation with messages
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sessionUserId = await getAuthenticatedUserId(request);

    const conversation = await db.chatConversation.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    if (conversation.userId && conversation.userId !== sessionUserId) {
      return NextResponse.json(
        { error: "You can only access your own conversations" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      id: conversation.id,
      title: conversation.title,
      preview: conversation.preview,
      pinned: conversation.pinned,
      category: conversation.category,
      categoryColor: conversation.categoryColor,
      confidence: conversation.confidence,
      isCrisis: conversation.isCrisis,
      isGuest: conversation.isGuest,
      userId: conversation.userId,
      createdAt: conversation.createdAt.toISOString(),
      updatedAt: conversation.updatedAt.toISOString(),
      messages: conversation.messages.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        sources: m.resources
          ? (() => {
              try {
                return JSON.parse(m.resources);
              } catch {
                return null;
              }
            })()
          : null,
        timestamp: m.createdAt.toISOString(),
        createdAt: m.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Get conversation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/conversations/[id] — Update conversation (pin, title, etc.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sessionUserId = await getAuthenticatedUserId(request);
    const body = await request.json();

    const conversation = await db.chatConversation.findUnique({
      where: { id },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    if (conversation.userId && conversation.userId !== sessionUserId) {
      return NextResponse.json(
        { error: "You can only update your own conversations" },
        { status: 403 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.preview !== undefined) updateData.preview = body.preview;
    if (body.pinned !== undefined) updateData.pinned = body.pinned;

    const updated = await db.chatConversation.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      id: updated.id,
      title: updated.title,
      preview: updated.preview,
      pinned: updated.pinned,
      updatedAt: updated.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("Update conversation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/conversations/[id] — Delete a conversation and its messages
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sessionUserId = await getAuthenticatedUserId(request);

    const conversation = await db.chatConversation.findUnique({
      where: { id },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    if (conversation.userId && conversation.userId !== sessionUserId) {
      return NextResponse.json(
        { error: "You can only delete your own conversations" },
        { status: 403 }
      );
    }

    await db.chatMessage.deleteMany({
      where: { conversationId: id },
    });

    await db.chatConversation.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Conversation deleted" });
  } catch (error) {
    console.error("Delete conversation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
