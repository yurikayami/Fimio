// Native Google Sign-In Service
// Uses the native Google Sign-In SDK for popup login experience

import { Capacitor } from "@capacitor/core";
import { supabase } from "@/lib/supabase";

/**
 * Initialize Google Auth on native platforms
 * Call this once when app starts
 */
export async function initGoogleAuth() {
  if (!Capacitor.isNativePlatform()) return;

  try {
    const { SocialLogin } = await import("@capgo/capacitor-social-login");

    await SocialLogin.initialize({
      google: {
        // Replace with your actual Web Client ID from Google Cloud Console
        webClientId: import.meta.env.VITE_GOOGLE_WEB_CLIENT_ID || "",
      },
    });

    console.log("Google Auth initialized");
  } catch (error) {
    console.error("Failed to initialize Google Auth:", error);
  }
}

/**
 * Sign in with native Google popup
 * Returns the user data if successful
 */
export async function signInWithGoogleNative() {
  if (!Capacitor.isNativePlatform()) {
    throw new Error("Native Google Sign-In only available on mobile");
  }

  try {
    const { SocialLogin } = await import("@capgo/capacitor-social-login");

    // Show the native Google Sign-In popup
    const result = await SocialLogin.login({
      provider: "google",
      options: {
        scopes: ["email", "profile"],
      },
    });

    console.log("Google Sign-In result:", result);

    if (result.provider === "google" && result.result) {
      const { idToken, accessToken } = result.result;

      if (idToken) {
        // Sign in to Supabase with the Google ID token
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: idToken,
          access_token: accessToken?.token,
        });

        if (error) {
          console.error("Supabase auth error:", error);
          throw error;
        }

        console.log("Supabase auth success:", data);
        return data;
      }
    }

    throw new Error("Failed to get Google credentials");
  } catch (error) {
    console.error("Google Sign-In error:", error);
    throw error;
  }
}

/**
 * Sign out from Google (native)
 */
export async function signOutFromGoogle() {
  if (!Capacitor.isNativePlatform()) return;

  try {
    const { SocialLogin } = await import("@capgo/capacitor-social-login");
    await SocialLogin.logout({ provider: "google" });
  } catch (error) {
    console.log("Google sign out error:", error);
  }
}

/**
 * Check if user is logged in with Google
 */
export async function isGoogleLoggedIn() {
  if (!Capacitor.isNativePlatform()) return false;

  try {
    const { SocialLogin } = await import("@capgo/capacitor-social-login");
    const result = await SocialLogin.isLoggedIn({ provider: "google" });
    return result.isLoggedIn;
  } catch (error) {
    return false;
  }
}

export default {
  initGoogleAuth,
  signInWithGoogleNative,
  signOutFromGoogle,
  isGoogleLoggedIn,
};
