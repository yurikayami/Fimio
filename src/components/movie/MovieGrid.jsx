import { MovieCard } from './MovieCard';

export const MovieGrid = ({ movies = [], isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 md:py-16 text-center px-4">
        <div className="text-5xl md:text-6xl mb-3 md:mb-4">🎬</div>
        <h3 className="text-lg md:text-xl font-semibold mb-2">Không tìm thấy phim</h3>
        <p className="text-sm md:text-base text-muted-foreground">
          Thử tìm kiếm với từ khóa khác hoặc thay đổi bộ lọc
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
      {movies.map((movie) => (
        <MovieCard key={movie._id || movie.slug} movie={movie} />
      ))}
    </div>
  );
};

const MovieCardSkeleton = () => (
  <div className="bg-secondary rounded-lg overflow-hidden border border-slate-700 animate-pulse">
    <div className="pb-[150%] bg-slate-700" />
  </div>
);
