'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const jumpScareImages = [
  '/jumpscare1.png',
  '/jumpscare2.png',
  '/jumpscare3.png',
]

export default function JumpScare() {
  const [showScare, setShowScare] = useState(false)
  const [scareImage, setScareImage] = useState('')

  useEffect(() => {
    const triggerScare = () => {
      if (Math.random() < 0.2) { // 20% chance of triggering
        setScareImage(jumpScareImages[Math.floor(Math.random() * jumpScareImages.length)])
        setShowScare(true)
        const audio = new Audio('/jumpscare.mp3')
        audio.volume = 0.7
        audio.play().catch(error => {
          console.error('Error playing jump scare audio:', error)
        })
        setTimeout(() => setShowScare(false), 500)
      }
    }

    const interval = setInterval(triggerScare, 15000) // Check every 15 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatePresence>
      {showScare && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.img
            src={scareImage}
            alt="Jump Scare"
            className="w-full h-full object-cover"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 10, stiffness: 100 }}
            onError={(e) => {
              console.error('Jump scare image failed to load:', e)
              setShowScare(false)
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

