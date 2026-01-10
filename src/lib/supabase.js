import { createClient } from "@supabase/supabase-js";
import { Capacitor } from "@capacitor/core";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables."
  );
}

// Determine the correct redirect URL based on platform
export const getRedirectUrl = () => {
  if (Capacitor.isNativePlatform()) {
    // Use deep link scheme for native apps
    return "fimio://auth/callback";
  }
  // Use web URL for browser
  return `${window.location.origin}/profile`;
};

export const supabase = createClient(supabaseUrl, supabaseKey);
