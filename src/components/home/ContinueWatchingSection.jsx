import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, X, MoreVertical, Clock } from 'lucide-react';
import { buildImageUrl } from '@/services/api';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useUserActions } from '@/hooks/useUserActions';
import { Button } from '@/components/ui/button';

export const ContinueWatchingSection = () => {
  const { user } = useAuth();
  const { removeFromHistory } = useUserActions();
  const [history, setHistory] = useState([]);

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
            thumb_url,
            year
          )
        `)
        .eq('user_id', user.id)
        .order('watched_at', { ascending: false })
        .limit(6);

      if (!error && data) {
        setHistory(data.map(item => ({
          ...item.movies,
          watchedAt: item.watched_at,
          currentEpisode: item.episode_name,
          historyId: item.id
        })));
      }
    };

    fetchHistory();
  }, [user]);

  const handleRemove = async (historyId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const { success } = await removeFromHistory(historyId);
    if (success) {
      setHistory(prev => prev.filter(item => item.historyId !== historyId));
    }
  };

  if (!user || history.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6 px-4 md:px-0">
        <h2 className="text-2xl font-bold">Tiếp tục xem</h2>
        <Button variant="link" asChild className="text-sm">
          <Link to="/history">Xem tất cả</Link>
        </Button>
      </div>
      
      <div 
        className="flex overflow-x-auto gap-4 px-4 md:px-0 pb-4 snap-x snap-mandatory scroll-smooth"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(63, 63, 70, 0.5) transparent',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            height: 8px;
          }
          div::-webkit-scrollbar-track {
            background: transparent;
          }
          div::-webkit-scrollbar-thumb {
            background: rgba(63, 63, 70, 0.5);
            border-radius: 4px;
          }
          div::-webkit-scrollbar-thumb:hover {
            background: rgba(63, 63, 70, 0.8);
          }
        `}</style>
        {history.map((item) => (
          <div
            key={item.historyId}
            className="group relative rounded-lg overflow-hidden bg-zinc-900 hover:scale-105 transition-all duration-300 flex-shrink-0 w-[300px] md:w-[380px] snap-start"
          >
            <Link to={`/movie/${item.slug}`}>
              {/* Thumbnail Container */}
              <div className="relative aspect-video">
                <img
                  src={buildImageUrl(item.thumb_url || item.poster_url)}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = buildImageUrl(item.poster_url);
                  }}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                
                {/* Top Info - Year & Duration */}
                <div className="absolute top-2 left-2 flex items-center gap-2">
                  {item.year && (
                    <span className="text-xs font-semibold text-white/90 bg-black/60 px-2 py-1 rounded">
                      {item.year}
                    </span>
                  )}
                  {item.currentEpisode && (
                    <span className="text-xs font-medium text-white/90 bg-black/60 px-2 py-1 rounded flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.currentEpisode}
                    </span>
                  )}
                </div>

                {/* Play Icon on Hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 border-2 border-white">
                    <Play className="w-6 h-6 text-white fill-white" />
                  </div>
                </div>

                {/* Bottom Info */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="text-sm font-semibold text-white line-clamp-1 mb-1">
                    {item.name}
                  </h3>
                  {item.origin_name && (
                    <p className="text-xs text-white/70 line-clamp-1">
                      {item.origin_name}
                    </p>
                  )}
                </div>
              </div>
            </Link>

            {/* Menu Button */}
            <button
              onClick={(e) => handleRemove(item.historyId, e)}
              className="absolute top-2 right-2 z-10 bg-black/60 hover:bg-red-600 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Xóa khỏi lịch sử"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
