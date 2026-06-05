"use client"

import { Contact, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { AdminCmsController } from "@/components/admin/admin-types"
import {
  CollectionHeader,
  EmptyState,
  SectionPanel,
  TextAreaField,
  TextField,
  inputClassName,
  itemClassName,
} from "@/components/admin/admin-ui"
import { SocialLinksEditor } from "@/components/admin/editors/social-links-editor"
import { removeAt, updateAt } from "@/lib/admin/cms-utils"

export function ContactFooterEditor({ cms }: { cms: AdminCmsController }) {
  const { content, setContent } = cms

  return (
    <SectionPanel
      id="contact"
      icon={Contact}
      title="Contact and Footer"
      description="Contact CTA, detail links, response copy, and footer social links."
      count={`${content.contact.details.length} details`}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <TextField label="Contact Badge" value={content.contact.badge} onChange={(value) => setContent({ ...content, contact: { ...content.contact, badge: value } })} />
        <TextField label="Contact Title" value={content.contact.title} onChange={(value) => setContent({ ...content, contact: { ...content.contact, title: value } })} />
        <TextField label="Form Title" value={content.contact.formTitle} onChange={(value) => setContent({ ...content, contact: { ...content.contact, formTitle: value } })} />
        <TextField label="Intro Title" value={content.contact.introTitle} onChange={(value) => setContent({ ...content, contact: { ...content.contact, introTitle: value } })} />
        <TextAreaField
          label="Contact Description"
          value={content.contact.description}
          rows={3}
          className="md:col-span-2"
          onChange={(value) => setContent({ ...content, contact: { ...content.contact, description: value } })}
        />
        <TextAreaField
          label="Intro Description"
          value={content.contact.introDescription}
          rows={3}
          className="md:col-span-2"
          onChange={(value) => setContent({ ...content, contact: { ...content.contact, introDescription: value } })}
        />
        <TextField
          label="Response Time Title"
          value={content.contact.responseTimeTitle}
          onChange={(value) => setContent({ ...content, contact: { ...content.contact, responseTimeTitle: value } })}
        />
        <TextAreaField
          label="Response Time Description"
          value={content.contact.responseTimeDescription}
          rows={2}
          onChange={(value) => setContent({ ...content, contact: { ...content.contact, responseTimeDescription: value } })}
        />
      </div>

      <div className="space-y-3">
        <CollectionHeader
          title="Contact Details"
          count={content.contact.details.length}
          addLabel="Add Detail"
          onAdd={() =>
            setContent({
              ...content,
              contact: {
                ...content.contact,
                details: [...content.contact.details, { title: "New Detail", content: "Value", href: "#", description: "Description" }],
              },
            })
          }
        />
        {content.contact.details.length === 0 ? <EmptyState label="No contact details yet." /> : null}
        {content.contact.details.map((detail, index) => (
          <div key={`${detail.title}-${index}`} className={`grid gap-3 md:grid-cols-2 ${itemClassName}`}>
            <input
              className={inputClassName}
              value={detail.title}
              onChange={(event) =>
                setContent({
                  ...content,
                  contact: { ...content.contact, details: updateAt(content.contact.details, index, (item) => ({ ...item, title: event.target.value })) },
                })
              }
              placeholder="Title"
            />
            <input
              className={inputClassName}
              value={detail.content}
              onChange={(event) =>
                setContent({
                  ...content,
                  contact: { ...content.contact, details: updateAt(content.contact.details, index, (item) => ({ ...item, content: event.target.value })) },
                })
              }
              placeholder="Content"
            />
            <input
              className={inputClassName}
              value={detail.href}
              onChange={(event) =>
                setContent({
                  ...content,
                  contact: { ...content.contact, details: updateAt(content.contact.details, index, (item) => ({ ...item, href: event.target.value })) },
                })
              }
              placeholder="Href"
            />
            <div className="grid gap-3 md:grid-cols-[1fr_auto]">
              <input
                className={inputClassName}
                value={detail.description}
                onChange={(event) =>
                  setContent({
                    ...content,
                    contact: {
                      ...content.contact,
                      details: updateAt(content.contact.details, index, (item) => ({ ...item, description: event.target.value })),
                    },
                  })
                }
                placeholder="Description"
              />
              <Button
                variant="outline"
                size="icon"
                title="Remove detail"
                onClick={() => setContent({ ...content, contact: { ...content.contact, details: removeAt(content.contact.details, index) } })}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TextField label="Footer Name" value={content.footer.name} onChange={(value) => setContent({ ...content, footer: { ...content.footer, name: value } })} />
        <TextField label="Footer Tagline" value={content.footer.tagline} onChange={(value) => setContent({ ...content, footer: { ...content.footer, tagline: value } })} />
      </div>
      <SocialLinksEditor links={content.footer.socialLinks} onChange={(links) => setContent({ ...content, footer: { ...content.footer, socialLinks: links } })} />
    </SectionPanel>
  )
}
