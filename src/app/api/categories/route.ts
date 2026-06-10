import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// ─── GET /api/categories ─────────────────────────────────
// Returns all resource categories with counts.
// Used by the API docs page and for category browsing.

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "Housing Assistance": "Emergency shelter, rental assistance, affordable housing programs, and foreclosure prevention",
  "Food Assistance": "Food banks, SNAP benefits, meal programs, and nutrition support",
  "Mental Health": "Crisis counseling, therapy, support groups, and psychiatric services",
  "Employment Services": "Job training, career counseling, resume help, and workforce development",
  "Legal Aid": "Free legal representation, immigration services, and court assistance",
  "Healthcare": "Primary care, dental, pharmacy, and community health centers",
  "Substance Abuse": "Detox, rehabilitation, AA/NA meetings, and recovery support",
  "Senior Services": "Meals on Wheels, caregiver support, benefits counseling, and senior centers",
  "Veteran Services": "VA healthcare, PTSD treatment, housing assistance, employment programs, and benefits navigation",
};

const CATEGORY_ICONS: Record<string, string> = {
  "Housing Assistance": "home",
  "Food Assistance": "utensils",
  "Mental Health": "brain",
  "Employment Services": "briefcase",
  "Legal Aid": "scale",
  "Healthcare": "heart-pulse",
  "Substance Abuse": "shield",
  "Senior Services": "users",
  "Veteran Services": "flag",
};

export async function GET() {
  try {
    // Get all resources to count by category
    const resources = await db.resource.findMany({
      select: { category: true },
    });

    // Count resources per category
    const categoryCounts: Record<string, number> = {};
    for (const r of resources) {
      categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
    }

    // Build categories list
    const categories = Object.entries(categoryCounts)
      .map(([name, count]) => ({
        name,
        slug: name.toLowerCase().replace(/\s+/g, "-"),
        description: CATEGORY_DESCRIPTIONS[name] || "Community resources and support services",
        icon: CATEGORY_ICONS[name] || "circle",
        resource_count: count,
      }))
      .sort((a, b) => b.resource_count - a.resource_count);

    return NextResponse.json({
      categories,
      total_categories: categories.length,
      total_resources: resources.length,
    });
  } catch (error) {
    console.error("Categories API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories", categories: [] },
      { status: 500 }
    );
  }
}
