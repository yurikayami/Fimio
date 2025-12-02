import { useSavedMovies } from '@/hooks/useLocalStorage';
import { MovieGrid } from '@/components/movie/MovieGrid';
import { Bookmark, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const SavedMovies = () => {
  const { savedMovies, removeMovie } = useSavedMovies();

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
                  src={movie.poster_url || movie.thumb_url}
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
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
              onClick={(e) => {
                e.preventDefault();
                removeMovie(movie.slug);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        </div>
        </div>
      </div>
    </div>
  );
};
