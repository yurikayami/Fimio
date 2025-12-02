import { SectionHeader } from './SectionHeader';
import { MovieCardCinema } from '../movie/MovieCardCinema';
import { LoadingSkeleton } from '../common/LoadingSkeleton';

/**
 * CinemaSection - Phim rạp/Màn Nhấn (grid layout)
 * Desktop: 6 card, Tablet: 4 card, Mobile: 2 card
 */
export const CinemaSection = ({ 
  movies, 
  title = 'Màn Nhấn với Phim Chiếu Rạp', 
  isLoading 
}) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <SectionHeader title={title} />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-5">
          {[...Array(6)].map((_, i) => (
            <LoadingSkeleton key={i} className="rounded-lg w-full aspect-[3/4.5]" />
          ))}
        </div>
      </div>
    );
  }

  const displayMovies = movies?.slice(0, 6) || [];

  return (
    <div className="space-y-6">
      <SectionHeader title={title} />
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-5">
        {displayMovies.map((movie) => (
          <MovieCardCinema key={movie.slug} movie={movie} />
        ))}
      </div>
    </div>
  );
};
