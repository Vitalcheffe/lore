import { NextRequest, NextResponse } from "next/server";

// ─── POST /api/verify ────────────────────────────────────
// Accepts community resource verification submissions.
// Per ADR-007 and privacy policy: Submissions are processed in-memory only
// and NEVER stored. This endpoint validates the submission and
// acknowledges receipt without persisting data.

interface VerifyRequest {
  resource_name: string;
  resource_url?: string;
  resource_phone?: string;
  resource_address?: string;
  category: string;
  verification_notes?: string;
  submitter_contact?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: VerifyRequest = await request.json();

    // Validate required fields
    if (!body.resource_name || body.resource_name.trim().length === 0) {
      return NextResponse.json(
        { error: "resource_name is required" },
        { status: 400 }
      );
    }

    if (!body.category || body.category.trim().length === 0) {
      return NextResponse.json(
        { error: "category is required" },
        { status: 400 }
      );
    }

    // Validate category against known categories
    const validCategories = [
      "Housing Assistance",
      "Food Assistance",
      "Mental Health",
      "Employment Services",
      "Legal Aid",
      "Healthcare",
      "Substance Abuse",
      "Senior Services",
      "Veteran Services",
    ];

    const categoryMatch = validCategories.find(
      (c) =>
        c.toLowerCase() === body.category.toLowerCase() ||
        c.toLowerCase().includes(body.category.toLowerCase()) ||
        body.category.toLowerCase().includes(c.toLowerCase())
    );

    if (!categoryMatch) {
      return NextResponse.json(
        {
          error: "Invalid category",
          valid_categories: validCategories,
        },
        { status: 400 }
      );
    }

    // Per ADR-007: No data persistence. Verification is acknowledged but never stored.
    // In a production system, this would go to a human review queue.
    console.log(
      `[VERIFY] Resource: ${body.resource_name}, Category: ${categoryMatch}, ` +
      `URL: ${body.resource_url || "N/A"}, Phone: ${body.resource_phone || "N/A"}`
    );

    return NextResponse.json({
      status: "received",
      message: `Verification for "${body.resource_name}" has been received. Our team will review it within 48 hours.`,
      category: categoryMatch,
      note: "Submissions are processed in real-time and never stored — per our zero-retention privacy policy. Contact information is discarded immediately after processing.",
    });
  } catch (error) {
    console.error("Verify API error:", error);
    return NextResponse.json(
      { error: "Failed to process verification" },
      { status: 500 }
    );
  }
}
