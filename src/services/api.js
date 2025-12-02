const API_BASE = "https://phimapi.com";
const IMAGE_PROXY = "https://phimapi.com/image.php";

/**
 * Helper to normalize API responses which vary between endpoints
 * @param {Object} data - Raw API response
 * @returns {Object} Normalized response with items and pagination
 */
const normalizeResponse = (data) => {
  // Check for items in common locations
  const items = data.items || data.data?.items || [];

  // Check for pagination in common locations
  const pagination =
    data.pagination ||
    data.data?.pagination ||
    data.data?.params?.pagination ||
    {};

  return {
    status: data.status,
    msg: data.msg,
    items,
    pagination,
    originalData: data,
  };
};

/**
 * Fetches the latest movies with pagination
 * Endpoint: /danh-sach/phim-moi-cap-nhat?page={page}
 */
export const getLatestMovies = async (page = 1) => {
  try {
    const response = await fetch(
      `${API_BASE}/danh-sach/phim-moi-cap-nhat?page=${page}`
    );
    if (!response.ok) throw new Error("Failed to fetch latest movies");
    const data = await response.json();
    return normalizeResponse(data);
  } catch (error) {
    console.error("Error fetching latest movies:", error);
    throw error;
  }
};

/**
 * Searches movies by keyword with optional filters
 * Endpoint: /v1/api/tim-kiem?keyword={keyword}&limit={limit}
 */
export const searchMovies = async (keyword, options = {}) => {
  try {
    const params = new URLSearchParams({
      keyword,
      page: options.page || 1,
      limit: options.limit || 24,
      ...(options.sort_field && { sort_field: options.sort_field }),
      ...(options.sort_type && { sort_type: options.sort_type }),
      ...(options.category && { category: options.category }),
      ...(options.country && { country: options.country }),
      ...(options.year && { year: options.year }),
    });

    const response = await fetch(`${API_BASE}/v1/api/tim-kiem?${params}`);
    if (!response.ok) throw new Error("Failed to search movies");
    const data = await response.json();
    return normalizeResponse(data);
  } catch (error) {
    console.error("Error searching movies:", error);
    throw error;
  }
};

/**
 * Fetches movie details by slug
 * Endpoint: /phim/{slug}
 */
export const getMovieDetails = async (slug) => {
  try {
    const response = await fetch(`${API_BASE}/phim/${slug}`);
    if (!response.ok) throw new Error("Failed to fetch movie details");
    return await response.json();
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
};

/**
 * Fetches movies by type list with filters
 * Endpoint: /v1/api/danh-sach/{type_list}
 * Valid types: phim-le, phim-bo, hoat-hinh, tv-shows
 */
export const getMoviesByType = async (typeList, options = {}) => {
  try {
    // API Correction: 'phim-moi-cap-nhat' is NOT a valid type for /v1/api/danh-sach/
    // If typeList is 'phim-moi-cap-nhat', redirect to getLatestMovies
    if (typeList === "phim-moi-cap-nhat") {
      return getLatestMovies(options.page);
    }

    const params = new URLSearchParams({
      page: options.page || 1,
      limit: options.limit || 24,
      ...(options.sort_field && { sort_field: options.sort_field }),
      ...(options.sort_type && { sort_type: options.sort_type }),
      ...(options.category && { category: options.category }),
      ...(options.country && { country: options.country }),
      ...(options.year && { year: options.year }),
    });

    const response = await fetch(
      `${API_BASE}/v1/api/danh-sach/${typeList}?${params}`
    );

    if (!response.ok) {
      // Handle 404 or other errors gracefully
      console.warn(
        `Endpoint failed for type ${typeList}, falling back to latest.`
      );
      return getLatestMovies(options.page);
    }

    const data = await response.json();
    return normalizeResponse(data);
  } catch (error) {
    console.error("Error fetching movies by type:", error);
    throw error;
  }
};

/**
 * Fetches available categories
 * Endpoint: /the-loai
 */
export const getCategories = async () => {
  try {
    const response = await fetch(`${API_BASE}/the-loai`);
    if (!response.ok) throw new Error("Failed to fetch categories");
    const data = await response.json();
    return normalizeResponse(data);
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

/**
 * Fetches available countries
 * Endpoint: /quoc-gia
 */
export const getCountries = async () => {
  try {
    const response = await fetch(`${API_BASE}/quoc-gia`);
    if (!response.ok) throw new Error("Failed to fetch countries");
    const data = await response.json();
    return normalizeResponse(data);
  } catch (error) {
    console.error("Error fetching countries:", error);
    throw error;
  }
};

/**
 * Builds optimized image URL using KKPhim's WebP conversion
 * Automatically converts JPG/PNG to WebP for better performance
 * Endpoint: https://phimapi.com/image.php?url={original_url}
 * @param {string} url - Original image URL from API
 * @param {Object} options - Additional options
 * @returns {string} - WebP image URL
 */
export const buildImageUrl = (url, options = {}) => {
  if (!url) return "/placeholder.jpg";
  if (url.startsWith("blob:") || url.startsWith("data:")) return url;

  let fullUrl = url;
  if (!url.startsWith("http")) {
    fullUrl = `https://phimimg.com/${url.replace(/^\//, "")}`;
  }

  // Use KKPhim's image proxy to get WebP format
  // This provides automatic format conversion + optimization
  const webpUrl = `${IMAGE_PROXY}?url=${encodeURIComponent(fullUrl)}`;

  return webpUrl;
};

/**
 * Extracts slug from various URL formats
 */
export const extractSlug = (url) => {
  if (!url) return "";
  if (!url.startsWith("http")) return url;

  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/").filter(Boolean);
    return pathParts[pathParts.length - 1] || "";
  } catch (error) {
    console.error("Error extracting slug:", error);
    return url;
  }
};
