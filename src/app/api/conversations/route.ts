import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthenticatedUserId } from "@/lib/auth-helpers";

// GET /api/conversations — list conversations
export async function GET(request: NextRequest) {
  try {
    const sessionUserId = await getAuthenticatedUserId(request);

    if (!sessionUserId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const skip = parseInt(searchParams.get("skip") || "0", 10);
    const take = parseInt(searchParams.get("take") || "0", 10);

    const where: Record<string, unknown> = { userId: sessionUserId };
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { preview: { contains: search } },
      ];
    }

    const conversations = await db.chatConversation.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: skip > 0 ? skip : undefined,
      take: take > 0 ? take : undefined,
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          take: 1,
        },
      },
    });

    const total = await db.chatConversation.count({ where });

    const mapped = conversations.map((c) => {
      let topResource: string | null = null;
      for (const msg of c.messages) {
        if (msg.role === "assistant" && msg.resources) {
          try {
            const resources = JSON.parse(msg.resources);
            if (Array.isArray(resources) && resources.length > 0) {
              topResource =
                typeof resources[0] === "string"
                  ? resources[0]
                  : resources[0]?.title || resources[0]?.name || null;
            }
          } catch {
            if (msg.resources.trim()) {
              topResource = msg.resources.split("\n")[0] || null;
            }
          }
          break;
        }
      }

      return {
        id: c.id,
        title: c.title,
        preview: c.preview,
        pinned: c.pinned,
        category: c.category,
        categoryColor: c.categoryColor,
        confidence: c.confidence,
        isCrisis: c.isCrisis,
        topResource,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
      };
    });

    return NextResponse.json({ conversations: mapped, total });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}

// POST /api/conversations — create a new conversation
export async function POST(request: NextRequest) {
  try {
    const sessionUserId = await getAuthenticatedUserId(request);
    const body = await request.json();
    const { title, preview, pinned } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const effectiveUserId = sessionUserId;

    if (!effectiveUserId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const conversation = await db.chatConversation.create({
      data: {
        title,
        preview: preview || title,
        pinned: pinned || false,
        isGuest: false,
        userId: effectiveUserId,
      },
    });

    return NextResponse.json({
      id: conversation.id,
      title: conversation.title,
      preview: conversation.preview,
      pinned: conversation.pinned,
      category: conversation.category,
      categoryColor: conversation.categoryColor,
      confidence: conversation.confidence,
      isCrisis: conversation.isCrisis,
      createdAt: conversation.createdAt.toISOString(),
      updatedAt: conversation.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("Error creating conversation:", error);
    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 }
    );
  }
}
