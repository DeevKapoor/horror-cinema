'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageLayout from '../../components/PageLayout';
import { Skull, Film, Ghost } from 'lucide-react';

const TMDB_API_KEY = '95a07433f19cbefdd02f495c48939a37';
const BASE_URL = 'https://api.themoviedb.org/3/';

interface Trailer {
  key: string;
  title: string;
}

interface TrailerClientProps {
  id: string;
}

export default function TrailerClient({ id }: TrailerClientProps) {
  const [trailer, setTrailer] = useState<Trailer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [movieTitle, setMovieTitle] = useState<string>(''); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrailerAndMovieInfo = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!id) {
          setError('No movie title provided');
          setLoading(false);
          return;
        }

        const movieResponse = await fetch(
          `${BASE_URL}search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(id)}`
        );
        const movieData = await movieResponse.json();

        if (!movieData || !movieData.results || movieData.results.length === 0) {
          setError('Movie not found');
          setLoading(false);
          return;
        }

        const movieInfo = movieData.results[0];
        setMovieTitle(movieInfo.title);

        const videoResponse = await fetch(
          `${BASE_URL}movie/${movieInfo.id}/videos?api_key=${TMDB_API_KEY}`
        );
        const videoData = await videoResponse.json();

        const trailerVideo = videoData.results?.find((video: { type: string; }) => video.type === 'Trailer');
        if (trailerVideo) {
          setTrailer({
            key: trailerVideo.key,
            title: movieInfo.title
          });
        } else {
          setTrailer(null);
          setError('No trailer found for this movie.');
        }
      } catch (err: unknown) {
        setTrailer(null);
        setError('An error occurred while fetching the trailer. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrailerAndMovieInfo();
  }, [id]);

  return (
    <PageLayout title={`whispers call you....`} className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <AnimatePresence>
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                initial={{ opacity: 0, scale: 0, x: Math.random() * 100 + '%', y: -20 }}
                animate={{
                  opacity: [0.2, 0.5, 0.2],
                  scale: [1, 1.5, 1],
                  y: '100%',
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{
                  duration: Math.random() * 5 + 5,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: Math.random() * 5,
                }}
              >
                <Ghost className="text-red-600 opacity-20" size={Math.random() * 30 + 20} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10"
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <motion.div
                animate={{
                  rotate: 360,
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <Skull className="w-16 h-16 text-red-600" />
              </motion.div>
              <p className="mt-4 text-red-400 font-creepster text-xl sm:text-2xl md:text-3xl animate-pulse">
                Summoning the darkness...
              </p>
            </div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center min-h-[60vh] space-y-6"
            >
              <Skull className="w-24 h-24 text-red-600 animate-pulse" />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-nosifer text-red-600 text-center">
                {error}
              </h2>
              <p className="text-xl sm:text-2xl md:text-3xl font-nosifer text-red-400">
                Perhaps try another victim...
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-nosifer text-center bg-gradient-to-br from-red-500 via-red-600 to-red-700 
                            text-transparent bg-clip-text mb-4 sm:mb-8 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                {movieTitle}
              </h1>

              <div className="relative w-full mx-auto">
                <motion.div
                  className="w-full shadow-[0_0_30px_rgba(220,38,38,0.3)] rounded-lg overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  {trailer ? (
                    <div className="relative w-full" style={{ paddingTop: '75%' }}>
                      <iframe
                        src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=0`}
                        title={trailer.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute top-0 left-0 w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-video bg-gray-900 flex flex-col justify-center items-center text-red-500 p-4">
                      <Film className="w-16 h-16 mb-4 animate-pulse" />
                      <p className="text-xl sm:text-2xl md:text-3xl font-nosifer text-center">No trailer available</p>
                      <p className="text-sm sm:text-base md:text-lg mt-2 text-red-400 text-center">The darkness has consumed this trailer</p>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </PageLayout>
  );
}