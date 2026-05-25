import { createHash } from "crypto"

type CloudinarySignatureAlgorithm = "sha1" | "sha256"

function requireEnv(name: string) {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

function splitAssetPath(assetPath: string) {
  const normalizedPath = assetPath.replace(/^\/+/, "")
  const lastSlash = normalizedPath.lastIndexOf("/")
  const folder = lastSlash >= 0 ? normalizedPath.slice(0, lastSlash) : ""
  const fileName = lastSlash >= 0 ? normalizedPath.slice(lastSlash + 1) : normalizedPath
  const lastDot = fileName.lastIndexOf(".")
  const publicId = lastDot >= 0 ? fileName.slice(0, lastDot) : fileName

  return {
    folder,
    publicId,
  }
}

function signCloudinaryParams(params: Record<string, string>, algorithm: CloudinarySignatureAlgorithm) {
  const apiSecret = requireEnv("CLOUDINARY_API_SECRET")

  const payload = Object.entries(params)
    .filter(([, value]) => value !== "")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&")

  return createHash(algorithm)
    .update(`${payload}${apiSecret}`)
    .digest("hex")
}

async function uploadWithSignature(
  file: File,
  cloudName: string,
  apiKey: string,
  signedParams: Record<string, string>,
  algorithm: CloudinarySignatureAlgorithm
) {
  const signature = signCloudinaryParams(signedParams, algorithm)
  const formData = new FormData()

  formData.append("file", file)
  formData.append("api_key", apiKey)
  formData.append("timestamp", signedParams.timestamp)
  formData.append("signature", signature)

  if (signedParams.folder) {
    formData.append("folder", signedParams.folder)
  }

  if (signedParams.public_id) {
    formData.append("public_id", signedParams.public_id)
  }

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: "POST",
    body: formData,
  })

  return response
}

export async function uploadAssetToCloudinary(file: File, assetPath: string) {
  const cloudName = requireEnv("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME")
  const apiKey = requireEnv("CLOUDINARY_API_KEY")
  const timestamp = Math.floor(Date.now() / 1000).toString()
  const { folder, publicId } = splitAssetPath(assetPath)

  const signedParams = {
    folder,
    public_id: publicId,
    timestamp,
  }

  let response = await uploadWithSignature(file, cloudName, apiKey, signedParams, "sha256")

  if (!response.ok) {
    const errorBody = await response.text()

    if (response.status === 401 && errorBody.includes("Invalid Signature")) {
      response = await uploadWithSignature(file, cloudName, apiKey, signedParams, "sha1")
    } else {
      throw new Error(`Cloudinary upload failed: ${response.status} ${errorBody}`)
    }
  }

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Cloudinary upload failed: ${response.status} ${errorBody}`)
  }

  const result = (await response.json()) as {
    public_id: string
    secure_url: string
    resource_type: string
    format?: string
  }

  return {
    downloadUrl: result.secure_url,
    storagePath: result.public_id,
    resourceType: result.resource_type,
    format: result.format ?? "",
  }
}
