'use client'
import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navigation from './components/Navigation'

const strangeMovies = [
  { 
    id: 1, 
    title: 'Eraserhead', 
    posterPath: '/eraserhead.jpg', 
    year: 1977, 
    reason: 'An unsettling, surreal experience that delves into themes of fear and isolation.'
  },
  { 
    id: 2, 
    title: 'The Lobster', 
    posterPath: '/lobster.jpg',
    year: 2015, 
    reason: 'A darkly comedic exploration of love and conformity in a dystopian society.'
  },
  { 
    id: 3, 
    title: 'Tetsuo: The Iron Man', 
    posterPath: '/tetsuo.jpg',
    year: 1989, 
    reason: 'A Japanese cyberpunk film that is intensely disturbing with its body horror elements.'
  },
  { 
    id: 4, 
    title: 'Pink Flamingos', 
    posterPath: '/p.jpg',
    year: 1972, 
    reason: 'A shocking and controversial cult classic known for its bizarre and graphic content.'
  },
]

const strangeFacts = [
  "Did you know that 'Eraserhead' was created with no script, and much of the dialogue was improvised on set?",
  "In 'The Lobster', if someone is not in a relationship, they are turned into an animal of their choice in 45 days.",
  "The creator of 'Tetsuo: The Iron Man' used stop-motion animation and practical effects to achieve its grotesque body horror.",
  "Pink Flamingos was banned in multiple countries for its shocking and vulgar scenes, yet it became a cult classic."
]

export default function Home() {
  const [showIntro, setShowIntro] = useState(true)
  const [showWarning, setShowWarning] = useState(false)
  const [currentFact, setCurrentFact] = useState(0)
  const [currentMovie, setCurrentMovie] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false)
      setShowWarning(true)
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const factInterval = setInterval(() => {
      setCurrentFact(Math.floor(Math.random() * strangeFacts.length))
      setCurrentMovie(Math.floor(Math.random() * strangeMovies.length))
    }, 10000)
    return () => clearInterval(factInterval)
  }, [])

  useEffect(() => {
    if (!showIntro && audioRef.current) {
      audioRef.current.play()
    }
  }, [showIntro])

  const handleProceed = () => {
    setShowWarning(false)
    if (audioRef.current) {
      audioRef.current.play()
    }
  }

  const MovieCard = ({ title, posterPath, year, reason }: { title: string, posterPath: string, year: number, reason: string }) => {
    return (
      <div className="relative group">
        <img src={posterPath} alt={title} className="w-full h-auto object-cover rounded-lg shadow-lg" />
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-white p-4">{reason}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-red-600 overflow-hidden font-nosifer relative">
      <audio ref={audioRef} loop>
        <source src="/scary-ambience.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      <div className="fixed top-0 left-0 right-0 z-30 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-0 w-1 sm:w-2 bg-red-600"
            style={{
              left: `${Math.random() * 100}%`,
              height: `${Math.random() * 20 + 10}vh`,
            }}
            initial={{ y: '-100%' }}
            animate={{ y: '100%' }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: 'linear',
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <AnimatePresence>
        {showIntro && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.h1
              className="text-4xl sm:text-6xl md:text-8xl font-nosifer text-red-600"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 2, times: [0, 0.8, 1] }}
            >
              Enter at Your Own Risk
            </motion.h1>
          </motion.div>
        )}

        {showWarning && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center p-8 border-2 border-red-800 rounded-lg max-w-2xl">
              <h2 className="text-3xl mb-4">WARNING</h2>
              <p className="mb-6">This site contains strange and disturbing content. Proceed only if you dare to face your deepest curiosities.</p>
              <button
                onClick={handleProceed}
                className="px-6 py-2 bg-red-800 text-white rounded hover:bg-red-700 transition-colors"
              >
                I Dare to Proceed
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Navigation />

      <main className="container mx-auto px-4 py-16 relative">
        <motion.div
          className="absolute inset-0 bg-red-900 opacity-10"
          animate={{
            scale: [2, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{ repeat: Infinity, duration: 20 }}
        />

        <motion.h1
          className="font-nosifer text-3xl sm:text-4xl md:text-5xl text-center text-white mb-8 relative z-20"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 5, duration: 0.5 }}
        >
          Welcome to the Strange World
        </motion.h1>

        <motion.section
          className="mt-8 sm:mt-16 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 5.5, duration: 0.5 }}
        >
          <h2 className="font-nosifer text-2xl sm:text-3xl text-red-800 mb-4 sm:mb-8">Strange Movies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {strangeMovies.map((movie, index) => (
              <motion.div
                key={movie.id}
                className="relative group"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 5.5 + index * 0.1, duration: 0.5 }}
              >
                <MovieCard {...movie} />
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="mt-12 sm:mt-16 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 6, duration: 0.5 }}
        >
          <h2 className="font-nosifer text-2xl sm:text-3xl text-red-800 mb-4">Strange Facts</h2>
          <motion.div
            className="bg-red-900 bg-opacity-20 p-4 rounded-lg"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 6, duration: 0.5 }}
          >
            <p className="text-white">{strangeFacts[currentFact]}</p>
          </motion.div>
        </motion.section>
      </main>
    </div>
  )
}
