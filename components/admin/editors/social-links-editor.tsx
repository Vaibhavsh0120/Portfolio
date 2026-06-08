"use client"

import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CollectionHeader, EmptyState, inputClassName, itemClassName } from "@/components/admin/core/admin-ui"
import { newSocialLink, removeAt, updateAt } from "@/lib/cms/cms-utils"
import type { SocialLink } from "@/lib/cms/types"

export function SocialLinksEditor({
  links,
  onChange,
}: {
  links: SocialLink[]
  onChange: (links: SocialLink[]) => void
}) {
  return (
    <div className="space-y-3">
      <CollectionHeader
        title="Social Links"
        count={links.length}
        addLabel="Add Link"
        onAdd={() => onChange([...links, { ...newSocialLink }])}
      />
      {links.length === 0 ? <EmptyState label="No social links yet." /> : null}
      {links.map((link, index) => (
        <div key={`${link.label}-${index}`} className={`grid gap-3 md:grid-cols-[1fr_2fr_auto] ${itemClassName}`}>
          <input
            className={inputClassName}
            value={link.label}
            onChange={(event) => onChange(updateAt(links, index, (item) => ({ ...item, label: event.target.value })))}
            placeholder="Label"
          />
          <input
            className={inputClassName}
            value={link.href}
            onChange={(event) => onChange(updateAt(links, index, (item) => ({ ...item, href: event.target.value })))}
            placeholder="https://"
          />
          <Button variant="outline" size="icon" title="Remove link" onClick={() => onChange(removeAt(links, index))}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}
