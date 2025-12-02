import { useEffect, useRef, useState } from 'react';
import { MovieCard } from '@/components/movie/MovieCard';

export const MovieGridSection = ({ title, movies, cols = 6 }) => {
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

  const gridColsClass = {
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6'
  };

  return (
    <section 
      ref={sectionRef}
      className="py-8 space-y-5"
    >
      <div className="flex items-center gap-3 px-4">
        <div className="w-1.5 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
        <h2 className="text-xl sm:text-2xl font-heading font-bold text-white tracking-wide">
          {title}
        </h2>
      </div>

      <div className={`grid ${gridColsClass[cols]} gap-4 px-4`}>
        {movies.slice(0, cols * 2).map((movie, idx) => (
          <div
            key={movie._id || movie.slug}
            className="opacity-0 transition-opacity duration-500"
            style={{
              animation: isVisible ? `fadeInScale 0.6s ease-out ${idx * 60}ms forwards` : 'none'
            }}
          >
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </section>
  );
};
