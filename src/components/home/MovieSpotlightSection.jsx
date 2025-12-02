import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { buildImageUrl } from '@/services/api';
import { TrendingUp, Play } from 'lucide-react';

export const MovieSpotlightSection = ({ title, movies }) => {
  const sectionRef = useRef(null);
  const sideRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [featured, setFeatured] = useState(0);
  const [sideHeight, setSideHeight] = useState(0);

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

  useEffect(() => {
    if (sideRef.current) {
      const height = sideRef.current.offsetHeight;
      setSideHeight(height);
    }
  }, [movies, isVisible]);

  if (!movies || movies.length === 0) return null;

  const featuredMovie = movies[featured];
  const otherMovies = movies.filter((_, idx) => idx !== featured && idx < 5);

  return (
    <section 
      ref={sectionRef}
      className="py-8 space-y-5"
    >
      <div className="flex items-center gap-3 px-4">
        <div className="w-1 h-7 bg-yellow-500 rounded-full"></div>
        <h2 className="text-2xl font-heading font-bold text-white tracking-wide">
          {title}
        </h2>
        <TrendingUp className="h-5 w-5 text-yellow-500 ml-auto" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4">
        {/* Featured - Left Side */}
        <div 
          className="lg:col-span-2 relative rounded-2xl overflow-hidden group opacity-0 transition-opacity duration-500"
          style={{
            height: sideHeight || '320px',
            animation: isVisible ? `fadeInScale 0.7s ease-out 0ms forwards` : 'none'
          }}
        >
          <img
            src={buildImageUrl(featuredMovie.poster_url || featuredMovie.thumb_url)}
            alt={featuredMovie.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>

          {/* Featured Content */}
          <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">
            <div className="flex gap-2 justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex gap-2">
                {featuredMovie.year && (
                  <span className="px-3 py-1 bg-yellow-600 rounded-full text-sm font-bold">
                    {featuredMovie.year}
                  </span>
                )}
              </div>
              <span className="px-3 py-1 bg-red-600 rounded-full text-sm font-bold">
                SPOTLIGHT
              </span>
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl font-heading font-bold group-hover:text-yellow-400 transition-colors">
                {featuredMovie.name}
              </h2>
              <p className="text-sm text-slate-300 line-clamp-2">
                {featuredMovie.origin_name}
              </p>

              {featuredMovie.episode_current && (
                <div className="inline-block px-3 py-1 bg-white/10 border border-white/30 rounded text-xs">
                  {featuredMovie.episode_current}
                </div>
              )}
            </div>
          </div>

          {/* Play Button */}
          <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="p-4 bg-yellow-500 rounded-full hover:bg-yellow-400 transition-colors">
              <Play className="h-8 w-8 text-black fill-black" />
            </div>
          </button>
        </div>

        {/* Side Movies - Right Side */}
        <div ref={sideRef} className="space-y-3">
          {otherMovies.map((movie, idx) => (
            <Link
              key={movie._id || movie.slug}
              to={`/movie/${movie.slug}`}
              className="group flex gap-3 p-3 rounded-lg bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-slate-700 hover:border-yellow-500/50 hover:from-slate-800/80 transition-all duration-300 opacity-0 cursor-pointer"
              onClick={() => setFeatured(movies.indexOf(movie))}
              style={{
                animation: isVisible ? `slideInLeft 0.5s ease-out ${(idx + 2) * 80}ms forwards` : 'none'
              }}
            >
              <img
                src={buildImageUrl(movie.poster_url || movie.thumb_url)}
                alt={movie.name}
                className="w-12 h-16 rounded object-cover group-hover:scale-110 transition-transform duration-300"
                loading="lazy"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-slate-100 group-hover:text-yellow-400 transition-colors line-clamp-2">
                  {movie.name}
                </h4>
                <p className="text-xs text-slate-400">
                  {movie.year}
                </p>
              </div>
              <span className="text-2xl font-bold text-yellow-500">#{idx + 2}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
