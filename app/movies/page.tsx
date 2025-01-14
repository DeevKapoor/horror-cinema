'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Skull, ChevronLeft, ChevronRight, Search, PlayCircle, Edit3, Droplet } from 'lucide-react'
import PageLayout from '../components/PageLayout'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const TMDB_API_KEY = '95a07433f19cbefdd02f495c48939a37'
const BASE_URL = 'https://api.themoviedb.org/3/'

interface Movie {
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
  const searchDebounceRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    fetchBestOf2024Movies()
  }, [])

  const fetchBestOf2024Movies = async () => {
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
  }

  const formatMovieData = (results: any[]): Movie[] => {
    return results
      .filter((movie: any) => movie.poster_path)
      .map((movie: any) => ({
        id: movie.id,
        title: movie.title,
        posterUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        year: movie.release_date?.split('-')[0] || '2024',
        description: movie.overview,
        rating: movie.vote_average,
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

    // Redirect to the reviews page using the movie's ID
   
  }
  const handleReviewClick = (movie: Movie) => {
    router.push(`/reviews/${movie.id}`)
  }

  const handleTrailerClick = (movie: Movie) => {
    // URL-encode the movie title to ensure it's safe to pass in the URL
    const movieTitleEncoded = encodeURIComponent(movie.title)
    router.push(`/trailers/${movieTitleEncoded}`) // Navigate to /trailers/[movieName]
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

        <div className="carousel-container relative">
          <motion.button
            className="scroll-button absolute top-1/2 left-2 transform -translate-y-1/2 bg-red-600 text-white rounded-full p-2 z-10"
            onClick={() => scrollCarousel('left')}
            whileHover={{ scale: 1.1, boxShadow: '0 0 15px rgba(255, 0, 0, 0.7)' }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft size={24} />
          </motion.button>

          <div
            ref={carouselRef}
            className="flex overflow-x-auto carousel-scroll py-6 gap-4 md:gap-6"
            style={{ scrollSnapType: 'x mandatory' }}
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
                  <div className="relative w-[85vw] sm:w-[300px] md:w-[320px] lg:w-[350px] aspect-[2/3] rounded-lg overflow-hidden shadow-[0_0_15px_rgba(255,0,0,0.5)]">
                    <Image
                      src={movie.posterUrl}
                      alt={movie.title}
                      fill
                      className="object-cover rounded-lg"
                    />
                    <div className="movie-overlay absolute inset-0 flex flex-col justify-center items-center p-4 text-center bg-gradient-to-t from-black to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <h3 className="text-red-500 text-xl mb-2 font-nosifer">{movie.title}</h3>
                      <p className="text-red-400 mb-4">{movie.rating.toFixed(1)} ★</p>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <motion.button
                          onClick={() => handleTrailerClick(movie)}
                         
                          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors"
                          whileHover={{ scale: 1.1, boxShadow: '0 0 15px rgba(255, 0, 0, 0.7)' }}
                        >
                          <PlayCircle size={20} />
                          <span className="font-nosifer">Trailer</span>
                        </motion.button>
                        <motion.button
                          onClick={() => handleReviewClick(movie)}
                          
                          className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition-colors"
                          whileHover={{ scale: 1.1, boxShadow: '0 0 15px rgba(255, 255, 255, 0.3)' }}
                        >
                          <Edit3 size={20} />
                          <span className="font-nosifer">Reviews</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          <motion.button
            className="scroll-button absolute top-1/2 right-2 transform -translate-y-1/2 bg-red-600 text-white rounded-full p-2 z-10"
            onClick={() => scrollCarousel('right')}
            whileHover={{ scale: 1.1, boxShadow: '0 0 15px rgba(255, 0, 0, 0.7)' }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight size={24} />
          </motion.button>
        </div>
      </div>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Nosifer&display=swap');

        body {
          background-color: #000000;
          color: #ff0000;
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="12" cy="12" r="9" stroke="red" stroke-width="2" fill="none"/></svg>') 16 16, auto;
        }
      `}</style>
    </PageLayout>
  )
}
