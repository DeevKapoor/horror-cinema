'use client'

import { useEffect, useState } from 'react'

export default function FlickeringLights() {
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    const flicker = () => {
      setOpacity(Math.random())
      setTimeout(flicker, Math.random() * 100)
    }
    flicker()
  }, [])

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-50"
      style={{
        background: `radial-gradient(circle, rgba(255,255,255,${opacity}) 0%, rgba(0,0,0,0) 70%)`,
        mixBlendMode: 'overlay'
      }}
    />
  )
}

