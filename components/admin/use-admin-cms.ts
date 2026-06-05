"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import {
  onAuthStateChanged,
  signInWithCustomToken,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth"

import type { AdminCmsController, StatusState } from "@/components/admin/admin-types"
import {
  createResumeVersion,
  loadPortfolioBundle,
  savePortfolioContent,
  setCurrentResume,
  uploadPortfolioFile,
} from "@/lib/firebase/portfolio"
import { adminEmails, getClientAuth, isAuthorizedAdminEmail } from "@/lib/firebase/client"
import { getFileExtension, slugify, updateAt } from "@/lib/admin/cms-utils"
import { emptyPortfolioContent } from "@/lib/portfolio/empty-content"
import type { PortfolioBundle, PortfolioBundleMeta, PortfolioContent, ResumeVersion } from "@/lib/portfolio/types"

const defaultBundleMeta: PortfolioBundleMeta = {
  contentSource: "local-default",
  resumeSource: "local-default",
}

export function useAdminCms(): AdminCmsController {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()
  const [user, setUser] = useState<User | null>(null)
  const [authReady, setAuthReady] = useState(false)
  const [loadingBundle, setLoadingBundle] = useState(false)
  const [saving, setSaving] = useState(false)
  const [requestingOtp, setRequestingOtp] = useState(false)
  const [verifyingOtp, setVerifyingOtp] = useState(false)
  const [otpRequested, setOtpRequested] = useState(false)
  const [otpCode, setOtpCode] = useState("")
  const [status, setStatus] = useState<StatusState>({ type: "idle", message: "" })
  const [content, setContent] = useState<PortfolioContent>(emptyPortfolioContent)
  const [savedContentFingerprint, setSavedContentFingerprint] = useState(() => JSON.stringify(emptyPortfolioContent))
  const [resumes, setResumes] = useState<ResumeVersion[]>([])
  const [bundleMeta, setBundleMeta] = useState<PortfolioBundleMeta>(defaultBundleMeta)
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [resumeLabel, setResumeLabel] = useState("Updated Resume")
  const [resumeNote, setResumeNote] = useState("")
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const isDark = resolvedTheme === "dark"
  const loaderColor = isDark ? "#f5f5f5" : "#171717"
  const contentFingerprint = JSON.stringify(content)
  const hasUnsavedChanges = contentFingerprint !== savedContentFingerprint

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (status.message && !user) {
      const timer = setTimeout(() => {
        setStatus({ type: "idle", message: "" })
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [status, user])

  useEffect(() => {
    if (!hasUnsavedChanges) {
      return
    }

    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ""
    }

    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [hasUnsavedChanges])

  async function refreshBundle(options: { announce?: boolean } = {}): Promise<PortfolioBundle | null> {
    setLoadingBundle(true)

    try {
      const bundle = await loadPortfolioBundle()
      setContent(bundle.content)
      setSavedContentFingerprint(JSON.stringify(bundle.content))
      setResumes(bundle.resumes)
      setBundleMeta(bundle.meta)

      if (options.announce) {
        setStatus({ type: "success", message: "CMS data refreshed from Firebase." })
      }

      return bundle
    } catch (error) {
      console.error(error)
      setStatus({
        type: "error",
        message: "Failed to load CMS data from Firebase. Check your Firebase setup and rules.",
      })
      return null
    } finally {
      setLoadingBundle(false)
    }
  }

  useEffect(() => {
    let unsubscribe: () => void = () => undefined

    try {
      const auth = getClientAuth()

      unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
        setAuthReady(true)

        if (!nextUser) {
          setUser(null)
          return
        }

        if (!isAuthorizedAdminEmail(nextUser.email)) {
          await signOut(auth)
          setStatus({
            type: "error",
            message: `The account ${nextUser.email ?? "unknown"} is not allowed to access this CMS.`,
          })
          setUser(null)
          return
        }

        setUser(nextUser)
        await refreshBundle()
      })
    } catch (error) {
      console.error(error)
      setAuthReady(true)
      setUser(null)
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Firebase client configuration is missing. Add the NEXT_PUBLIC_FIREBASE_* env vars.",
      })
    }

    return () => unsubscribe()
  }, [])

  async function handleEmailSignIn() {
    setStatus({ type: "idle", message: "" })

    try {
      await signInWithEmailAndPassword(getClientAuth(), loginEmail.trim(), loginPassword)
    } catch (error) {
      console.error(error)
      setStatus({
        type: "error",
        message:
          error instanceof Error && error.message.includes("Firebase client config")
            ? error.message
            : "Email login failed. Make sure the email/password account already exists in Firebase Authentication.",
      })
    }
  }

  async function handleRequestOtp() {
    setStatus({ type: "idle", message: "" })
    setRequestingOtp(true)

    try {
      const response = await fetch("/api/admin/request-otp", { method: "POST" })
      const payload = (await response.json().catch(() => null)) as { error?: string } | null

      if (!response.ok) {
        throw new Error(payload?.error ?? "Failed to send verification code.")
      }

      setOtpRequested(true)
      setStatus({
        type: "success",
        message: `A verification code was sent to ${adminEmails[0] ?? "your admin email"}.`,
      })
    } catch (error) {
      console.error(error)
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to send verification code.",
      })
    } finally {
      setRequestingOtp(false)
    }
  }

  async function handleVerifyOtp() {
    setStatus({ type: "idle", message: "" })
    setVerifyingOtp(true)

    try {
      const response = await fetch("/api/admin/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: otpCode }),
      })

      const payload = (await response.json().catch(() => null)) as { error?: string; customToken?: string } | null

      if (!response.ok) {
        throw new Error(payload?.error ?? "Failed to verify code.")
      }

      if (!payload?.customToken) {
        throw new Error("No admin login token was returned.")
      }

      await signInWithCustomToken(getClientAuth(), payload.customToken)
      setOtpRequested(false)
      setOtpCode("")
      setStatus({
        type: "success",
        message: "Verification complete. Admin access granted.",
      })
    } catch (error) {
      console.error(error)
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to verify code.",
      })
    } finally {
      setVerifyingOtp(false)
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => null)

    try {
      await signOut(getClientAuth())
    } catch (error) {
      console.error(error)
    }

    setOtpRequested(false)
    setOtpCode("")
    setStatus({ type: "info", message: "Signed out from the admin panel." })
  }

  async function handleSaveContent() {
    setSaving(true)
    setStatus({ type: "idle", message: "" })

    try {
      const savedAtMs = Date.now()
      const nextContent = { ...content, updatedAtMs: savedAtMs }
      await savePortfolioContent(nextContent)
      setContent(nextContent)
      setSavedContentFingerprint(JSON.stringify(nextContent))
      setStatus({
        type: "success",
        message: "Portfolio content saved to Firestore.",
      })
    } catch (error) {
      console.error(error)
      setStatus({
        type: "error",
        message: "Failed to save the portfolio content to Firestore.",
      })
    } finally {
      setSaving(false)
    }
  }

  async function handleUploadAboutImage(file: File) {
    const extension = getFileExtension(file.name) || ".png"
    const storagePath = `portfolio/images/profile/about-${Date.now()}${extension}`

    try {
      const uploaded = await uploadPortfolioFile(file, storagePath)
      const nextContent = {
        ...content,
        about: {
          ...content.about,
          imageUrl: uploaded.downloadUrl,
          imagePath: uploaded.storagePath,
        },
      }

      setContent(nextContent)
      await savePortfolioContent(nextContent)
      setSavedContentFingerprint(JSON.stringify(nextContent))
      setStatus({
        type: "success",
        message: "About image uploaded to Cloudinary and saved.",
      })
    } catch (error) {
      console.error(error)
      setStatus({
        type: "error",
        message: "Failed to upload the about image.",
      })
    }
  }

  async function handleUploadProjectImage(projectIndex: number, file: File) {
    const project = content.projects.items[projectIndex]
    const extension = getFileExtension(file.name) || ".png"
    const storagePath = `portfolio/images/projects/${slugify(project.title || `project-${projectIndex + 1}`)}-${Date.now()}${extension}`

    try {
      const uploaded = await uploadPortfolioFile(file, storagePath)
      const nextProjects = updateAt(content.projects.items, projectIndex, (item) => ({
        ...item,
        image: uploaded.downloadUrl,
        imagePath: uploaded.storagePath,
      }))

      const nextContent = {
        ...content,
        projects: {
          ...content.projects,
          items: nextProjects,
        },
      }

      setContent(nextContent)
      await savePortfolioContent(nextContent)
      setSavedContentFingerprint(JSON.stringify(nextContent))
      setStatus({
        type: "success",
        message: `Project image for "${project.title}" uploaded successfully.`,
      })
    } catch (error) {
      console.error(error)
      setStatus({
        type: "error",
        message: `Failed to upload the image for "${project.title}".`,
      })
    }
  }

  async function handleResumeUpload() {
    if (!resumeFile) {
      setStatus({
        type: "error",
        message: "Choose a resume PDF before uploading.",
      })
      return
    }

    setSaving(true)
    setStatus({ type: "idle", message: "" })

    try {
      const extension = getFileExtension(resumeFile.name) || ".pdf"
      const storagePath = `portfolio/resumes/${Date.now()}-${slugify(resumeLabel || resumeFile.name)}${extension}`
      const uploaded = await uploadPortfolioFile(resumeFile, storagePath)

      await createResumeVersion({
        label: resumeLabel || resumeFile.name,
        fileName: resumeFile.name,
        downloadUrl: uploaded.downloadUrl,
        storagePath: uploaded.storagePath,
        isCurrent: true,
        createdAtMs: Date.now(),
        note: resumeNote || "Uploaded from the admin CMS.",
      })

      setResumeFile(null)
      setResumeNote("")
      setResumeLabel("Updated Resume")
      await refreshBundle()
      setStatus({
        type: "success",
        message: "New resume uploaded. Previous versions are still preserved.",
      })
    } catch (error) {
      console.error(error)
      setStatus({
        type: "error",
        message: "Failed to upload the resume PDF.",
      })
    } finally {
      setSaving(false)
    }
  }

  async function handleMakeCurrentResume(resumeId: string) {
    setSaving(true)
    setStatus({ type: "idle", message: "" })

    try {
      await setCurrentResume(resumeId)
      await refreshBundle()
      setStatus({
        type: "success",
        message: "Current resume updated.",
      })
    } catch (error) {
      console.error(error)
      setStatus({
        type: "error",
        message: "Failed to update the current resume.",
      })
    } finally {
      setSaving(false)
    }
  }

  return {
    mounted,
    user,
    authReady,
    loadingBundle,
    saving,
    requestingOtp,
    verifyingOtp,
    otpRequested,
    otpCode,
    setOtpCode,
    status,
    content,
    setContent,
    resumes,
    bundleMeta,
    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    resumeLabel,
    setResumeLabel,
    resumeNote,
    setResumeNote,
    resumeFile,
    setResumeFile,
    loaderColor,
    hasUnsavedChanges,
    refreshBundle,
    handleEmailSignIn,
    handleRequestOtp,
    handleVerifyOtp,
    handleLogout,
    handleSaveContent,
    handleUploadAboutImage,
    handleUploadProjectImage,
    handleResumeUpload,
    handleMakeCurrentResume,
  }
}
