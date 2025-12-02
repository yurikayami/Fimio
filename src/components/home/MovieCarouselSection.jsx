import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MovieCard } from '@/components/movie/MovieCard';

export const MovieCarouselSection = ({ title, movies }) => {
  const scrollContainerRef = useRef(null);
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

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <section 
      ref={sectionRef}
      className="py-8 space-y-4 group/section"
    >
      <div className="flex items-center gap-3 px-4">
        <div className="w-1 h-7 bg-accent rounded-full"></div>
        <h2 className="text-xl sm:text-2xl font-heading font-bold text-white tracking-wider">
          {title}
        </h2>
      </div>

      <div className="relative group">
        {/* Left Button */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-start"
          aria-label="Scroll left"
        >
          <div className="ml-2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
            <ChevronLeft className="h-6 w-6 text-white" />
          </div>
        </button>

        <div
          ref={scrollContainerRef}
          className="flex gap-3 overflow-x-auto pb-4 px-4 scrollbar-hide snap-x scroll-smooth contain-paint"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie, idx) => (
            <div
              key={movie._id || movie.slug}
              className="w-[140px] sm:w-[170px] flex-shrink-0 snap-start opacity-0 transition-opacity duration-500"
              style={{
                animation: isVisible ? `fadeInUp 0.6s ease-out ${idx * 40}ms forwards` : 'none'
              }}
            >
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>

        {/* Right Button */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end"
          aria-label="Scroll right"
        >
          <div className="mr-2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
            <ChevronRight className="h-6 w-6 text-white" />
          </div>
        </button>
      </div>
    </section>
  );
};
