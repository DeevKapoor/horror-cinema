'use client'

import { useEffect, useRef, useState } from 'react'

export default function BackgroundNoise() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [audioError, setAudioError] = useState<string | null>(null)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.1
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error)
        setAudioError('Failed to play background audio')
      })
    }
  }, [])

  if (audioError) {
    console.warn(audioError)
    return null
  }

  return (
    <audio 
      ref={audioRef} 
      src="/1.wav" 
      loop 
      onError={(e) => {
        console.error('Audio failed to load:', e)
        setAudioError('Failed to load background audio')
      }}
    />
  )
}

