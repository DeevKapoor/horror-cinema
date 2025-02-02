'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface SpookyOverlayProps {
  isVisible: boolean
}

export default function SpookyOverlay({ isVisible }: SpookyOverlayProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
        >
          <div className="absolute inset-0 bg-red-900 opacity-10" />
          <div className="absolute inset-0 bg-[url('/cobweb.png')] bg-repeat opacity-20" />
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ scale: 2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 2 }}
          >
            <Image
              src="/spooky.png"
              alt="Spooky Ghost"
              width={100}  // Set the width
              height={100} // Set the height
              className="object-contain opacity-30"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
