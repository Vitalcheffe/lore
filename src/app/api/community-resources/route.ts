import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/community-resources — List community resources from DB, optionally filtered by category
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};
    if (category && category !== "All") {
      where.category = category;
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { services: { contains: search } },
      ];
    }

    const resources = await db.communityResource.findMany({
      where,
      orderBy: { name: "asc" },
    });

    const categories = await db.communityResource.findMany({
      select: { category: true },
      distinct: ["category"],
      orderBy: { category: "asc" },
    });

    return NextResponse.json({
      resources: resources.map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description,
        category: r.category,
        services: r.services || undefined,
        verified: r.lastVerified || undefined,
        distance: r.distance || undefined,
      })),
      categories: categories.map((c) => c.category),
    });
  } catch (error) {
    console.error("Error fetching community resources:", error);
    return NextResponse.json(
      { error: "Failed to fetch resources" },
      { status: 500 }
    );
  }
}

// POST /api/community-resources — Create a new community resource (admin)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, category, description, services, lastVerified, distance } = body;

    if (!name || !category || !description) {
      return NextResponse.json(
        { error: "name, category, and description are required" },
        { status: 400 }
      );
    }

    const resource = await db.communityResource.create({
      data: {
        name,
        category,
        description,
        services: services || null,
        lastVerified: lastVerified || null,
        distance: distance || null,
      },
    });

    return NextResponse.json(resource, { status: 201 });
  } catch (error) {
    console.error("Error creating community resource:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
