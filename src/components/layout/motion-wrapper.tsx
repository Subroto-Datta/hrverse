'use client'

import { motion, AnimatePresence, type Variants } from 'framer-motion'

export const MotionDiv = motion.div
export const MotionSection = motion.section
export const MotionH1 = motion.h1
export const MotionP = motion.p
export { AnimatePresence }

export const fadeIn: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}
