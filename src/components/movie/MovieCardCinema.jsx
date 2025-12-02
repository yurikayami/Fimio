import { useState } from 'react';
import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { buildImageUrl } from '@/services/api';

/**
 * MovieCardCinema - Card kiểu phim rạp (Màn Nhấn)
 * - Poster lớn hơn, badge T.mới/Phụ đề
 * - Nền xanh lá hoặc cam nhạt
 */
export const MovieCardCinema = ({ movie }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const posterUrl = buildImageUrl(movie?.poster_url || movie?.thumb_url, {
    width: 180,
    height: 280,
    quality: 85,
  });

  const getBadges = () => {
    const badges = [];
    
    if (movie?.episode_current && movie.episode_current === '1') {
      badges.push({ text: 'T.mới', color: 'bg-lime-500' });
    }
    
    if (movie?.lang && movie.lang.includes('sub')) {
      badges.push({ text: 'Phụ đề', color: 'bg-amber-500' });
    }
    
    if (movie?.year) {
      badges.push({ text: String(movie.year), color: 'bg-blue-500' });
    }
    
    return badges.slice(0, 2); // Tối đa 2 badge
  };

  return (
    <Link to={`/movie/${movie?.slug}`} className="group">
      <div
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Card image wrapper - lớn hơn một chút */}
        <div
          className={`
            relative rounded-xl overflow-hidden
            transition-all duration-300
            group-hover:scale-105
            group-hover:shadow-2xl
            w-full aspect-[3/4.5]
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
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Play button */}
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
                {movie.category[0].name?.substring(0, 4)}
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
        <div className="mt-3 space-y-2">
          <h3 className="text-white font-bold text-sm md:text-base leading-tight line-clamp-2">
            {movie?.name}
          </h3>

          {/* Badges dưới tên - xanh lá/cam nhạt */}
          <div className="flex flex-wrap gap-2">
            {getBadges().map((badge, idx) => (
              <span
                key={idx}
                className={`
                  inline-block px-2 py-1 rounded text-white text-xs font-semibold
                  ${badge.color}
                `}
              >
                {badge.text}
              </span>
            ))}
          </div>

          {/* Dòng phụ */}
          <p className="text-gray-400 text-xs">
            {movie?.type}
          </p>
        </div>
      </div>
    </Link>
  );
};
