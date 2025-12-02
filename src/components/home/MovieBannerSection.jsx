import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { buildImageUrl } from '@/services/api';
import { Star, Play } from 'lucide-react';

export const MovieBannerSection = ({ title, movies }) => {
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
    <section ref={sectionRef} className="py-8 space-y-6">
      <div className="flex items-center gap-3 px-4">
        <div className="w-1 h-7 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"></div>
        <h2 className="text-2xl font-heading font-bold text-white tracking-wide">
          {title}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
        {movies.slice(0, 6).map((movie, idx) => (
          <Link
            key={movie._id || movie.slug}
            to={`/movie/${movie.slug}`}
            className="group relative h-48 rounded-xl overflow-hidden opacity-0 transition-opacity duration-500"
            style={{
              animation: isVisible ? `fadeInLeft 0.6s ease-out ${idx * 100}ms forwards` : 'none'
            }}
          >
            {/* Banner Image */}
            <img
              src={buildImageUrl(movie.poster_url || movie.thumb_url)}
              alt={movie.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent transition-all duration-300 group-hover:from-black/80"></div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-between p-4 text-white">
              <div className="flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {movie.year && (
                  <span className="px-2 py-1 bg-red-600 rounded text-xs font-bold">
                    {movie.year}
                  </span>
                )}
                {movie.quality && (
                  <span className="px-2 py-1 bg-blue-600 rounded text-xs font-bold">
                    {movie.quality}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold line-clamp-2 group-hover:text-red-400 transition-colors">
                  {movie.name}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-2">
                  {movie.origin_name}
                </p>
                <div className="flex items-center gap-2 text-yellow-400">
                  <Star className="h-3 w-3 fill-current" />
                  <span className="text-xs font-semibold">Hot</span>
                </div>
              </div>
            </div>

            {/* Play Icon */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="p-3 bg-red-600 rounded-full">
                <Play className="h-5 w-5 text-white fill-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
