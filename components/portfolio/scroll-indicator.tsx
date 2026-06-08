"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowDown } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ScrollIndicator() {
  const { scrollY } = useScroll()
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      setIsVisible(latest < 100)
    })
    return () => unsubscribe()
  }, [scrollY])

  const opacity = useTransform(scrollY, [0, 100], [1, 0])
  const y = useTransform(scrollY, [0, 100], [0, -20])

  if (!isVisible) return null

  return (
    <motion.div
      style={{ opacity, y }}
      className="fixed bottom-8 md:bottom-12 inset-x-0 z-30 flex justify-center pointer-events-none"
    >
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        className="flex flex-col items-center gap-2 text-neutral-400 dark:text-neutral-600"
      >
        <span className="text-xs md:text-sm font-medium">Scroll to explore</span>
        <ArrowDown size={16} className="md:w-5 md:h-5" />
      </motion.div>
    </motion.div>
  )
}
