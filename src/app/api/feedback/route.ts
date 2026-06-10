import { NextRequest, NextResponse } from "next/server";

// ─── POST /api/feedback ──────────────────────────────────
// Accepts classification accuracy feedback from users.
// Per ADR-007 and privacy policy: Feedback is processed in-memory only
// and NEVER stored. This endpoint acknowledges receipt but does not
// persist any data.

interface FeedbackRequest {
  classification_id?: string;
  category: string;
  confidence: number;
  accurate: boolean;
  suggested_category?: string;
  comment?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: FeedbackRequest = await request.json();

    // Validate required fields
    if (!body.category || typeof body.accurate !== "boolean") {
      return NextResponse.json(
        {
          error: "category and accurate (boolean) are required fields",
        },
        { status: 400 }
      );
    }

    if (body.confidence !== undefined && (body.confidence < 0 || body.confidence > 1)) {
      return NextResponse.json(
        { error: "confidence must be between 0 and 1" },
        { status: 400 }
      );
    }

    // Per ADR-007: No data persistence. Feedback is acknowledged but never stored.
    // In a production system, this would feed into model retraining pipeline.
    console.log(
      `[FEEDBACK] Category: ${body.category}, Accurate: ${body.accurate}, ` +
      `Confidence: ${body.confidence}, Suggested: ${body.suggested_category || "N/A"}`
    );

    return NextResponse.json({
      status: "received",
      message: "Thank you for your feedback. It helps improve our classification accuracy.",
      note: "Feedback is processed in real-time and never stored — per our zero-retention privacy policy.",
    });
  } catch (error) {
    console.error("Feedback API error:", error);
    return NextResponse.json(
      { error: "Failed to process feedback" },
      { status: 500 }
    );
  }
}
