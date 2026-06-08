"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { cn } from "@/lib/core/utils"

export default function ThemeToggle({ className, inline = false }: { className?: string; inline?: boolean }) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return a neutral placeholder to prevent layout shift
    return (
      <div className={cn(!inline && "fixed top-4 right-4 md:top-6 md:right-6 z-50", className)}>
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "relative w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm border-neutral-200 dark:border-neutral-700 shadow-lg transition-all duration-500",
            inline && "w-9 h-9 md:w-9 md:h-9 shadow-none border-none bg-transparent dark:bg-transparent"
          )}
          disabled
        >
          <div className="h-4 w-4 md:h-5 md:w-5" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    )
  }

  const isDark = resolvedTheme === "dark"

  const handleToggle = () => {
    // If currently on system theme, switch to the opposite of current resolved theme
    if (theme === "system") {
      setTheme(isDark ? "light" : "dark")
    } else {
      // If already on manual theme, toggle between light and dark
      setTheme(theme === "dark" ? "light" : "dark")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(!inline && "fixed top-4 right-4 md:top-6 md:right-6 z-50", className)}
    >
      <Button
        variant="outline"
        size="icon"
        onClick={handleToggle}
        className={cn(
          "relative w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm border-neutral-200 dark:border-neutral-700 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-110 active:scale-95 hover:bg-white dark:hover:bg-neutral-800",
          inline &&
            "w-9 h-9 md:w-9 md:h-9 shadow-none border-none bg-transparent dark:bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:scale-100"
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Moon className="h-4 w-4 text-neutral-700 dark:text-neutral-300" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Sun className="h-4 w-4 text-neutral-700 dark:text-neutral-300" />
            </motion.div>
          )}
        </AnimatePresence>
        <span className="sr-only">Toggle theme</span>
      </Button>
    </motion.div>
  )
}
