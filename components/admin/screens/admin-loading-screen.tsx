"use client"

import { Mosaic } from "react-loading-indicators"

import ThemeToggle from "@/components/theme-toggle"

export function AdminLoadingScreen({ mounted, loaderColor }: { mounted: boolean; loaderColor: string }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-100 px-4 dark:bg-neutral-950">
      <ThemeToggle />
      <div className="relative flex flex-col items-center gap-5 rounded-lg border border-white/70 bg-white/75 px-10 py-9 text-neutral-700 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-neutral-900/70 dark:text-neutral-300">
        {mounted ? (
          <Mosaic color={loaderColor} size="large" text="" textColor="" />
        ) : (
          <div className="h-10 w-10 rounded-lg bg-neutral-200 dark:bg-neutral-800" />
        )}
        <span className="text-sm font-medium uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">
          Preparing the CMS
        </span>
      </div>
    </div>
  )
}
