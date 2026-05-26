"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { ExternalLink, Github } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ProjectsContent } from "@/lib/portfolio/types"

function FloatingShapes() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 8 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${10 + i * 12}%`,
            top: `${5 + i * 8}%`,
          }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 180, 360],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <div
            className={`h-3 w-3 bg-gradient-to-r from-neutral-300/30 to-neutral-400/30 dark:from-neutral-600/30 dark:to-neutral-500/30 ${
              i % 2 === 0 ? "rounded-full" : "rotate-45"
            }`}
          />
        </motion.div>
      ))}
    </div>
  )
}

interface ProjectsSectionProps {
  projects: ProjectsContent
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const featuredProjects = projects.items.filter((project) => project.featured)
  const otherProjects = projects.items.filter((project) => !project.featured)

  return (
    <section
      id="projects"
      className="relative overflow-hidden bg-gradient-to-br from-white via-neutral-50 to-white py-16 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 md:py-24"
    >
      <FloatingShapes />

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          viewport={{ once: true }}
          className="mb-12 text-center md:mb-16"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.42 }}
            viewport={{ once: true }}
            className="mb-4 inline-block"
          >
            <span className="rounded-full border border-neutral-300/20 bg-neutral-200/50 px-4 py-2 text-sm font-medium text-neutral-600 backdrop-blur-sm dark:border-neutral-700/20 dark:bg-neutral-800/50 dark:text-neutral-400">
              {projects.badge}
            </span>
          </motion.div>

          <h2 className="mb-4 bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 bg-clip-text text-3xl font-bold text-transparent dark:from-white dark:via-neutral-200 dark:to-white md:mb-6 md:text-4xl lg:text-5xl">
            {projects.title}
          </h2>
          <p className="mx-auto max-w-3xl px-4 text-base text-neutral-600 dark:text-neutral-400 md:px-0 md:text-lg">
            {projects.description}
          </p>
        </motion.div>

        <div className="mb-16 space-y-16 md:mb-20 md:space-y-24">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={`${project.title}-${index}`}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: index * 0.12 }}
              viewport={{ once: true }}
              className={`grid items-center gap-8 md:gap-16 lg:grid-cols-2 ${
                index % 2 === 1 ? "lg:grid-flow-col-dense" : ""
              }`}
            >
              <div className={`${index % 2 === 1 ? "lg:col-start-2" : ""} order-1 lg:order-none`}>
                <div className="group relative">
                  <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-neutral-200/40 to-neutral-300/40 opacity-60 blur-2xl transition-all duration-500 group-hover:blur-3xl dark:from-neutral-700/40 dark:to-neutral-600/40" />
                  <div className="relative mx-auto max-w-2xl overflow-hidden rounded-2xl border border-neutral-200/50 shadow-2xl transition-shadow duration-500 group-hover:shadow-3xl dark:border-neutral-700/50 lg:mx-0">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      width={800}
                      height={600}
                      className="h-auto max-h-80 w-full object-cover transition-transform duration-700 group-hover:scale-105 md:max-h-96 lg:max-h-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>
                </div>
              </div>

              <div className={`${index % 2 === 1 ? "lg:col-start-1" : ""} order-2 lg:order-none`}>
                <div className="relative">
                  <div className="absolute -inset-6 rounded-3xl bg-gradient-to-r from-neutral-100/50 to-transparent opacity-50 blur-2xl dark:from-neutral-800/30 dark:to-transparent" />
                  <div className="relative">
                    <div className="mb-4">
                      <h3 className="mb-3 text-2xl font-bold text-neutral-900 dark:text-white md:text-3xl">
                        {project.title}
                      </h3>
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                        <div className="flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
                          <div className="flex items-center gap-1">
                            <span className="font-medium">{project.stats.stars}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">{project.stats.views}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {project.achievement ? (
                      <div className="mb-4">
                        <span className="inline-block rounded-full border border-orange-300/30 bg-gradient-to-r from-orange-100 to-orange-200 px-3 py-1.5 text-xs font-medium text-orange-700 dark:border-orange-600/30 dark:from-orange-900/30 dark:to-orange-800/30 dark:text-orange-300 md:text-sm">
                          {project.achievement}
                        </span>
                      </div>
                    ) : null}

                    <p className="mb-6 text-base leading-relaxed text-neutral-600 dark:text-neutral-400 md:mb-8 md:text-lg">
                      {project.description}
                    </p>

                    <div className="mb-6 flex flex-wrap gap-2 md:mb-8">
                      {project.technologies.map((technology, techIndex) => (
                        <motion.span
                          key={`${technology}-${techIndex}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.28, delay: techIndex * 0.06 }}
                          viewport={{ once: true }}
                          className="rounded-full border border-neutral-300/30 bg-gradient-to-r from-neutral-100 to-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 transition-transform duration-200 hover:scale-105 dark:border-neutral-600/30 dark:from-neutral-800 dark:to-neutral-700 dark:text-neutral-300 md:text-sm"
                        >
                          {technology}
                        </motion.span>
                      ))}
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row md:gap-4">
                      <Button
                        variant="default"
                        className="group flex-1 bg-gradient-to-r from-neutral-900 to-neutral-800 text-white shadow-lg transition-all duration-300 hover:from-neutral-800 hover:to-neutral-700 hover:shadow-xl dark:from-white dark:to-neutral-100 dark:text-neutral-900 dark:hover:from-neutral-100 dark:hover:to-neutral-200 sm:flex-none"
                        asChild
                      >
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:rotate-12" />
                          Live Demo
                        </a>
                      </Button>
                      <Button
                        variant="outline"
                        className="group flex-1 border-2 bg-transparent transition-all duration-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 sm:flex-none"
                        asChild
                      >
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:rotate-12" />
                          View Code
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          viewport={{ once: true }}
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
                {projects.otherProjectsBadge}
              </span>
            </motion.div>
            <h3 className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 bg-clip-text text-2xl font-semibold text-transparent dark:from-white dark:via-neutral-200 dark:to-white md:text-3xl">
              {projects.otherProjectsTitle}
            </h3>
          </div>

          <div className="grid gap-6 md:grid-cols-2 md:gap-8">
            {otherProjects.map((project, index) => (
              <motion.div
                key={`${project.title}-${index}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: index * 0.12 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="relative h-full overflow-hidden border border-neutral-200/50 bg-white/80 shadow-xl backdrop-blur-sm transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl dark:border-neutral-700/50 dark:bg-neutral-800/80">
                  <div className="absolute inset-0 bg-gradient-to-br from-neutral-50/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:from-neutral-700/20 dark:to-transparent" />

                  <div className="relative overflow-hidden">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      width={500}
                      height={300}
                      className="h-40 w-full object-cover transition-transform duration-700 group-hover:scale-110 md:h-48"
                    />
                    <div className="absolute right-4 top-4 flex items-center gap-2 text-xs text-white/80">
                      <div className="rounded-full bg-black/20 px-2 py-1 backdrop-blur-sm">
                        <span>{project.stats.stars}</span>
                      </div>
                      <div className="rounded-full bg-black/20 px-2 py-1 backdrop-blur-sm">
                        <span>{project.stats.views}</span>
                      </div>
                    </div>
                  </div>

                  <CardContent className="relative z-10 p-4 md:p-6">
                    <h4 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-white md:mb-3 md:text-xl">
                      {project.title}
                    </h4>
                    <p className="mb-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 md:mb-4 md:text-base">
                      {project.description}
                    </p>
                    <div className="mb-4 flex flex-wrap gap-1.5 md:mb-6 md:gap-2">
                      {project.technologies.map((technology) => (
                        <span
                          key={technology}
                          className="rounded-full bg-gradient-to-r from-neutral-100 to-neutral-200 px-2 py-0.5 text-xs font-medium text-neutral-600 dark:from-neutral-700 dark:to-neutral-600 dark:text-neutral-300 md:py-1"
                        >
                          {technology}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2 md:gap-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="group/btn flex-1 bg-transparent text-xs transition-all duration-300 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 md:text-sm"
                        asChild
                      >
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-1 h-3 w-3 transition-transform duration-200 group-hover/btn:rotate-12" />
                          Demo
                        </a>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="group/btn flex-1 bg-transparent text-xs transition-all duration-300 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 md:text-sm"
                        asChild
                      >
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="mr-1 h-3 w-3 transition-transform duration-200 group-hover/btn:rotate-12" />
                          Code
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
