'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const hauntedImages = [
  '/haunted1.png',
  '/haunted2.png',
  '/haunted3.png',
]

export default function HauntedOverlay() {
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % hauntedImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatePresence>
      <motion.div
        key={currentImage}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 2 }}
        className="fixed inset-0 pointer-events-none z-40"
      >
        <img 
          src={hauntedImages[currentImage]} 
          alt="Haunted Overlay" 
          className="w-full h-full object-cover"
        />
      </motion.div>
    </AnimatePresence>
  )
}

