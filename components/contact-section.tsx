"use client"

import { useState } from "react"

import { motion } from "framer-motion"
import { AlertCircle, CheckCircle, Clock, Mail, MapPin, MessageCircle, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ContactContent } from "@/lib/portfolio/types"

function ContactBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 12 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-neutral-300/30 dark:bg-neutral-600/30"
          style={{
            left: `${15 + (i * 7.5) % 85}%`,
            top: `${10 + (i * 6.3) % 80}%`,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3 + i * 0.2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  )
}

interface FormData {
  firstName: string
  lastName: string
  email: string
  subject: string
  message: string
}

interface FormStatus {
  type: "idle" | "loading" | "success" | "error"
  message: string
}

const detailIcons = {
  Email: Mail,
  Location: MapPin,
}

interface ContactSectionProps {
  contact: ContactContent
}

export default function ContactSection({ contact }: ContactSectionProps) {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  })

  const [status, setStatus] = useState<FormStatus>({
    type: "idle",
    message: "",
  })

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.subject || !formData.message) {
      setStatus({
        type: "error",
        message: "Please fill in all fields.",
      })
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setStatus({
        type: "error",
        message: "Please enter a valid email address.",
      })
      return
    }

    setStatus({
      type: "loading",
      message: "Sending message...",
    })

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        setStatus({
          type: "success",
          message: "Message sent successfully! I'll get back to you soon.",
        })
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          subject: "",
          message: "",
        })
      } else {
        setStatus({
          type: "error",
          message: result.error || "Failed to send message. Please try again.",
        })
      }
    } catch {
      setStatus({
        type: "error",
        message: "Network error. Please check your connection and try again.",
      })
    }
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-neutral-50 via-white to-neutral-100 py-16 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900 md:py-24">
      <ContactBackground />

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12 text-center md:mb-16"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-4 inline-block"
          >
            <span className="rounded-full border border-neutral-300/20 bg-neutral-200/50 px-4 py-2 text-sm font-medium text-neutral-600 backdrop-blur-sm dark:border-neutral-700/20 dark:bg-neutral-800/50 dark:text-neutral-400">
              {contact.badge}
            </span>
          </motion.div>

          <h2 className="mb-4 bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 bg-clip-text text-3xl font-bold text-transparent dark:from-white dark:via-neutral-200 dark:to-white md:mb-6 md:text-4xl lg:text-5xl">
            {contact.title}
          </h2>
          <p className="mx-auto max-w-3xl px-4 text-base text-neutral-600 dark:text-neutral-400 md:px-0 md:text-lg">
            {contact.description}
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2 md:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-neutral-200/50 to-neutral-300/50 opacity-60 blur-2xl dark:from-neutral-700/50 dark:to-neutral-600/50" />
              <Card className="relative border border-neutral-200/50 bg-white/90 shadow-2xl backdrop-blur-sm dark:border-neutral-700/50 dark:bg-neutral-800/90">
                <CardContent className="p-6 md:p-8">
                  <div className="mb-6 flex items-center gap-3 md:mb-8">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-700 dark:to-neutral-600 md:h-12 md:w-12">
                      <MessageCircle className="h-5 w-5 text-neutral-600 dark:text-neutral-300 md:h-6 md:w-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-neutral-900 dark:text-white md:text-2xl">
                      {contact.formTitle}
                    </h3>
                  </div>

                  {status.type !== "idle" ? (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mb-6 flex items-center gap-3 rounded-xl border p-4 ${
                        status.type === "success"
                          ? "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300"
                          : status.type === "error"
                            ? "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300"
                            : "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
                      }`}
                    >
                      {status.type === "success" ? <CheckCircle className="h-5 w-5 flex-shrink-0" /> : null}
                      {status.type === "error" ? <AlertCircle className="h-5 w-5 flex-shrink-0" /> : null}
                      {status.type === "loading" ? (
                        <div className="h-5 w-5 flex-shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      ) : null}
                      <span className="text-sm font-medium">{status.message}</span>
                    </motion.div>
                  ) : null}

                  <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                    <div className="grid gap-3 md:grid-cols-2 md:gap-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full rounded-xl border border-neutral-200 bg-white/80 px-3 py-2.5 text-sm text-neutral-900 backdrop-blur-sm transition-all duration-300 hover:bg-white focus:border-transparent focus:ring-2 focus:ring-neutral-400 dark:border-neutral-700 dark:bg-neutral-800/80 dark:text-white dark:hover:bg-neutral-800 dark:focus:ring-neutral-500 md:px-4 md:py-3 md:text-base"
                          placeholder="John"
                          required
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full rounded-xl border border-neutral-200 bg-white/80 px-3 py-2.5 text-sm text-neutral-900 backdrop-blur-sm transition-all duration-300 hover:bg-white focus:border-transparent focus:ring-2 focus:ring-neutral-400 dark:border-neutral-700 dark:bg-neutral-800/80 dark:text-white dark:hover:bg-neutral-800 dark:focus:ring-neutral-500 md:px-4 md:py-3 md:text-base"
                          placeholder="Doe"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-neutral-200 bg-white/80 px-3 py-2.5 text-sm text-neutral-900 backdrop-blur-sm transition-all duration-300 hover:bg-white focus:border-transparent focus:ring-2 focus:ring-neutral-400 dark:border-neutral-700 dark:bg-neutral-800/80 dark:text-white dark:hover:bg-neutral-800 dark:focus:ring-neutral-500 md:px-4 md:py-3 md:text-base"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Subject *
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-neutral-200 bg-white/80 px-3 py-2.5 text-sm text-neutral-900 backdrop-blur-sm transition-all duration-300 hover:bg-white focus:border-transparent focus:ring-2 focus:ring-neutral-400 dark:border-neutral-700 dark:bg-neutral-800/80 dark:text-white dark:hover:bg-neutral-800 dark:focus:ring-neutral-500 md:px-4 md:py-3 md:text-base"
                        placeholder="Project Inquiry"
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full resize-none rounded-xl border border-neutral-200 bg-white/80 px-3 py-2.5 text-sm text-neutral-900 backdrop-blur-sm transition-all duration-300 hover:bg-white focus:border-transparent focus:ring-2 focus:ring-neutral-400 dark:border-neutral-700 dark:bg-neutral-800/80 dark:text-white dark:hover:bg-neutral-800 dark:focus:ring-neutral-500 md:px-4 md:py-3 md:text-base"
                        placeholder="Tell me about your project..."
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={status.type === "loading"}
                      className="group w-full rounded-xl bg-gradient-to-r from-neutral-900 to-neutral-800 py-2.5 text-sm text-white shadow-lg transition-all duration-300 hover:from-neutral-800 hover:to-neutral-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 dark:from-white dark:to-neutral-100 dark:text-neutral-900 dark:hover:from-neutral-100 dark:hover:to-neutral-200 md:py-3 md:text-base"
                    >
                      {status.type === "loading" ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="order-1 space-y-6 lg:order-2 md:space-y-8"
          >
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-neutral-100/50 to-transparent opacity-50 blur-2xl dark:from-neutral-800/30 dark:to-transparent" />
              <div className="relative rounded-2xl border border-neutral-200/50 bg-white/80 p-6 shadow-xl backdrop-blur-sm dark:border-neutral-700/50 dark:bg-neutral-800/80 md:p-8">
                <h3 className="mb-4 text-xl font-semibold text-neutral-900 dark:text-white md:mb-6 md:text-2xl">
                  {contact.introTitle}
                </h3>
                <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 md:text-base">
                  {contact.introDescription}
                </p>
              </div>
            </div>

            <div className="space-y-4 md:space-y-6">
              {contact.details.map((detail, index) => {
                const Icon = detailIcons[detail.title as keyof typeof detailIcons] ?? Mail

                return (
                  <motion.a
                    key={`${detail.title}-${index}`}
                    href={detail.href}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="group block"
                  >
                    <div className="relative">
                      <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-neutral-200/30 to-neutral-300/30 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100 dark:from-neutral-700/30 dark:to-neutral-600/30" />
                      <div className="relative flex items-center gap-3 rounded-xl border border-neutral-200/50 bg-white/80 p-4 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-white group-hover:shadow-xl dark:border-neutral-700/50 dark:bg-neutral-800/80 dark:hover:bg-neutral-800 md:gap-4 md:p-5">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-neutral-100 to-neutral-200 shadow-md transition-transform duration-300 group-hover:scale-110 dark:from-neutral-700 dark:to-neutral-600 md:h-14 md:w-14">
                          <Icon className="h-5 w-5 text-neutral-600 dark:text-neutral-300 md:h-6 md:w-6" />
                        </div>
                        <div className="flex-1">
                          <h4 className="mb-1 text-sm font-semibold text-neutral-900 dark:text-white md:text-base">
                            {detail.title}
                          </h4>
                          <p className="mb-1 text-sm font-medium text-neutral-700 dark:text-neutral-300 md:text-base">
                            {detail.content}
                          </p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 md:text-sm">
                            {detail.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.a>
                )
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-neutral-100/50 to-transparent opacity-50 blur-2xl dark:from-neutral-800/30 dark:to-transparent" />
              <div className="relative rounded-2xl border border-neutral-200/50 bg-white/80 p-6 shadow-xl backdrop-blur-sm dark:border-neutral-700/50 dark:bg-neutral-800/80 md:p-8">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-700 dark:to-neutral-600 md:h-12 md:w-12">
                    <Clock className="h-5 w-5 text-neutral-600 dark:text-neutral-300 md:h-6 md:w-6" />
                  </div>
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white md:text-base">
                    {contact.responseTimeTitle}
                  </h4>
                </div>
                <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 md:text-base">
                  {contact.responseTimeDescription}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
