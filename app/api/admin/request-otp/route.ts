import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { adminEmails, getOtpRecipientEmail } from "@/lib/admin/config"
import { createMailTransporter } from "@/lib/admin/mail"
import { adminOtpCookieName, createOtpChallenge } from "@/lib/admin/session"

export async function POST() {
  try {
    const adminEmail = adminEmails[0]

    if (!adminEmail) {
      return NextResponse.json({ error: "No admin email is configured for OTP login." }, { status: 500 })
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
      return NextResponse.json({ error: "Email service not configured." }, { status: 500 })
    }

    const transporter = createMailTransporter()
    const { code, cookieValue, maxAgeSeconds } = createOtpChallenge(adminEmail)
    const recipient = getOtpRecipientEmail(adminEmail)

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: recipient,
      subject: "Your portfolio admin verification code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px;">
          <div style="border: 1px solid #e5e7eb; border-radius: 16px; padding: 24px;">
            <h2 style="margin: 0 0 12px; color: #111827;">Portfolio Admin Verification</h2>
            <p style="margin: 0 0 16px; color: #4b5563;">Use this one-time code to sign in to your admin panel.</p>
            <div style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #111827; margin: 16px 0;">
              ${code}
            </div>
            <p style="margin: 0; color: #6b7280;">This code expires in 10 minutes.</p>
          </div>
        </div>
      `,
      text: `Your portfolio admin verification code is ${code}. It expires in 10 minutes.`,
    })

    const cookieStore = await cookies()
    cookieStore.set(adminOtpCookieName, cookieValue, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: maxAgeSeconds,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Admin OTP request failed:", error)

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to send verification code." },
      { status: 500 }
    )
  }
}
