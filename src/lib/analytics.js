// Simple Google Analytics wrapper (gtag.js) for SPA page view & event tracking
// Measurement ID: G-S3KV4K17ZN
export const GA_MEASUREMENT_ID = "G-S3KV4K17ZN";

// Send a pageview to Google Analytics
export const pageview = (path) => {
  if (typeof window === "undefined") return;
  if (!window.gtag) return;
  // Only send events in production builds by default
  if (import.meta.env && import.meta.env.MODE !== "production") return;
  try {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: path,
    });
  } catch (e) {
    // swallow errors in case gtag isn't ready
    // console.debug('gtag pageview error', e);
  }
};

// Send a custom event to Google Analytics
export const event = ({ action, category, label, value }) => {
  if (typeof window === "undefined") return;
  if (!window.gtag) return;
  if (import.meta.env && import.meta.env.MODE !== "production") return;
  try {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  } catch (e) {
    // console.debug('gtag event error', e);
  }
};

// optional helper to initialize with send_page_view false.
export const initialize = (measurementId) => {
  if (typeof window === "undefined") return;
  if (!window.gtag) return;
  try {
    window.gtag("config", measurementId || GA_MEASUREMENT_ID, {
      send_page_view: true,
    });
  } catch (e) {}
};

export default { GA_MEASUREMENT_ID, pageview, event, initialize };
