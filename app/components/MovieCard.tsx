'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface MovieCardProps {
  id: number
  title: string
  posterUrl: string
  year: number
}

export default function MovieCard({ id, title, posterUrl, year }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [audioError, setAudioError] = useState<string | null>(null)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load()
    }
  }, [])

  const handleMouseEnter = () => {
    setIsHovered(true)
    if (audioRef.current && !audioError) {
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error)
        setAudioError('Failed to play audio')
      })
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    if (audioRef.current && !audioError) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  return (
    <Link href={`/movies/${id}`}>
      <motion.div
        className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer"
        whileHover={{ scale: 1.05, rotateY: 10 }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Image src={posterUrl} alt={title} width={300} height={450} className="w-full h-auto" />
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black to-transparent flex items-end p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div>
            <motion.h3
              className="font-nosifer text-xl text-red-600 mb-1"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {title}
            </motion.h3>
            <motion.p
              className="text-gray-300"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {year}
            </motion.p>
          </div>
        </motion.div>
        {isHovered && (
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.img
              src="/ghost.png"
              alt="Ghost"
              className="w-1/2 h-1/2 object-contain"
              animate={{ 
                y: [0, -10, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{ 
                y: { repeat: Infinity, duration: 2 },
                opacity: { repeat: Infinity, duration: 2 },
              }}
            />
          </motion.div>
        )}
        <audio 
          ref={audioRef} 
          src="/eerie-whisper.mp3" 
          loop 
          onError={(e) => {
            console.error('Audio failed to load:', e)
            setAudioError('Failed to load audio')
          }}
        />
      </motion.div>
    </Link>
  )
}

