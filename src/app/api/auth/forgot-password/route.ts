import { NextRequest, NextResponse } from "next/server"
import { randomUUID } from "crypto"
import { db } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    // Check if user exists (but don't reveal this to the client for security)
    const user = await db.user.findUnique({
      where: { email },
    })

    if (user) {
      // Delete any existing reset tokens for this email
      await db.verificationToken.deleteMany({
        where: { identifier: email },
      })

      // Create a new verification token that expires in 24 hours
      const token = randomUUID()
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

      await db.verificationToken.create({
        data: {
          identifier: email,
          token,
          expires,
        },
      })

      // TODO: Send password reset email with link containing the token
      // The reset link would be: `${BASE_URL}/forgot-password?token=${token}`
      // For now, the token is stored in the DB and the email sending
      // would be integrated with an email service (e.g., SendGrid, Resend)
    }

    // Always return success to prevent email enumeration
    return NextResponse.json(
      { message: "If an account with that email exists, we've sent a password reset link." },
      { status: 200 }
    )
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}
