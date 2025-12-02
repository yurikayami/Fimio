import { SectionHeader } from './SectionHeader';
import { MovieCardTop10 } from '../movie/MovieCardTop10';
import { LoadingSkeleton } from '../common/LoadingSkeleton';

/**
 * Top10Section - Hiển thị top 10 phim (grid layout)
 * Desktop: 6 card, Tablet: 4 card, Mobile: 2 card
 */
export const Top10Section = ({ movies, title = 'Top 10 Phim Hot', isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <SectionHeader title={title} />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-5">
          {[...Array(6)].map((_, i) => (
            <LoadingSkeleton key={i} className="rounded-2xl w-full aspect-[3/4.5]" />
          ))}
        </div>
      </div>
    );
  }

  const topMovies = movies?.slice(0, 6) || [];

  return (
    <div className="space-y-6">
      <SectionHeader title={title} />
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-5">
        {topMovies.map((movie, index) => (
          <MovieCardTop10 key={`${movie.slug}-${index}`} movie={movie} rank={index + 1} />
        ))}
      </div>
    </div>
  );
};
