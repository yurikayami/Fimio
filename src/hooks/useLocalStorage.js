import { useState } from "react";

/**
 * Custom hook for managing LocalStorage
 * @param {string} key - LocalStorage key
 * @param {any} initialValue - Initial value
 * @returns {[any, Function]} [storedValue, setValue]
 */
export const useLocalStorage = (key, initialValue) => {
  // State to store our value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  return [storedValue, setValue];
};

/**
 * Hook for managing saved movies in localStorage
 */
export const useSavedMovies = () => {
  const [savedMovies, setSavedMovies] = useLocalStorage("savedMovies", []);

  const saveMovie = (movie) => {
    setSavedMovies((prev) => {
      // Check if movie already exists
      const exists = prev.some((m) => m.slug === movie.slug);
      if (exists) return prev;

      // Add new movie with timestamp
      return [...prev, { ...movie, savedAt: new Date().toISOString() }];
    });
  };

  const removeMovie = (slug) => {
    setSavedMovies((prev) => prev.filter((m) => m.slug !== slug));
  };

  const isMovieSaved = (slug) => {
    return savedMovies.some((m) => m.slug === slug);
  };

  return {
    savedMovies,
    saveMovie,
    removeMovie,
    isMovieSaved,
  };
};
