"use client"

import { type ReactNode, useEffect, useRef } from "react"
import { CheckCircle2, Plus } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { StatusState } from "@/components/admin/core/admin-types"

export const inputClassName =
  "h-11 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 outline-none transition focus:border-neutral-500 focus:ring-2 focus:ring-neutral-200 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white dark:focus:border-neutral-500 dark:focus:ring-neutral-800"

export const textareaClassName =
  "w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-neutral-500 focus:ring-2 focus:ring-neutral-200 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white dark:focus:border-neutral-500 dark:focus:ring-neutral-800"

export const panelClassName = "border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950"

export const itemClassName =
  "rounded-lg border border-neutral-200 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-900/45"

type FieldProps = {
  label: string
  hint?: string
  children: ReactNode
  className?: string
}

type TextFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
  hint?: string
  className?: string
}

type TextAreaFieldProps = TextFieldProps & {
  rows?: number
}

export function StatusBanner({ status }: { status: StatusState }) {
  if (status.type === "idle") {
    return null
  }

  const styles =
    status.type === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/70 dark:bg-emerald-950/35 dark:text-emerald-300"
      : status.type === "error"
        ? "border-red-200 bg-red-50 text-red-800 dark:border-red-900/70 dark:bg-red-950/35 dark:text-red-300"
        : "border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-900/70 dark:bg-sky-950/35 dark:text-sky-300"

  return (
    <div className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-sm ${styles}`}>
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{status.message}</span>
    </div>
  )
}

export function Field({ label, hint, children, className }: FieldProps) {
  return (
    <label className={`block space-y-2 ${className ?? ""}`}>
      <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{label}</span>
      {children}
      {hint ? <span className="block text-xs text-neutral-500 dark:text-neutral-500">{hint}</span> : null}
    </label>
  )
}

export function TextField({ label, value, onChange, placeholder, type = "text", hint, className }: TextFieldProps) {
  return (
    <Field label={label} hint={hint} className={className}>
      <input
        className={inputClassName}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type={type}
        placeholder={placeholder}
      />
    </Field>
  )
}

export function TextAreaField({ label, value, onChange, placeholder, rows = 3, hint, className }: TextAreaFieldProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [value])

  return (
    <Field label={label} hint={hint} className={className}>
      <textarea
        ref={textareaRef}
        className={`${textareaClassName} resize-none overflow-hidden`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
      />
    </Field>
  )
}

export function SectionPanel({
  id,
  icon: Icon,
  title,
  description,
  count,
  children,
}: {
  id: string
  icon: LucideIcon
  title: string
  description: string
  count?: string
  children: ReactNode
}) {
  return (
    <Card id={id} className={`${panelClassName} scroll-mt-24 overflow-hidden`}>
      <CardHeader className="gap-1 border-b border-neutral-100 p-4 pb-5 dark:border-neutral-900 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <span className="shrink-0 rounded-lg border border-neutral-200 bg-neutral-50 p-2 dark:border-neutral-800 dark:bg-neutral-900">
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <CardTitle className="truncate text-lg sm:text-xl">{title}</CardTitle>
              <CardDescription className="mt-1 break-words leading-relaxed">{description}</CardDescription>
            </div>
          </div>
          {count ? (
            <span className="shrink-0 rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-600 dark:border-neutral-800 dark:text-neutral-400">
              {count}
            </span>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-6 p-4 pt-6 sm:p-6">{children}</CardContent>
    </Card>
  )
}

export function CollectionHeader({
  title,
  count,
  addLabel,
  onAdd,
}: {
  title: string
  count: number
  addLabel: string
  onAdd: () => void
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="font-medium truncate">{title}</p>
        <p className="text-sm text-neutral-500 dark:text-neutral-500">
          {count} item{count === 1 ? "" : "s"}
        </p>
      </div>
      <Button size="sm" variant="outline" onClick={onAdd} className="shrink-0">
        <Plus className="mr-2 h-4 w-4" />
        {addLabel}
      </Button>
    </div>
  )
}

export function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-lg border border-dashed border-neutral-300 px-4 py-6 text-center text-sm text-neutral-500 dark:border-neutral-800 dark:text-neutral-500">
      {label}
    </div>
  )
}

export function MetricCard({ label, value, icon: Icon }: { label: string; value: string; icon: LucideIcon }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-50/80 p-3 sm:p-4 dark:border-neutral-800 dark:bg-neutral-900/60">
      <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-neutral-500 dark:text-neutral-500">
        <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        <span className="truncate">{label}</span>
      </div>
      <p className="mt-1.5 sm:mt-2 text-base sm:text-lg font-semibold text-neutral-950 dark:text-neutral-50 truncate">{value}</p>
    </div>
  )
}

export function UploadLabel({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-10 cursor-pointer items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
      {children}
    </span>
  )
}
