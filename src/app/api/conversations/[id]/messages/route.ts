import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthenticatedUserId } from "@/lib/auth-helpers";

// GET /api/conversations/[id]/messages — Get messages for a conversation
export async function GET(
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
        { error: "You can only access your own conversations" },
        { status: 403 }
      );
    }

    const messages = await db.chatMessage.findMany({
      where: { conversationId: id },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({
      messages: messages.map((m) => ({
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
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

// POST /api/conversations/[id]/messages — add a message to a conversation
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sessionUserId = await getAuthenticatedUserId(request);
    const body = await request.json();
    const { role, content, sources } = body;

    if (!role || !content) {
      return NextResponse.json(
        { error: "Role and content are required" },
        { status: 400 }
      );
    }

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
        { error: "You can only add messages to your own conversations" },
        { status: 403 }
      );
    }

    const message = await db.chatMessage.create({
      data: {
        conversationId: id,
        role,
        content,
        resources: sources ? JSON.stringify(sources) : null,
      },
    });

    // Update conversation's updatedAt and preview
    const previewText = content.slice(0, 100);
    await db.chatConversation.update({
      where: { id },
      data: {
        updatedAt: new Date(),
        preview: previewText,
      },
    });

    return NextResponse.json({
      id: message.id,
      role: message.role,
      content: message.content,
      sources: sources || null,
      timestamp: message.createdAt.toISOString(),
      createdAt: message.createdAt.toISOString(),
    });
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      { error: "Failed to create message" },
      { status: 500 }
    );
  }
}
