'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'  // Correctly import the Image component from Next.js

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
        <Image
          src={hauntedImages[currentImage]} 
          alt="Haunted Overlay" 
          layout="fill" // Use layout="fill" to make the image cover the container
          objectFit="cover" // Make sure the image covers the full screen
          className="w-full h-full" // Full screen styling
        />
      </motion.div>
    </AnimatePresence>
  )
}
