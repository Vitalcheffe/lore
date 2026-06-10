import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, organization, subject, urgency, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Save the contact submission to the database
    const submission = await db.contactSubmission.create({
      data: {
        name,
        email,
        organization: organization || null,
        subject: subject || null,
        urgency: urgency || "medium",
        message,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Thank you for your message. We'll get back to you soon.",
      id: submission.id,
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to process your message. Please try again later." },
      { status: 500 }
    );
  }
}
