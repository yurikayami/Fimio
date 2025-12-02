// User Stats & Profile Management
const USER_STATS_KEY = "Fimio_user_stats";
const USER_RATINGS_KEY = "Fimio_user_ratings";

export const getUserStats = () => {
  try {
    const stats = localStorage.getItem(USER_STATS_KEY);
    return stats
      ? JSON.parse(stats)
      : {
          totalMoviesWatched: 0,
          totalWatchTime: 0, // in minutes
          favoriteGenres: {},
          favoriteCountries: {},
          joinedDate: new Date().toISOString(),
          achievements: [],
        };
  } catch (error) {
    console.error("Error loading user stats:", error);
    return null;
  }
};

export const updateUserStats = (movie, watchTimeMinutes = 0) => {
  try {
    const stats = getUserStats();

    // Update total movies watched
    stats.totalMoviesWatched += 1;

    // Update watch time
    stats.totalWatchTime += watchTimeMinutes;

    // Update favorite genres
    if (movie.category) {
      const genres = Array.isArray(movie.category)
        ? movie.category
        : [movie.category];
      genres.forEach((genre) => {
        const genreName = genre.name || genre;
        stats.favoriteGenres[genreName] =
          (stats.favoriteGenres[genreName] || 0) + 1;
      });
    }

    // Update favorite countries
    if (movie.country) {
      const countries = Array.isArray(movie.country)
        ? movie.country
        : [movie.country];
      countries.forEach((country) => {
        const countryName = country.name || country;
        stats.favoriteCountries[countryName] =
          (stats.favoriteCountries[countryName] || 0) + 1;
      });
    }

    // Check for achievements
    checkAchievements(stats);

    localStorage.setItem(USER_STATS_KEY, JSON.stringify(stats));
    return stats;
  } catch (error) {
    console.error("Error updating user stats:", error);
    return null;
  }
};

const checkAchievements = (stats) => {
  const achievements = [];

  if (
    stats.totalMoviesWatched >= 10 &&
    !stats.achievements.includes("beginner")
  ) {
    achievements.push({
      id: "beginner",
      name: "Người mới bắt đầu",
      description: "Xem 10 phim",
      unlockedAt: new Date().toISOString(),
    });
  }
  if (
    stats.totalMoviesWatched >= 50 &&
    !stats.achievements.includes("moviefan")
  ) {
    achievements.push({
      id: "moviefan",
      name: "Fan phim",
      description: "Xem 50 phim",
      unlockedAt: new Date().toISOString(),
    });
  }
  if (
    stats.totalMoviesWatched >= 100 &&
    !stats.achievements.includes("cinephile")
  ) {
    achievements.push({
      id: "cinephile",
      name: "Người mê phim",
      description: "Xem 100 phim",
      unlockedAt: new Date().toISOString(),
    });
  }
  if (stats.totalWatchTime >= 600 && !stats.achievements.includes("marathon")) {
    achievements.push({
      id: "marathon",
      name: "Marathon",
      description: "Xem hơn 10 giờ",
      unlockedAt: new Date().toISOString(),
    });
  }

  achievements.forEach((ach) => {
    if (!stats.achievements.find((a) => a.id === ach.id)) {
      stats.achievements.push(ach);
    }
  });
};

export const getUserRatings = () => {
  try {
    const ratings = localStorage.getItem(USER_RATINGS_KEY);
    return ratings ? JSON.parse(ratings) : {};
  } catch (error) {
    console.error("Error loading user ratings:", error);
    return {};
  }
};

export const rateMovie = (slug, rating, review = "") => {
  try {
    const ratings = getUserRatings();
    ratings[slug] = {
      rating,
      review,
      ratedAt: new Date().toISOString(),
    };
    localStorage.setItem(USER_RATINGS_KEY, JSON.stringify(ratings));
    return true;
  } catch (error) {
    console.error("Error rating movie:", error);
    return false;
  }
};

export const getMovieRating = (slug) => {
  const ratings = getUserRatings();
  return ratings[slug] || null;
};

export const getTopGenres = (limit = 5) => {
  const stats = getUserStats();
  if (!stats || !stats.favoriteGenres) return [];

  return Object.entries(stats.favoriteGenres)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([name, count]) => ({ name, count }));
};

export const getTopCountries = (limit = 5) => {
  const stats = getUserStats();
  if (!stats || !stats.favoriteCountries) return [];

  return Object.entries(stats.favoriteCountries)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([name, count]) => ({ name, count }));
};
