import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

// ─── GET /api/resources?category=Legal+Aid&zip=78701 ────────
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const zip = searchParams.get("zip");

    if (!category || category.trim().length === 0) {
      return NextResponse.json(
        { error: "category query parameter is required" },
        { status: 400 }
      );
    }

    // Build where clause
    const where: Prisma.ResourceWhereInput = {
      category: category.trim(),
    };

    if (zip && zip.trim().length > 0) {
      where.zip = zip.trim();
    }

    const resources = await db.resource.findMany({
      where,
      orderBy: { name: "asc" },
    });

    // Format resources for API response
    const formattedResources = resources.map((r) => ({
      id: r.id,
      name: r.name,
      category: r.category,
      description: r.description,
      phone: r.phone,
      address: r.address,
      hours: r.hours,
      eligibility: r.eligibility,
      services: JSON.parse(r.services) as string[],
      languages: JSON.parse(r.languages) as string[],
      last_verified: r.lastVerified.toISOString().split("T")[0],
      url: r.url,
    }));

    return NextResponse.json({
      category: category.trim(),
      zip: zip?.trim() || null,
      resources: formattedResources,
      total: formattedResources.length,
      note: "Please call to confirm availability and eligibility before visiting.",
    });
  } catch (error) {
    console.error("Resources API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch resources. Please try again." },
      { status: 500 }
    );
  }
}
