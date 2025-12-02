import { useEffect, useState } from "react";

/**
 * Hook to preload multiple images
 * Useful for preloading hero images or next carousel slides
 * @param {string[]} srcs - Array of image URLs to preload
 */
export const useImagePreload = (srcs = []) => {
  useEffect(() => {
    srcs.forEach((src) => {
      if (src) {
        const img = new Image();
        img.src = src;
      }
    });
  }, [srcs]);
};

/**
 * Hook for lazy loading images with IntersectionObserver
 * @param {React.RefObject} ref - Ref to the element to observe
 * @param {Object} options - IntersectionObserver options
 * @returns {boolean} - Whether the element is in view
 */
export const useLazyLoad = (ref, options = {}) => {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "100px 0px",
        threshold: 0.01,
        ...options,
      }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref, options]);

  return isInView;
};

export default useImagePreload;
