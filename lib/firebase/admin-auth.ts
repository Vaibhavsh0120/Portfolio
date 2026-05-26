import { isAuthorizedAdminEmail } from "@/lib/admin/config"
import { getFirebaseAdminAuth } from "@/lib/firebase/admin-server"

export interface VerifiedAdminUser {
  email: string
  uid: string
}

export async function verifyFirebaseAdminToken(idToken: string): Promise<VerifiedAdminUser | null> {
  if (!idToken) {
    return null
  }

  try {
    const decodedToken = await getFirebaseAdminAuth().verifyIdToken(idToken)
    const email = decodedToken.email?.toLowerCase()

    if (!decodedToken.uid || !email || !isAuthorizedAdminEmail(email)) {
      return null
    }

    return {
      uid: decodedToken.uid,
      email,
    }
  } catch {
    return null
  }
}
