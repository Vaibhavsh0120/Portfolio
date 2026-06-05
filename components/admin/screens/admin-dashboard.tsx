"use client"

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
  RefreshCw,
  Save,
  Sparkles,
  UserRound,
} from "lucide-react"

import type { AdminCmsController } from "@/components/admin/admin-types"
import { AboutEditor } from "@/components/admin/editors/about-editor"
import { ContactFooterEditor } from "@/components/admin/editors/contact-footer-editor"
import { ExperienceEditor } from "@/components/admin/editors/experience-editor"
import { HeroEditor } from "@/components/admin/editors/hero-editor"
import { ProjectsEditor } from "@/components/admin/editors/projects-editor"
import { ResumeManager } from "@/components/admin/editors/resume-manager"
import { AdminOverview } from "@/components/admin/admin-overview"
import ThemeToggle from "@/components/theme-toggle"
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
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <ThemeToggle />

      <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-neutral-900 dark:bg-neutral-950/90">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-3">
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
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-500">Signed in as {cms.user?.email}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => void cms.refreshBundle({ announce: true })} disabled={cms.loadingBundle}>
              {cms.loadingBundle ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
              Refresh
            </Button>
            <Button asChild variant="outline">
              <Link href="/" target="_blank">
                <ArrowUpRight className="mr-2 h-4 w-4" />
                Preview
              </Link>
            </Button>
            <Button onClick={cms.handleSaveContent} disabled={cms.saving || !cms.hasUnsavedChanges}>
              {cms.saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save
            </Button>
            <Button onClick={cms.handleLogout} variant="outline">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <nav className="sticky top-24 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-50"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </a>
              )
            })}
          </nav>
        </aside>

        <div className="space-y-6">
          <AdminOverview cms={cms} />
          <HeroEditor cms={cms} />
          <AboutEditor cms={cms} />
          <ExperienceEditor cms={cms} />
          <ProjectsEditor cms={cms} />
          <ContactFooterEditor cms={cms} />
          <ResumeManager cms={cms} />
        </div>
      </main>
    </div>
  )
}
