"use client"

import { useEffect, useState } from "react"

import AboutSection from "@/components/portfolio/sections/about-section"
import ContactSection from "@/components/portfolio/sections/contact-section"
import Footer from "@/components/portfolio/sections/footer"
import HeroSection from "@/components/portfolio/sections/hero-section"
import ProjectsSection from "@/components/portfolio/sections/projects-section"
import ScrollIndicator from "@/components/portfolio/scroll-indicator"
import { LoadingScreen } from "@/components/ui/loading-screen"
import ThemeToggle from "@/components/ui/theme-toggle"
import { loadPortfolioBundle } from "@/lib/firebase/portfolio"
import { emptyPortfolioContent, emptyResumeVersions } from "@/lib/cms/empty-content"
import { PortfolioBundle } from "@/lib/cms/types"

const defaultBundle: PortfolioBundle = {
  content: emptyPortfolioContent,
  resumes: emptyResumeVersions,
  meta: {
    contentSource: "local-default",
    resumeSource: "local-default",
  },
}

export function PortfolioScreen() {
  const [bundle, setBundle] = useState<PortfolioBundle>(defaultBundle)
  const [status, setStatus] = useState<"loading" | "ready" | "missing" | "error">("loading")

  useEffect(() => {
    let cancelled = false

    async function run() {
      try {
        const nextBundle = await loadPortfolioBundle()

        if (!cancelled) {
          if (nextBundle.meta.contentSource !== "firestore" || (nextBundle.meta.resumeSource !== "cloudinary" && nextBundle.meta.resumeSource !== "local-default")) {
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
    return <LoadingScreen />
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
