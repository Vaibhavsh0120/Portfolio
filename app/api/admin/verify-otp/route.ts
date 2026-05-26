import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

import { adminEmails } from "@/lib/admin/config"
import { adminOtpCookieName, verifyOtpChallenge } from "@/lib/admin/session"
import { getFirebaseAdminAuth } from "@/lib/firebase/admin-server"

export async function POST(request: NextRequest) {
  try {
    const adminEmail = adminEmails[0]

    if (!adminEmail) {
      return NextResponse.json({ error: "No admin email is configured for OTP login." }, { status: 500 })
    }

    const body = (await request.json().catch(() => null)) as { code?: string } | null
    const code = body?.code?.trim()

    if (!code) {
      return NextResponse.json({ error: "A verification code is required." }, { status: 400 })
    }

    const cookieStore = await cookies()
    const result = verifyOtpChallenge(cookieStore.get(adminOtpCookieName)?.value, adminEmail, code)

    if (!result.ok) {
      return NextResponse.json({ error: result.reason }, { status: 400 })
    }

    cookieStore.delete(adminOtpCookieName)

    const adminUser = await getFirebaseAdminAuth().getUserByEmail(adminEmail)
    const customToken = await getFirebaseAdminAuth().createCustomToken(adminUser.uid, {
      email: adminEmail,
      role: "admin",
    })

    return NextResponse.json({ success: true, customToken })
  } catch (error) {
    console.error("Admin OTP verification failed:", error)

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to verify code." },
      { status: 500 }
    )
  }
}
