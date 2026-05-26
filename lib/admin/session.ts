import { createHash, createHmac, randomInt, timingSafeEqual } from "crypto"

const otpCookieName = "admin_otp"
const sessionCookieName = "admin_session"
const otpMaxAgeSeconds = 10 * 60
const sessionMaxAgeSeconds = 12 * 60 * 60

type OtpPayload = {
  codeHash: string
  email: string
  expiresAt: number
}

type SessionPayload = {
  email: string
  expiresAt: number
}

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET ?? process.env.EMAIL_APP_PASSWORD ?? process.env.NEXT_PUBLIC_FIREBASE_API_KEY
}

function encodeBase64Url(value: string) {
  return Buffer.from(value, "utf8").toString("base64url")
}

function decodeBase64Url<T>(value: string) {
  return JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as T
}

function signValue(value: string) {
  const secret = getSessionSecret()

  if (!secret) {
    throw new Error("Missing ADMIN_SESSION_SECRET or fallback mail secret.")
  }

  return createHmac("sha256", secret).update(value).digest("base64url")
}

function sealPayload(payload: OtpPayload | SessionPayload) {
  const encoded = encodeBase64Url(JSON.stringify(payload))
  return `${encoded}.${signValue(encoded)}`
}

function unsealPayload<T>(sealed: string | undefined) {
  if (!sealed) {
    return null
  }

  const [encoded, signature] = sealed.split(".")

  if (!encoded || !signature) {
    return null
  }

  const expectedSignature = signValue(encoded)
  const actual = Buffer.from(signature)
  const expected = Buffer.from(expectedSignature)

  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    return null
  }

  return decodeBase64Url<T>(encoded)
}

function hashOtpCode(code: string) {
  return createHash("sha256").update(code).digest("hex")
}

export function createOtpChallenge(email: string) {
  const code = `${randomInt(0, 1_000_000)}`.padStart(6, "0")
  const payload: OtpPayload = {
    email: email.trim().toLowerCase(),
    codeHash: hashOtpCode(code),
    expiresAt: Date.now() + otpMaxAgeSeconds * 1000,
  }

  return {
    code,
    cookieValue: sealPayload(payload),
    maxAgeSeconds: otpMaxAgeSeconds,
  }
}

export function verifyOtpChallenge(sealed: string | undefined, email: string, code: string) {
  const payload = unsealPayload<OtpPayload>(sealed)

  if (!payload) {
    return { ok: false as const, reason: "Missing or invalid OTP challenge." }
  }

  if (payload.expiresAt < Date.now()) {
    return { ok: false as const, reason: "The verification code has expired. Request a new one." }
  }

  if (payload.email !== email.trim().toLowerCase()) {
    return { ok: false as const, reason: "The verification code does not match this account." }
  }

  if (payload.codeHash !== hashOtpCode(code.trim())) {
    return { ok: false as const, reason: "The verification code is incorrect." }
  }

  return { ok: true as const }
}

export function createAdminSession(email: string) {
  const payload: SessionPayload = {
    email: email.trim().toLowerCase(),
    expiresAt: Date.now() + sessionMaxAgeSeconds * 1000,
  }

  return {
    cookieValue: sealPayload(payload),
    maxAgeSeconds: sessionMaxAgeSeconds,
  }
}

export function verifyAdminSession(sealed: string | undefined, email: string) {
  const payload = unsealPayload<SessionPayload>(sealed)

  if (!payload) {
    return false
  }

  return payload.expiresAt >= Date.now() && payload.email === email.trim().toLowerCase()
}

export const adminOtpCookieName = otpCookieName
export const adminSessionCookieName = sessionCookieName
