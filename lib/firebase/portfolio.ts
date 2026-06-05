import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore"
import { getClientAuth, getClientDb } from "@/lib/firebase/client"

import { emptyPortfolioContent, emptyResumeVersions } from "@/lib/portfolio/empty-content"
import { PortfolioBundle, PortfolioContent, ResumeVersion } from "@/lib/portfolio/types"

function getPortfolioDocRef() {
  return doc(getClientDb(), "siteContent", "portfolio")
}

function getResumesCollectionRef() {
  return collection(getClientDb(), "resumeVersions")
}

function normalizePortfolioContent(data: Partial<PortfolioContent> | undefined): PortfolioContent {
  return {
    ...emptyPortfolioContent,
    ...data,
    hero: { ...emptyPortfolioContent.hero, ...data?.hero },
    about: {
      ...emptyPortfolioContent.about,
      ...data?.about,
      traits: data?.about?.traits ?? emptyPortfolioContent.about.traits,
      skills: data?.about?.skills ?? emptyPortfolioContent.about.skills,
    },
    experience: {
      ...emptyPortfolioContent.experience,
      ...data?.experience,
      items: data?.experience?.items ?? emptyPortfolioContent.experience.items,
    },
    projects: {
      ...emptyPortfolioContent.projects,
      ...data?.projects,
      items: data?.projects?.items ?? emptyPortfolioContent.projects.items,
    },
    contact: {
      ...emptyPortfolioContent.contact,
      ...data?.contact,
      details: data?.contact?.details ?? emptyPortfolioContent.contact.details,
    },
    footer: { ...emptyPortfolioContent.footer, ...data?.footer },
  }
}

function normalizeResumeVersion(data: Partial<ResumeVersion>, id?: string): ResumeVersion {
  return {
    label: "",
    fileName: "",
    downloadUrl: "",
    storagePath: "",
    isCurrent: false,
    createdAtMs: 0,
    note: "",
    ...data,
    id,
  }
}

export async function loadPortfolioBundle(): Promise<PortfolioBundle> {
  const portfolioDocRef = getPortfolioDocRef()
  const resumesCollectionRef = getResumesCollectionRef()
  const [contentSnapshot, resumesSnapshot] = await Promise.all([
    getDoc(portfolioDocRef),
    getDocs(query(resumesCollectionRef, orderBy("createdAtMs", "desc"))),
  ])

  const content = normalizePortfolioContent(
    contentSnapshot.exists() ? (contentSnapshot.data() as PortfolioContent) : undefined
  )

  const resumes = resumesSnapshot.empty
    ? emptyResumeVersions
    : resumesSnapshot.docs.map((resumeDoc) =>
        normalizeResumeVersion(resumeDoc.data() as ResumeVersion, resumeDoc.id)
      )

  return {
    content,
    resumes,
    meta: {
      contentSource: contentSnapshot.exists() ? "firestore" : "local-default",
      resumeSource: resumesSnapshot.empty ? "local-default" : "firestore",
    },
  }
}

export async function savePortfolioContent(content: PortfolioContent) {
  await setDoc(
    getPortfolioDocRef(),
    {
      ...content,
      updatedAtMs: Date.now(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )
}

export async function uploadPortfolioFile(file: File, storagePath: string) {
  const currentUser = getClientAuth().currentUser

  if (!currentUser) {
    throw new Error("You must be signed in as an admin before uploading files.")
  }

  const idToken = await currentUser.getIdToken()
  const formData = new FormData()
  formData.append("file", file)
  formData.append("assetPath", storagePath)

  const response = await fetch("/api/admin/upload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
    body: formData,
  })

  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as { error?: string } | null
    throw new Error(error?.error ?? "Cloudinary upload failed.")
  }

  const payload = (await response.json()) as {
    downloadUrl: string
    storagePath: string
  }

  return {
    downloadUrl: payload.downloadUrl,
    storagePath: payload.storagePath,
  }
}

export async function createResumeVersion(input: Omit<ResumeVersion, "id">) {
  const db = getClientDb()
  const resumesCollectionRef = getResumesCollectionRef()
  const snapshot = await getDocs(resumesCollectionRef)
  const batch = writeBatch(db)

  snapshot.docs.forEach((resumeDoc) => {
    if (resumeDoc.data().isCurrent) {
      batch.update(resumeDoc.ref, { isCurrent: false })
    }
  })

  const newDocRef = doc(resumesCollectionRef)
  batch.set(newDocRef, {
    ...input,
    createdAtMs: input.createdAtMs,
    createdAt: serverTimestamp(),
  })

  await batch.commit()

  return newDocRef.id
}

export async function setCurrentResume(resumeId: string) {
  const db = getClientDb()
  const resumesCollectionRef = getResumesCollectionRef()
  const snapshot = await getDocs(resumesCollectionRef)
  const batch = writeBatch(db)

  snapshot.docs.forEach((resumeDoc) => {
    batch.update(resumeDoc.ref, { isCurrent: resumeDoc.id === resumeId })
  })

  await batch.commit()
}

export async function updateResumeVersion(resumeId: string, data: Partial<ResumeVersion>) {
  await updateDoc(doc(getClientDb(), "resumeVersions", resumeId), data)
}
