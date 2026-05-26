"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Mosaic } from "react-loading-indicators"

import AboutSection from "@/components/about-section"
import ContactSection from "@/components/contact-section"
import Footer from "@/components/footer"
import HeroSection from "@/components/hero-section"
import ProjectsSection from "@/components/projects-section"
import ScrollIndicator from "@/components/scroll-indicator"
import ThemeToggle from "@/components/theme-toggle"
import { loadPortfolioBundle } from "@/lib/firebase/portfolio"
import { emptyPortfolioContent, emptyResumeVersions } from "@/lib/portfolio/empty-content"
import { PortfolioBundle } from "@/lib/portfolio/types"

const defaultBundle: PortfolioBundle = {
  content: emptyPortfolioContent,
  resumes: emptyResumeVersions,
  meta: {
    contentSource: "local-default",
    resumeSource: "local-default",
  },
}

export default function PortfolioApp() {
  const [bundle, setBundle] = useState<PortfolioBundle>(defaultBundle)
  const [status, setStatus] = useState<"loading" | "ready" | "missing" | "error">("loading")
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const loaderColor = isDark ? "#f5f5f5" : "#171717"

  useEffect(() => {
    setMounted(true)

    let cancelled = false

    async function run() {
      try {
        const nextBundle = await loadPortfolioBundle()

        if (!cancelled) {
          if (nextBundle.meta.contentSource !== "firestore" || nextBundle.meta.resumeSource !== "firestore") {
            setStatus("missing")
            return
          }

          setBundle(nextBundle)
          setStatus("ready")
        }
      } catch (error) {
        console.error("Failed to load portfolio content from Firebase.", error)

        if (!cancelled) {
          setStatus("error")
        }
      }
    }

    void run()

    return () => {
      cancelled = true
    }
  }, [])

  if (status === "loading") {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-100 px-6 dark:bg-neutral-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.08),transparent_32%),radial-gradient(circle_at_bottom,rgba(115,115,115,0.14),transparent_34%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.10),transparent_28%),radial-gradient(circle_at_bottom,rgba(255,255,255,0.04),transparent_34%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.45)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.45)_1px,transparent_1px)] bg-[size:72px_72px] opacity-30 dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] dark:opacity-100" />
        <div className="relative text-center">
          <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-[2rem] border border-white/70 bg-white/75 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-neutral-900/70 dark:shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
            {mounted ? (
              <Mosaic color={loaderColor} size="large" text="" textColor="" />
            ) : (
              <div className="h-10 w-10 rounded-xl bg-neutral-200 dark:bg-neutral-800" />
            )}
          </div>
          <p className="mt-8 text-xs font-medium uppercase tracking-[0.35em] text-neutral-500 dark:text-neutral-400">
            Vaibhav Sharma
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-neutral-900 dark:text-white">Loading experience</h1>
        </div>
      </main>
    )
  }

  if (status === "missing") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-6 text-center dark:bg-neutral-950">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.3em] text-neutral-500 dark:text-neutral-400">Unavailable</p>
          <h1 className="mt-4 text-3xl font-semibold text-neutral-900 dark:text-white">Portfolio content is not available yet</h1>
          <p className="mt-4 text-base text-neutral-600 dark:text-neutral-400">
            Please check back shortly.
          </p>
        </div>
      </main>
    )
  }

  if (status === "error") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-6 text-center dark:bg-neutral-950">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.3em] text-neutral-500 dark:text-neutral-400">Load Failed</p>
          <h1 className="mt-4 text-3xl font-semibold text-neutral-900 dark:text-white">Could not load portfolio content</h1>
        </div>
      </main>
    )
  }

  const currentResume = bundle.resumes.find((resume) => resume.isCurrent) ?? bundle.resumes[0]

  if (!currentResume) {
    return null
  }

  return (
    <main className="min-h-screen">
      <ThemeToggle />
      <ScrollIndicator />
      <HeroSection hero={bundle.content.hero} currentResume={currentResume} />
      <AboutSection about={bundle.content.about} experience={bundle.content.experience} />
      <ProjectsSection projects={bundle.content.projects} />
      <ContactSection contact={bundle.content.contact} />
      <Footer footer={bundle.content.footer} />
    </main>
  )
}
