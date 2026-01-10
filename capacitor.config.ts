import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fimio.app',
  appName: 'Fimio',
  webDir: 'dist',
  server: {
    // Set /home as the initial URL instead of /
    url: 'https://fimio.vercel.app/home',
    // For development, uncomment the line below and comment the line above
    // url: 'http://localhost:5173/home',
    cleartext: true, // Allow HTTP for development
  },
  plugins: {
    // Capgo Live Update configuration
    CapacitorUpdater: {
      autoUpdate: true,
      // URL to check for updates (you'll need to set this up)
      // updateUrl: 'https://your-update-server.com/api/updates',
      statsUrl: '', // Optional: disable stats
      version: '1.0.0',
      directUpdate: false, // Show update notification before updating
      periodCheckDelay: 600, // Check for updates every 10 minutes (in seconds)
      localS3: false,
      localHost: '',
      localWebHost: '',
      localSupa: '',
      localSupaAnon: '',
      resetWhenUpdate: true, // Reset to home when update is applied
      appReadyTimeout: 10000, // 10 seconds timeout
      responseTimeout: 20, // 20 seconds for download timeout
      autoDeleteFailed: true, // Auto delete failed updates
      autoDeletePrevious: true, // Auto delete previous versions
      keepUrlPathAfterReload: false,
    },
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#000000',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#000000',
    },
    // Google Social Login configuration
    SocialLogin: {
      google: {
        // Get this from Google Cloud Console -> APIs & Services -> Credentials -> OAuth 2.0 Client IDs
        // Create a "Web application" type client ID
        webClientId: process.env.VITE_GOOGLE_WEB_CLIENT_ID || '',
      },
    },
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true, // Set to false for production
  },
};

export default config;
