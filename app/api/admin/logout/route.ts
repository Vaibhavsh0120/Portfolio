import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { adminOtpCookieName } from "@/lib/admin/session"

export async function POST() {
  const cookieStore = await cookies()
  cookieStore.delete(adminOtpCookieName)

  return NextResponse.json({ success: true })
}
