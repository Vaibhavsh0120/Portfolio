"use client"

import { motion } from "framer-motion"
import { Briefcase, Calendar } from "lucide-react"

import { ExperienceContent } from "@/lib/portfolio/types"

interface ExperienceSectionProps {
  experience: ExperienceContent
}

export default function ExperienceSection({ experience }: ExperienceSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55 }}
      viewport={{ once: true }}
      className="mb-16 md:mb-20"
    >
      <div className="mb-12 text-center md:mb-16">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.42 }}
          viewport={{ once: true }}
          className="mb-4 inline-block"
        >
          <span className="rounded-full border border-neutral-300/20 bg-neutral-200/50 px-4 py-2 text-sm font-medium text-neutral-600 backdrop-blur-sm dark:border-neutral-700/20 dark:bg-neutral-800/50 dark:text-neutral-400">
            {experience.badge}
          </span>
        </motion.div>
        <h3 className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 bg-clip-text text-2xl font-semibold text-transparent dark:from-white dark:via-neutral-200 dark:to-white md:text-3xl">
          {experience.title}
        </h3>
      </div>

      <div className="space-y-6 md:space-y-8">
        {experience.items.map((item, index) => (
          <motion.div
            key={`${item.company}-${item.role}-${index}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: index * 0.09 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-neutral-200/40 via-neutral-300/40 to-neutral-200/40 opacity-50 blur-xl dark:from-neutral-700/40 dark:via-neutral-600/40 dark:to-neutral-700/40" />

            <div className="relative rounded-2xl border border-neutral-200/50 bg-white/60 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/80 dark:border-neutral-700/50 dark:bg-neutral-800/60 dark:hover:bg-neutral-800/80 md:p-8">
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-neutral-100 to-neutral-200 shadow-lg dark:from-neutral-700 dark:to-neutral-600 md:h-14 md:w-14">
                    <Briefcase className="h-6 w-6 text-neutral-600 dark:text-neutral-300 md:h-7 md:w-7" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-neutral-900 dark:text-white md:text-xl">{item.company}</h4>
                    <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 md:text-base">{item.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 md:ml-auto">
                  <Calendar className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                  <span className="inline-block rounded-full bg-neutral-700 px-3 py-1.5 text-xs font-semibold text-white shadow-sm dark:bg-neutral-600 md:text-sm">
                    {item.period}
                  </span>
                </div>
              </div>

              <p className="mb-6 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 md:text-base">
                {item.description}
              </p>

              <div className="mb-6 space-y-4">
                {item.projects.map((project, projectIndex) => (
                  <div key={`${project.title}-${projectIndex}`} className="flex items-start gap-3">
                    <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-neutral-500 dark:bg-neutral-400" />
                    <div className="flex-1">
                      <h5 className="mb-1 text-sm font-semibold text-neutral-900 dark:text-white md:text-base">
                        {project.title}
                      </h5>
                      <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400 md:text-sm">
                        {project.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 border-t border-neutral-200/50 pt-4 dark:border-neutral-700/30">
                {item.technologies.map((technology) => (
                  <span
                    key={technology}
                    className="rounded-full border border-neutral-300/20 bg-gradient-to-r from-neutral-100 to-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 transition-transform duration-200 hover:scale-105 dark:border-neutral-600/20 dark:from-neutral-700 dark:to-neutral-600 dark:text-neutral-300 md:text-sm"
                  >
                    {technology}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
