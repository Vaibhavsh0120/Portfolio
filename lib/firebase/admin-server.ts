import { readFileSync, readdirSync } from "fs"
import { join } from "path"

import { cert, getApps, initializeApp } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"

type ServiceAccountShape = {
  project_id: string
  client_email: string
  private_key: string
}

function getServiceAccountFromEnv() {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n")

  if (!projectId || !clientEmail || !privateKey) {
    return null
  }

  return { projectId, clientEmail, privateKey }
}

function getServiceAccountFromFile() {
  const explicitPath = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_PATH
  const discoveredPath =
    explicitPath ||
    readdirSync(process.cwd()).find((fileName) => /firebase-adminsdk-.*\.json$/i.test(fileName))

  if (!discoveredPath) {
    return null
  }

  const filePath = explicitPath ? explicitPath : join(process.cwd(), discoveredPath)
  const parsed = JSON.parse(readFileSync(filePath, "utf8")) as ServiceAccountShape

  if (!parsed.project_id || !parsed.client_email || !parsed.private_key) {
    throw new Error("Firebase admin service account file is missing required fields.")
  }

  return {
    projectId: parsed.project_id,
    clientEmail: parsed.client_email,
    privateKey: parsed.private_key,
  }
}

function getAdminApp() {
  return (
    getApps()[0] ||
    initializeApp({
      credential: cert(
        getServiceAccountFromEnv() ??
          getServiceAccountFromFile() ??
          (() => {
            throw new Error(
              "Missing Firebase admin credentials. Set FIREBASE_ADMIN_PROJECT_ID/FIREBASE_ADMIN_CLIENT_EMAIL/FIREBASE_ADMIN_PRIVATE_KEY or provide a local firebase-adminsdk JSON file."
            )
          })()
      ),
    })
  )
}

export function getFirebaseAdminAuth() {
  return getAuth(getAdminApp())
}
