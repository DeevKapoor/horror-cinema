'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function SearchBar() {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <motion.div
      className="relative max-w-md mx-auto mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <input
        type="text"
        placeholder="Search for your nightmares..."
        className="w-full px-4 py-2 text-gray-300 bg-gray-800 border-2 border-red-800 rounded-full focus:outline-none focus:border-red-600 transition-colors"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        animate={{
          boxShadow: isFocused
            ? '0 0 0 2px rgba(255, 0, 0, 0.5), 0 0 10px rgba(255, 0, 0, 0.5)'
            : '0 0 0 0 rgba(255, 0, 0, 0)',
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}

