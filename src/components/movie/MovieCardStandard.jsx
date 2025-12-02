import { useState } from 'react';
import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { buildImageUrl } from '@/services/api';

/**
 * MovieCardStandard - Card kiểu thường
 * - Poster bo góc 8-12px
 * - Tên phim 2 dòng
 * - Dòng phụ: năm, tập, thời lượng
 * - Scale hover 1.05
 */
export const MovieCardStandard = ({ movie, variant = 'default' }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const posterUrl = buildImageUrl(movie?.poster_url || movie?.thumb_url, {
    width: 160,
    height: 240,
    quality: 80,
  });

  // Lấy thông tin phụ: năm, tập mới, thời lượng
  const getMetaInfo = () => {
    const parts = [];
    
    if (movie?.year) parts.push(movie.year.toString());
    
    if (movie?.episode_current && movie?.episode_current !== '0') {
      parts.push(`Tập ${movie.episode_current}`);
    }
    
    if (movie?.time) {
      parts.push(`${movie.time}m`);
    }
    
    return parts.join(' • ') || movie?.type || 'Phim';
  };

  return (
    <Link to={`/movie/${movie?.slug}`} className="group">
      <div
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Card image wrapper */}
        <div
          className={`
            relative rounded-xl overflow-hidden
            transition-all duration-300
            group-hover:scale-105
            group-hover:shadow-2xl
            ${variant === 'large' ? 'w-full aspect-[2/3]' : 'w-full aspect-[3/4.5]'}
          `}
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

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Play button - hiện khi hover */}
          {isHovered && (
            <button className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors">
                <Play size={24} className="text-black fill-black ml-1" />
              </div>
            </button>
          )}

          {/* Top Left Badge - Thể loại */}
          {movie?.category?.[0] && (
            <div className="absolute top-2 left-2 z-10">
              <span className="inline-block px-2.5 py-1 rounded-lg bg-red-600 text-white text-xs font-bold">
                {movie.category[0].name?.substring(0, 3)}
              </span>
            </div>
          )}

          {/* Top Right Badge - Tập mới */}
          {movie?.episode_current && movie.episode_current !== '0' && (
            <div className="absolute top-2 right-2 z-10">
              <span className="inline-block px-2.5 py-1 rounded-lg bg-emerald-500 text-white text-xs font-bold">
                TM.{movie.episode_current}
              </span>
            </div>
          )}
        </div>

        {/* Title section */}
        <div className="mt-3 space-y-1">
          <h3 className="text-white font-bold text-sm md:text-base leading-tight line-clamp-2 hover:line-clamp-none">
            {movie?.name}
          </h3>
          <p className="text-gray-400 text-xs md:text-sm">
            {getMetaInfo()}
          </p>
        </div>
      </div>
    </Link>
  );
};
