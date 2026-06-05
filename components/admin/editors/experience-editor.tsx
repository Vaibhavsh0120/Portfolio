"use client"

import { Briefcase, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { AdminCmsController } from "@/components/admin/admin-types"
import {
  CollectionHeader,
  EmptyState,
  SectionPanel,
  TextField,
  inputClassName,
  itemClassName,
  textareaClassName,
} from "@/components/admin/admin-ui"
import { joinCommaList, newExperienceProject, removeAt, splitCommaList, updateAt } from "@/lib/admin/cms-utils"

export function ExperienceEditor({ cms }: { cms: AdminCmsController }) {
  const { content, setContent } = cms

  return (
    <SectionPanel
      id="experience"
      icon={Briefcase}
      title="Experience"
      description="Timeline entries, role summaries, and project highlights."
      count={`${content.experience.items.length} roles`}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <TextField label="Badge" value={content.experience.badge} onChange={(value) => setContent({ ...content, experience: { ...content.experience, badge: value } })} />
        <TextField label="Title" value={content.experience.title} onChange={(value) => setContent({ ...content, experience: { ...content.experience, title: value } })} />
      </div>

      <CollectionHeader
        title="Experience Items"
        count={content.experience.items.length}
        addLabel="Add Experience"
        onAdd={() =>
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
                  projects: [{ ...newExperienceProject }],
                  technologies: ["Technology"],
                },
              ],
            },
          })
        }
      />
      {content.experience.items.length === 0 ? <EmptyState label="No experience entries yet." /> : null}
      {content.experience.items.map((item, index) => (
        <div key={`${item.company}-${index}`} className={`space-y-4 ${itemClassName}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-medium">Role {index + 1}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setContent({ ...content, experience: { ...content.experience, items: removeAt(content.experience.items, index) } })}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove
            </Button>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <input
              className={inputClassName}
              value={item.company}
              onChange={(event) =>
                setContent({
                  ...content,
                  experience: {
                    ...content.experience,
                    items: updateAt(content.experience.items, index, (entry) => ({ ...entry, company: event.target.value })),
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
                    items: updateAt(content.experience.items, index, (entry) => ({ ...entry, role: event.target.value })),
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
                    items: updateAt(content.experience.items, index, (entry) => ({ ...entry, period: event.target.value })),
                  },
                })
              }
              placeholder="Period"
            />
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
                  items: updateAt(content.experience.items, index, (entry) => ({ ...entry, description: event.target.value })),
                },
              })
            }
            placeholder="Role description"
          />
          <input
            className={inputClassName}
            value={joinCommaList(item.technologies)}
            onChange={(event) =>
              setContent({
                ...content,
                experience: {
                  ...content.experience,
                  items: updateAt(content.experience.items, index, (entry) => ({ ...entry, technologies: splitCommaList(event.target.value) })),
                },
              })
            }
            placeholder="Comma separated technologies"
          />

          <CollectionHeader
            title="Projects"
            count={item.projects.length}
            addLabel="Add Project"
            onAdd={() =>
              setContent({
                ...content,
                experience: {
                  ...content.experience,
                  items: updateAt(content.experience.items, index, (entry) => ({
                    ...entry,
                    projects: [...entry.projects, { ...newExperienceProject }],
                  })),
                },
              })
            }
          />
          {item.projects.map((project, projectIndex) => (
            <div key={`${project.title}-${projectIndex}`} className="grid gap-3 rounded-lg border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-950 md:grid-cols-[1fr_2fr_auto]">
              <input
                className={inputClassName}
                value={project.title}
                onChange={(event) =>
                  setContent({
                    ...content,
                    experience: {
                      ...content.experience,
                      items: updateAt(content.experience.items, index, (entry) => ({
                        ...entry,
                        projects: updateAt(entry.projects, projectIndex, (entryProject) => ({ ...entryProject, title: event.target.value })),
                      })),
                    },
                  })
                }
                placeholder="Project"
              />
              <input
                className={inputClassName}
                value={project.description}
                onChange={(event) =>
                  setContent({
                    ...content,
                    experience: {
                      ...content.experience,
                      items: updateAt(content.experience.items, index, (entry) => ({
                        ...entry,
                        projects: updateAt(entry.projects, projectIndex, (entryProject) => ({ ...entryProject, description: event.target.value })),
                      })),
                    },
                  })
                }
                placeholder="Description"
              />
              <Button
                variant="outline"
                size="icon"
                title="Remove project"
                onClick={() =>
                  setContent({
                    ...content,
                    experience: {
                      ...content.experience,
                      items: updateAt(content.experience.items, index, (entry) => ({
                        ...entry,
                        projects: removeAt(entry.projects, projectIndex),
                      })),
                    },
                  })
                }
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      ))}
    </SectionPanel>
  )
}
