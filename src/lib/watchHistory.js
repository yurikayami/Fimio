// Watch History Management
const WATCH_HISTORY_KEY = "Fimio_watch_history";
const MAX_HISTORY_ITEMS = 50;

export const getWatchHistory = () => {
  try {
    const history = localStorage.getItem(WATCH_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error("Error loading watch history:", error);
    return [];
  }
};

export const addToWatchHistory = (movie, episode = null, progress = 0) => {
  try {
    let history = getWatchHistory();

    // Remove existing entry if exists
    history = history.filter((item) => item.slug !== movie.slug);

    // Add new entry at the beginning
    const historyItem = {
      ...movie,
      watchedAt: new Date().toISOString(),
      currentEpisode: episode,
      progress: progress, // Progress in seconds
      timestamp: Date.now(),
    };

    history.unshift(historyItem);

    // Keep only MAX_HISTORY_ITEMS
    if (history.length > MAX_HISTORY_ITEMS) {
      history = history.slice(0, MAX_HISTORY_ITEMS);
    }

    localStorage.setItem(WATCH_HISTORY_KEY, JSON.stringify(history));
    return true;
  } catch (error) {
    console.error("Error adding to watch history:", error);
    return false;
  }
};

export const removeFromWatchHistory = (slug) => {
  try {
    let history = getWatchHistory();
    history = history.filter((item) => item.slug !== slug);
    localStorage.setItem(WATCH_HISTORY_KEY, JSON.stringify(history));
    return true;
  } catch (error) {
    console.error("Error removing from watch history:", error);
    return false;
  }
};

export const clearWatchHistory = () => {
  try {
    localStorage.removeItem(WATCH_HISTORY_KEY);
    return true;
  } catch (error) {
    console.error("Error clearing watch history:", error);
    return false;
  }
};

export const getMovieProgress = (slug) => {
  const history = getWatchHistory();
  const item = history.find((h) => h.slug === slug);
  return item
    ? { episode: item.currentEpisode, progress: item.progress }
    : null;
};
