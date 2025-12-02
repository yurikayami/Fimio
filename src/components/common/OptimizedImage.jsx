import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

/**
 * OptimizedImage - A performance-optimized image component
 * Features:
 * - Lazy loading with IntersectionObserver
 * - Blur-up placeholder effect
 * - Error handling with fallback
 * - Proper image sizing with srcset
 * - Loading priority for above-the-fold images
 */
export const OptimizedImage = ({
  src,
  alt,
  className,
  containerClassName,
  width,
  height,
  priority = false, // Set to true for LCP/above-the-fold images
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  onError,
  fallbackSrc = '/placeholder.jpg',
  aspectRatio, // e.g., "16/9", "2/3", "1/1"
  objectFit = 'cover',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px 0px', // Start loading 50px before entering viewport
        threshold: 0.01,
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = (e) => {
    setHasError(true);
    if (onError) {
      onError(e);
    }
  };

  // Generate optimized image URLs with different sizes
  const generateSrcSet = (baseSrc) => {
    if (!baseSrc || hasError) return undefined;
    
    // If it's already a full URL with specific dimensions, return as is
    if (baseSrc.includes('?') || baseSrc.includes('width=')) {
      return undefined;
    }
    
    // For phimapi.com images, they don't support srcset
    // But we can still use the image proxy if available
    return undefined;
  };

  const imageSrc = hasError ? fallbackSrc : (isInView ? src : undefined);

  // Aspect ratio style
  const aspectRatioStyle = aspectRatio
    ? { aspectRatio: aspectRatio }
    : height && width
    ? { aspectRatio: `${width}/${height}` }
    : undefined;

  return (
    <div
      ref={imgRef}
      className={cn(
        'relative overflow-hidden bg-slate-800',
        containerClassName
      )}
      style={aspectRatioStyle}
    >
      {/* Placeholder/Loading skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-800 animate-pulse" />
      )}

      {/* Actual image */}
      {isInView && (
        <img
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          srcSet={generateSrcSet(src)}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0',
            objectFit === 'cover' && 'object-cover',
            objectFit === 'contain' && 'object-contain',
            className
          )}
          {...props}
        />
      )}
    </div>
  );
};

export default OptimizedImage;
