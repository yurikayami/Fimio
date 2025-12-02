import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export const VideoPlayer = ({ embedUrl, episodeName, className }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    if (iframeRef.current && embedUrl) {
      iframeRef.current.src = embedUrl;
    }
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
      "relative w-full pb-[56.25%] h-0 overflow-hidden bg-black rounded-lg border border-slate-700",
      className
    )}>
      <iframe
        ref={iframeRef}
        src={embedUrl || 'about:blank'}
        className="absolute top-0 left-0 w-full h-full"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        title={episodeName || 'Video Player'}
      />
      
      {episodeName && (
        <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/70 rounded text-sm font-medium">
          {episodeName}
        </div>
      )}
    </div>
  );
};
