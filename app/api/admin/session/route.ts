import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

import { adminSessionCookieName, verifyAdminSession } from "@/lib/admin/session"
import { verifyFirebaseAdminToken } from "@/lib/firebase/admin-auth"

function getBearerToken(request: NextRequest) {
  const header = request.headers.get("authorization")

  if (!header?.startsWith("Bearer ")) {
    return null
  }

  return header.slice("Bearer ".length).trim()
}

export async function GET(request: NextRequest) {
  const idToken = getBearerToken(request)

  if (!idToken) {
    return NextResponse.json({ authorized: false }, { status: 401 })
  }

  const adminUser = await verifyFirebaseAdminToken(idToken)

  if (!adminUser) {
    return NextResponse.json({ authorized: false }, { status: 403 })
  }

  const cookieStore = await cookies()
  const authorized = verifyAdminSession(cookieStore.get(adminSessionCookieName)?.value, adminUser.email)

  return NextResponse.json({ authorized })
}
