// Saved Movies Management
const SAVED_MOVIES_KEY = "savedMovies";

export const getSavedMovies = () => {
  try {
    const saved = localStorage.getItem(SAVED_MOVIES_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Error loading saved movies:", error);
    return [];
  }
};

export const addToSavedMovies = (movie) => {
  try {
    let saved = getSavedMovies();

    // Check if already exists
    if (saved.some((m) => m.slug === movie.slug)) {
      return false;
    }

    saved.unshift({
      ...movie,
      savedAt: new Date().toISOString(),
    });

    localStorage.setItem(SAVED_MOVIES_KEY, JSON.stringify(saved));
    return true;
  } catch (error) {
    console.error("Error adding to saved movies:", error);
    return false;
  }
};

export const removeFromSavedMovies = (slug) => {
  try {
    let saved = getSavedMovies();
    saved = saved.filter((m) => m.slug !== slug);
    localStorage.setItem(SAVED_MOVIES_KEY, JSON.stringify(saved));
    return true;
  } catch (error) {
    console.error("Error removing from saved movies:", error);
    return false;
  }
};

export const isMovieSaved = (slug) => {
  const saved = getSavedMovies();
  return saved.some((m) => m.slug === slug);
};

export const clearSavedMovies = () => {
  try {
    localStorage.removeItem(SAVED_MOVIES_KEY);
    return true;
  } catch (error) {
    console.error("Error clearing saved movies:", error);
    return false;
  }
};
