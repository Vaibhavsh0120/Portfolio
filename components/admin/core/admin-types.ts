"use client"

import type { Dispatch, SetStateAction } from "react"
import type { User } from "firebase/auth"

import type { PortfolioBundleMeta, PortfolioContent, ResumeVersion } from "@/lib/cms/types"

export type StatusState = {
  type: "idle" | "success" | "error" | "info"
  message: string
}

export type PendingUpload = {
  file: File
  previewUrl: string
  storagePath: string
  type: "about" | "project"
  projectIndex?: number
}

export type AdminCmsController = {
  mounted: boolean
  user: User | null
  authReady: boolean
  loadingBundle: boolean
  saving: boolean
  requestingOtp: boolean
  verifyingOtp: boolean
  otpRequested: boolean
  otpCode: string
  setOtpCode: Dispatch<SetStateAction<string>>
  status: StatusState
  content: PortfolioContent
  setContent: Dispatch<SetStateAction<PortfolioContent>>
  resumes: ResumeVersion[]
  bundleMeta: PortfolioBundleMeta
  loginEmail: string
  setLoginEmail: Dispatch<SetStateAction<string>>
  loginPassword: string
  setLoginPassword: Dispatch<SetStateAction<string>>
  resumeLabel: string
  setResumeLabel: Dispatch<SetStateAction<string>>
  resumeNote: string
  setResumeNote: Dispatch<SetStateAction<string>>
  resumeFile: File | null
  setResumeFile: Dispatch<SetStateAction<File | null>>
  loaderColor: string
  hasUnsavedChanges: boolean
  savedContentFingerprint: string
  pendingUploads: PendingUpload[]
  clearStatus: () => void
  refreshBundle: (options?: { announce?: boolean }) => Promise<unknown>
  handleEmailSignIn: () => Promise<void>
  handleRequestOtp: () => Promise<void>
  handleVerifyOtp: () => Promise<void>
  handleLogout: () => Promise<void>
  handleSaveContent: () => Promise<void>
  handleCancelChanges: () => void
  handleStageAboutImage: (file: File) => void
  handleStageProjectImage: (projectIndex: number, file: File) => void
  handleCommitStagedImage: (file: File, previewUrl: string) => void
  handleCancelStaging: () => void
  handleResumeUpload: () => Promise<void>
  handleMakeCurrentResume: (resumeId: string) => Promise<void>
  croppingImage: {
    file: File
    aspect?: number
    onComplete: (file: File, previewUrl: string) => void
  } | null
}
