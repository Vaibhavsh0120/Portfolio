"use client"

import { ArrowUpRight, FileText, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { AdminCmsController } from "@/components/admin/core/admin-types"
import { EmptyState, Field, SectionPanel, TextAreaField, TextField, inputClassName, itemClassName } from "@/components/admin/core/admin-ui"

export function ResumeManager({ cms }: { cms: AdminCmsController }) {
  return (
    <SectionPanel
      id="resume"
      icon={FileText}
      title="Resume Manager"
      description="Upload new PDFs, preserve old versions, and switch the active download."
      count={`${cms.resumes.length} versions`}
    >
      <div className={`space-y-4 ${itemClassName}`}>
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Resume Label" value={cms.resumeLabel} onChange={cms.setResumeLabel} placeholder="May 2026 Resume" />
          <Field label="PDF File" hint={cms.resumeFile?.name ?? "Choose a PDF to upload."}>
            <input className={inputClassName} type="file" accept="application/pdf" onChange={(event) => cms.setResumeFile(event.target.files?.[0] ?? null)} />
          </Field>
        </div>
        <TextAreaField label="Resume Note" value={cms.resumeNote} onChange={cms.setResumeNote} rows={3} placeholder="What changed in this version?" />
        <Button onClick={cms.handleResumeUpload} disabled={cms.saving || !cms.resumeFile}>
          <Upload className="mr-2 h-4 w-4" />
          Upload New Resume
        </Button>
      </div>

      <div className="space-y-3">
        {cms.resumes.length === 0 ? <EmptyState label="No resume versions found." /> : null}
        {cms.resumes.map((resume) => (
          <div key={resume.id ?? resume.storagePath} className={itemClassName}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium">{resume.label}</p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{resume.fileName}</p>
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-500">{resume.note || "No note"}</p>
              </div>
              {resume.isCurrent ? (
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                  Current
                </span>
              ) : null}
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={resume.downloadUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-neutral-700 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white"
              >
                Download
                <ArrowUpRight className="h-4 w-4" />
              </a>
              {!resume.isCurrent && resume.id ? (
                <Button size="sm" variant="outline" onClick={() => void cms.handleMakeCurrentResume(resume.id!)}>
                  Make Current
                </Button>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </SectionPanel>
  )
}
