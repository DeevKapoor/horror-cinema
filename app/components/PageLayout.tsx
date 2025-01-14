'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import HorrorBackground from './HorrorBackground'
import Navigation from './Navigation'
import SpookyOverlay from './SpookyOverlay'


interface PageLayoutProps {

  title: string;

  children: React.ReactNode;

  className?: string; // Add className property

}
export default function PageLayout({ children, title }: PageLayoutProps) {
  const [showOverlay, setShowOverlay] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setShowOverlay(prev => !prev)
    }, 10000) // Toggle overlay every 10 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden">
      <HorrorBackground />
      <Navigation />
      <motion.div
        className="absolute inset-0 bg-black opacity-50 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1 }}
      />
      <main className="container mx-auto px-4 py-16 relative z-10">
        <motion.h1
          className="font-nosifer text-5xl text-center text-red-600 mb-8"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {title}
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {children}
        </motion.div>
      </main>
      <SpookyOverlay isVisible={showOverlay} />
    </div>
  )
}
