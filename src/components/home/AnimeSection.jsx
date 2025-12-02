import { SectionHeader } from './SectionHeader';
import { AnimeCard } from '../movie/AnimeCard';

/**
 * AnimeSection - Hoạt Hình & Anime
 * Netflix-style grid layout với card design backdrop + poster overlap
 * Desktop: 3 card per row
 * Tablet: 2 card per row
 * Mobile: 1 card per row
 */
export const AnimeSection = ({ 
  movies, 
  title = 'Hoạt Hình & Anime', 
  isLoading 
}) => {
  const displayMovies = movies?.slice(0, 6) || [];

  if (displayMovies.length === 0 && !isLoading) return null;

  return (
    <div className="space-y-6">
      <SectionHeader title={title} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(isLoading ? [...Array(3)] : displayMovies).map((movie, idx) => (
          <div key={movie?.slug || idx}>
            <AnimeCard movie={movie} isLoading={isLoading} />
          </div>
        ))}
      </div>
    </div>
  );
};
