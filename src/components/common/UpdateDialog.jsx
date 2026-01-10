// Update Dialog Component
// Shows a dialog when a new update is available

import { useState, useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import { Download, RefreshCw, Sparkles } from "lucide-react";

export function UpdateDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [updateInfo, setUpdateInfo] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    // Dynamic import for native platform only
    import("@capgo/capacitor-updater").then(({ CapacitorUpdater }) => {
      // Listen for update available event
      CapacitorUpdater.addListener("updateAvailable", (info) => {
        setUpdateInfo(info.bundle);
        setIsOpen(true);
      });

      // Listen for download progress
      CapacitorUpdater.addListener("downloadProgress", (info) => {
        setDownloadProgress(info.percent);
      });

      // Listen for download complete
      CapacitorUpdater.addListener("downloadComplete", () => {
        setIsDownloading(false);
        setDownloadProgress(100);
      });
    });
  }, []);

  const handleUpdate = async () => {
    if (!updateInfo) return;

    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      const { CapacitorUpdater } = await import("@capgo/capacitor-updater");
      const { App } = await import("@capacitor/app");

      // Download the update
      const bundle = await CapacitorUpdater.download({
        url: updateInfo.url,
        version: updateInfo.version,
      });

      // Set the bundle
      await CapacitorUpdater.set(bundle);

      // Reload the app
      await App.exitApp();
    } catch (error) {
      console.error("Update failed:", error);
      setIsDownloading(false);
    }
  };

  const handleLater = () => {
    setIsOpen(false);
  };

  if (!Capacitor.isNativePlatform()) {
    return null;
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="bg-zinc-900 border-zinc-800 max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-white">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            Cập nhật mới có sẵn!
          </AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-400">
            {updateInfo ? (
              <>
                <p className="mb-2">
                  Phiên bản <strong className="text-white">{updateInfo.version}</strong> đã sẵn sàng để cài đặt.
                </p>
                {updateInfo.releaseNotes && (
                  <p className="text-sm text-zinc-500">{updateInfo.releaseNotes}</p>
                )}
              </>
            ) : (
              "Một phiên bản mới của ứng dụng đã có sẵn. Cập nhật ngay để có trải nghiệm tốt nhất!"
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {isDownloading && (
          <div className="space-y-2 py-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-400 flex items-center gap-2">
                <Download className="w-4 h-4 animate-bounce" />
                Đang tải xuống...
              </span>
              <span className="text-white">{downloadProgress}%</span>
            </div>
            <Progress value={downloadProgress} className="h-2 bg-zinc-700" />
          </div>
        )}

        <AlertDialogFooter className="gap-2 sm:gap-0">
          <AlertDialogCancel
            onClick={handleLater}
            disabled={isDownloading}
            className="bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700"
          >
            Để sau
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleUpdate}
            disabled={isDownloading}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {isDownloading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            {isDownloading ? "Đang cập nhật..." : "Cập nhật ngay"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default UpdateDialog;
