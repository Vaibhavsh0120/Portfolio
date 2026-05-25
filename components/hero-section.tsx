"use client"

import { motion } from "framer-motion"
import { Github, Linkedin, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { HeroContent, ResumeVersion } from "@/lib/portfolio/types"

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.02,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="h-full w-full text-slate-950 dark:text-white" viewBox="0 0 696 316" fill="none">
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.05 + path.id * 0.02}
            initial={{ pathLength: 0.3, opacity: 0.4 }}
            animate={{
              pathLength: 1,
              opacity: [0.2, 0.4, 0.2],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 25 + Math.random() * 15,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  )
}

function getSocialIcon(label: string, href: string) {
  const key = `${label} ${href}`.toLowerCase()

  if (key.includes("github")) {
    return Github
  }

  if (key.includes("linkedin")) {
    return Linkedin
  }

  return Mail
}

interface HeroSectionProps {
  hero: HeroContent
  currentResume: ResumeVersion
}

export default function HeroSection({ hero, currentResume }: HeroSectionProps) {
  const { name, title, description, eyebrow, primaryButtonLabel, secondaryButtonLabel, socialLinks } = hero

  const scrollToProjects = () => {
    const projectsSection = document.getElementById("projects")
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-white dark:bg-neutral-950">
      <div className="absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center md:px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="mx-auto max-w-4xl"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mb-4 md:mb-6"
          >
            <span className="text-xs font-medium uppercase tracking-wider text-neutral-600 dark:text-neutral-400 md:text-sm">
              {eyebrow}
            </span>
          </motion.div>

          <h1 className="mb-3 text-4xl font-bold leading-tight tracking-tighter sm:text-6xl md:mb-4 md:text-7xl lg:text-8xl">
            {name.split("").map((letter, index) => (
              <motion.span
                key={index}
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: 0.8 + index * 0.05,
                  type: "spring",
                  stiffness: 150,
                  damping: 25,
                }}
                className="inline-block bg-gradient-to-r from-neutral-900 to-neutral-700/80 bg-clip-text text-transparent dark:from-white dark:to-white/80"
              >
                {letter === " " ? "\u00A0" : letter}
              </motion.span>
            ))}
          </h1>

          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="mb-6 text-lg font-light text-neutral-600 dark:text-neutral-300 sm:text-xl md:mb-8 md:text-2xl lg:text-3xl"
          >
            {title}
          </motion.h2>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.8 }}
            className="mx-auto mb-8 max-w-2xl px-4 text-base leading-relaxed text-neutral-600 dark:text-neutral-400 md:mb-12 md:px-0 md:text-lg"
          >
            {description}
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 2.1, duration: 0.8 }}
            className="mb-12 flex flex-col items-center justify-center gap-3 px-4 md:mb-16 md:px-0 sm:flex-row md:gap-4"
          >
            <div className="group relative inline-block w-full overflow-hidden rounded-2xl bg-gradient-to-b from-black/10 to-white/10 p-px shadow-lg transition-shadow duration-300 hover:shadow-xl dark:from-white/10 dark:to-black/10 sm:w-auto">
              <Button
                onClick={scrollToProjects}
                variant="ghost"
                className="w-full rounded-[1.15rem] border border-black/10 bg-white/95 px-6 py-4 text-base font-semibold text-black backdrop-blur-md transition-all duration-300 group-hover:-translate-y-0.5 hover:bg-white/100 hover:shadow-md dark:border-white/10 dark:bg-black/95 dark:text-white dark:hover:bg-black/100 dark:hover:shadow-neutral-800/50 md:px-8 md:py-6 md:text-lg sm:w-auto"
              >
                <span className="opacity-90 transition-opacity group-hover:opacity-100">{primaryButtonLabel}</span>
                <span className="ml-3 opacity-70 transition-all duration-300 group-hover:translate-x-1.5 group-hover:opacity-100">
                  -&gt;
                </span>
              </Button>
            </div>

            <Button
              variant="outline"
              className="w-full rounded-2xl border-2 border-neutral-200 bg-transparent px-6 py-4 text-base font-medium transition-all duration-300 hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:border-neutral-700 dark:hover:bg-neutral-900/50 md:px-8 md:py-6 md:text-lg sm:w-auto"
              asChild
            >
              <a href={currentResume.downloadUrl} download={currentResume.fileName}>
                {secondaryButtonLabel}
              </a>
            </Button>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 2.4, duration: 0.8 }}
            className="flex items-center justify-center gap-4 md:gap-6"
          >
            {socialLinks.map((social) => {
              const Icon = getSocialIcon(social.label, social.href)

              return (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-full bg-neutral-100 p-2.5 text-neutral-600 shadow-sm transition-all duration-300 hover:bg-neutral-200 hover:text-neutral-900 hover:shadow-md dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-100 md:p-3"
                  aria-label={social.label}
                >
                  <Icon size={18} className="md:h-5 md:w-5" />
                </motion.a>
              )
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
