"use client"

import { motion } from "framer-motion"
import ThemeToggle from "@/components/ui/theme-toggle"
import Image from "next/image"

type LoadingScreenProps = {
  label?: string
  title?: string
  showThemeToggle?: boolean
}

export function LoadingScreen({
  label = "Vaibhav Sharma",
  title = "Loading experience",
  showThemeToggle = true,
}: LoadingScreenProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-50 px-6 dark:bg-neutral-950">
      {showThemeToggle && <ThemeToggle />}
      
      {/* Dynamic Background */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.08),transparent_32%),radial-gradient(circle_at_bottom,rgba(115,115,115,0.14),transparent_34%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.10),transparent_28%),radial-gradient(circle_at_bottom,rgba(255,255,255,0.04),transparent_34%)]" 
      />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.45)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.45)_1px,transparent_1px)] bg-[size:72px_72px] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] dark:opacity-100" 
      />
      
      <div className="relative text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-[2rem] border border-white/70 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-white/10 dark:shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
        >
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="relative h-full w-full p-4"
          >
            {/* Light Mode Logo */}
            <div className="relative h-full w-full dark:hidden">
              <Image 
                src="/logo-light.png" 
                alt="Logo"
                fill
                className="object-contain"
                unoptimized
                priority
              />
            </div>
            
            {/* Dark Mode Logo */}
            <div className="relative hidden h-full w-full dark:block">
              <Image 
                src="/logo-dark.png" 
                alt="Logo"
                fill
                className="object-contain"
                unoptimized
                priority
              />
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {label && (
            <p className="mt-8 text-xs font-medium uppercase tracking-[0.35em] text-neutral-500 dark:text-neutral-400">
              {label}
            </p>
          )}
          
          {title && (
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
              {title}
            </h1>
          )}
        </motion.div>
      </div>
    </div>
  )
}
