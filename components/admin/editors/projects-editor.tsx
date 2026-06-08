"use client"

import { ArrowUpRight, FolderKanban, ImagePlus, Trash2 } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import type { AdminCmsController } from "@/components/admin/core/admin-types"
import {
  CollectionHeader,
  EmptyState,
  SectionPanel,
  TextAreaField,
  TextField,
  UploadLabel,
  inputClassName,
  itemClassName,
  textareaClassName,
} from "@/components/admin/core/admin-ui"
import { createProject, joinCommaList, removeAt, splitCommaList, updateAt } from "@/lib/cms/cms-utils"

export function ProjectsEditor({ cms }: { cms: AdminCmsController }) {
  const { content, setContent } = cms

  return (
    <SectionPanel
      id="projects"
      icon={FolderKanban}
      title="Projects"
      description="Case studies, featured flags, links, images, and stats."
      count={`${content.projects.items.length} projects`}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <TextField label="Badge" value={content.projects.badge} onChange={(value) => setContent({ ...content, projects: { ...content.projects, badge: value } })} />
        <TextField label="Title" value={content.projects.title} onChange={(value) => setContent({ ...content, projects: { ...content.projects, title: value } })} />
        <TextField
          label="Other Projects Badge"
          value={content.projects.otherProjectsBadge}
          onChange={(value) => setContent({ ...content, projects: { ...content.projects, otherProjectsBadge: value } })}
        />
        <TextField
          label="Other Projects Title"
          value={content.projects.otherProjectsTitle}
          onChange={(value) => setContent({ ...content, projects: { ...content.projects, otherProjectsTitle: value } })}
        />
        <TextAreaField
          label="Description"
          value={content.projects.description}
          rows={3}
          className="md:col-span-2"
          onChange={(value) => setContent({ ...content, projects: { ...content.projects, description: value } })}
        />
      </div>

      <CollectionHeader
        title="Project Items"
        count={content.projects.items.length}
        addLabel="Add Project"
        onAdd={() => setContent({ ...content, projects: { ...content.projects, items: [...content.projects.items, createProject()] } })}
      />
      {content.projects.items.length === 0 ? <EmptyState label="No projects yet." /> : null}
      {content.projects.items.map((project, index) => (
        <div key={`${project.title}-${index}`} className={`space-y-4 ${itemClassName}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-medium">{project.title || `Project ${index + 1}`}</p>
              <p className="text-sm text-neutral-500 dark:text-neutral-500">{project.featured ? "Featured project" : "Standard project"}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setContent({ ...content, projects: { ...content.projects, items: removeAt(content.projects.items, index) } })}>
              <Trash2 className="mr-2 h-4 w-4" />
              Remove
            </Button>
          </div>

          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <input
              className={inputClassName}
              value={project.title}
              onChange={(event) =>
                setContent({
                  ...content,
                  projects: {
                    ...content.projects,
                    items: updateAt(content.projects.items, index, (item) => ({ ...item, title: event.target.value })),
                  },
                })
              }
              placeholder="Project title"
            />
            <label className="flex h-11 items-center gap-3 rounded-lg border border-neutral-200 bg-white px-3 text-sm dark:border-neutral-800 dark:bg-neutral-950">
              <input
                type="checkbox"
                checked={project.featured}
                onChange={(event) =>
                  setContent({
                    ...content,
                    projects: {
                      ...content.projects,
                      items: updateAt(content.projects.items, index, (item) => ({ ...item, featured: event.target.checked })),
                    },
                  })
                }
              />
              Featured
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
                  items: updateAt(content.projects.items, index, (item) => ({ ...item, description: event.target.value })),
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
                    items: updateAt(content.projects.items, index, (item) => ({ ...item, liveUrl: event.target.value })),
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
                    items: updateAt(content.projects.items, index, (item) => ({ ...item, githubUrl: event.target.value })),
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
                    items: updateAt(content.projects.items, index, (item) => ({ ...item, stats: { ...item.stats, stars: event.target.value } })),
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
                    items: updateAt(content.projects.items, index, (item) => ({ ...item, stats: { ...item.stats, views: event.target.value } })),
                  },
                })
              }
              placeholder="Stat 2"
            />
            <input
              className={inputClassName}
              value={project.achievement ?? ""}
              onChange={(event) =>
                setContent({
                  ...content,
                  projects: {
                    ...content.projects,
                    items: updateAt(content.projects.items, index, (item) => ({ ...item, achievement: event.target.value })),
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
                    items: updateAt(content.projects.items, index, (item) => ({ ...item, technologies: splitCommaList(event.target.value) })),
                  },
                })
              }
              placeholder="Comma separated technologies"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label>
              <UploadLabel>
                <ImagePlus className="mr-2 h-4 w-4" />
                Upload Image
              </UploadLabel>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (file) {
                    cms.handleStageProjectImage(index, file)
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
                className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-100"
              >
                Preview Link
                <ArrowUpRight className="h-4 w-4" />
              </a>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {project.image ? (
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                  {cms.pendingUploads.find((p) => p.type === "project" && p.projectIndex === index)
                    ? "Preview (Unsaved)"
                    : "Current Image"}
                </p>
                <div className="relative min-h-[200px] overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    unoptimized
                    className="object-contain bg-neutral-100/50 dark:bg-neutral-900/50"
                  />
                </div>
              </div>
            ) : null}

            {cms.pendingUploads.find((p) => p.type === "project" && p.projectIndex === index) && (
              <div className="space-y-2 opacity-50 grayscale sm:opacity-100 sm:grayscale-0">
                <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">Original Image</p>
                <div className="relative h-48 sm:h-64 md:h-72 lg:h-80 w-full overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100/50 dark:border-neutral-800 dark:bg-neutral-900/50 aspect-[3/2]">
                  <Image
                    src={JSON.parse(cms.savedContentFingerprint).projects?.items?.[index]?.image || ""}
                    alt="Original"
                    fill
                    unoptimized
                    className="object-contain p-2 sm:p-4"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </SectionPanel>
  )
}
