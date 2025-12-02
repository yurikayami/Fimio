import { lazy } from "react";

/**
 * Utilities for lazy loading components and handling errors
 * Separate file for non-component exports to maintain Fast Refresh compatibility
 */

/**
 * Helper function to create lazy-loaded components with retry logic
 * Handles chunk loading failures gracefully
 * @param {function} componentImport - Dynamic import function
 * @param {number} retries - Number of retries (default: 3)
 * @param {number} delay - Delay between retries in ms (default: 1000)
 * @returns {React.LazyExoticComponent}
 */
export function lazyWithRetry(componentImport, retries = 3, delay = 1000) {
  return lazy(async () => {
    let lastError;

    for (let i = 0; i < retries; i++) {
      try {
        return await componentImport();
      } catch (error) {
        lastError = error;
        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, delay));
        // Clear the failed module from cache if possible
        console.warn(`Retrying lazy load (attempt ${i + 1}/${retries})...`);
      }
    }

    throw lastError;
  });
}

/**
 * Preload a lazy component (useful for hover preloading)
 * @param {object} lazyComponent - Lazy loaded component
 */
export const preloadComponent = (lazyComponent) => {
  if (lazyComponent._payload?._result) {
    lazyComponent._payload._result();
  }
};

export default {
  lazyWithRetry,
  preloadComponent,
};
