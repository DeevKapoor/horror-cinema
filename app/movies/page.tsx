'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Skull, ChevronLeft, ChevronRight, Search, PlayCircle, Edit3, Droplet } from 'lucide-react'
import PageLayout from '../components/PageLayout'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import '../components/styles.css'
const TMDB_API_KEY = '95a07433f19cbefdd02f495c48939a37'
const BASE_URL = 'https://api.themoviedb.org/3/'

interface Movie {
  vote_average: unknown
  overview: unknown
  release_date: string | undefined
  poster_path: unknown
  id: number
  title: string
  posterUrl: string
  year: string
  description: string
  rating: number
  genre: string
  trailerUrl?: string
  reviewsUrl?: string
}

export default function MoviePage() {
  const router = useRouter()
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [autocompleteResults, setAutocompleteResults] = useState<Movie[]>([])
  const [isAutocompleteVisible, setIsAutocompleteVisible] = useState<boolean>(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null)

  // Memoize the function to prevent it from changing on every render
  const fetchBestOf2024Movies = useCallback(async () => {
    try {
      const url = `${BASE_URL}discover/movie?api_key=${TMDB_API_KEY}&with_genres=27&sort_by=popularity.desc`
      const response = await fetch(url)
      const data = await response.json()
      setMovies(formatMovieData(data.results))
    } catch (error) {
      console.error('Error fetching movies:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBestOf2024Movies()
  }, [fetchBestOf2024Movies]) // Add fetchBestOf2024Movies to the dependency array

  const formatMovieData = (results: Movie[]): Movie[] => {
    return results
      .filter((movie: Movie) => movie.poster_path)
      .map((movie: Movie) => ({
        vote_average: movie.vote_average as number,
        overview: movie.overview as string,
        release_date: movie.release_date,
        poster_path: movie.poster_path,
        id: movie.id,
        title: movie.title,
        posterUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        year: movie.release_date?.split('-')[0] || '2024',
        description: movie.overview as string,
        rating: movie.vote_average as number,
        genre: 'Horror',
        trailerUrl: `/trailers`,
        reviewsUrl: `/reviews/${movie.id}`,
      }))
  }

  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)

    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current)
    }

    if (term.trim() === '') {
      setIsAutocompleteVisible(false)
      setAutocompleteResults([])
      return
    }

    searchDebounceRef.current = setTimeout(async () => {
      try {
        const url = `${BASE_URL}search/movie?api_key=${TMDB_API_KEY}&query=${term}&with_genres=27`
        const response = await fetch(url)
        const data = await response.json()

        if (data.results && data.results.length > 0) {
          const moviesData = formatMovieData(data.results)
          setAutocompleteResults(moviesData)
          setIsAutocompleteVisible(true)
        } else {
          setIsAutocompleteVisible(false)
          setAutocompleteResults([])
        }
      } catch (error) {
        console.error('Error fetching autocomplete suggestions:', error)
        setIsAutocompleteVisible(false)
        setAutocompleteResults([])
      }
    }, 300)
  }

  const handleMovieSelect = (movie: Movie) => {
    setMovies([movie])
    setSearchTerm('')
    setIsAutocompleteVisible(false)
  }

  const handleReviewClick = (movie: Movie) => {
    router.push(`/reviews/${movie.id}`)
  }

  const handleTrailerClick = (movie: Movie) => {
    const movieTitleEncoded = encodeURIComponent(movie.title)
    router.push(`/trailers/${movieTitleEncoded}`)
  }

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const screenWidth = window.innerWidth
      const scrollAmount = direction === 'left' ? -screenWidth * 0.6 : screenWidth * 0.6
      const newPosition = scrollPosition + scrollAmount
      carouselRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      })
      setScrollPosition(newPosition)
    }
  }

  return (
    <PageLayout title="Horror Movie Collection" className="horror-container">
      <div className="py-6 px-4 md:px-6 lg:px-12 relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{ y: -20, x: Math.random() * 100 + '%' }}
              animate={{
                y: '100%',
                x: Math.random() * 100 + '%',
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                ease: 'linear',
                delay: Math.random() * 5,
              }}
            >
              <Droplet className="text-red-600 opacity-50" size={Math.random() * 20 + 10} />
            </motion.div>
          ))}
        </div>

        <div className="mb-8 md:mb-12 relative max-w-lg mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-red-600" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchTermChange}
              placeholder="Search for your nightmares..."
              className="horror-search w-full py-3 pl-12 pr-4 text-red-500 bg-black border-2 border-red-600 rounded-full focus:outline-none focus:border-red-400 transition-all duration-300 font-nosifer"
            />
          </div>

          <AnimatePresence>
            {isAutocompleteVisible && autocompleteResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="search-results scrollbar-horror absolute w-full z-50 bg-black border-2 border-red-600 rounded-lg mt-2"
              >
                {autocompleteResults.map((movie) => (
                  <motion.div
                    key={movie.id}
                    className="search-result-item cursor-pointer p-3 hover:bg-red-900 transition-colors duration-300"
                    whileHover={{ x: 10, backgroundColor: 'rgba(255, 0, 0, 0.2)' }}
                    onClick={() => handleMovieSelect(movie)}
                  >
                    <div className="flex items-center">
                      <Skull className="w-4 h-4 mr-2 text-red-600" />
                      <div>
                        <p className="font-medium text-red-500 font-nosifer">{movie.title}</p>
                        <p className="text-xs text-red-700">{movie.year} • Rating: {movie.rating.toFixed(1)}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.h2
          className="horror-title text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-12 text-red-600 font-nosifer"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {movies.length === 1 && movies[0].title !== '' ? 'YOUR NIGHTMARE AWAITS' : 'BEST OF 2024 HORROR'}
        </motion.h2>

        <div className="carousel-container relative overflow-hidden">
          <motion.button
            className="scroll-button absolute top-1/2 left-2 transform -translate-y-1/2 bg-red-600 text-white rounded-full p-2 z-10 opacity-75 hover:opacity-100 transition-opacity duration-300"
            onClick={() => scrollCarousel('left')}
            whileHover={{ scale: 1.1, boxShadow: '0 0 15px rgba(255, 0, 0, 0.7)' }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft size={24} />
          </motion.button>

          <div
            ref={carouselRef}
            className="flex overflow-x-auto carousel-scroll py-6 gap-4 md:gap-6 scrollbar-thin scrollbar-thumb-red-600 scrollbar-track-gray-800"
            style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'thin' }}
          >
            {loading ? (
              <div className="flex justify-center items-center w-full h-64">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                  className="text-red-600"
                >
                  <Skull size={48} />
                </motion.div>
              </div>
            ) : (
              movies.map((movie) => (
                <motion.div
                  key={movie.id}
                  className="movie-card flex-shrink-0"
                  style={{ scrollSnapAlign: 'center' }}
                  whileHover={{ scale: 1.05, zIndex: 10 }}
                >
                  <div className="relative w-[250px] sm:w-[300px] md:w-[320px] lg:w-[350px] aspect-[2/3] rounded-lg overflow-hidden shadow-[0_0_15px_rgba(255,0,0,0.5)]">
                    <Image
                      src={movie.posterUrl}
                      alt={movie.title}
                      fill
                      className="object-cover rounded-lg"
                    />
                    <div className="movie-overlay absolute inset-0 flex flex-col justify-end items-center p-4 text-center bg-gradient-to-t from-black via-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <h3 className="text-red-500 text-xl mb-2 font-nosifer">{movie.title}</h3>
                      <p className="text-red-400 mb-4">{movie.rating.toFixed(1)} ★</p>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <motion.button
                          onClick={() => handleTrailerClick(movie)}
                          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors"
                          whileHover={{ scale: 1.1, boxShadow: '0 0 15px rgba(255, 0, 0, 0.7)' }}
                        >
                          <PlayCircle size={20} />
                          <span className="font-nosifer text-sm">Trailer</span>
                        </motion.button>
                        <motion.button
                          onClick={() => handleReviewClick(movie)}
                          className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition-colors"
                          whileHover={{ scale: 1.1, boxShadow: '0 0 15px rgba(255, 255, 255, 0.3)' }}
                        >
                          <Edit3 size={20} />
                          <span className="font-nosifer text-sm">Reviews</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          <motion.button
            className="scroll-button absolute top-1/2 right-2 transform -translate-y-1/2 bg-red-600 text-white rounded-full p-2 z-10 opacity-75 hover:opacity-100 transition-opacity duration-300"
            onClick={() => scrollCarousel('right')}
            whileHover={{ scale: 1.1, boxShadow: '0 0 15px rgba(255, 0, 0, 0.7)' }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight size={24} />
          </motion.button>
        </div>
      </div>
    </PageLayout>
  )
}


