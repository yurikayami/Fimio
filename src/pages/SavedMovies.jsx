import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { MovieGrid } from '@/components/movie/MovieGrid';
import { Bookmark, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { buildImageUrl } from '@/services/api';
import { useUserActions } from '@/hooks/useUserActions';

export const SavedMovies = () => {
  const { user, signInWithGoogle } = useAuth();
  const { removeFromLibrary } = useUserActions();
  const [savedMovies, setSavedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, movieSlug: null, movieName: null });

  useEffect(() => {
    if (!user) return;

    const fetchSaved = async () => {
      const { data, error } = await supabase
        .from('library')
        .select(`
                id,
                movies (
                    slug,
                    name,
                    poster_url,
                    thumb_url
                )
            `)
        .eq('user_id', user.id);

      if (!error && data) {
        // Flatten structure
        setSavedMovies(data.map(item => item.movies));
      }
      setLoading(false);
    };

    fetchSaved();
  }, [user]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <h2 className="text-3xl font-heading font-bold mb-3">
          Đăng nhập để xem phim đã lưu
        </h2>
        <Button onClick={signInWithGoogle}>Đăng nhập với Google</Button>
      </div>
    );
  }

  if (loading) return <div className="p-8 text-center">Đang tải...</div>;

  if (savedMovies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-accent/10 p-6 mb-6">
          <Bookmark className="h-16 w-16 text-accent" />
        </div>
        <h2 className="text-3xl font-heading font-bold mb-3">
          Chưa có phim đã lưu
        </h2>
        <p className="text-muted-foreground max-w-md mb-8">
          Bạn chưa lưu phim nào. Hãy khám phá và lưu những phim yêu thích của bạn!
        </p>
        <Button asChild>
          <a href="/explore">Khám phá ngay</a>
        </Button>
      </div>
    );
  }

  const handleRemove = async (movieSlug, movieName) => {
    setDeleteConfirm({ open: true, movieSlug, movieName });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.movieSlug) return;
    
    const { success, error } = await removeFromLibrary(deleteConfirm.movieSlug);
    if (success) {
      setSavedMovies(prev => prev.filter(m => m.slug !== deleteConfirm.movieSlug));
    } else {
      alert("Lỗi khi xóa: " + error);
    }
    setDeleteConfirm({ open: false, movieSlug: null, movieName: null });
  };

  return (
    <div className="flex flex-1">
      <div className="w-full mx-auto px-4 md:px-6 lg:px-8 py-8 flex-1">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bookmark className="h-8 w-8 text-accent" />
              <h1 className="text-3xl font-heading font-bold">Phim đã lưu</h1>
            </div>
            <span className="text-muted-foreground">
              {savedMovies.length} phim
            </span>
          </div>

          {/* Movies Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {savedMovies.map((movie) => (
              <div key={movie.slug} className="relative group">
                <a
                  href={`/movie/${movie.slug}`}
                  className="block bg-secondary rounded-lg overflow-hidden border border-slate-700 transition-all duration-300 hover:-translate-y-[15px] hover:scale-[1.02] hover:shadow-[0_12px_24px_rgba(99,102,241,0.2)]"
                >
                  <div className="relative pb-[150%] bg-slate-700">
                    <img
                      src={buildImageUrl(movie.poster_url)}
                      onError={(e) => {
                        e.target.src = buildImageUrl(movie.thumb_url);
                      }}
                      alt={movie.name}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#000000]/95 via-[#000000]/70 to-transparent pt-6 pb-3 px-3">
                      <h3 className="text-sm font-semibold text-slate-100 line-clamp-2 text-center">
                        {movie.name}
                      </h3>
                    </div>
                  </div>
                </a>

                {/* Remove Button */}
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 scale-90 hover:scale-100 z-10 shadow-md"
                  onClick={(e) => {
                    e.preventDefault();
                    handleRemove(movie.slug, movie.name);
                  }}
                  title="Xóa khỏi danh sách"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Delete Confirmation Dialog */}
          <Dialog open={deleteConfirm.open} onOpenChange={(open) => !open && setDeleteConfirm({ open: false, movieSlug: null, movieName: null })}>
            <DialogContent className="bg-slate-900/60 backdrop-blur-2xl border border-slate-400/20 shadow-2xl w-[95vw] max-w-md rounded-2xl supports-[backdrop-filter]:bg-slate-950/40">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800/30 via-slate-900/20 to-slate-950/30 rounded-2xl pointer-events-none" />
              <DialogHeader className="pb-4 border-b border-slate-400/15 relative z-10">
                <DialogTitle className="text-lg font-bold text-pink-400">Xóa phim?</DialogTitle>
                <DialogDescription className="hidden">Xác nhận xóa phim</DialogDescription>
              </DialogHeader>
              <p className="text-slate-300 text-sm relative z-10">Bạn chắc chắn muốn xóa <span className="font-semibold text-slate-100">"{deleteConfirm.movieName}"</span> khỏi danh sách đã lưu? Hành động này không thể hoàn tác.</p>
              <div className="flex gap-3 mt-6 relative z-10">
                <Button
                  onClick={() => setDeleteConfirm({ open: false, movieSlug: null, movieName: null })}
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
    </div>
  );
};
