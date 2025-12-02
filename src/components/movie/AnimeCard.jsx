import { useState } from 'react';
import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { buildOptimizedImageUrl } from '@/lib/imageUtils';
import { LoadingSkeleton } from '../common/LoadingSkeleton';

/**
 * AnimeCard - Netflix-style design với backdrop + poster overlap
 * 
 * Layout:
 * - Backdrop (16:9): Hình nền landscape, bo góc trên
 * - Poster (2:3): Ảnh portrait, nằm dưới backdrop với -mt-16, shadow
 * - Badge "P.Đề": Nằm dưới poster phía trái
 * - Metadata: Tiêu đề, gốc, năm, tập ở phía phải
 */
export const AnimeCard = ({ movie, isLoading = false }) => {
  const [backdropLoaded, setBackdropLoaded] = useState(false);
  const [posterLoaded, setPosterLoaded] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <LoadingSkeleton className="rounded-t-lg w-full aspect-[16/9]" />
        <div className="flex gap-4 px-2 pb-4">
          <LoadingSkeleton className="w-24 h-32 rounded-md flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <LoadingSkeleton className="w-full h-4 rounded" />
            <LoadingSkeleton className="w-3/4 h-3 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!movie) return null;

  const backdropUrl = buildOptimizedImageUrl(movie.backdrop_path || movie.poster_url, {
    useWebP: true,
    compress: true
  });

  const posterUrl = buildOptimizedImageUrl(movie.poster_url, {
    useWebP: true,
    compress: true
  });

  const title = movie.name || movie.title || 'Untitled';
  const originName = movie.origin_name;
  const year = movie.year || new Date().getFullYear();
  const episodes = movie.episodes_total || movie.total_episodes;

  // Kiểm tra xem có phụ đề không
  const hasSubtitle = movie.status?.includes('Phụ') || movie.quality?.includes('Phụ');

  return (
    <Link to={`/movie/${movie.slug}`} className="group block cursor-pointer">
      <div className="space-y-0">
        
        {/* ===== BACKDROP LAYER (2.35:1) ===== */}
        <div className="relative rounded-t-lg overflow-hidden bg-slate-900">
          <div className="relative w-full aspect-[2.35/1]">
            {!backdropLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 animate-pulse" />
            )}

            <img
              src={backdropUrl}
              alt={title}
              loading="lazy"
              onLoad={() => setBackdropLoaded(true)}
              className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                backdropLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* Play Button Hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="bg-white rounded-full p-4 shadow-2xl">
                <Play className="w-6 h-6 text-slate-900 fill-slate-900" />
              </div>
            </div>
          </div>
        </div>

        {/* ===== CONTENT LAYER (Poster + Metadata - nằm overlap) ===== */}
        <div className="flex gap-4 -mt-16 relative z-10 px-3 pb-4 pt-2 from-black/20 to-slate-950">
          
          {/* Poster (2:3) - nằm overlap */}
          <div className="flex-shrink-0">
            <div className="relative w-24 h-32 rounded-md overflow-hidden shadow-2xl border-2 border-black/20">
              {!posterLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 animate-pulse" />
              )}

              <img
                src={posterUrl}
                alt={title}
                loading="lazy"
                onLoad={() => setPosterLoaded(true)}
                className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 ${
                  posterLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </div>

            {/* Badge "P.Đề" - dưới poster */}
            {hasSubtitle && (
              <div className="mt-2">
                <span className="inline-block bg-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                  P.Đề
                </span>
              </div>
            )}
          </div>

          {/* Metadata (Title, Origin, Year, Episodes) - bên phải poster */}
          <div className="flex-1 flex flex-col justify-center pt-14">
            {/* Title */}
            <h3 className="text-white font-bold text-xs line-clamp-1 group-hover:text-purple-300 transition-colors leading-tight">
              {title}
            </h3>

            {/* Origin Name */}
            {originName && (
              <p className="text-gray-400 text-xs line-clamp-1 mt-1">
                {originName}
              </p>
            )}

            {/* Metadata: Year • Episodes (kept but will be clipped by max-h) */}
            <div className="text-gray-500 text-xs mt-1 flex items-center gap-2 flex-wrap">
              <span className="font-medium">{year}</span>
              {episodes && (
                <>
                  <span>•</span>
                  <span>{episodes} tập</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
