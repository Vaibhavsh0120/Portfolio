"use client"

import { motion } from "framer-motion"
import { Github, Linkedin, Mail } from "lucide-react"

import { FooterContent } from "@/lib/portfolio/types"

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

interface FooterProps {
  footer: FooterContent
}

export default function Footer({ footer }: FooterProps) {
  return (
    <footer className="border-t border-neutral-200 bg-white py-12 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-between gap-6 md:flex-row"
        >
          <div className="text-center md:text-left">
            <h3 className="mb-2 text-xl font-semibold text-neutral-900 dark:text-white">{footer.name}</h3>
            <p className="text-neutral-600 dark:text-neutral-400">{footer.tagline}</p>
          </div>

          <div className="flex items-center gap-6">
            {footer.socialLinks.map((social) => {
              const Icon = getSocialIcon(social.label, social.href)

              return (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-full p-2 text-neutral-600 transition-all duration-300 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
                  aria-label={social.label}
                >
                  <Icon size={20} />
                </motion.a>
              )
            })}
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
