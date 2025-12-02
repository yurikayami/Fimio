import { useState } from 'react';
import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { buildImageUrl } from '@/services/api';

/**
 * MovieCardTop10 - Card kiểu Top 10 đặc biệt
 * - Số thứ hạng gradient lệch ngoài
 * - Badge góc trên (thể loại, tập mới)
 * - Scale hover 1.05-1.08
 */
export const MovieCardTop10 = ({ movie, rank }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const posterUrl = buildImageUrl(movie?.poster_url || movie?.thumb_url, {
    width: 200,
    height: 300,
    quality: 80,
  });

  return (
    <Link to={`/movie/${movie?.slug}`} className="group flex-shrink-0 relative">
      {/* Container với số thứ hạng bên ngoài */}
      <div
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Số thứ hạng - Gradient gold → orange, lệch ngoài */}
        <div className="absolute -left-7 md:-left-12 top-8 z-20">
          <span className="text-7xl md:text-8xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent drop-shadow-lg">
            {rank}
          </span>
        </div>

        {/* Card image wrapper */}
        <div
          className="
            relative rounded-2xl overflow-hidden
            w-44 md:w-48 h-64 md:h-72
            bg-slate-800
            transition-all duration-300
            group-hover:scale-105 md:group-hover:scale-108
            group-hover:shadow-2xl
          "
        >
          {/* Poster image */}
          <img
            src={posterUrl}
            alt={movie?.name}
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            className={`
              w-full h-full object-cover
              transition-opacity duration-300
              ${isLoaded ? 'opacity-100' : 'opacity-0'}
            `}
          />

          {/* Skeleton loading */}
          {!isLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 animate-shimmer" />
          )}

          {/* Gradient overlay - dark from bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Play button - hiện khi hover */}
          {isHovered && (
            <button className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors">
                <Play size={32} className="text-black fill-black ml-1" />
              </div>
            </button>
          )}

          {/* Top Left Badge - Thể loại (PD.4, T18, etc) */}
          {movie?.category?.[0] && (
            <div className="absolute top-3 left-3 z-10">
              <span className="inline-block px-3 py-1 rounded-lg bg-red-600 text-white text-xs font-bold">
                {movie.category[0].name?.substring(0, 4)}
              </span>
            </div>
          )}

          {/* Top Right Badge - Tập mới (nếu có) */}
          {movie?.episode_current && (
            <div className="absolute top-3 right-3 z-10">
              <span className="inline-block px-3 py-1 rounded-lg bg-emerald-500 text-white text-xs font-bold">
                TM.{movie.episode_current}
              </span>
            </div>
          )}
        </div>

        {/* Title section - bên dưới card */}
        <div className="mt-4 space-y-1">
          <h3 className="text-white font-bold text-base leading-tight line-clamp-2">
            {movie?.name}
          </h3>
          <p className="text-gray-400 text-sm">
            {movie?.year} • {movie?.type}
          </p>
        </div>
      </div>
    </Link>
  );
};
