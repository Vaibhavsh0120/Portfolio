"use client"

import { ImagePlus, Trash2, UserRound } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import type { AdminCmsController } from "@/components/admin/admin-types"
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
} from "@/components/admin/admin-ui"
import { joinCommaList, newSkill, newTrait, removeAt, splitCommaList, updateAt } from "@/lib/admin/cms-utils"

export function AboutEditor({ cms }: { cms: AdminCmsController }) {
  const { content, setContent } = cms

  return (
    <SectionPanel
      id="about"
      icon={UserRound}
      title="About"
      description="Bio copy, profile image, traits, and skill cards."
      count={`${content.about.traits.length} traits`}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <TextField label="Badge" value={content.about.badge} onChange={(value) => setContent({ ...content, about: { ...content.about, badge: value } })} />
        <TextField label="Title" value={content.about.title} onChange={(value) => setContent({ ...content, about: { ...content.about, title: value } })} />
        <TextField
          label="Summary Title"
          value={content.about.summaryTitle}
          onChange={(value) => setContent({ ...content, about: { ...content.about, summaryTitle: value } })}
        />
        <TextField label="Image Alt Text" value={content.about.imageAlt} onChange={(value) => setContent({ ...content, about: { ...content.about, imageAlt: value } })} />
        <TextAreaField
          label="Description"
          value={content.about.description}
          rows={3}
          className="md:col-span-2"
          onChange={(value) => setContent({ ...content, about: { ...content.about, description: value } })}
        />
        <TextAreaField
          label="Summary Body"
          value={content.about.summaryBody}
          rows={4}
          className="md:col-span-2"
          onChange={(value) => setContent({ ...content, about: { ...content.about, summaryBody: value } })}
        />
      </div>

      <div className={itemClassName}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="font-medium">About Image</p>
            <p className="truncate text-sm text-neutral-500 dark:text-neutral-500">{content.about.imageUrl || "No image uploaded"}</p>
          </div>
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
                  void cms.handleUploadAboutImage(file)
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
            className="mt-4 max-h-64 w-full rounded-lg object-cover md:w-auto"
          />
        ) : null}
      </div>

      <div className="space-y-3">
        <CollectionHeader
          title="Traits"
          count={content.about.traits.length}
          addLabel="Add Trait"
          onAdd={() => setContent({ ...content, about: { ...content.about, traits: [...content.about.traits, { ...newTrait }] } })}
        />
        {content.about.traits.length === 0 ? <EmptyState label="No traits added yet." /> : null}
        {content.about.traits.map((trait, index) => (
          <div key={`${trait.title}-${index}`} className={`grid gap-3 md:grid-cols-[1fr_2fr_auto] ${itemClassName}`}>
            <input
              className={inputClassName}
              value={trait.title}
              onChange={(event) =>
                setContent({
                  ...content,
                  about: {
                    ...content.about,
                    traits: updateAt(content.about.traits, index, (item) => ({ ...item, title: event.target.value })),
                  },
                })
              }
              placeholder="Title"
            />
            <input
              className={inputClassName}
              value={trait.description}
              onChange={(event) =>
                setContent({
                  ...content,
                  about: {
                    ...content.about,
                    traits: updateAt(content.about.traits, index, (item) => ({ ...item, description: event.target.value })),
                  },
                })
              }
              placeholder="Description"
            />
            <Button
              variant="outline"
              size="icon"
              title="Remove trait"
              onClick={() => setContent({ ...content, about: { ...content.about, traits: removeAt(content.about.traits, index) } })}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TextField label="Skills Badge" value={content.about.skillBadge} onChange={(value) => setContent({ ...content, about: { ...content.about, skillBadge: value } })} />
        <TextField label="Skills Title" value={content.about.skillTitle} onChange={(value) => setContent({ ...content, about: { ...content.about, skillTitle: value } })} />
      </div>

      <div className="space-y-3">
        <CollectionHeader
          title="Skill Cards"
          count={content.about.skills.length}
          addLabel="Add Skill"
          onAdd={() => setContent({ ...content, about: { ...content.about, skills: [...content.about.skills, { ...newSkill }] } })}
        />
        {content.about.skills.length === 0 ? <EmptyState label="No skill cards yet." /> : null}
        {content.about.skills.map((skill, index) => (
          <div key={`${skill.title}-${index}`} className={`space-y-3 ${itemClassName}`}>
            <div className="grid gap-3 md:grid-cols-[1fr_auto]">
              <input
                className={inputClassName}
                value={skill.title}
                onChange={(event) =>
                  setContent({
                    ...content,
                    about: {
                      ...content.about,
                      skills: updateAt(content.about.skills, index, (item) => ({ ...item, title: event.target.value })),
                    },
                  })
                }
                placeholder="Skill title"
              />
              <Button
                variant="outline"
                size="icon"
                title="Remove skill"
                onClick={() => setContent({ ...content, about: { ...content.about, skills: removeAt(content.about.skills, index) } })}
              >
                <Trash2 className="h-4 w-4" />
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
                    skills: updateAt(content.about.skills, index, (item) => ({ ...item, description: event.target.value })),
                  },
                })
              }
              placeholder="Description"
            />
            <input
              className={inputClassName}
              value={joinCommaList(skill.technologies)}
              onChange={(event) =>
                setContent({
                  ...content,
                  about: {
                    ...content.about,
                    skills: updateAt(content.about.skills, index, (item) => ({ ...item, technologies: splitCommaList(event.target.value) })),
                  },
                })
              }
              placeholder="Comma separated technologies"
            />
          </div>
        ))}
      </div>
    </SectionPanel>
  )
}
