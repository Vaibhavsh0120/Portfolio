export interface VerifiedAdminUser {
  email: string
  uid: string
}

const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "vaibhavsh0120@gmail.com")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean)

export async function verifyFirebaseAdminToken(idToken: string): Promise<VerifiedAdminUser | null> {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY

  if (!apiKey || !idToken) {
    return null
  }

  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idToken }),
    cache: "no-store",
  })

  if (!response.ok) {
    return null
  }

  const data = (await response.json()) as {
    users?: Array<{
      localId?: string
      email?: string
    }>
  }

  const user = data.users?.[0]
  const email = user?.email?.toLowerCase()

  if (!user?.localId || !email || !adminEmails.includes(email)) {
    return null
  }

  return {
    uid: user.localId,
    email,
  }
}
