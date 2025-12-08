import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Trash2, Play } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { buildImageUrl } from '@/services/api';
import { Button } from '@/components/ui/button';
import { useUserActions } from '@/hooks/useUserActions';

export const WatchHistory = () => {
  const { user, signInWithGoogle } = useAuth();
  const { removeFromHistory } = useUserActions();
  const [history, setHistory] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, historyId: null, movieName: null });

  useEffect(() => {
    if (!user) return;

    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from('watch_history')
        .select(`
                id,
                watched_at,
                episode_name,
                movies (
                    slug,
                    name,
                    origin_name,
                    poster_url,
                    thumb_url
                )
            `)
        .eq('user_id', user.id)
        .order('watched_at', { ascending: false });

      if (!error && data) {
        setHistory(data.map(item => ({
          ...item.movies,
          watchedAt: item.watched_at,
          currentEpisode: item.episode_name,
          id: item.id // Keep ID for potential deletion
        })));
      }
    };

    fetchHistory();
  }, [user]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <h2 className="text-3xl font-heading font-bold mb-3">Đăng nhập để xem lịch sử</h2>
        <Button onClick={signInWithGoogle}>Đăng nhập với Google</Button>
      </div>
    );
  }

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

  const handleRemove = async (historyId, movieName) => {
    setDeleteConfirm({ open: true, historyId, movieName });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.historyId) return;

    const { success, error } = await removeFromHistory(deleteConfirm.historyId);
    if (success) {
      setHistory(prev => prev.filter(h => h.id !== deleteConfirm.historyId));
    } else {
      alert("Lỗi khi xóa: " + error);
    }
    setDeleteConfirm({ open: false, historyId: null, movieName: null });
  };

  return (
    <div className="flex flex-1">
      <div className="w-full mx-auto px-4 md:px-6 lg:px-8 py-8 flex-1">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-heading font-bold">Lịch sử xem</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {history.length} phim đã xem
              </p>
            </div>
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
                  key={item.id}
                  className="group flex gap-4 p-4 rounded-lg bg-slate-800/30 border border-slate-700 hover:bg-slate-700/50 hover:border-indigo-500/50 transition-all duration-300 relative"
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
                      onError={(e) => {
                        e.target.src = buildImageUrl(item.thumb_url);
                      }}
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
                    </div>
                  </div>

                   {/* Delete Button */}
                   <Button
                      variant="ghost" 
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-400 hover:bg-red-400/10 absolute top-4 right-4"
                      onClick={() => handleRemove(item.id, item.name)}
                      title="Xóa khỏi lịch sử"
                   >
                       <Trash2 className="h-5 w-5" />
                   </Button>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteConfirm.open} onOpenChange={(open) => !open && setDeleteConfirm({ open: false, historyId: null, movieName: null })}>
          <DialogContent className="bg-slate-900/60 backdrop-blur-2xl border border-slate-400/20 shadow-2xl w-[95vw] max-w-md rounded-2xl supports-[backdrop-filter]:bg-slate-950/40">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/30 via-slate-900/20 to-slate-950/30 rounded-2xl pointer-events-none" />
            <DialogHeader className="pb-4 border-b border-slate-400/15 relative z-10">
              <DialogTitle className="text-lg font-bold text-blue-400">Xóa khỏi lịch sử?</DialogTitle>
              <DialogDescription className="hidden">Xác nhận xóa khỏi lịch sử xem</DialogDescription>
            </DialogHeader>
            <p className="text-slate-300 text-sm relative z-10">Bạn chắc chắn muốn xóa <span className="font-semibold text-slate-100">"{deleteConfirm.movieName}"</span> khỏi lịch sử xem? Hành động này không thể hoàn tác.</p>
            <div className="flex gap-3 mt-6 relative z-10">
              <Button
                onClick={() => setDeleteConfirm({ open: false, historyId: null, movieName: null })}
                className="flex-1 bg-slate-800/30 border border-slate-400/30 hover:bg-slate-800/50 backdrop-blur-sm font-semibold text-slate-200"
                variant="outline"
              >
                Hủy
              </Button>
              <Button
                onClick={confirmDelete}
                className="flex-1 bg-gradient-to-r from-red-600/90 to-red-700/90 hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-red-500/30 font-semibold"
              >
                Xóa
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
