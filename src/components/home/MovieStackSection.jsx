import { useEffect, useRef, useState } from 'react';
import { MovieCard } from '@/components/movie/MovieCard';
import { TrendingUp } from 'lucide-react';

export const MovieStackSection = ({ title, movies }) => {
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

  const topMovies = movies.slice(0, 4);

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

      <div className="px-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {topMovies.map((movie, idx) => (
          <div
            key={movie._id || movie.slug}
            className="relative group opacity-0 transition-opacity duration-500"
            style={{
              animation: isVisible ? `fadeInScale 0.5s ease-out ${idx * 80}ms forwards` : 'none'
            }}
          >
            {/* Ranking Badge */}
            <div className="absolute top-2 left-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white font-bold text-sm">
              {idx + 1}
            </div>
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </section>
  );
};
