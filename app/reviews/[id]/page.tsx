// app/components/reviews/[id]/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Film, ArrowLeft, Star } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import PageLayout from '../components/PageLayout'
export default function ReviewsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, setState] = useState({
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

  const fetchMovieReviews = async (movieId) => {
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
      const director = creditsData.crew.find((member) => member.job === 'Director')?.name || 'Unknown';
      const cast = creditsData.cast.slice(0, 5).map((actor) => actor.name);
  
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
  
      let combinedReviews = [];
  
      // Add TMDB reviews
      if (tmdbData.results) {
        const tmdbReviews = tmdbData.results.map((review) => ({
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
        const omdbReviews = omdbData.Ratings.map((rating, index) => ({
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

  const handleMovieSelect = (movieId) => {
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
    });
    router.push('/'); // Navigate back to home
  };

  return (
    <div className="min-h-screen bg-black text-red-500 p-4 relative">
      <h1 className="text-3xl md:text-6xl font-nosifer text-center mb-12 text-red-600 text-shadow-horror tracking-wider animate-pulse">
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
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-red-500" />
            <input
              type="text"
              value={state.searchTerm}
              onChange={(e) => setState(prev => ({ ...prev, searchTerm: e.target.value }))}
              placeholder="Search for horror movies..."
              className="w-full pl-12 pr-4 py-3 bg-gray-900/80 text-red-500 rounded-full border border-red-700 focus:outline-none font-nosifer focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
      )}

      {/* Search Results */}
      {(!state.selectedMovie && state.searchResults.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {state.searchResults.map((movie) => (
            <div
              key={movie.id}
              onClick={() => handleMovieSelect(movie.id)}
              className="bg-gray-900/80 rounded-lg p-4 cursor-pointer hover:bg-gray-800/80 transition-all duration-300 border border-red-800"
            >
              <div className="flex gap-4">
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                    alt={movie.title}
                    className="w-24 h-36 object-cover rounded"
                  />
                ) : (
                  <div className="w-24 h-36 bg-gray-800 rounded flex items-center justify-center">
                    <Film className="w-8 h-8 text-red-500" />
                  </div>
                )}
                <div>
                  <h3 className="font-nosifer text-lg text-red-400">{movie.title}</h3>
                  <p className="text-sm text-gray-400 mt-2">
                    {new Date(movie.release_date).getFullYear()}
                  </p>
                  <div className="flex items-center mt-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="ml-2 text-yellow-300">{movie.vote_average.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Movie Details and Reviews */}
      {state.selectedMovie && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900/80 rounded-lg p-6 border border-red-800 mb-8">
            <div className="flex flex-col md:flex-row gap-6">
              {state.selectedMovie.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w400${state.selectedMovie.poster_path}`}
                  alt={state.selectedMovie.title}
                  className="w-full md:w-64 rounded-lg"
                />
              )}
              <div>
                <h2 className="text-2xl font-nosifer text-red-400 mb-4">
                  {state.selectedMovie.title}
                </h2>
                <p className="text-gray-400 mb-4">{state.selectedMovie.overview}</p>
                <div className="text-gray-300 mb-4">
                  <p><strong>Director:</strong> {state.director}</p>
                  <p><strong>Cast:</strong> {state.cast.join(', ')}</p>
                </div>
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="ml-2 text-yellow-300">
                    {state.selectedMovie.vote_average.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="space-y-6">
            <h3 className="text-2xl font-nosifer mb-6">Reviews</h3>
            {state.reviews.length > 0 ? (
              state.reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-gray-900/80 p-6 rounded-lg border border-red-800"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-nosifer text-red-400">
                      {review.author} <span className="text-gray-500">({review.source})</span>
                    </h4>
                    {review.rating && (
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="ml-2 text-yellow-300">{review.rating}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-400 whitespace-pre-line">{review.content}</p>
                  <p className="text-sm text-gray-500 mt-4">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No reviews available for this movie.</p>
            )}
          </div>
        </div>
      )}

      {/* Loading State */}
      {state.loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
        </div>
      )}
    </div>
  );
}