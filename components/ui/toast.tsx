"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, AlertCircle, Info, X, Loader2 } from "lucide-react"
import { cn } from "@/lib/core/utils"
import type { StatusState } from "@/components/admin/core/admin-types"

type ToastProps = {
  status: StatusState
  onClose: () => void
}

export function Toast({ status, onClose }: ToastProps) {
  useEffect(() => {
    if (status.type !== "idle" && status.type !== "info") {
      const timer = setTimeout(() => {
        onClose()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [status, onClose])

  if (status.type === "idle") return null

  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
    error: <AlertCircle className="h-5 w-5 text-red-500" />,
    info: <Loader2 className="h-5 w-5 text-sky-500 animate-spin" />,
  }

  const styles = {
    success: "border-emerald-100 bg-white dark:bg-neutral-900 dark:border-emerald-900/30",
    error: "border-red-100 bg-white dark:bg-neutral-900 dark:border-red-900/30",
    info: "border-sky-100 bg-white dark:bg-neutral-900 dark:border-sky-900/30",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={cn(
        "fixed bottom-6 right-6 z-[110] flex w-full max-w-sm items-center gap-3 rounded-xl border p-4 shadow-lg sm:right-8",
        styles[status.type as keyof typeof styles]
      )}
    >
      <div className="shrink-0">{icons[status.type as keyof typeof icons] || <Info className="h-5 w-5 text-neutral-500" />}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
          {status.type.charAt(0).toUpperCase() + status.type.slice(1)}
        </p>
        <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">
          {status.message}
        </p>
      </div>
      <button
        onClick={onClose}
        className="shrink-0 rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-500 dark:hover:bg-neutral-800"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  )
}
