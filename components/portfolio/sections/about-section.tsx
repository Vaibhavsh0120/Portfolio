"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Code, Heart, Lightbulb, Palette, Target, Zap } from "lucide-react"

import ExperienceSection from "@/components/portfolio/sections/experience-section"
import { Card, CardContent } from "@/components/ui/card"
import { AboutContent, ExperienceContent } from "@/lib/cms/types"

const skillIcons = [Code, Palette, Zap]
const traitIcons = [Heart, Lightbulb, Target]

function FloatingElements() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 8 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute h-2 w-2 rounded-full bg-neutral-300/20 dark:bg-neutral-600/20"
          style={{
            left: `${15 + i * 12}%`,
            top: `${8 + i * 11}%`,
          }}
          animate={{
            y: [0, -25, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4 + i * 0.8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

interface AboutSectionProps {
  about: AboutContent
  experience: ExperienceContent
}

export default function AboutSection({ about, experience }: AboutSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-neutral-50 via-white to-neutral-100 py-16 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900 md:py-24">
      <FloatingElements />

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          viewport={{ once: true }}
          className="mb-16 text-center md:mb-20"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.42 }}
            viewport={{ once: true }}
            className="mb-4 inline-block"
          >
            <span className="rounded-full border border-neutral-300/20 bg-neutral-200/50 px-4 py-2 text-sm font-medium text-neutral-600 backdrop-blur-sm dark:border-neutral-700/20 dark:bg-neutral-800/50 dark:text-neutral-400">
              {about.badge}
            </span>
          </motion.div>

          <h2 className="mb-4 bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 bg-clip-text text-3xl font-bold text-transparent dark:from-white dark:via-neutral-200 dark:to-white md:mb-6 md:text-4xl lg:text-5xl">
            {about.title}
          </h2>
          <p className="mx-auto max-w-3xl text-base leading-relaxed text-neutral-600 dark:text-neutral-400 md:text-lg">
            {about.description}
          </p>
        </motion.div>

        <div className="mb-16 grid items-center gap-8 lg:grid-cols-5 md:mb-20 md:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
            className="flex justify-center lg:col-span-2"
          >
            <div className="group relative">
              <div className="absolute -inset-8 rounded-3xl bg-gradient-to-r from-neutral-200/30 via-neutral-300/30 to-neutral-200/30 opacity-50 blur-2xl transition-all duration-500 group-hover:blur-3xl dark:from-neutral-700/30 dark:via-neutral-600/30 dark:to-neutral-700/30" />

              <div className="absolute -inset-4 rotate-3 rounded-2xl bg-gradient-to-br from-white/50 to-neutral-100/50 transition-transform duration-500 group-hover:rotate-6 dark:from-neutral-800/50 dark:to-neutral-900/50" />

              <div className="relative h-96 w-72 sm:h-[28rem] sm:w-80 md:h-[32rem] md:w-96 lg:h-[26rem] lg:w-80 xl:h-[30rem] xl:w-96">
                <div className="relative h-full w-full overflow-hidden rounded-2xl border-4 border-white shadow-2xl transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-3xl dark:border-neutral-800">
                  <Image
                    src={about.imageUrl}
                    alt={about.imageAlt}
                    width={384}
                    height={512}
                    className="h-full w-full object-cover object-center transition-all duration-700 group-hover:scale-105"
                    priority
                    loading="eager"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent dark:from-black/40 dark:via-transparent dark:to-transparent" />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.06 }}
            viewport={{ once: true, margin: "-100px" }}
            className="lg:col-span-3"
          >
            <div className="relative">
              <div className="absolute -inset-6 rounded-3xl bg-gradient-to-r from-transparent via-neutral-100/30 to-transparent opacity-50 blur-2xl dark:from-transparent dark:via-neutral-800/20 dark:to-transparent" />

              <div className="relative space-y-6 md:space-y-8">
                <div>
                  <h3 className="mb-4 text-2xl font-bold text-neutral-900 dark:text-white md:text-3xl">
                    {about.summaryTitle}
                  </h3>
                  <p className="mb-6 text-base leading-relaxed text-neutral-600 dark:text-neutral-400 md:text-lg">
                    {about.summaryBody}
                  </p>
                </div>

                <div className="grid gap-4">
                  {about.traits.map((trait, index) => {
                    const Icon = traitIcons[index % traitIcons.length]

                    return (
                      <motion.div
                        key={`${trait.title}-${index}`}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                        viewport={{ once: true, margin: "-50px" }}
                        className="group flex cursor-default items-start gap-4 rounded-xl border border-neutral-200/50 bg-white/60 p-4 backdrop-blur-sm transition-all duration-200 hover:bg-white/80 dark:border-neutral-700/50 dark:bg-neutral-800/60 dark:hover:bg-neutral-800/80"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-neutral-100 to-neutral-200 shadow-sm transition-transform duration-300 group-hover:scale-110 dark:from-neutral-700 dark:to-neutral-600">
                          <Icon className="h-5 w-5 text-neutral-600 dark:text-neutral-300" />
                        </div>
                        <div className="flex-1">
                          <h4 className="mb-1 font-semibold text-neutral-900 dark:text-white">{trait.title}</h4>
                          <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                            {trait.description}
                          </p>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <ExperienceSection experience={experience} />

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
                {about.skillBadge}
              </span>
            </motion.div>
            <h3 className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 bg-clip-text text-2xl font-semibold text-transparent dark:from-white dark:via-neutral-200 dark:to-white md:text-3xl">
              {about.skillTitle}
            </h3>
          </div>

          <div className="grid gap-6 md:grid-cols-3 md:gap-8">
            {about.skills.map((skill, index) => {
              const Icon = skillIcons[index % skillIcons.length]

              return (
                <motion.div
                  key={`${skill.title}-${index}`}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: index * 0.12 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <Card className="relative h-full overflow-hidden border border-neutral-200/50 bg-white/80 shadow-xl backdrop-blur-sm transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl dark:border-neutral-700/50 dark:bg-neutral-800/80">
                    <div className="absolute inset-0 bg-gradient-to-br from-neutral-50/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:from-neutral-700/20 dark:to-transparent" />
                    <CardContent className="relative z-10 p-6 md:p-8">
                      <div className="mb-4 md:mb-6">
                        <div className="relative">
                          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-neutral-100 to-neutral-200 shadow-lg transition-transform duration-300 group-hover:scale-110 dark:from-neutral-700 dark:to-neutral-600 md:mb-6 md:h-16 md:w-16">
                            <Icon className="h-6 w-6 text-neutral-600 dark:text-neutral-300 md:h-8 md:w-8" />
                          </div>
                          <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-neutral-200/0 via-neutral-200/30 to-neutral-200/0 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100 dark:from-neutral-600/0 dark:via-neutral-600/30 dark:to-neutral-600/0" />
                        </div>
                        <h4 className="mb-3 text-lg font-semibold text-neutral-900 dark:text-white md:mb-4 md:text-xl">
                          {skill.title}
                        </h4>
                        <p className="mb-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 md:mb-6 md:text-base">
                          {skill.description}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {skill.technologies.map((technology) => (
                          <span
                            key={technology}
                            className="rounded-full border border-neutral-300/20 bg-gradient-to-r from-neutral-100 to-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 transition-transform duration-200 hover:scale-105 dark:border-neutral-600/20 dark:from-neutral-700 dark:to-neutral-600 dark:text-neutral-300 md:text-sm"
                          >
                            {technology}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
