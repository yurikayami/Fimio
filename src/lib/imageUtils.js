/**
 * Image optimization utilities
 * Separated from components for better Fast Refresh support
 */

// Cache for WEBP support detection
let supportsWebP = null;

/**
 * Detect if browser supports WebP images
 * @returns {boolean}
 */
export const detectWebPSupport = () => {
  if (supportsWebP !== null) return supportsWebP;

  try {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    supportsWebP = canvas.toDataURL("image/webp").includes("webp");
  } catch {
    supportsWebP = false;
  }
  return supportsWebP;
};

/**
 * Convert image URL to WebP via KKPhim/PhimAPI
 * Converts any image to optimized WebP format for better performance
 * @param {string} imageUrl - Original image URL
 * @returns {string} - WebP image URL via KKPhim API
 */
export const convertToWebP = (imageUrl) => {
  if (!imageUrl) return "/placeholder.jpg";

  try {
    // Encode the original image URL
    const encodedUrl = encodeURIComponent(imageUrl);
    // Use KKPhim/PhimAPI image proxy to get WebP
    return `https://phimapi.com/image.php?url=${encodedUrl}`;
  } catch {
    return imageUrl;
  }
};

/**
 * Build optimized image URL with compression and WebP conversion
 * @param {string} imageUrl - Original image URL
 * @param {Object} options - Optimization options
 * @returns {string}
 */
export const buildOptimizedImageUrl = (imageUrl, options = {}) => {
  if (!imageUrl) return "/placeholder.jpg";

  const { width = 200, height = 300, quality = 80, useWebP = true } = options;

  // For local image paths
  if (!imageUrl.startsWith("http")) {
    imageUrl = `https://phimimg.com/${imageUrl.replace(/^\//, "")}`;
  }

  // Priority 1: Convert to WebP for better compression
  if (useWebP) {
    return convertToWebP(imageUrl);
  }

  // Fallback: Use Imgix-like CDN for resizing
  try {
    const url = new URL(imageUrl);

    // Add query params for compression
    url.searchParams.set("auto", "format"); // Auto format selection
    url.searchParams.set("fit", "crop");
    url.searchParams.set("w", width);
    url.searchParams.set("h", height);
    url.searchParams.set("q", quality);

    return url.toString();
  } catch {
    // If URL parsing fails, return as-is
    return imageUrl;
  }
};

/**
 * Generate ultra-lightweight blur-up placeholder
 * @param {number} w - Width
 * @param {number} h - Height
 * @param {string} color - Hex color (default: slate-800)
 * @returns {string} - Data URL
 */
export const generateBlurPlaceholder = (w = 10, h = 15, color = "1e293b") => {
  // SVG-based placeholder is much smaller than canvas
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${h}'%3E%3Crect fill='%23${color}' width='${w}' height='${h}'/%3E%3C/svg%3E`;
};

/**
 * Preload critical images for LCP optimization
 * Adds preload link with fetchpriority=high to HTML head
 * This ensures the image is discovered in the initial document
 * @param {string} src - Image URL to preload
 * @param {boolean} isLCP - Is this the LCP (Largest Contentful Paint) image?
 */
export const preloadImage = (src, isLCP = false) => {
  if (!src || typeof window === "undefined") return;

  // Check if already preloaded
  const existingLink = document.querySelector(`link[href="${src}"]`);
  if (existingLink) return;

  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "image";
  link.href = src;

  // High priority for LCP images
  if (isLCP) {
    link.fetchPriority = "high";
  } else {
    link.fetchPriority = "high"; // All critical images get high priority
  }

  document.head.appendChild(link);

  // Also start loading in background for even faster display
  const img = new Image();
  img.src = src;
};
/**
 * Preload multiple images concurrently
 * @param {string[]} srcs - Array of image URLs to preload
 * @param {Object} options - Options for preloading
 */
export const preloadImages = (srcs = [], options = {}) => {
  const { concurrency = 3 } = options;

  // Limit concurrent preloads to avoid network congestion
  let index = 0;
  const preloadNext = () => {
    if (index < srcs.length) {
      preloadImage(srcs[index]);
      index++;
      // Stagger preloads
      setTimeout(preloadNext, 50);
    }
  };

  // Start concurrent preloads
  for (let i = 0; i < Math.min(concurrency, srcs.length); i++) {
    preloadNext();
  }
};

/**
 * Generate low-quality image placeholder (LQIP) approach
 * Creates a tiny blurred version shown while full image loads
 * @param {number} size - Size of tiny image (10-20 recommended)
 * @returns {string} - Canvas data URL
 */
export const generateLQIP = (size = 10) => {
  // Ultra-low quality placeholder for faster rendering
  return generateBlurPlaceholder(size, size * 1.5, "0f172a");
};

/**
 * Batch preload images from movie objects
 * Useful for preloading next page of results
 * @param {Array} movies - Array of movie objects
 * @param {string} imageKey - Key for image URL in movie object
 * @param {number} limit - Max number of images to preload
 */
export const preloadMovieImages = (
  movies = [],
  imageKey = "poster_url",
  limit = 6
) => {
  const urls = movies
    .slice(0, limit)
    .map((m) => m[imageKey])
    .filter(Boolean);

  preloadImages(urls, { concurrency: 2 });
};

/**
 * Compress and convert images to WebP
 * Works with KKPhim API to convert JPG/PNG to WebP
 * @param {string} imageUrl - Image URL
 * @param {number} quality - Quality 0-100 (for fallback)
 * @returns {string}
 */
export const compressImage = (imageUrl, quality = 85) => {
  if (!imageUrl) return "/placeholder.jpg";

  try {
    const q = Number.isFinite(quality)
      ? Math.max(1, Math.min(100, Math.floor(quality)))
      : 85;
    const encodedUrl = encodeURIComponent(imageUrl);
    // Use KKPhim image proxy and include quality parameter for conversion/compression
    return `https://phimapi.com/image.php?url=${encodedUrl}&q=${q}`;
  } catch {
    // Fallback: try using the generic converter and append quality if possible
    try {
      return `${convertToWebP(imageUrl)}&q=${quality}`;
    } catch {
      return imageUrl;
    }
  }
};

export default {
  detectWebPSupport,
  convertToWebP,
  buildOptimizedImageUrl,
  generateBlurPlaceholder,
  generateLQIP,
  preloadImage,
  preloadImages,
  preloadMovieImages,
  compressImage,
};
