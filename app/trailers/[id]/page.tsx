'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PageLayout from '../../components/PageLayout';
import { Skull } from 'lucide-react';

const TMDB_API_KEY = '95a07433f19cbefdd02f495c48939a37';
const YOUTUBE_API_KEY = 'AIzaSyC8yWK5PXl2wfykYWXqUWf5_3-AbyTrZSo';  // YouTube API key
const BASE_URL = 'https://api.themoviedb.org/3/';

export default function TrailersPage({ params }: { params: { id: string } }) {
  const [trailer, setTrailer] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [movieTitle, setMovieTitle] = useState<string>('');  // Movie title state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrailerAndMovieInfo = async () => {
      setLoading(true);
      setError(null);  // Reset error on each request

      try {
        if (!params?.id) {
          setError('No movie title provided');
          setLoading(false);
          return;
        }

        // Fetch movie details from TMDB using movie title (params.id)
        const movieResponse = await fetch(
          `${BASE_URL}search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(params.id)}`
        );
        const movieData = await movieResponse.json();

        // Ensure movie data exists
        if (!movieData || !movieData.results || movieData.results.length === 0) {
          setError('Movie not found');
          setLoading(false);
          return;
        }

        const movieInfo = movieData.results[0];  // Use the first movie result
        setMovieTitle(movieInfo.title);

        // Search for the trailer on YouTube using the movie title
        const youtubeResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(movieInfo.title)} trailer&key=${YOUTUBE_API_KEY}`
        );
        const youtubeData = await youtubeResponse.json();

        // Get the first video result
        const youtubeVideo = youtubeData.items?.[0];
        if (youtubeVideo) {
          setTrailer({
            key: youtubeVideo.id.videoId,
            title: movieInfo.title
          });
        } else {
          setTrailer(null);
          setError('No trailer found on YouTube.');
        }
      } catch (err: any) {
        setTrailer(null);
        setError('An error occurred while fetching the trailer. Please try again later.');
        console.error(err);  // Log the actual error for debugging
      } finally {
        setLoading(false);
      }
    };

    fetchTrailerAndMovieInfo();
  }, [params?.id]);  // Triggered when params.id changes

  return (
    <PageLayout title={`Darkness Your Way.....`} className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-red-950">
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="animate-spin w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full"></div>
            <p className="mt-4 text-red-400 font-creepster text-xl">Summoning the darkness...</p>
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center min-h-[60vh] space-y-6"
          >
            <Skull className="w-24 h-24 text-red-600 animate-pulse" />
            <h2 className="text-4xl font-nosifer text-red-600 text-center">
              {error}
            </h2>
            <p className="text-xl font-nosifer text-red-400">
              Perhaps try another victim...
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <h1 className="text-4xl font-nosifer text-center bg-gradient-to-br from-red-500 via-red-600 to-red-700 
                          text-transparent bg-clip-text mb-8 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
              {movieTitle}
            </h1>

            <div className="relative aspect-video max-w-5xl mx-auto">
              <motion.div
                className="w-full h-full shadow-[0_0_30px_rgba(220,38,38,0.3)] rounded-lg overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                {trailer ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=0`}
                    title={trailer.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex justify-center items-center text-white">
                    <p>No trailer available</p>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </PageLayout>
  );
}
