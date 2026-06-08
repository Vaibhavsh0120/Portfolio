"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  ArrowUpRight,
  Briefcase,
  Contact,
  FileText,
  FolderKanban,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  RefreshCw,
  Save,
  Sparkles,
  UserRound,
  X,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import type { AdminCmsController } from "@/components/admin/core/admin-types"
import { AboutEditor } from "@/components/admin/editors/about-editor"
import { ContactFooterEditor } from "@/components/admin/editors/contact-footer-editor"
import { ExperienceEditor } from "@/components/admin/editors/experience-editor"
import { HeroEditor } from "@/components/admin/editors/hero-editor"
import { ProjectsEditor } from "@/components/admin/editors/projects-editor"
import { ResumeManager } from "@/components/admin/editors/resume-manager"
import { AdminOverview } from "@/components/admin/core/admin-overview"
import { ImageCropperModal } from "@/components/admin/core/image-cropper-modal"
import { Toast } from "@/components/ui/toast"
import ThemeToggle from "@/components/ui/theme-toggle"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "#overview", label: "Overview", icon: LayoutDashboard },
  { href: "#hero", label: "Hero", icon: Sparkles },
  { href: "#about", label: "About", icon: UserRound },
  { href: "#experience", label: "Experience", icon: Briefcase },
  { href: "#projects", label: "Projects", icon: FolderKanban },
  { href: "#contact", label: "Contact", icon: Contact },
  { href: "#resume", label: "Resume", icon: FileText },
]

export function AdminDashboard({ cms }: { cms: AdminCmsController }) {
  const [activeSection, setActiveSection] = useState(navItems[0].href.slice(1))
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    const sectionIds = navItems.map((item) => item.href.slice(1))

    const updateActiveSection = () => {
      const activationOffset = 140
      let activeId = sectionIds[0]

      for (let index = sectionIds.length - 1; index >= 0; index -= 1) {
        const section = document.getElementById(sectionIds[index])

        if (section && section.getBoundingClientRect().top <= activationOffset) {
          activeId = sectionIds[index]
          break
        }
      }

      setActiveSection(activeId)
    }

    updateActiveSection()
    window.addEventListener("scroll", updateActiveSection, { passive: true })
    window.addEventListener("resize", updateActiveSection)

    return () => {
      window.removeEventListener("scroll", updateActiveSection)
      window.removeEventListener("resize", updateActiveSection)
    }
  }, [])

  // Close sidebar when clicking a link on mobile
  const handleNavItemClick = (sectionId: string) => {
    setActiveSection(sectionId)
    setIsSidebarOpen(false)
  }

  return (
    <div className="min-h-screen max-w-full bg-neutral-50 dark:bg-neutral-950">
      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-neutral-900 dark:bg-neutral-950/90">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-3 gap-y-2">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="hidden sm:block">
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-semibold tracking-tight">Portfolio CMS</h1>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    cms.hasUnsavedChanges
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
                      : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                  }`}
                >
                  {cms.hasUnsavedChanges ? "Unsaved changes" : "Saved"}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-500">Signed in as {cms.user?.email}</p>
            </div>
            {/* Mobile Title */}
            <h1 className="text-lg font-semibold tracking-tight sm:hidden">CMS</h1>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 ml-auto">
            <ThemeToggle inline className="mr-0.5 sm:mr-1" />
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-2 sm:px-3"
                onClick={() => void cms.refreshBundle({ announce: true })}
                disabled={cms.loadingBundle}
                title="Refresh"
              >
                {cms.loadingBundle ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                <span className="ml-2 hidden lg:inline">Refresh</span>
              </Button>
              <Button asChild variant="outline" size="sm" className="h-9 px-2 sm:px-3" title="Preview">
                <Link href="/" target="_blank">
                  <ArrowUpRight className="h-4 w-4" />
                  <span className="ml-2 hidden lg:inline">Preview</span>
                </Link>
              </Button>
              {cms.hasUnsavedChanges && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 px-2 sm:px-3 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/50 dark:hover:text-red-300"
                  onClick={cms.handleCancelChanges}
                  title="Cancel Changes"
                >
                  <X className="h-4 w-4" />
                  <span className="ml-2 hidden lg:inline">Cancel</span>
                </Button>
              )}
              <Button
                size="sm"
                className="h-9 px-2 sm:px-3"
                onClick={cms.handleSaveContent}
                disabled={cms.saving || !cms.hasUnsavedChanges}
                title="Save"
              >
                {cms.saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                <span className="ml-2 hidden lg:inline">Save</span>
              </Button>
              <Button onClick={cms.handleLogout} variant="outline" size="sm" className="h-9 px-2 sm:px-3" title="Logout">
                <LogOut className="h-4 w-4" />
                <span className="ml-2 hidden lg:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-neutral-950/50 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-white p-6 shadow-2xl dark:bg-neutral-950 lg:hidden"
            >
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Portfolio CMS</h2>
                  <p className="mt-1 text-xs text-neutral-500">{cms.user?.email}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const sectionId = item.href.slice(1)
                  const isActive = activeSection === sectionId

                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => handleNavItemClick(sectionId)}
                      className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors ${
                        isActive
                          ? "bg-neutral-950 font-medium text-white dark:bg-neutral-50 dark:text-neutral-950"
                          : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-50"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </a>
                  )
                })}
              </nav>
              <div className="absolute bottom-6 left-6 right-6">
                <div
                  className={`rounded-lg border p-4 ${
                    cms.hasUnsavedChanges
                      ? "border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/30"
                      : "border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/30"
                  }`}
                >
                  <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">Status</p>
                  <p
                    className={`mt-1 text-sm font-semibold ${
                      cms.hasUnsavedChanges
                        ? "text-amber-700 dark:text-amber-400"
                        : "text-emerald-700 dark:text-emerald-400"
                    }`}
                  >
                    {cms.hasUnsavedChanges ? "Unsaved Changes" : "Everything Saved"}
                  </p>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="mx-auto grid w-full max-w-7xl items-start gap-6 px-4 py-6 lg:grid-cols-[220px_1fr]">
        <aside className="sticky top-24 hidden lg:block">
          <nav className="max-h-[calc(100vh-8rem)] space-y-2 overflow-y-auto pr-2 pb-4 scrollbar-thin">
            {navItems.map((item) => {
              const Icon = item.icon
              const sectionId = item.href.slice(1)
              const isActive = activeSection === sectionId

              return (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "true" : undefined}
                  onClick={() => setActiveSection(sectionId)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                    isActive
                      ? "bg-neutral-950 font-medium text-white shadow-sm dark:bg-neutral-50 dark:text-neutral-950"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </a>
              )
            })}
          </nav>
        </aside>

        <div className="space-y-6 min-w-0 pb-24">
            <AdminOverview cms={cms} />
            <HeroEditor cms={cms} />
            <AboutEditor cms={cms} />
            <ExperienceEditor cms={cms} />
            <ProjectsEditor cms={cms} />
            <ContactFooterEditor cms={cms} />
            <ResumeManager cms={cms} />
        </div>
      </main>

      {cms.croppingImage && (
        <ImageCropperModal
          file={cms.croppingImage.file}
          aspect={cms.croppingImage.aspect}
          onComplete={cms.croppingImage.onComplete}
          onCancel={cms.handleCancelStaging}
        />
      )}

      <AnimatePresence>
        {cms.status.type !== "idle" && (
          <Toast status={cms.status} onClose={cms.clearStatus} />
        )}
      </AnimatePresence>
    </div>
  )
}
