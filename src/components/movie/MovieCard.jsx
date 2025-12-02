import { useState, useRef, useEffect, memo } from 'react';
import { Link } from 'react-router-dom';
import { buildImageUrl } from '@/services/api';
import { generateLQIP, preloadImage } from '@/lib/imageUtils';
import { Clock } from 'lucide-react';

// Memoized MovieCard to prevent unnecessary re-renders
export const MovieCard = memo(({ movie, priority = false }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const [showBlur, setShowBlur] = useState(true);
  const imgRef = useRef(null);

  const posterUrl = buildImageUrl(movie.poster_url || movie.thumb_url);
  const placeholderUrl = generateLQIP(8);

  // Intersection Observer for aggressive lazy loading below-the-fold images
  useEffect(() => {
    if (priority || !imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          // Immediately preload the image once visible
          preloadImage(posterUrl);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px 0px', // Reduced margin for faster loading start
        threshold: 0,
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [priority, posterUrl]);

  const handleImageLoad = () => {
    setIsLoaded(true);
    setShowBlur(false);
  };

  const handleImageError = () => {
    setHasError(true);
    setIsLoaded(true);
    setShowBlur(false);
  };

  return (
    <Link
      to={`/movie/${movie.slug}`}
      className="group block bg-secondary rounded-lg overflow-hidden border border-slate-700 transition-transform duration-300 hover:-translate-y-[15px] hover:border-indigo-500/50"
    >
      <div ref={imgRef} className="relative pb-[150%] bg-slate-700">
        {/* Ultra-fast blur-up placeholder */}
        {showBlur && (
          <img
            src={placeholderUrl}
            alt=""
            className="absolute inset-0 w-full h-full blur-lg scale-110"
            style={{ filter: 'blur(10px)' }}
            aria-hidden="true"
          />
        )}

        {/* Skeleton loading state */}
        {!isLoaded && !showBlur && (
          <div className="absolute inset-0 bg-slate-800 animate-pulse" />
        )}

        {/* Main Poster Image - Lazy loaded only when in view */}
        {isInView && (
          <img
            src={hasError ? '/placeholder.jpg' : posterUrl}
            alt={movie.name || movie.origin_name}
            width={200}
            height={300}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            } group-hover:scale-110`}
            loading="lazy"
            decoding="async"
            fetchPriority={priority ? 'high' : 'low'}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}

        {/* Year Tag */}
        {movie.year && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-slate-800/70 rounded border border-slate-700 text-xs text-indigo-300 font-medium z-10">
            {movie.year}
          </div>
        )}

        {/* Episode Status Tag */}
        {movie.episode_current && (
          <div className="absolute top-2 right-2 px-2 py-1 bg-slate-800/70 rounded border border-slate-700 text-xs text-orange-300 font-medium flex items-center gap-1 z-10">
            <Clock className="h-3 w-3" />
            {movie.episode_current}
          </div>
        )}

        {/* Movie Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#000000]/95 via-[#000000]/70 to-transparent pt-6 pb-3 px-3 z-10">
          <h3 className="text-sm font-semibold text-slate-100 text-center mb-1 line-clamp-2">
            {movie.name}
          </h3>
          {movie.origin_name && movie.origin_name !== movie.name && (
            <p className="text-xs text-slate-400 text-center line-clamp-1">
              {movie.origin_name}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
});

MovieCard.displayName = 'MovieCard';
