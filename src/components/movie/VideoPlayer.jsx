import { useEffect, useRef } from 'react';
import Artplayer from 'artplayer';
import Hls from 'hls.js';
import { cn } from '@/lib/utils';

export const VideoPlayer = ({ 
  embedUrl, // m3u8 link
  episodeName, 
  className,
  config = {} // Artplayer config tùy chỉnh
}) => {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const hlsRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !embedUrl) return;

    // Destroy player cũ nếu tồn tại
    if (playerRef.current) {
      try {
        playerRef.current.destroy();
      } catch (e) {
        console.warn('Error destroying previous player:', e);
      }
    }

    // Cleanup HLS instance
    if (hlsRef.current) {
      try {
        hlsRef.current.destroy();
      } catch (e) {
        console.warn('Error destroying HLS:', e);
      }
    }

    // Artplayer config
    const playerConfig = {
      container: containerRef.current,
      url: embedUrl,
      type: 'm3u8',
      
      // Cấu hình UI
      volume: 0.5,
      isLive: false,
      muted: false,
      autoplay: false,
      pip: true,
      autoSize: true,
      autoMini: true,
      screenshot: true,
      setting: true,
      loop: false,
      playbackRate: true,
      aspectRatio: true,
      fullscreen: true,
      fullscreenWeb: true,
      subtitleOffset: true,
      miniProgressBar: true,
      mutex: true,
      backdrop: true,
      playsInline: true,
      autoPlayback: true,
      airplay: true,
      theme: '#23ade5',
      lang: typeof navigator !== 'undefined' ? navigator.language.toLowerCase() : 'en',
      
      moreVideoAttr: {
        crossOrigin: 'anonymous',
      },

      customType: {
        m3u8: function (video, url) {
          if (Hls.isSupported()) {
            const hls = new Hls();
            hlsRef.current = hls;
            hls.loadSource(url);
            hls.attachMedia(video);
          } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = url;
          }
        },
      },
      
      // Merge với config tùy chỉnh
      ...config,
    };

    try {
      // Khởi tạo Artplayer
      const art = new Artplayer(playerConfig);
      playerRef.current = art;
    } catch (error) {
      console.error('Error initializing Artplayer:', error);
    }

    // Cleanup
    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
          playerRef.current = null;
        } catch (e) {
          console.warn('Error in cleanup:', e);
        }
      }
      if (hlsRef.current) {
        try {
          hlsRef.current.destroy();
          hlsRef.current = null;
        } catch (e) {
          console.warn('Error cleaning up HLS:', e);
        }
      }
    };
  }, [embedUrl]);

  if (!embedUrl) {
    return (
      <div className={cn(
        "relative w-full pb-[56.25%] h-0 overflow-hidden bg-slate-900 rounded-lg border border-slate-700",
        className
      )}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-2">Chọn tập phim để bắt đầu xem</p>
            <p className="text-sm text-slate-500">🎬</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "w-full rounded-lg border border-slate-700 overflow-hidden bg-black",
      className
    )}>
      {episodeName && (
        <div className="px-3 py-2 bg-slate-900 border-b border-slate-700 text-sm font-medium">
          {episodeName}
        </div>
      )}
      <div 
        ref={containerRef} 
        className="w-full"
        style={{ 
          aspectRatio: '16 / 9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000'
        }}
      />
    </div>
  );
};
