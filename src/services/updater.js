// Capacitor Live Update Service
// This file handles OTA (Over-The-Air) updates for the app

import { CapacitorUpdater } from "@capgo/capacitor-updater";
import { App } from "@capacitor/app";

// Version of the current app bundle
const APP_VERSION = "1.0.0";

/**
 * Initialize the updater and set up event listeners
 */
export async function initUpdater() {
  // Notify that the app is ready (required for Capgo)
  await CapacitorUpdater.notifyAppReady();

  // Listen for update events
  CapacitorUpdater.addListener("updateAvailable", async (info) => {
    console.log("Update available:", info);

    // You can show a notification or dialog to the user here
    const shouldUpdate = await showUpdateDialog(info.bundle.version);
    if (shouldUpdate) {
      try {
        // Download the update
        const bundle = await CapacitorUpdater.download({
          url: info.bundle.url,
          version: info.bundle.version,
        });

        // Set the downloaded bundle as the next version
        await CapacitorUpdater.set(bundle);

        // Reload the app with the new bundle
        await App.exitApp();
      } catch (error) {
        console.error("Failed to download update:", error);
      }
    }
  });

  // Listen for download progress
  CapacitorUpdater.addListener("downloadProgress", (info) => {
    console.log("Download progress:", info.percent + "%");
    // You can update a progress bar here
  });

  // Listen for download completion
  CapacitorUpdater.addListener("downloadComplete", (info) => {
    console.log("Download complete:", info.bundle);
  });

  // Listen for download failure
  CapacitorUpdater.addListener("downloadFailed", (info) => {
    console.error("Download failed:", info);
  });

  // Listen for update failure (rollback)
  CapacitorUpdater.addListener("updateFailed", (info) => {
    console.error("Update failed, rolling back:", info);
  });
}

/**
 * Check for updates manually
 */
export async function checkForUpdates() {
  try {
    const currentBundle = await CapacitorUpdater.current();
    console.log("Current bundle:", currentBundle);

    // Check the update server for new versions
    // You need to implement your own update server or use Capgo cloud
    const updateInfo = await fetchUpdateInfo();

    if (updateInfo && updateInfo.version !== currentBundle.bundle.version) {
      return {
        hasUpdate: true,
        version: updateInfo.version,
        url: updateInfo.url,
        notes: updateInfo.releaseNotes,
      };
    }

    return { hasUpdate: false };
  } catch (error) {
    console.error("Error checking for updates:", error);
    return { hasUpdate: false, error };
  }
}

/**
 * Download and apply an update
 */
export async function downloadAndApplyUpdate(url, version) {
  try {
    // Download the update bundle
    const bundle = await CapacitorUpdater.download({
      url,
      version,
    });

    console.log("Downloaded bundle:", bundle);

    // Set the bundle as the next version
    await CapacitorUpdater.set(bundle);

    // Return success
    return { success: true, bundle };
  } catch (error) {
    console.error("Failed to apply update:", error);
    return { success: false, error };
  }
}

/**
 * Get current bundle information
 */
export async function getCurrentBundle() {
  try {
    return await CapacitorUpdater.current();
  } catch (error) {
    console.error("Failed to get current bundle:", error);
    return null;
  }
}

/**
 * List all available bundles
 */
export async function listBundles() {
  try {
    return await CapacitorUpdater.list();
  } catch (error) {
    console.error("Failed to list bundles:", error);
    return [];
  }
}

/**
 * Delete a specific bundle
 */
export async function deleteBundle(bundleId) {
  try {
    await CapacitorUpdater.delete({ id: bundleId });
    return true;
  } catch (error) {
    console.error("Failed to delete bundle:", error);
    return false;
  }
}

/**
 * Reset to the original app bundle
 */
export async function resetToBuiltin() {
  try {
    await CapacitorUpdater.reset();
    return true;
  } catch (error) {
    console.error("Failed to reset:", error);
    return false;
  }
}

/**
 * Fetch update info from your server
 * You need to implement your own API endpoint
 */
async function fetchUpdateInfo() {
  try {
    // Replace with your actual update server URL
    const response = await fetch(
      "https://your-update-server.com/api/updates/latest",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-App-Version": APP_VERSION,
          "X-Platform": "android",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch update info");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching update info:", error);
    return null;
  }
}

/**
 * Show update dialog to the user
 * Returns true if user wants to update
 */
async function showUpdateDialog(newVersion) {
  // In a real app, you would show a proper dialog using your UI library
  // For now, we'll use a simple confirm
  return window.confirm(
    `Phiên bản mới ${newVersion} đã có sẵn! Bạn có muốn cập nhật ngay không?`
  );
}

export default {
  initUpdater,
  checkForUpdates,
  downloadAndApplyUpdate,
  getCurrentBundle,
  listBundles,
  deleteBundle,
  resetToBuiltin,
};
