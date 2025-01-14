'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import PageLayout from '../components/PageLayout'

interface MovieRating {
  id: number
  title: string
  rating: number
}

export default function RatingsPage() {
  const [ratings, setRatings] = useState<MovieRating[]>([])

  useEffect(() => {
    // In a real application, you would fetch ratings from an API
    // For this example, we'll use mock data
    const mockRatings: MovieRating[] = [
      { id: 1, title: 'The Exorcist', rating: 4.8 },
      { id: 2, title: 'Halloween', rating: 4.5 },
      { id: 3, title: 'The Shining', rating: 4.7 },
      { id: 4, title: 'A Nightmare on Elm Street', rating: 4.3 },
      { id: 5, title: 'The Haunting of Hill House', rating: 4.6 },
    ]
    setRatings(mockRatings)
  }, [])

  return (
    <PageLayout title="Horror Movie Ratings">
      <div className="space-y-4">
        {ratings.map((movie, index) => (
          <motion.div
            key={movie.id}
            className="bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-center"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link href={`/movies/${movie.id}`} className="text-xl text-red-500 hover:text-red-400 transition-colors">
              {movie.title}
            </Link>
            <div className="flex items-center">
              <span className="text-yellow-500 text-2xl mr-2">★</span>
              <span className="text-xl">{movie.rating.toFixed(1)}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </PageLayout>
  )
}

