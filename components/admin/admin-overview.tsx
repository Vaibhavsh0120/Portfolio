"use client"

import { CheckCircle2, Database, FileText, FolderKanban } from "lucide-react"
import { Mosaic } from "react-loading-indicators"

import type { AdminCmsController } from "@/components/admin/admin-types"
import { MetricCard, StatusBanner } from "@/components/admin/admin-ui"
import { describeSource, formatDate } from "@/lib/admin/cms-utils"

export function AdminOverview({ cms }: { cms: AdminCmsController }) {
  return (
    <section id="overview" className="scroll-mt-24 space-y-4">
      <StatusBanner status={cms.status} />
      {cms.loadingBundle ? (
        <div className="flex items-center gap-4 rounded-lg border border-neutral-200 bg-white px-5 py-4 text-sm text-neutral-700 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300">
          {cms.mounted ? (
            <Mosaic color={cms.loaderColor} size="small" text="" textColor="" />
          ) : (
            <div className="h-6 w-6 rounded-lg bg-neutral-200 dark:bg-neutral-800" />
          )}
          <span className="font-medium">Loading content from Firebase...</span>
        </div>
      ) : null}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Content Source" value={describeSource(cms.bundleMeta.contentSource)} icon={Database} />
        <MetricCard label="Resume Source" value={describeSource(cms.bundleMeta.resumeSource)} icon={FileText} />
        <MetricCard label="Projects" value={String(cms.content.projects.items.length)} icon={FolderKanban} />
        <MetricCard label="Last Updated" value={formatDate(cms.content.updatedAtMs)} icon={CheckCircle2} />
      </div>
    </section>
  )
}
