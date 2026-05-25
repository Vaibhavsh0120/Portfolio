import { NextRequest, NextResponse } from "next/server"

import { uploadAssetToCloudinary } from "@/lib/cloudinary/server"
import { verifyFirebaseAdminToken } from "@/lib/firebase/admin-auth"

function getBearerToken(request: NextRequest) {
  const header = request.headers.get("authorization")

  if (!header?.startsWith("Bearer ")) {
    return null
  }

  return header.slice("Bearer ".length).trim()
}

export async function POST(request: NextRequest) {
  try {
    const idToken = getBearerToken(request)

    if (!idToken) {
      return NextResponse.json({ error: "Missing admin token." }, { status: 401 })
    }

    const adminUser = await verifyFirebaseAdminToken(idToken)

    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized upload request." }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get("file")
    const assetPath = formData.get("assetPath")

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "A file is required." }, { status: 400 })
    }

    if (typeof assetPath !== "string" || assetPath.trim() === "") {
      return NextResponse.json({ error: "An assetPath is required." }, { status: 400 })
    }

    const uploaded = await uploadAssetToCloudinary(file, assetPath)

    return NextResponse.json({
      ...uploaded,
      uploadedBy: adminUser.email,
    })
  } catch (error) {
    console.error("Cloudinary admin upload failed:", error)

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed." },
      { status: 500 }
    )
  }
}
