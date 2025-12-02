import { SectionHeader } from './SectionHeader';
import { MovieCardTop10 } from '../movie/MovieCardTop10';
import { LoadingSkeleton } from '../common/LoadingSkeleton';

/**
 * Top10Section - Hiển thị top 10 phim (grid layout tối ưu mobile)
 * Mobile: 2 cols, Tablet: 3 cols, Desktop: 4-6 cols (compact size)
 */
export const Top10Section = ({ movies, title = 'Top 10 Phim Hot', isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-3 md:space-y-6">
        <SectionHeader title={title} />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 md:gap-3 lg:gap-4">
          {[...Array(6)].map((_, i) => (
            <LoadingSkeleton key={i} className="rounded-lg md:rounded-2xl w-full aspect-[3/4.5]" />
          ))}
        </div>
      </div>
    );
  }

  const topMovies = movies?.slice(0, 6) || [];

  return (
    <div className="space-y-3 md:space-y-6">
      <SectionHeader title={title} />
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 md:gap-3 lg:gap-4">
        {topMovies.map((movie, index) => (
          <MovieCardTop10 key={`${movie.slug}-${index}`} movie={movie} rank={index + 1} />
        ))}
      </div>
    </div>
  );
};
