import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Trash2, Play } from 'lucide-react';
import { getWatchHistory, removeFromWatchHistory, clearWatchHistory } from '@/lib/watchHistory';
import { buildImageUrl } from '@/services/api';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export const WatchHistory = () => {
  const [history, setHistory] = useState([]);
  const [showClearDialog, setShowClearDialog] = useState(false);

  useEffect(() => {
    setHistory(getWatchHistory());
  }, []);

  const handleRemove = (slug) => {
    removeFromWatchHistory(slug);
    const data = getWatchHistory();
    setHistory(data);
  };

  const handleClearAll = () => {
    clearWatchHistory();
    setHistory([]);
    setShowClearDialog(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Lịch sử xem</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {history.length} phim đã xem
          </p>
        </div>
        {history.length > 0 && (
          <Button
            variant="outline"
            onClick={() => setShowClearDialog(true)}
            className="text-red-400 border-red-400/50 hover:bg-red-400/10"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Xóa tất cả
          </Button>
        )}
      </div>

      {/* History List */}
      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Clock className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Chưa có lịch sử xem</h3>
          <p className="text-muted-foreground mb-6">
            Bắt đầu xem phim để theo dõi lịch sử của bạn
          </p>
          <Button asChild>
            <Link to="/">
              <Play className="h-4 w-4 mr-2" />
              Khám phá phim
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {history.map((item) => (
            <div
              key={item.slug}
              className="group flex gap-4 p-4 rounded-lg bg-slate-800/30 border border-slate-700 hover:bg-slate-700/50 hover:border-indigo-500/50 transition-all duration-300"
            >
              {/* Thumbnail */}
              <Link
                to={`/movie/${item.slug}`}
                className="relative w-24 h-36 rounded-lg overflow-hidden flex-shrink-0 border border-slate-600"
              >
                <img
                  src={buildImageUrl(item.poster_url || item.thumb_url)}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                
                {/* Play Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="p-2 bg-indigo-600 rounded-full">
                    <Play className="h-4 w-4 text-white fill-white" />
                  </div>
                </div>
              </Link>

              {/* Info */}
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <Link
                    to={`/movie/${item.slug}`}
                    className="font-semibold text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-2"
                  >
                    {item.name}
                  </Link>
                  <p className="text-sm text-slate-400 line-clamp-1 mt-1">
                    {item.origin_name}
                  </p>

                  {/* Episode Info */}
                  {item.currentEpisode && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs px-2 py-1 bg-indigo-600/20 border border-indigo-500/50 rounded text-indigo-300">
                        {item.currentEpisode}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="h-3 w-3" />
                    {formatDate(item.watchedAt)}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemove(item.slug)}
                    className="text-slate-400 hover:text-red-400 hover:bg-red-400/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Clear Confirmation Dialog */}
      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent className="bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle>Xóa toàn bộ lịch sử?</DialogTitle>
            <DialogDescription>
              Hành động này không thể hoàn tác. Tất cả lịch sử xem của bạn sẽ bị xóa vĩnh viễn.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClearDialog(false)}>
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleClearAll}
            >
              Xóa tất cả
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
