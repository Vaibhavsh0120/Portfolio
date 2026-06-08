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

import type { AdminCmsController, PendingUpload, StatusState } from "@/components/admin/core/admin-types"
import {
  createResumeVersion,
  loadPortfolioBundle,
  savePortfolioContent,
  setCurrentResume,
  uploadPortfolioFile,
} from "@/lib/firebase/portfolio"
import { adminEmails, getClientAuth, isAuthorizedAdminEmail } from "@/lib/firebase/client"
import { getFileExtension, slugify, updateAt } from "@/lib/cms/cms-utils"
import { emptyPortfolioContent } from "@/lib/cms/empty-content"
import type { PortfolioBundle, PortfolioBundleMeta, PortfolioContent, ResumeVersion } from "@/lib/cms/types"

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
  
  // Staging state
  const [pendingUploads, setPendingUploads] = useState<PendingUpload[]>([])
  const [croppingImage, setCroppingImage] = useState<AdminCmsController["croppingImage"]>(null)

  const isDark = resolvedTheme === "dark"
  const loaderColor = isDark ? "#f5f5f5" : "#171717"
  const contentFingerprint = JSON.stringify(content)
  const hasUnsavedChanges = contentFingerprint !== savedContentFingerprint || pendingUploads.length > 0

  function clearStatus() {
    setStatus({ type: "idle", message: "" })
  }

  useEffect(() => {
    setMounted(true)
  }, [])

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
        // Load bundle silently on mount/login
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
    clearStatus()

    try {
      await signInWithEmailAndPassword(getClientAuth(), loginEmail.trim(), loginPassword)
      // Success will be handled by onAuthStateChanged listener silently
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
    clearStatus()
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
    clearStatus()
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
      // Success will be handled by onAuthStateChanged listener silently
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
    clearStatus()
  }

  async function handleSaveContent() {
    setSaving(true)
    clearStatus()

    try {
      const finalContent = { ...content }

      // 1. Upload pending images first if any
      if (pendingUploads.length > 0) {
        setStatus({ type: "info", message: `Uploading ${pendingUploads.length} images...` })
        
        for (const pending of pendingUploads) {
          const uploaded = await uploadPortfolioFile(pending.file, pending.storagePath)
          
          if (pending.type === "about") {
            finalContent.about.imageUrl = uploaded.downloadUrl
            finalContent.about.imagePath = uploaded.storagePath
          } else if (pending.type === "project" && pending.projectIndex !== undefined) {
            finalContent.projects.items[pending.projectIndex].image = uploaded.downloadUrl
            finalContent.projects.items[pending.projectIndex].imagePath = uploaded.storagePath
          }
        }
      }

      const savedAtMs = Date.now()
      finalContent.updatedAtMs = savedAtMs
      
      await savePortfolioContent(finalContent)
      
      setContent(finalContent)
      setSavedContentFingerprint(JSON.stringify(finalContent))
      setPendingUploads([]) // Clear pending uploads
      
      setStatus({
        type: "success",
        message: "Portfolio content and images saved successfully.",
      })
    } catch (error) {
      console.error(error)
      setStatus({
        type: "error",
        message: "Failed to save the portfolio content or upload images.",
      })
    } finally {
      setSaving(false)
    }
  }

  function handleCancelChanges() {
    setContent(JSON.parse(savedContentFingerprint))
    setPendingUploads([])
    setStatus({ type: "info", message: "Unsaved changes discarded." })
  }

  function handleStageAboutImage(file: File) {
    const extension = getFileExtension(file.name) || ".png"
    const storagePath = `portfolio/images/profile/about-${Date.now()}${extension}`
    
    setCroppingImage({
      file,
      onComplete: (croppedFile, previewUrl) => {
        setPendingUploads(prev => [
          ...prev.filter(p => p.type !== "about"),
          { file: croppedFile, previewUrl, storagePath, type: "about" }
        ])
        setContent(prev => ({
          ...prev,
          about: { ...prev.about, imageUrl: previewUrl }
        }))
        setCroppingImage(null)
      }
    })
  }

  function handleStageProjectImage(projectIndex: number, file: File) {
    const project = content.projects.items[projectIndex]
    const extension = getFileExtension(file.name) || ".png"
    const storagePath = `portfolio/images/projects/${slugify(project.title || `project-${projectIndex + 1}`)}-${Date.now()}${extension}`
    
    setCroppingImage({
      file,
      aspect: 3 / 2, // Project aspect
      onComplete: (croppedFile, previewUrl) => {
        setPendingUploads(prev => [
          ...prev.filter(p => !(p.type === "project" && p.projectIndex === projectIndex)),
          { file: croppedFile, previewUrl, storagePath, type: "project", projectIndex }
        ])
        setContent(prev => ({
          ...prev,
          projects: {
            ...prev.projects,
            items: updateAt(prev.projects.items, projectIndex, (item) => ({ ...item, image: previewUrl }))
          }
        }))
        setCroppingImage(null)
      }
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function handleCommitStagedImage(_file: File, _previewUrl: string) {
    // This is handled via croppingImage.onComplete
  }

  function handleCancelStaging() {
    setCroppingImage(null)
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
    savedContentFingerprint,
    pendingUploads,
    croppingImage,
    clearStatus,
    refreshBundle,
    handleEmailSignIn,
    handleRequestOtp,
    handleVerifyOtp,
    handleLogout,
    handleSaveContent,
    handleCancelChanges,
    handleStageAboutImage,
    handleStageProjectImage,
    handleCommitStagedImage,
    handleCancelStaging,
    handleResumeUpload,
    handleMakeCurrentResume,
  }
}
