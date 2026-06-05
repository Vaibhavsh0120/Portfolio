"use client"

import { Sparkles } from "lucide-react"

import type { AdminCmsController } from "@/components/admin/admin-types"
import { SectionPanel, TextAreaField, TextField } from "@/components/admin/admin-ui"
import { SocialLinksEditor } from "@/components/admin/editors/social-links-editor"

export function HeroEditor({ cms }: { cms: AdminCmsController }) {
  const { content, setContent } = cms

  return (
    <SectionPanel
      id="hero"
      icon={Sparkles}
      title="Hero"
      description="Top-of-page identity, intro copy, and action labels."
      count={`${content.hero.socialLinks.length} links`}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <TextField label="Eyebrow" value={content.hero.eyebrow} onChange={(value) => setContent({ ...content, hero: { ...content.hero, eyebrow: value } })} />
        <TextField label="Name" value={content.hero.name} onChange={(value) => setContent({ ...content, hero: { ...content.hero, name: value } })} />
        <TextField label="Title" value={content.hero.title} onChange={(value) => setContent({ ...content, hero: { ...content.hero, title: value } })} />
        <TextField
          label="Primary Button"
          value={content.hero.primaryButtonLabel}
          onChange={(value) => setContent({ ...content, hero: { ...content.hero, primaryButtonLabel: value } })}
        />
        <TextField
          label="Secondary Button"
          value={content.hero.secondaryButtonLabel}
          onChange={(value) => setContent({ ...content, hero: { ...content.hero, secondaryButtonLabel: value } })}
        />
        <TextAreaField
          label="Description"
          value={content.hero.description}
          rows={4}
          className="md:col-span-2"
          onChange={(value) => setContent({ ...content, hero: { ...content.hero, description: value } })}
        />
      </div>

      <SocialLinksEditor
        links={content.hero.socialLinks}
        onChange={(links) => setContent({ ...content, hero: { ...content.hero, socialLinks: links } })}
      />
    </SectionPanel>
  )
}
