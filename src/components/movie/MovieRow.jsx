import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MovieCard } from '@/components/movie/MovieCard';
import { SectionHeader } from '@/components/home/SectionHeader';

export const MovieRow = ({ title, movies, linkTo, variant = 'default' }) => {
  const scrollContainerRef = useRef(null);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Scroll animation observer
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

  // Style variants
  const variantStyles = {
    default: {
      section: 'py-6 space-y-4 group/section',
      title: 'text-xl sm:text-2xl font-heading font-bold text-white tracking-wide',
      bar: 'w-1 h-6 bg-accent rounded-full',
      container: 'flex gap-4 overflow-x-auto pb-4 px-4 scrollbar-hide snap-x scroll-smooth contain-paint',
      card: 'w-[160px] sm:w-[200px] flex-shrink-0 snap-start'
    },
    minimal: {
      section: 'py-8 space-y-5 group/section opacity-0 transition-opacity duration-700',
      title: 'text-lg sm:text-xl font-heading font-bold text-slate-200 tracking-wider',
      bar: 'w-0.5 h-5 bg-indigo-500 rounded',
      container: 'flex gap-5 overflow-x-auto pb-5 px-4 scrollbar-hide snap-x scroll-smooth contain-paint',
      card: 'w-[140px] sm:w-[180px] flex-shrink-0 snap-start'
    },
    compact: {
      section: 'py-5 space-y-3 group/section opacity-0 transition-opacity duration-700',
      title: 'text-base sm:text-lg font-heading font-semibold text-slate-100 uppercase tracking-wider',
      bar: 'w-1.5 h-4 bg-orange-500 rounded-full',
      container: 'flex gap-3 overflow-x-auto pb-3 px-4 scrollbar-hide snap-x scroll-smooth contain-paint',
      card: 'w-[150px] sm:w-[190px] flex-shrink-0 snap-start'
    },
    accent: {
      section: 'py-7 space-y-4 group/section opacity-0 transition-opacity duration-700',
      title: 'text-xl sm:text-2xl font-heading font-bold text-white drop-shadow-lg tracking-wide',
      bar: 'w-1 h-7 bg-gradient-to-b from-accent to-indigo-600 rounded-full',
      container: 'flex gap-4 overflow-x-auto pb-4 px-4 scrollbar-hide snap-x scroll-smooth contain-paint',
      card: 'w-[160px] sm:w-[200px] flex-shrink-0 snap-start'
    }
  };

  const style = variantStyles[variant] || variantStyles.default;

  // Map variant to SectionHeader options
  const headerMap = {
    default: { accentColor: 'accent', muted: false },
    minimal: { accentColor: 'accent', muted: true },
    compact: { accentColor: 'accent', muted: false },
    accent: { accentColor: 'yellow', muted: false }
  };

  const headerProps = headerMap[variant] || headerMap.default;

  return (
    <section 
      ref={sectionRef}
      className={`${style.section} ${isVisible ? 'opacity-100' : ''}`}
    >
      <div className="px-4">
        <div className="flex items-center justify-between">
          <SectionHeader
            title={title}
            accentColor={headerProps.accentColor}
            muted={headerProps.muted}
            showIcon={false}
            className="mb-0 px-0"
          />
       
        {linkTo && (
          <Button asChild variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-white/5">
            <Link to={linkTo} className="flex items-center gap-1">
              Xem tất cả <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        )}
        </div>
      </div>

      <div className="relative group">
        {/* Navigation Buttons - Removed gradient backgrounds */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-start disabled:opacity-0"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-8 w-8 text-white hover:scale-125 transition-transform drop-shadow-lg" />
        </button>

        <div
          ref={scrollContainerRef}
          className={`${style.container}`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie, idx) => (
            <div 
              key={movie._id || movie.slug} 
              className={`${style.card} opacity-0 transition-opacity duration-500`}
              style={{ 
                animation: isVisible ? `fadeInUp 0.6s ease-out ${idx * 50}ms forwards` : 'none'
              }}
            >
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-8 w-8 text-white hover:scale-125 transition-transform drop-shadow-lg" />
        </button>
      </div>
    </section>
  );
};
