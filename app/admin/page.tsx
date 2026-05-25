"use client"

import { useEffect, useState } from "react"

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth"
import { ArrowUpRight, FileText, ImagePlus, Loader2, LogOut, Save, ShieldCheck } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { adminEmails, auth, googleProvider, isAuthorizedAdminEmail } from "@/lib/firebase/client"
import {
  createResumeVersion,
  loadPortfolioBundle,
  savePortfolioContent,
  setCurrentResume,
  uploadPortfolioFile,
} from "@/lib/firebase/portfolio"
import { emptyPortfolioContent } from "@/lib/portfolio/empty-content"
import { PortfolioBundleMeta, PortfolioContent, ResumeVersion } from "@/lib/portfolio/types"

const inputClassName =
  "w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:focus:border-neutral-500"

const textareaClassName =
  "w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:focus:border-neutral-500"

const secondaryCardClassName = "border-neutral-200/70 bg-white/90 dark:border-neutral-800 dark:bg-neutral-950/80"

type StatusState = {
  type: "idle" | "success" | "error" | "info"
  message: string
}

const defaultBundleMeta: PortfolioBundleMeta = {
  contentSource: "local-default",
  resumeSource: "local-default",
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function getFileExtension(fileName: string) {
  const lastDot = fileName.lastIndexOf(".")
  if (lastDot === -1) {
    return ""
  }

  return fileName.slice(lastDot)
}

function splitCommaList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
}

function joinCommaList(values: string[]) {
  return values.join(", ")
}

function StatusBanner({ status }: { status: StatusState }) {
  if (status.type === "idle") {
    return null
  }

  const styles =
    status.type === "success"
      ? "border-green-200 bg-green-50 text-green-700 dark:border-green-900/60 dark:bg-green-950/40 dark:text-green-300"
      : status.type === "error"
        ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
        : "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300"

  return <div className={`rounded-xl border px-4 py-3 text-sm ${styles}`}>{status.message}</div>
}

function describeSource(source: PortfolioBundleMeta["contentSource"]) {
  return source === "firestore" ? "Firestore" : "No live document found"
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null)
  const [authReady, setAuthReady] = useState(false)
  const [loadingBundle, setLoadingBundle] = useState(false)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<StatusState>({ type: "idle", message: "" })
  const [content, setContent] = useState<PortfolioContent>(emptyPortfolioContent)
  const [resumes, setResumes] = useState<ResumeVersion[]>([])
  const [bundleMeta, setBundleMeta] = useState<PortfolioBundleMeta>(defaultBundleMeta)
  const [loginEmail, setLoginEmail] = useState(adminEmails[0] ?? "")
  const [loginPassword, setLoginPassword] = useState("")
  const [resumeLabel, setResumeLabel] = useState("Updated Resume")
  const [resumeNote, setResumeNote] = useState("")
  const [resumeFile, setResumeFile] = useState<File | null>(null)

  async function refreshBundle(): Promise<{ content: PortfolioContent; resumes: ResumeVersion[]; meta: PortfolioBundleMeta } | null> {
    setLoadingBundle(true)

    try {
      const bundle = await loadPortfolioBundle()
      setContent(bundle.content)
      setResumes(bundle.resumes)
      setBundleMeta(bundle.meta)
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
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
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

    return () => unsubscribe()
  }, [])

  async function handleEmailSignIn() {
    setStatus({ type: "idle", message: "" })

    try {
      await signInWithEmailAndPassword(auth, loginEmail.trim(), loginPassword)
    } catch (error) {
      console.error(error)
      setStatus({
        type: "error",
        message: "Email login failed. If the account does not exist yet, create it first or use Google.",
      })
    }
  }

  async function handleCreateAccount() {
    setStatus({ type: "idle", message: "" })

    if (!isAuthorizedAdminEmail(loginEmail)) {
      setStatus({
        type: "error",
        message: `Only these admin emails are allowed here: ${adminEmails.join(", ")}`,
      })
      return
    }

    try {
      await createUserWithEmailAndPassword(auth, loginEmail.trim(), loginPassword)
      setStatus({
        type: "success",
        message: "Admin email/password account created successfully.",
      })
    } catch (error) {
      console.error(error)
      setStatus({
        type: "error",
        message: "Could not create the admin email/password account. It may already exist.",
      })
    }
  }

  async function handleGoogleSignIn() {
    setStatus({ type: "idle", message: "" })

    try {
      await signInWithPopup(auth, googleProvider)
    } catch (error) {
      console.error(error)
      setStatus({
        type: "error",
        message: "Google sign-in failed. Make sure the Google provider is enabled in Firebase Authentication.",
      })
    }
  }

  async function handleLogout() {
    await signOut(auth)
    setStatus({ type: "info", message: "Signed out from the admin panel." })
  }

  async function handleSaveContent() {
    setSaving(true)
    setStatus({ type: "idle", message: "" })

    try {
      await savePortfolioContent(content)
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
      const nextProjects = content.projects.items.map((item, index) =>
        index === projectIndex
          ? {
              ...item,
              image: uploaded.downloadUrl,
              imagePath: uploaded.storagePath,
            }
          : item
      )

      const nextContent = {
        ...content,
        projects: {
          ...content.projects,
          items: nextProjects,
        },
      }

      setContent(nextContent)
      await savePortfolioContent(nextContent)
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

  if (!authReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 dark:bg-neutral-950">
        <div className="flex items-center gap-3 text-neutral-700 dark:text-neutral-300">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Preparing the CMS...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-50 px-4 py-12 dark:bg-neutral-950">
        <div className="mx-auto max-w-xl">
          <Card className={secondaryCardClassName}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-3xl">
                <ShieldCheck className="h-7 w-7" />
                Admin CMS
              </CardTitle>
              <CardDescription>
                Login at <code>/admin</code> with your admin email/password or Google account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <StatusBanner status={status} />

              <div className="space-y-3">
                <div>
                  <label className="mb-2 block text-sm font-medium">Admin Email</label>
                  <input
                    className={inputClassName}
                    value={loginEmail}
                    onChange={(event) => setLoginEmail(event.target.value)}
                    type="email"
                    placeholder="admin@example.com"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Password</label>
                  <input
                    className={inputClassName}
                    value={loginPassword}
                    onChange={(event) => setLoginPassword(event.target.value)}
                    type="password"
                    placeholder="Minimum 6 characters"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Button onClick={handleEmailSignIn} className="rounded-xl">
                  Sign In
                </Button>
                <Button onClick={handleCreateAccount} variant="outline" className="rounded-xl">
                  Create Password Login
                </Button>
              </div>

              <Button onClick={handleGoogleSignIn} variant="outline" className="w-full rounded-xl">
                Continue With Google
              </Button>

              <div className="rounded-xl border border-neutral-200 bg-neutral-100/80 p-4 text-sm dark:border-neutral-800 dark:bg-neutral-900/70">
                <p className="font-medium">Allowed admin emails</p>
                <p className="mt-1 text-neutral-600 dark:text-neutral-400">{adminEmails.join(", ")}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-8 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl space-y-6">
        <Card className={secondaryCardClassName}>
          <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-3xl">Portfolio CMS</CardTitle>
              <CardDescription>
                Signed in as {user.email}. Manage live portfolio content stored in Firestore and Cloudinary.
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleSaveContent} className="rounded-xl" disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Content
              </Button>
              <Button onClick={handleLogout} variant="outline" className="rounded-xl">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <StatusBanner status={status} />
            {loadingBundle ? (
              <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading content from Firebase...
              </div>
            ) : null}
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-xl border border-neutral-200 bg-neutral-50/80 p-4 text-sm dark:border-neutral-800 dark:bg-neutral-900/60">
                <p className="font-medium text-neutral-900 dark:text-neutral-100">Content Source</p>
                <p className="mt-1 text-neutral-600 dark:text-neutral-400">{describeSource(bundleMeta.contentSource)}</p>
              </div>
              <div className="rounded-xl border border-neutral-200 bg-neutral-50/80 p-4 text-sm dark:border-neutral-800 dark:bg-neutral-900/60">
                <p className="font-medium text-neutral-900 dark:text-neutral-100">Resume Source</p>
                <p className="mt-1 text-neutral-600 dark:text-neutral-400">{describeSource(bundleMeta.resumeSource)}</p>
              </div>
              <div className="rounded-xl border border-neutral-200 bg-neutral-50/80 p-4 text-sm dark:border-neutral-800 dark:bg-neutral-900/60">
                <p className="font-medium text-neutral-900 dark:text-neutral-100">Asset Storage</p>
                <p className="mt-1 text-neutral-600 dark:text-neutral-400">
                  Images and resume files are served from Cloudinary
                </p>
              </div>
              <div className="rounded-xl border border-neutral-200 bg-neutral-50/80 p-4 text-sm dark:border-neutral-800 dark:bg-neutral-900/60">
                <p className="font-medium text-neutral-900 dark:text-neutral-100">Firestore Targets</p>
                <p className="mt-1 text-neutral-600 dark:text-neutral-400">siteContent/portfolio and resumeVersions</p>
              </div>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              The public site reads only from Firestore, and uploaded assets resolve from Cloudinary URLs stored there.
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <Card className={secondaryCardClassName}>
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">Eyebrow</label>
                  <input
                    className={inputClassName}
                    value={content.hero.eyebrow}
                    onChange={(event) =>
                      setContent({ ...content, hero: { ...content.hero, eyebrow: event.target.value } })
                    }
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Name</label>
                  <input
                    className={inputClassName}
                    value={content.hero.name}
                    onChange={(event) => setContent({ ...content, hero: { ...content.hero, name: event.target.value } })}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Title</label>
                  <input
                    className={inputClassName}
                    value={content.hero.title}
                    onChange={(event) => setContent({ ...content, hero: { ...content.hero, title: event.target.value } })}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Primary Button</label>
                  <input
                    className={inputClassName}
                    value={content.hero.primaryButtonLabel}
                    onChange={(event) =>
                      setContent({ ...content, hero: { ...content.hero, primaryButtonLabel: event.target.value } })
                    }
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Secondary Button</label>
                  <input
                    className={inputClassName}
                    value={content.hero.secondaryButtonLabel}
                    onChange={(event) =>
                      setContent({ ...content, hero: { ...content.hero, secondaryButtonLabel: event.target.value } })
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium">Description</label>
                  <textarea
                    className={textareaClassName}
                    rows={4}
                    value={content.hero.description}
                    onChange={(event) =>
                      setContent({ ...content, hero: { ...content.hero, description: event.target.value } })
                    }
                  />
                </div>

                <div className="md:col-span-2 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Hero Social Links</label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setContent({
                          ...content,
                          hero: {
                            ...content.hero,
                            socialLinks: [...content.hero.socialLinks, { label: "New Link", href: "https://" }],
                          },
                        })
                      }
                    >
                      Add Link
                    </Button>
                  </div>
                  {content.hero.socialLinks.map((link, index) => (
                    <div key={`${link.label}-${index}`} className="grid gap-3 rounded-xl border p-3 md:grid-cols-[1fr_2fr_auto]">
                      <input
                        className={inputClassName}
                        value={link.label}
                        onChange={(event) =>
                          setContent({
                            ...content,
                            hero: {
                              ...content.hero,
                              socialLinks: content.hero.socialLinks.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, label: event.target.value } : item
                              ),
                            },
                          })
                        }
                      />
                      <input
                        className={inputClassName}
                        value={link.href}
                        onChange={(event) =>
                          setContent({
                            ...content,
                            hero: {
                              ...content.hero,
                              socialLinks: content.hero.socialLinks.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, href: event.target.value } : item
                              ),
                            },
                          })
                        }
                      />
                      <Button
                        variant="outline"
                        onClick={() =>
                          setContent({
                            ...content,
                            hero: {
                              ...content.hero,
                              socialLinks: content.hero.socialLinks.filter((_, itemIndex) => itemIndex !== index),
                            },
                          })
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className={secondaryCardClassName}>
              <CardHeader>
                <CardTitle>About Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Badge</label>
                    <input
                      className={inputClassName}
                      value={content.about.badge}
                      onChange={(event) =>
                        setContent({ ...content, about: { ...content.about, badge: event.target.value } })
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Title</label>
                    <input
                      className={inputClassName}
                      value={content.about.title}
                      onChange={(event) =>
                        setContent({ ...content, about: { ...content.about, title: event.target.value } })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Description</label>
                  <textarea
                    className={textareaClassName}
                    rows={3}
                    value={content.about.description}
                    onChange={(event) =>
                      setContent({ ...content, about: { ...content.about, description: event.target.value } })
                    }
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Summary Title</label>
                    <input
                      className={inputClassName}
                      value={content.about.summaryTitle}
                      onChange={(event) =>
                        setContent({ ...content, about: { ...content.about, summaryTitle: event.target.value } })
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Image Alt Text</label>
                    <input
                      className={inputClassName}
                      value={content.about.imageAlt}
                      onChange={(event) =>
                        setContent({ ...content, about: { ...content.about, imageAlt: event.target.value } })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Summary Body</label>
                  <textarea
                    className={textareaClassName}
                    rows={4}
                    value={content.about.summaryBody}
                    onChange={(event) =>
                      setContent({ ...content, about: { ...content.about, summaryBody: event.target.value } })
                    }
                  />
                </div>

                <div className="rounded-xl border p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium">About Image</p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">{content.about.imageUrl}</p>
                    </div>
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900">
                      <ImagePlus className="h-4 w-4" />
                      Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) => {
                          const file = event.target.files?.[0]
                          if (file) {
                            void handleUploadAboutImage(file)
                          }
                          event.target.value = ""
                        }}
                      />
                    </label>
                  </div>
                  {content.about.imageUrl ? (
                    <Image
                      src={content.about.imageUrl}
                      alt={content.about.imageAlt}
                      width={640}
                      height={448}
                      unoptimized
                      className="max-h-56 w-auto rounded-xl object-cover"
                    />
                  ) : null}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Traits</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setContent({
                          ...content,
                          about: {
                            ...content.about,
                            traits: [...content.about.traits, { title: "New Trait", description: "Describe it" }],
                          },
                        })
                      }
                    >
                      Add Trait
                    </Button>
                  </div>
                  {content.about.traits.map((trait, index) => (
                    <div key={`${trait.title}-${index}`} className="grid gap-3 rounded-xl border p-3 md:grid-cols-[1fr_2fr_auto]">
                      <input
                        className={inputClassName}
                        value={trait.title}
                        onChange={(event) =>
                          setContent({
                            ...content,
                            about: {
                              ...content.about,
                              traits: content.about.traits.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, title: event.target.value } : item
                              ),
                            },
                          })
                        }
                      />
                      <input
                        className={inputClassName}
                        value={trait.description}
                        onChange={(event) =>
                          setContent({
                            ...content,
                            about: {
                              ...content.about,
                              traits: content.about.traits.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, description: event.target.value } : item
                              ),
                            },
                          })
                        }
                      />
                      <Button
                        variant="outline"
                        onClick={() =>
                          setContent({
                            ...content,
                            about: {
                              ...content.about,
                              traits: content.about.traits.filter((_, itemIndex) => itemIndex !== index),
                            },
                          })
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Skills Badge</label>
                    <input
                      className={inputClassName}
                      value={content.about.skillBadge}
                      onChange={(event) =>
                        setContent({ ...content, about: { ...content.about, skillBadge: event.target.value } })
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Skills Title</label>
                    <input
                      className={inputClassName}
                      value={content.about.skillTitle}
                      onChange={(event) =>
                        setContent({ ...content, about: { ...content.about, skillTitle: event.target.value } })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Skill Cards</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setContent({
                          ...content,
                          about: {
                            ...content.about,
                            skills: [
                              ...content.about.skills,
                              { title: "New Skill", description: "Describe it", technologies: ["Example"] },
                            ],
                          },
                        })
                      }
                    >
                      Add Skill Card
                    </Button>
                  </div>
                  {content.about.skills.map((skill, index) => (
                    <div key={`${skill.title}-${index}`} className="space-y-3 rounded-xl border p-4">
                      <div className="grid gap-3 md:grid-cols-2">
                        <input
                          className={inputClassName}
                          value={skill.title}
                          onChange={(event) =>
                            setContent({
                              ...content,
                              about: {
                                ...content.about,
                                skills: content.about.skills.map((item, itemIndex) =>
                                  itemIndex === index ? { ...item, title: event.target.value } : item
                                ),
                              },
                            })
                          }
                        />
                        <Button
                          variant="outline"
                          onClick={() =>
                            setContent({
                              ...content,
                              about: {
                                ...content.about,
                                skills: content.about.skills.filter((_, itemIndex) => itemIndex !== index),
                              },
                            })
                          }
                        >
                          Remove
                        </Button>
                      </div>
                      <textarea
                        className={textareaClassName}
                        rows={2}
                        value={skill.description}
                        onChange={(event) =>
                          setContent({
                            ...content,
                            about: {
                              ...content.about,
                              skills: content.about.skills.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, description: event.target.value } : item
                              ),
                            },
                          })
                        }
                      />
                      <input
                        className={inputClassName}
                        value={joinCommaList(skill.technologies)}
                        onChange={(event) =>
                          setContent({
                            ...content,
                            about: {
                              ...content.about,
                              skills: content.about.skills.map((item, itemIndex) =>
                                itemIndex === index
                                  ? { ...item, technologies: splitCommaList(event.target.value) }
                                  : item
                              ),
                            },
                          })
                        }
                        placeholder="Comma separated technologies"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className={secondaryCardClassName}>
              <CardHeader>
                <CardTitle>Experience Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    className={inputClassName}
                    value={content.experience.badge}
                    onChange={(event) =>
                      setContent({ ...content, experience: { ...content.experience, badge: event.target.value } })
                    }
                    placeholder="Badge"
                  />
                  <input
                    className={inputClassName}
                    value={content.experience.title}
                    onChange={(event) =>
                      setContent({ ...content, experience: { ...content.experience, title: event.target.value } })
                    }
                    placeholder="Title"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Experience Items</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setContent({
                          ...content,
                          experience: {
                            ...content.experience,
                            items: [
                              ...content.experience.items,
                              {
                                company: "New Company",
                                role: "Role",
                                period: "Period",
                                description: "Describe the role",
                                projects: [{ title: "Project", description: "Project details" }],
                                technologies: ["Technology"],
                              },
                            ],
                          },
                        })
                      }
                    >
                      Add Experience
                    </Button>
                  </div>

                  {content.experience.items.map((item, index) => (
                    <div key={`${item.company}-${index}`} className="space-y-3 rounded-xl border p-4">
                      <div className="grid gap-3 md:grid-cols-2">
                        <input
                          className={inputClassName}
                          value={item.company}
                          onChange={(event) =>
                            setContent({
                              ...content,
                              experience: {
                                ...content.experience,
                                items: content.experience.items.map((entry, entryIndex) =>
                                  entryIndex === index ? { ...entry, company: event.target.value } : entry
                                ),
                              },
                            })
                          }
                          placeholder="Company"
                        />
                        <input
                          className={inputClassName}
                          value={item.role}
                          onChange={(event) =>
                            setContent({
                              ...content,
                              experience: {
                                ...content.experience,
                                items: content.experience.items.map((entry, entryIndex) =>
                                  entryIndex === index ? { ...entry, role: event.target.value } : entry
                                ),
                              },
                            })
                          }
                          placeholder="Role"
                        />
                        <input
                          className={inputClassName}
                          value={item.period}
                          onChange={(event) =>
                            setContent({
                              ...content,
                              experience: {
                                ...content.experience,
                                items: content.experience.items.map((entry, entryIndex) =>
                                  entryIndex === index ? { ...entry, period: event.target.value } : entry
                                ),
                              },
                            })
                          }
                          placeholder="Period"
                        />
                        <Button
                          variant="outline"
                          onClick={() =>
                            setContent({
                              ...content,
                              experience: {
                                ...content.experience,
                                items: content.experience.items.filter((_, entryIndex) => entryIndex !== index),
                              },
                            })
                          }
                        >
                          Remove Experience
                        </Button>
                      </div>
                      <textarea
                        className={textareaClassName}
                        rows={3}
                        value={item.description}
                        onChange={(event) =>
                          setContent({
                            ...content,
                            experience: {
                              ...content.experience,
                              items: content.experience.items.map((entry, entryIndex) =>
                                entryIndex === index ? { ...entry, description: event.target.value } : entry
                              ),
                            },
                          })
                        }
                      />
                      <input
                        className={inputClassName}
                        value={joinCommaList(item.technologies)}
                        onChange={(event) =>
                          setContent({
                            ...content,
                            experience: {
                              ...content.experience,
                              items: content.experience.items.map((entry, entryIndex) =>
                                entryIndex === index
                                  ? { ...entry, technologies: splitCommaList(event.target.value) }
                                  : entry
                              ),
                            },
                          })
                        }
                        placeholder="Comma separated technologies"
                      />

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">Projects</p>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setContent({
                                ...content,
                                experience: {
                                  ...content.experience,
                                  items: content.experience.items.map((entry, entryIndex) =>
                                    entryIndex === index
                                      ? {
                                          ...entry,
                                          projects: [...entry.projects, { title: "Project", description: "Details" }],
                                        }
                                      : entry
                                  ),
                                },
                              })
                            }
                          >
                            Add Project
                          </Button>
                        </div>

                        {item.projects.map((project, projectIndex) => (
                          <div key={`${project.title}-${projectIndex}`} className="grid gap-3 rounded-xl border p-3 md:grid-cols-[1fr_2fr_auto]">
                            <input
                              className={inputClassName}
                              value={project.title}
                              onChange={(event) =>
                                setContent({
                                  ...content,
                                  experience: {
                                    ...content.experience,
                                    items: content.experience.items.map((entry, entryIndex) =>
                                      entryIndex === index
                                        ? {
                                            ...entry,
                                            projects: entry.projects.map((itemProject, itemProjectIndex) =>
                                              itemProjectIndex === projectIndex
                                                ? { ...itemProject, title: event.target.value }
                                                : itemProject
                                            ),
                                          }
                                        : entry
                                    ),
                                  },
                                })
                              }
                            />
                            <input
                              className={inputClassName}
                              value={project.description}
                              onChange={(event) =>
                                setContent({
                                  ...content,
                                  experience: {
                                    ...content.experience,
                                    items: content.experience.items.map((entry, entryIndex) =>
                                      entryIndex === index
                                        ? {
                                            ...entry,
                                            projects: entry.projects.map((itemProject, itemProjectIndex) =>
                                              itemProjectIndex === projectIndex
                                                ? { ...itemProject, description: event.target.value }
                                                : itemProject
                                            ),
                                          }
                                        : entry
                                    ),
                                  },
                                })
                              }
                            />
                            <Button
                              variant="outline"
                              onClick={() =>
                                setContent({
                                  ...content,
                                  experience: {
                                    ...content.experience,
                                    items: content.experience.items.map((entry, entryIndex) =>
                                      entryIndex === index
                                        ? {
                                            ...entry,
                                            projects: entry.projects.filter((_, itemProjectIndex) => itemProjectIndex !== projectIndex),
                                          }
                                        : entry
                                    ),
                                  },
                                })
                              }
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className={secondaryCardClassName}>
              <CardHeader>
                <CardTitle>Projects Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    className={inputClassName}
                    value={content.projects.badge}
                    onChange={(event) =>
                      setContent({ ...content, projects: { ...content.projects, badge: event.target.value } })
                    }
                    placeholder="Badge"
                  />
                  <input
                    className={inputClassName}
                    value={content.projects.title}
                    onChange={(event) =>
                      setContent({ ...content, projects: { ...content.projects, title: event.target.value } })
                    }
                    placeholder="Title"
                  />
                  <input
                    className={inputClassName}
                    value={content.projects.otherProjectsBadge}
                    onChange={(event) =>
                      setContent({
                        ...content,
                        projects: { ...content.projects, otherProjectsBadge: event.target.value },
                      })
                    }
                    placeholder="Other badge"
                  />
                  <input
                    className={inputClassName}
                    value={content.projects.otherProjectsTitle}
                    onChange={(event) =>
                      setContent({
                        ...content,
                        projects: { ...content.projects, otherProjectsTitle: event.target.value },
                      })
                    }
                    placeholder="Other title"
                  />
                </div>

                <textarea
                  className={textareaClassName}
                  rows={3}
                  value={content.projects.description}
                  onChange={(event) =>
                    setContent({ ...content, projects: { ...content.projects, description: event.target.value } })
                  }
                  placeholder="Section description"
                />

                <div className="flex items-center justify-between">
                  <p className="font-medium">Projects</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setContent({
                        ...content,
                        projects: {
                          ...content.projects,
                          items: [
                            ...content.projects.items,
                            {
                              title: "New Project",
                              description: "Describe the project",
                              image: "",
                              imagePath: `portfolio/images/projects/${Date.now()}-project.png`,
                              technologies: ["Tech"],
                              liveUrl: "https://",
                              githubUrl: "https://",
                              featured: false,
                              stats: { stars: "Label", views: "Label" },
                            },
                          ],
                        },
                      })
                    }
                  >
                    Add Project
                  </Button>
                </div>

                {content.projects.items.map((project, index) => (
                  <div key={`${project.title}-${index}`} className="space-y-4 rounded-xl border p-4">
                    <div className="grid gap-3 md:grid-cols-2">
                      <input
                        className={inputClassName}
                        value={project.title}
                        onChange={(event) =>
                          setContent({
                            ...content,
                            projects: {
                              ...content.projects,
                              items: content.projects.items.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, title: event.target.value } : item
                              ),
                            },
                          })
                        }
                        placeholder="Project title"
                      />
                      <label className="flex items-center gap-3 rounded-xl border px-3 py-2 text-sm">
                        <input
                          type="checkbox"
                          checked={project.featured}
                          onChange={(event) =>
                            setContent({
                              ...content,
                              projects: {
                                ...content.projects,
                                items: content.projects.items.map((item, itemIndex) =>
                                  itemIndex === index ? { ...item, featured: event.target.checked } : item
                                ),
                              },
                            })
                          }
                        />
                        Featured project
                      </label>
                    </div>

                    <textarea
                      className={textareaClassName}
                      rows={3}
                      value={project.description}
                      onChange={(event) =>
                        setContent({
                          ...content,
                          projects: {
                            ...content.projects,
                            items: content.projects.items.map((item, itemIndex) =>
                              itemIndex === index ? { ...item, description: event.target.value } : item
                            ),
                          },
                        })
                      }
                      placeholder="Project description"
                    />

                    <div className="grid gap-3 md:grid-cols-2">
                      <input
                        className={inputClassName}
                        value={project.liveUrl}
                        onChange={(event) =>
                          setContent({
                            ...content,
                            projects: {
                              ...content.projects,
                              items: content.projects.items.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, liveUrl: event.target.value } : item
                              ),
                            },
                          })
                        }
                        placeholder="Live URL"
                      />
                      <input
                        className={inputClassName}
                        value={project.githubUrl}
                        onChange={(event) =>
                          setContent({
                            ...content,
                            projects: {
                              ...content.projects,
                              items: content.projects.items.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, githubUrl: event.target.value } : item
                              ),
                            },
                          })
                        }
                        placeholder="GitHub URL"
                      />
                      <input
                        className={inputClassName}
                        value={project.stats.stars}
                        onChange={(event) =>
                          setContent({
                            ...content,
                            projects: {
                              ...content.projects,
                              items: content.projects.items.map((item, itemIndex) =>
                                itemIndex === index
                                  ? { ...item, stats: { ...item.stats, stars: event.target.value } }
                                  : item
                              ),
                            },
                          })
                        }
                        placeholder="Stat 1"
                      />
                      <input
                        className={inputClassName}
                        value={project.stats.views}
                        onChange={(event) =>
                          setContent({
                            ...content,
                            projects: {
                              ...content.projects,
                              items: content.projects.items.map((item, itemIndex) =>
                                itemIndex === index
                                  ? { ...item, stats: { ...item.stats, views: event.target.value } }
                                  : item
                              ),
                            },
                          })
                        }
                        placeholder="Stat 2"
                      />
                    </div>

                    <input
                      className={inputClassName}
                      value={project.achievement ?? ""}
                      onChange={(event) =>
                        setContent({
                          ...content,
                          projects: {
                            ...content.projects,
                            items: content.projects.items.map((item, itemIndex) =>
                              itemIndex === index ? { ...item, achievement: event.target.value } : item
                            ),
                          },
                        })
                      }
                      placeholder="Achievement label"
                    />

                    <input
                      className={inputClassName}
                      value={joinCommaList(project.technologies)}
                      onChange={(event) =>
                        setContent({
                          ...content,
                          projects: {
                            ...content.projects,
                            items: content.projects.items.map((item, itemIndex) =>
                              itemIndex === index
                                ? { ...item, technologies: splitCommaList(event.target.value) }
                                : item
                            ),
                          },
                        })
                      }
                      placeholder="Comma separated technologies"
                    />

                    <div className="flex flex-wrap items-center gap-3">
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900">
                        <ImagePlus className="h-4 w-4" />
                        Upload Project Image
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(event) => {
                            const file = event.target.files?.[0]
                            if (file) {
                              void handleUploadProjectImage(index, file)
                            }
                            event.target.value = ""
                          }}
                        />
                      </label>
                      {project.image ? (
                        <a
                          href={project.image}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                        >
                          Preview Image
                          <ArrowUpRight className="h-4 w-4" />
                        </a>
                      ) : null}
                      <Button
                        variant="outline"
                        onClick={() =>
                          setContent({
                            ...content,
                            projects: {
                              ...content.projects,
                              items: content.projects.items.filter((_, itemIndex) => itemIndex !== index),
                            },
                          })
                        }
                      >
                        Remove Project
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className={secondaryCardClassName}>
              <CardHeader>
                <CardTitle>Contact and Footer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    className={inputClassName}
                    value={content.contact.badge}
                    onChange={(event) =>
                      setContent({ ...content, contact: { ...content.contact, badge: event.target.value } })
                    }
                    placeholder="Contact badge"
                  />
                  <input
                    className={inputClassName}
                    value={content.contact.title}
                    onChange={(event) =>
                      setContent({ ...content, contact: { ...content.contact, title: event.target.value } })
                    }
                    placeholder="Contact title"
                  />
                </div>
                <textarea
                  className={textareaClassName}
                  rows={3}
                  value={content.contact.description}
                  onChange={(event) =>
                    setContent({ ...content, contact: { ...content.contact, description: event.target.value } })
                  }
                  placeholder="Contact description"
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    className={inputClassName}
                    value={content.contact.formTitle}
                    onChange={(event) =>
                      setContent({ ...content, contact: { ...content.contact, formTitle: event.target.value } })
                    }
                    placeholder="Form title"
                  />
                  <input
                    className={inputClassName}
                    value={content.contact.introTitle}
                    onChange={(event) =>
                      setContent({ ...content, contact: { ...content.contact, introTitle: event.target.value } })
                    }
                    placeholder="Intro title"
                  />
                </div>
                <textarea
                  className={textareaClassName}
                  rows={3}
                  value={content.contact.introDescription}
                  onChange={(event) =>
                    setContent({
                      ...content,
                      contact: { ...content.contact, introDescription: event.target.value },
                    })
                  }
                  placeholder="Intro description"
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    className={inputClassName}
                    value={content.contact.responseTimeTitle}
                    onChange={(event) =>
                      setContent({
                        ...content,
                        contact: { ...content.contact, responseTimeTitle: event.target.value },
                      })
                    }
                    placeholder="Response time title"
                  />
                  <textarea
                    className={textareaClassName}
                    rows={2}
                    value={content.contact.responseTimeDescription}
                    onChange={(event) =>
                      setContent({
                        ...content,
                        contact: { ...content.contact, responseTimeDescription: event.target.value },
                      })
                    }
                    placeholder="Response time description"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Contact Details</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setContent({
                          ...content,
                          contact: {
                            ...content.contact,
                            details: [
                              ...content.contact.details,
                              {
                                title: "New Detail",
                                content: "Value",
                                href: "#",
                                description: "Description",
                              },
                            ],
                          },
                        })
                      }
                    >
                      Add Detail
                    </Button>
                  </div>
                  {content.contact.details.map((detail, index) => (
                    <div key={`${detail.title}-${index}`} className="grid gap-3 rounded-xl border p-3 md:grid-cols-2">
                      <input
                        className={inputClassName}
                        value={detail.title}
                        onChange={(event) =>
                          setContent({
                            ...content,
                            contact: {
                              ...content.contact,
                              details: content.contact.details.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, title: event.target.value } : item
                              ),
                            },
                          })
                        }
                      />
                      <input
                        className={inputClassName}
                        value={detail.content}
                        onChange={(event) =>
                          setContent({
                            ...content,
                            contact: {
                              ...content.contact,
                              details: content.contact.details.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, content: event.target.value } : item
                              ),
                            },
                          })
                        }
                      />
                      <input
                        className={inputClassName}
                        value={detail.href}
                        onChange={(event) =>
                          setContent({
                            ...content,
                            contact: {
                              ...content.contact,
                              details: content.contact.details.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, href: event.target.value } : item
                              ),
                            },
                          })
                        }
                      />
                      <div className="flex gap-3">
                        <input
                          className={inputClassName}
                          value={detail.description}
                          onChange={(event) =>
                            setContent({
                              ...content,
                              contact: {
                                ...content.contact,
                                details: content.contact.details.map((item, itemIndex) =>
                                  itemIndex === index ? { ...item, description: event.target.value } : item
                                ),
                              },
                            })
                          }
                        />
                        <Button
                          variant="outline"
                          onClick={() =>
                            setContent({
                              ...content,
                              contact: {
                                ...content.contact,
                                details: content.contact.details.filter((_, itemIndex) => itemIndex !== index),
                              },
                            })
                          }
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    className={inputClassName}
                    value={content.footer.name}
                    onChange={(event) =>
                      setContent({ ...content, footer: { ...content.footer, name: event.target.value } })
                    }
                    placeholder="Footer name"
                  />
                  <input
                    className={inputClassName}
                    value={content.footer.tagline}
                    onChange={(event) =>
                      setContent({ ...content, footer: { ...content.footer, tagline: event.target.value } })
                    }
                    placeholder="Footer tagline"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Footer Social Links</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setContent({
                          ...content,
                          footer: {
                            ...content.footer,
                            socialLinks: [...content.footer.socialLinks, { label: "New Link", href: "https://" }],
                          },
                        })
                      }
                    >
                      Add Footer Link
                    </Button>
                  </div>
                  {content.footer.socialLinks.map((link, index) => (
                    <div key={`${link.label}-${index}`} className="grid gap-3 rounded-xl border p-3 md:grid-cols-[1fr_2fr_auto]">
                      <input
                        className={inputClassName}
                        value={link.label}
                        onChange={(event) =>
                          setContent({
                            ...content,
                            footer: {
                              ...content.footer,
                              socialLinks: content.footer.socialLinks.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, label: event.target.value } : item
                              ),
                            },
                          })
                        }
                      />
                      <input
                        className={inputClassName}
                        value={link.href}
                        onChange={(event) =>
                          setContent({
                            ...content,
                            footer: {
                              ...content.footer,
                              socialLinks: content.footer.socialLinks.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, href: event.target.value } : item
                              ),
                            },
                          })
                        }
                      />
                      <Button
                        variant="outline"
                        onClick={() =>
                          setContent({
                            ...content,
                            footer: {
                              ...content.footer,
                              socialLinks: content.footer.socialLinks.filter((_, itemIndex) => itemIndex !== index),
                            },
                          })
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className={secondaryCardClassName}>
              <CardHeader>
                <CardTitle>Resume Manager</CardTitle>
                <CardDescription>Upload a new resume, keep old versions, and switch the current download.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 rounded-xl border p-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Resume Label</label>
                    <input
                      className={inputClassName}
                      value={resumeLabel}
                      onChange={(event) => setResumeLabel(event.target.value)}
                      placeholder="May 2026 Resume"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Resume Note</label>
                    <textarea
                      className={textareaClassName}
                      rows={3}
                      value={resumeNote}
                      onChange={(event) => setResumeNote(event.target.value)}
                      placeholder="What changed in this version?"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">PDF File</label>
                    <input
                      className={inputClassName}
                      type="file"
                      accept="application/pdf"
                      onChange={(event) => setResumeFile(event.target.files?.[0] ?? null)}
                    />
                  </div>
                  <Button onClick={handleResumeUpload} className="w-full rounded-xl" disabled={saving}>
                    <FileText className="mr-2 h-4 w-4" />
                    Upload New Resume
                  </Button>
                </div>

                <div className="space-y-3">
                  {resumes.map((resume) => (
                    <div key={resume.id ?? resume.storagePath} className="rounded-xl border p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-medium">{resume.label}</p>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">{resume.fileName}</p>
                          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-500">
                            {resume.note || "No note"}
                          </p>
                        </div>
                        {resume.isCurrent ? (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-950/50 dark:text-green-300">
                            Current
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <a
                          href={resume.downloadUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
                        >
                          Download
                          <ArrowUpRight className="h-4 w-4" />
                        </a>
                        {!resume.isCurrent && resume.id ? (
                          <Button size="sm" variant="outline" onClick={() => void handleMakeCurrentResume(resume.id!)}>
                            Make Current
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className={secondaryCardClassName}>
            <CardHeader>
              <CardTitle>Stack Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-neutral-700 dark:text-neutral-300">
                <p>Public content and resume history live in Firestore.</p>
                <p>Images and PDFs are uploaded to Cloudinary through a signed server route.</p>
                <p>Do not store private secrets like SMTP passwords in Firestore. Keep those in deployment env vars.</p>
                <p>After enabling Firebase Auth, only the admin emails you configured should have write access in your Firebase rules.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
