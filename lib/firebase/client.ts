import { getApp, getApps, initializeApp } from "firebase/app"
import type { FirebaseApp, FirebaseOptions } from "firebase/app"
import { getAuth } from "firebase/auth"
import type { Auth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import type { Firestore } from "firebase/firestore"

import { adminEmails, isAuthorizedAdminEmail } from "@/lib/admin/config"

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

const requiredFirebaseEnv = [
  ["NEXT_PUBLIC_FIREBASE_API_KEY", firebaseConfig.apiKey],
  ["NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", firebaseConfig.authDomain],
  ["NEXT_PUBLIC_FIREBASE_PROJECT_ID", firebaseConfig.projectId],
  ["NEXT_PUBLIC_FIREBASE_APP_ID", firebaseConfig.appId],
] as const

let cachedApp: FirebaseApp | null = null
let cachedAuth: Auth | null = null
let cachedDb: Firestore | null = null

function assertFirebaseClientConfig() {
  const missing = requiredFirebaseEnv.filter(([, value]) => !value).map(([name]) => name)

  if (missing.length > 0) {
    throw new Error(`Firebase client config is missing: ${missing.join(", ")}.`)
  }
}

export function getFirebaseClientApp() {
  assertFirebaseClientConfig()

  if (cachedApp) {
    return cachedApp
  }

  cachedApp = getApps().length ? getApp() : initializeApp(firebaseConfig)
  return cachedApp
}

export function getClientAuth() {
  if (!cachedAuth) {
    cachedAuth = getAuth(getFirebaseClientApp())
  }

  return cachedAuth
}

export function getClientDb() {
  if (!cachedDb) {
    cachedDb = getFirestore(getFirebaseClientApp())
  }

  return cachedDb
}

export { adminEmails, isAuthorizedAdminEmail }
