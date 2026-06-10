import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireSameUser } from "@/lib/auth-helpers";

// Field name mapping: frontend name → Prisma schema name
const fieldMappings: Record<string, string> = {
  showLabels: "graphShowLabels",
  deliveryTime: "digestTime",
  digestEmail: "digestEmailNotif",
  autoLinkDiscoveries: "memoryAutoLink",
  defaultModel: "chatModel",
  streamResponses: "chatStreamResponses",
};

// Fields that exist in the Prisma UserSettings schema
const allowedFields = [
  "theme", "language", "digestTime", "digestEnabled", "digestEmailNotif",
  "graphLayout", "graphShowLabels", "chatModel", "chatStreamResponses",
  "memoryAutoTag", "memoryAutoLink", "sidebarPosition", "fontSize",
  "reducedMotion", "emailNotifs", "weeklySummary", "developerMode",
  "animationSpeed", "confidenceThreshold", "dataRetention", "twoFactor",
  "newFeatures", "digestReminders", "nodeSize", "edgeStyle",
  "showSources", "includeAIComment",
];

// GET /api/user/settings — Get user settings
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

    let settings = await db.userSettings.findUnique({
      where: { userId },
    });

    // Auto-create default settings if they don't exist
    if (!settings) {
      settings = await db.userSettings.create({
        data: { userId },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Get user settings error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/user/settings — Update user settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, ...settingsFields } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Verify the authenticated user matches the requested userId
    const authError = await requireSameUser(request, userId);
    if (authError) return authError;

    // Map frontend field names to Prisma schema field names
    const mappedFields: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(settingsFields)) {
      const schemaKey = fieldMappings[key] || key;
      if (allowedFields.includes(schemaKey)) {
        mappedFields[schemaKey] = value;
      }
    }

    // Verify settings exist
    const existingSettings = await db.userSettings.findUnique({
      where: { userId },
    });

    if (!existingSettings) {
      // Create settings if they don't exist
      const newSettings = await db.userSettings.create({
        data: {
          userId,
          ...mappedFields,
        },
      });
      return NextResponse.json(newSettings);
    }

    const updatedSettings = await db.userSettings.update({
      where: { userId },
      data: mappedFields,
    });

    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error("Update user settings error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
