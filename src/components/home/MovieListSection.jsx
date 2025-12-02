import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { buildImageUrl } from '@/services/api';
import { Clock, Eye } from 'lucide-react';

export const MovieListSection = ({ title, movies }) => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (!movies || movies.length === 0) return null;

  return (
    <section ref={sectionRef} className="py-8 space-y-4">
      <div className="flex items-center gap-3 px-4">
        <div className="w-1.5 h-6 bg-green-500 rounded-full"></div>
        <h2 className="text-xl sm:text-2xl font-heading font-bold text-white tracking-wide">
          {title}
        </h2>
      </div>

      <div className="space-y-3 px-4">
        {movies.slice(0, 6).map((movie, idx) => (
          <Link
            key={movie._id || movie.slug}
            to={`/movie/${movie.slug}`}
            className="group flex gap-4 p-3 rounded-lg bg-slate-800/30 border border-slate-700 hover:bg-slate-700/50 hover:border-green-500/50 transition-all duration-300 opacity-0"
            style={{
              animation: isVisible ? `slideInLeft 0.5s ease-out ${idx * 60}ms forwards` : 'none'
            }}
          >
            {/* Thumbnail */}
            <div className="relative w-16 h-24 rounded-lg overflow-hidden flex-shrink-0 border border-slate-600">
              <img
                src={buildImageUrl(movie.poster_url || movie.thumb_url)}
                alt={movie.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-slate-100 group-hover:text-green-400 transition-colors line-clamp-1">
                  {movie.name}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-1">
                  {movie.origin_name}
                </p>
              </div>

              <div className="flex gap-3 items-center flex-wrap">
                {movie.year && (
                  <span className="text-xs px-2 py-0.5 bg-slate-700 rounded text-slate-200">
                    {movie.year}
                  </span>
                )}
                {movie.episode_current && (
                  <div className="flex items-center gap-1 text-xs text-orange-300">
                    <Clock className="h-3 w-3" />
                    {movie.episode_current}
                  </div>
                )}
              </div>
            </div>

            {/* Badge */}
            <div className="flex items-center justify-center">
              <div className="px-2 py-1 rounded-full bg-green-500/20 border border-green-500/50 text-xs font-bold text-green-400">
                NEW
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
