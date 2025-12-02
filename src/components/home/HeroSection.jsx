import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Play, Info, Calendar, Clock, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { buildImageUrl } from '@/services/api';
import { preloadImage, generateLQIP } from '@/lib/imageUtils';


export const HeroSection = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  // Memoize movie data to prevent unnecessary re-renders
  const movie = useMemo(() => movies?.[currentIndex], [movies, currentIndex]);
  
  // Preload hero images immediately for faster LCP
  useEffect(() => {
    if (!movies || movies.length === 0) return;

    // Preload current and next images
    const currentImageUrl = buildImageUrl(movies[currentIndex].thumb_url);
    const nextImageUrl = buildImageUrl(movies[(currentIndex + 1) % movies.length].thumb_url);
    
    // Mark first image as LCP if it's the initial slide
    const isFirstSlide = currentIndex === 0;
    preloadImage(currentImageUrl, isFirstSlide);
    
    // Stagger next image preload
    setTimeout(() => preloadImage(nextImageUrl, false), 100);
  }, [movies, currentIndex]);

  // Preload first image on mount for initial LCP
  useEffect(() => {
    if (movies && movies.length > 0) {
      const firstImageUrl = buildImageUrl(movies[0].thumb_url);
      // Mark as LCP for highest priority
      preloadImage(firstImageUrl, true);
    }
  }, [movies]);

  // Auto-slide functionality - optimized
  useEffect(() => {
    if (!movies || movies.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
      setIsImageLoaded(false);
      setShowPlaceholder(true);
    }, 8000); // Time each slide is shown

    return () => clearInterval(timer);
  }, [movies]);

  // Handle slide change
  const handleSlideChange = useCallback((index) => {
    setCurrentIndex(index);
    setIsImageLoaded(false);
    setShowPlaceholder(true);
  }, []);

  if (!movies || movies.length === 0) return null;
  
  const backgroundImageUrl = buildImageUrl(movie?.thumb_url);
  const posterImageUrl = buildImageUrl(movie?.poster_url);
  const placeholderUrl = generateLQIP(20);
  
  return (
    <div className="relative w-full h-[216px] sm:h-[270px] md:h-[85vh] lg:h-[90vh] max-h-[500px] sm:max-h-[600px] md:max-h-[800px] min-h-[216px] overflow-hidden bg-black">
      {/* Background Image - LCP optimized */}
      <div 
         key={movie?.slug + '-bg'}
         className="absolute inset-0 w-full h-full"
      >
        {/* Blur-up placeholder for faster perceived load */}
        {showPlaceholder && (
          <img
            src={placeholderUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110"
            aria-hidden="true"
            style={{ filter: 'blur(20px)' }}
          />
        )}

        {/* Critical LCP Image - loaded eagerly with high priority */}
        <img
          src={backgroundImageUrl}
          alt={movie?.name || 'Hero background'}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          style={{ opacity: isImageLoaded ? 1 : 0 }}
          loading="eager"
          decoding="sync"
          fetchPriority="high"
          onLoad={() => {
            setIsImageLoaded(true);
            setShowPlaceholder(false);
          }}
        />
        
        {/* Fallback background color while loading */}
        {!isImageLoaded && (
          <div className="absolute inset-0 bg-slate-900" />
        )}
        
        {/* Gradient overlays for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full h-full flex items-center justify-center px-3 sm:px-4 md:px-6">
        <div className="flex flex-col md:grid md:grid-cols-12 gap-2 sm:gap-4 md:gap-8 items-center justify-center w-full h-full">
          
          {/* Text Content - Visible on all screen sizes */}
          <div className="md:col-span-7 lg:col-span-6 space-y-1.5 sm:space-y-3 md:space-y-6 transition-opacity duration-300 w-full">
             <h1 className="text-lg sm:text-2xl md:text-5xl lg:text-6xl font-heading font-black text-white leading-tight drop-shadow-lg line-clamp-2">
              {movie?.name}
            </h1>
            <p className="text-xs sm:text-sm md:text-xl text-slate-300 font-light drop-shadow-md line-clamp-1 sm:line-clamp-2">
              {movie?.origin_name}
            </p>

            {/* Metadata - Visible on all screen sizes */}
            <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-4 md:gap-x-6 gap-y-1 sm:gap-y-2 text-xs md:text-base text-slate-300">
               <span className="flex items-center gap-0.5 md:gap-2"><Award className="w-2.5 h-2.5 md:w-4 md:h-4 text-accent flex-shrink-0" /><span className="truncate">{movie?.quality || 'HD'}</span></span>
               <span className="flex items-center gap-0.5 md:gap-2"><Calendar className="w-2.5 h-2.5 md:w-4 md:h-4 text-accent flex-shrink-0" /><span className="truncate">{movie?.year}</span></span>
               <span className="flex items-center gap-0.5 md:gap-2"><Clock className="w-2.5 h-2.5 md:w-4 md:h-4 text-accent flex-shrink-0" /><span className="truncate">{movie?.time}</span></span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1.5 md:pt-6">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-white min-h-[40px] h-9 sm:h-12 md:h-12 px-2.5 sm:px-5 md:px-7 rounded-lg text-xs sm:text-sm md:text-base font-semibold shadow-lg shadow-accent/30 transition-all duration-200 hover:shadow-accent/50 active:scale-95">
                <Link to={`/movie/${movie.slug}`} className="flex items-center gap-1 md:gap-3 whitespace-nowrap">
                  <Play className="w-3 h-3 md:w-5 md:h-5 fill-current flex-shrink-0" />
                  <span>Xem Ngay</span>
                </Link>
              </Button>
              <Button asChild size="lg" className="bg-secondary hover:bg-secondary/80 border border-slate-600 text-foreground min-h-[40px] h-9 sm:h-12 md:h-12 px-2.5 sm:px-5 md:px-7 rounded-lg text-xs sm:text-sm md:text-base font-semibold transition-all duration-200 hover:border-slate-500 active:scale-95">
                <Link to={`/movie/${movie.slug}`} className="flex items-center gap-1 md:gap-2 whitespace-nowrap">
                  <Info className="w-3 h-3 md:w-5 md:h-5 flex-shrink-0" />
                  <span>Chi Tiết</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* Desktop: Right Column Poster - Ẩn trên mobile */}
          <div className="hidden md:flex md:col-span-5 lg:col-span-6 justify-center items-center transition-all duration-300">
            <div className="relative w-[220px] h-[330px] md:w-[280px] md:h-[420px] lg:w-[320px] lg:h-[480px]">
              <div className="absolute -inset-2 border-2 border-white/10 rounded-2xl transform -rotate-3 transition-transform group-hover:rotate-0" />
              <Link to={`/movie/${movie?.slug}`} className="group">
                <img 
                  src={posterImageUrl} 
                  alt={`Poster for ${movie?.name}`}
                  width={320}
                  height={480}
                  loading="eager"
                  decoding="async"
                  className="relative w-full h-full object-cover rounded-2xl shadow-2xl shadow-black/50"
                />
                 <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Play className="w-12 h-12 md:w-16 md:h-16 text-white/80 drop-shadow-lg" />
                 </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
       {/* Slider Indicators - Compact style */}
       <div className="absolute bottom-1 md:bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-1 md:gap-2">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-accent w-2 h-2 md:w-3 md:h-3' 
                : 'bg-slate-500/50 w-1.5 h-1.5 md:w-2 md:h-2 hover:bg-slate-400'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
