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
      autoMini: false,
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

      // Thêm nút Back 10s và Next 10s trên thanh tiến trình
      controls: [
        {
          position: 'left',
          html: '-10s',
          index: 1,
          tooltip: 'Back 10s',
          click() {
            // Lấy player instance từ Artplayer
            const video = document.querySelector('video');
            if (video) {
              video.currentTime = Math.max(0, video.currentTime - 10);
            }
          },
        },
        {
          position: 'left',
          html: '+10s',
          index: 2,
          tooltip: 'Next 10s',
          click() {
            const video = document.querySelector('video');
            if (video) {
              video.currentTime = Math.min(video.duration, video.currentTime + 10);
            }
          },
        },
      ],
      
      // Merge với config tùy chỉnh
      ...config,
    };

    try {
      // Khởi tạo Artplayer
      const art = new Artplayer(playerConfig);
      playerRef.current = art;

      let hidePlayButtonTimer = null;

      // Phím tắt F cho Fullscreen - định nghĩa ở ngoài để reference ổn định
      const handleKeyPress = (e) => {
        if (e.key === 'f' || e.key === 'F') {
          e.preventDefault();
          if (playerRef.current) {
            playerRef.current.fullscreen = !playerRef.current.fullscreen;
          }
        }
      };

      // Thêm event listener cho phím tắt
      document.addEventListener('keydown', handleKeyPress);

      // Chỉ chạy một lần khi player ready
      art.on('ready', () => {
        const playButton = art.template.$play;
        if (!playButton) {
          console.warn('Play button not found');
          return;
        }

        // Ẩn nút Play khi video đang phát
        art.on('video:play', () => {
          if (hidePlayButtonTimer) {
            clearTimeout(hidePlayButtonTimer);
            hidePlayButtonTimer = null;
          }
          playButton.style.opacity = '0';
          playButton.style.pointerEvents = 'none';
        });

        // Hiện nút Play khi pause
        art.on('video:pause', () => {
          if (hidePlayButtonTimer) {
            clearTimeout(hidePlayButtonTimer);
          }
          playButton.style.opacity = '0.1';
          playButton.style.pointerEvents = 'auto';

          // Sau 1s tự động ẩn nếu không hover
          hidePlayButtonTimer = setTimeout(() => {
            if (!art.playing) {
              playButton.style.opacity = '0';
              playButton.style.pointerEvents = 'none';
            }
          }, 1000);
        });

        // Khi hover vào nút Play, giữ lại
        playButton.addEventListener('mouseenter', () => {
          if (hidePlayButtonTimer) {
            clearTimeout(hidePlayButtonTimer);
            hidePlayButtonTimer = null;
          }
          playButton.style.opacity = '0.1';
        });

        playButton.addEventListener('mouseleave', () => {
          if (!art.playing) {
            hidePlayButtonTimer = setTimeout(() => {
              playButton.style.opacity = '0';
              playButton.style.pointerEvents = 'none';
            }, 1000);
          }
        });
      });

      // Handle fullscreen orientation change on mobile
      const handleFullscreenChange = async () => {
        const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement;
        
        if (isFullscreen && window.screen?.orientation) {
          try {
            // Lock orientation to landscape when entering fullscreen
            await window.screen.orientation.lock('landscape').catch(() => {
              // Fallback: try landscape-primary
              return window.screen.orientation.lock('landscape-primary').catch(() => {
                console.log('Device does not support screen orientation locking');
              });
            });
          } catch (error) {
            console.log('Could not lock screen orientation:', error);
          }
        } else if (!isFullscreen && window.screen?.orientation) {
          try {
            // Unlock orientation when exiting fullscreen
            window.screen.orientation.unlock();
          } catch (error) { 
            console.log('Could not unlock screen orientation:', error);
          }
        }
      };

      // Listen for fullscreen changes
      document.addEventListener('fullscreenchange', handleFullscreenChange);
      document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.addEventListener('mozfullscreenchange', handleFullscreenChange);

      return () => {
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
        document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
        document.removeEventListener('keydown', handleKeyPress);
      };
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
