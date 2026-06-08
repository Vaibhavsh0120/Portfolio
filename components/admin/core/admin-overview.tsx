"use client"

import { CheckCircle2, Database, FileText, FolderKanban } from "lucide-react"
import { Mosaic } from "react-loading-indicators"

import type { AdminCmsController } from "@/components/admin/core/admin-types"
import { MetricCard, StatusBanner } from "@/components/admin/core/admin-ui"
import { describeSource, formatDate } from "@/lib/cms/cms-utils"

export function AdminOverview({ cms }: { cms: AdminCmsController }) {
  return (
    <section id="overview" className="scroll-mt-24 space-y-4 overflow-hidden">
      <StatusBanner status={cms.status} />
      {cms.loadingBundle ? (
        <div className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300 sm:gap-4 sm:px-5 sm:py-4">
          <div className="shrink-0">
            {cms.mounted ? (
              <Mosaic color={cms.loaderColor} size="small" text="" textColor="" />
            ) : (
              <div className="h-6 w-6 rounded-lg bg-neutral-200 dark:bg-neutral-800" />
            )}
          </div>
          <span className="font-medium truncate sm:whitespace-normal">Loading content from Firebase...</span>
        </div>
      ) : null}
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Content Source" value={describeSource(cms.bundleMeta.contentSource)} icon={Database} />
        <MetricCard label="Resume Source" value={describeSource(cms.bundleMeta.resumeSource)} icon={FileText} />
        <MetricCard label="Projects" value={String(cms.content.projects.items.length)} icon={FolderKanban} />
        <MetricCard label="Last Updated" value={formatDate(cms.content.updatedAtMs)} icon={CheckCircle2} />
      </div>
    </section>
  )
}
