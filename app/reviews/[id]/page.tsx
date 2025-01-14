/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Film, ArrowLeft, Star } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image'; // Use next/image for optimization
import '../../components/styles.css'
export default function ReviewsPage() {
  const router = useRouter();
  const [state, setState] = useState<{
      searchTerm: string;
      searchResults: {
        id: string;
        title: string;
        release_date: string;
        poster_path: string | null;
      }[];
      selectedMovie: {
        id: string;
        title: string;
        release_date: string;
        poster_path: string | null;
        overview: string;
      } | null;
      reviews: {
        id: string;
        author: string;
        content: string;
        rating: number | null;
        source: string;
        created_at: string;
      }[];
      loading: boolean;
      movieDetailsFetched: boolean;
      director: string;
      cast: string[];
    }>({
    searchTerm: '',
    searchResults: [],
    selectedMovie: null,
    reviews: [],
    loading: false,
    movieDetailsFetched: false,
    director: '',
    cast: [],
  });

  const TMDB_API_KEY = '95a07433f19cbefdd02f495c48939a37';
  const OMDB_API_KEY = 'da1a01ff';

  const fetchMovieReviews = async (movieId: string) => {
    setState((prevState) => ({ ...prevState, loading: true, reviews: [] }));
    try {
      // Fetch TMDB movie details first to get the title
      const movieDetailsResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`
      );
      const movieData = await movieDetailsResponse.json();
      const creditsResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${TMDB_API_KEY}&language=en-US`
      );
      const creditsData = await creditsResponse.json();
  
      // Extract director and top-billed cast
      const director = creditsData.crew.find((member: { job: string; }) => member.job === 'Director')?.name || 'Unknown';
      const cast = creditsData.cast.slice(0, 5).map((actor: { name: unknown; }) => actor.name);
  
      // Fetch TMDB reviews
      const tmdbResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/reviews?api_key=${TMDB_API_KEY}&language=en-US`
      );
      const tmdbData = await tmdbResponse.json();
  
      // Fetch OMDB reviews using the movie title
      const omdbResponse = await fetch(
        `https://www.omdbapi.com/?t=${encodeURIComponent(movieData.title)}&apikey=${OMDB_API_KEY}`
      );
      const omdbData = await omdbResponse.json();
  
      const combinedReviews: {
        id: string;
        author: string;
        content: string;
        rating: number | null;
        source: string;
        created_at: string;
      }[] = [];
  
      // Add TMDB reviews
      if (tmdbData.results) {
        const tmdbReviews = tmdbData.results.map((review: { id: unknown; author: unknown; content: unknown; author_details: { rating: unknown; }; created_at: unknown; }) => ({
          id: `tmdb-${review.id}`,
          author: review.author || 'Anonymous',
          content: review.content,
          rating: review.author_details?.rating,
          source: 'TMDB',
          created_at: review.created_at,
        }));
        combinedReviews.push(...tmdbReviews);
      }
  
      // Add OMDB reviews
      if (omdbData.Ratings) {
        const omdbReviews = omdbData.Ratings.map((rating: { Source: unknown; Value: string; }, index: unknown) => ({
          id: `omdb-${index}`,
          author: rating.Source,
          content: `Rating: ${rating.Value}`,
          rating: parseFloat(rating.Value.split('/')[0]) * 10,
          source: 'OMDB',
          created_at: new Date().toISOString(),
        }));
        combinedReviews.push(...omdbReviews);
      }
  
      setState((prevState) => ({
        ...prevState,
        reviews: combinedReviews,
        selectedMovie: movieData,
        director, // Set director
        cast, // Set cast
      }));
  
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setState((prevState) => ({ ...prevState, loading: false }));
    }
  };
  
  const searchMovies = useCallback(async () => {
    if (!state.searchTerm) {
      setState((prevState) => ({ ...prevState, searchResults: [] }));
      return;
    }
    setState((prevState) => ({ ...prevState, loading: true }));
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(state.searchTerm)}&include_adult=false&language=en-US&page=1`
      );
      const data = await response.json();
      setState((prevState) => ({
        ...prevState,
        searchResults: data.results || [],
      }));
    } catch (error) {
      console.error('Error searching movies:', error);
    } finally {
      setState((prevState) => ({ ...prevState, loading: false }));
    }
  }, [state.searchTerm]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (state.searchTerm) searchMovies();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [state.searchTerm, searchMovies]);

  useEffect(() => {
    // Get the movie ID from the URL path
    const pathSegments = window.location.pathname.split('/');
    const movieId = pathSegments[pathSegments.length - 1];
    
    if (movieId && movieId !== '1') {
      fetchMovieReviews(movieId);
    }
  }, []);

  const handleMovieSelect = (movieId: string) => {
    // Navigate to the movie's review page
    router.push(`/reviews/${movieId}`);
  };

  const handleBackToSearch = () => {
    setState({
      searchTerm: '',
      searchResults: [],
      selectedMovie: null,
      reviews: [],
      movieDetailsFetched: false,
      loading: false,
      director: '',
      cast: [],
    });
    router.push('/reviews/1');
  };
  const handleBackToHome = () => {
    setState({
      searchTerm: '',
      searchResults: [],
      selectedMovie: null,
      reviews: [],
      movieDetailsFetched: false,
      loading: false,
      director: '',
      cast: [],
    });
    router.push('/'); // Navigate back to home
  };

  return (
    <div className="min-h-screen bg-black text-red-500 p-4 sm:p-6 md:p-8 relative max-w-7xl mx-auto">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-nosifer text-center mb-8 sm:mb-12 text-red-600 text-shadow-horror tracking-wider animate-pulse">
        HORROR MOVIE REVIEWS
      </h1>

      {/* Back Buttons */}
      <div className="absolute top-8 left-4 z-50 flex gap-4">
        {state.selectedMovie ? (
          <button
            onClick={handleBackToSearch}
            className="bg-red-900/50 hover:bg-red-800 text-white px-4 py-2 rounded-full flex items-center gap-2 backdrop-blur-sm transition-all duration-300 border border-red-700 text-sm shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-nosifer">Back to Search</span>
          </button>
        ) : (
          <button
            onClick={handleBackToHome}
            className="bg-red-900/50 hover:bg-red-800 text-white px-4 py-2 rounded-full flex items-center gap-2 backdrop-blur-sm transition-all duration-300 border border-red-700 text-sm shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-nosifer">Home</span>
          </button>
        )}
      </div>

      {/* Search Bar - Only show on /components/reviews/1 */}
      {(!state.selectedMovie && window.location.pathname.endsWith('')) && (
        <div className="max-w-2xl mx-auto mb-8 px-4 sm:px-6 md:px-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-red-500" />
            <input
              type="text"
              value={state.searchTerm}
              onChange={(e) => setState(prev => ({ ...prev, searchTerm: e.target.value }))} // use prevState correctly
              placeholder="Search for horror movies..."
              className="w-full pl-12 pr-4 py-3 bg-gray-900/80 text-red-500 rounded-full border border-red-700 focus:outline-none font-nosifer focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
      )}

      {/* Search Results */}
      {(!state.selectedMovie && state.searchResults.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {(state.searchResults as { id: string; title: string; release_date: string; poster_path: string | null }[]).map((movie) => (
            <div
              key={movie.id}
              onClick={() => handleMovieSelect(movie.id)}
              className="bg-gray-900/80 rounded-lg p-4 cursor-pointer hover:bg-gray-800/80 transition-all duration-300 border border-red-800 flex flex-col h-full"
            >
              <div className="flex flex-col sm:flex-row gap-4 h-full">
                {movie.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                    alt={movie.title}
                    width={200}
                    height={300}
                    className="w-full sm:w-24 h-36 object-cover rounded"
                  />
                ) : (
                  <div className="w-full sm:w-24 h-36 bg-gray-800 rounded flex items-center justify-center">
                    <Film className="w-8 h-8 text-red-500" />
                  </div>
                )}
                <div className="flex flex-col justify-between flex-grow">
                  <h3 className="font-nosifer text-lg text-red-600">{movie.title}</h3>
                  <p className="text-sm text-red-500">{movie.release_date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Movie Details */}
      {state.selectedMovie && (
        <div className="max-w-6xl mx-auto mt-8 px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col sm:flex-row gap-4">
              {state.selectedMovie.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w300${state.selectedMovie.poster_path}`}
                  alt={state.selectedMovie.title}
                  width={300}
                  height={450}
                  className="w-full sm:w-64 h-96 object-cover rounded"
                />
              ) : (
                <div className="w-full sm:w-64 h-96 bg-gray-800 rounded flex items-center justify-center">
                  <Film className="w-16 h-16 text-red-500" />
                </div>
              )}
              <div className="flex-grow">
                <h2 className="text-2xl font-nosifer text-red-600">{state.selectedMovie.title}</h2>
                <p className="text-sm text-red-500">{state.selectedMovie.release_date}</p>
                <p className="text-sm text-gray-400 mt-2">{state.selectedMovie.overview}</p>

                <div className="mt-4">
                  <h3 className="text-xl font-nosifer text-red-600">Director: {state.director}</h3>
                  <h3 className="text-xl font-nosifer text-red-600 mt-2">Cast:</h3>
                  <ul className="list-disc ml-6">
                    {state.cast.map((actor, index) => (
                      <li key={index} className="text-red-500">{actor}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div>
              <h3 className="text-xl font-nosifer text-red-600 mb-4">Reviews</h3>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-red-600 scrollbar-track-gray-800">
                {state.reviews.length > 0 ? (
                  state.reviews.map((review) => (
                    <div key={review.id} className="bg-gray-900/80 p-4 rounded-lg border border-red-700">
                      <h4 className="text-lg text-red-500 font-semibold">{review.author}</h4>
                      <p className="text-sm text-gray-400">{review.content as string}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <span className="text-yellow-500">{review.rating || 'N/A'} / 10</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-red-400">No reviews available.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

