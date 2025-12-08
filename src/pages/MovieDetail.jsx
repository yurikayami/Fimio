import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieDetails, buildImageUrl } from '@/services/api';
import { useUserActions } from '@/hooks/useUserActions';
import { useAuth } from '@/contexts/AuthContext';
import { VideoPlayer } from '@/components/movie/VideoPlayer';
import { EpisodeSelector } from '@/components/movie/EpisodeSelector';
import { Button } from '@/components/ui/button';
import { DetailsSkeleton } from '@/components/common/LoadingSkeleton';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { Bookmark, BookmarkCheck, Play, Calendar, Clock, Globe, Star } from 'lucide-react';

export const MovieDetail = () => {
  const { slug } = useParams();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentEpisode, setCurrentEpisode] = useState({ embedUrl: '', name: '' });
  const { addToLibrary, addToHistory, checkIsSaved } = useUserActions();
  const { user, signInWithGoogle } = useAuth();
  const [isSaved, setIsSaved] = useState(false);

  const loadMovieDetails = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getMovieDetails(slug);

      if (response.status) {
        // Handle both root-level and nested data structures
        const movieData = response.movie || response.data?.movie;
        const episodesData = response.episodes || response.data?.episodes;

        if (movieData) {
          setMovie({ movie: movieData, episodes: episodesData || [] });

          // Auto-play first episode if available
          if (episodesData && episodesData[0]?.server_data?.[0]) {
            const firstEpisode = episodesData[0].server_data[0];
            setCurrentEpisode({
              embedUrl: firstEpisode.link_embed,
              name: firstEpisode.name,
            });
          }
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadMovieDetails();
  }, [loadMovieDetails]);

  // Track watch history when movie loads
  useEffect(() => {
    // Check if saved when movie loads
    if (movie && movie.movie) {
      checkIsSaved(movie.movie.slug).then(setIsSaved);
    }

    // Auto add to history on load
    if (movie && movie.movie && user) {
      addToHistory(movie, currentEpisode.name || 'Full Movie');
    }
  }, [movie, user, checkIsSaved, addToHistory, currentEpisode.name]); // Watch user too

  const handleEpisodeSelect = (embedUrl, episodeName) => {
    setCurrentEpisode({ embedUrl, name: episodeName });
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update watch history with new episode
    if (movie && movie.movie && user) {
      addToHistory(movie, episodeName);
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      signInWithGoogle(); // Simple auto login trigger
      return;
    }

    if (!movie) return;

    if (!isSaved) {
      // Pass the fully structured object matching API response for sync_movie_data
      // movie state is { movie: {...}, episodes: [...] }
      // sync_movie_data expects p_movie_data->'movie' and p_movie_data->'episodes'
      const result = await addToLibrary(movie);
      if (result.success) {
        setIsSaved(true);
      } else {
        alert(result.error);
      }
    }
  };

  if (isLoading) {
    return <DetailsSkeleton />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadMovieDetails} />;
  }

  if (!movie) {
    return <ErrorMessage message="Không tìm thấy phim" />;
  }

  const movieData = movie.movie;

  return (
    <div className="space-y-4 md:space-y-8">
      {/* Background Overlay */}
      <div className="fixed inset-0 bg-background -z-10" />

      {/* Video Player */}
      <section className="relative">
        <VideoPlayer
          embedUrl={currentEpisode.embedUrl}
          episodeName={currentEpisode.name}
          className="shadow-2xl"
        />
      </section>

      {/* Episode Selector */}
      {movie.episodes && movie.episodes.length > 0 && (
        <section>
          <EpisodeSelector
            episodes={movie.episodes}
            onEpisodeSelect={handleEpisodeSelect}
          />
        </section>
      )}

      {/* Movie Info */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 px-4 md:px-0">
        {/* Poster */}
        <div className="md:col-span-1">
          <div className="md:sticky md:top-24">
            <img
              src={buildImageUrl(movieData.poster_url)}
              alt={movieData.name}
              className="w-full rounded-lg shadow-2xl border border-slate-700"
              onError={(e) => {
                e.target.src = buildImageUrl(movieData.thumb_url);
              }}
            />

              {/* Action Buttons */}
            <div className="flex gap-2 mt-3 md:mt-4">
              <Button
                onClick={() => handleBookmark()}
                variant={isSaved ? 'default' : 'outline'}
                className="flex-1 min-h-[48px] h-12 text-sm md:text-base active:scale-95"
              >
                {isSaved ? (
                  <>
                    <BookmarkCheck className="h-4 w-4 md:h-4 md:w-4 mr-2" />
                    Đã lưu
                  </>
                ) : (
                  <>
                    <Bookmark className="h-4 w-4 md:h-4 md:w-4 mr-2" />
                    Lưu phim
                  </>
                )}
              </Button>

              {movieData.trailer_url && (
                <Button
                  asChild
                  variant="outline"
                  className="flex-1 min-h-[48px] h-12 text-sm md:text-base active:scale-95"
                >
                  <a href={movieData.trailer_url} target="_blank" rel="noopener noreferrer">
                    <Play className="h-4 w-4 md:h-4 md:w-4 mr-2" />
                    Trailer
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="md:col-span-2 space-y-4 md:space-y-6">
          {/* Title */}
          <div>
            <h1 className="text-2xl md:text-4xl font-heading font-bold mb-1 md:mb-2">{movieData.name}</h1>
            <p className="text-base md:text-xl text-muted-foreground">{movieData.origin_name}</p>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-2 md:gap-3">
            {movieData.year && (
              <div className="flex items-center gap-1.5 md:gap-2 px-2 py-1 md:px-3 md:py-1.5 bg-secondary rounded-lg border border-slate-700">
                <Calendar className="h-3.5 w-3.5 md:h-4 md:w-4 text-accent" />
                <span className="text-xs md:text-sm font-medium">{movieData.year}</span>
              </div>
            )}
            {movieData.time && (
              <div className="flex items-center gap-1.5 md:gap-2 px-2 py-1 md:px-3 md:py-1.5 bg-secondary rounded-lg border border-slate-700">
                <Clock className="h-3.5 w-3.5 md:h-4 md:w-4 text-accent" />
                <span className="text-xs md:text-sm font-medium">{movieData.time}</span>
              </div>
            )}
            {movieData.quality && (
              <div className="px-2 py-1 md:px-3 md:py-1.5 bg-secondary rounded-lg border border-slate-700">
                <span className="text-xs md:text-sm font-bold text-emerald-400">{movieData.quality}</span>
              </div>
            )}
            {movieData.lang && (
              <div className="px-2 py-1 md:px-3 md:py-1.5 bg-secondary rounded-lg border border-slate-700">
                <span className="text-xs md:text-sm font-medium">{movieData.lang}</span>
              </div>
            )}
             {/* TMDB Rating */}
            {movieData.tmdb && (
              <div className="flex items-center gap-1.5 md:gap-2 px-2 py-1 md:px-3 md:py-1.5 bg-amber-950/30 rounded-lg border border-amber-900/50">
                <Star className="h-3.5 w-3.5 md:h-4 md:w-4 text-amber-500 fill-amber-500" />
                <span className="text-xs md:text-sm font-bold text-amber-500">
                  {movieData.tmdb.vote_average}
                </span>
              </div>
            )}

          </div>

          {/* Description */}
          {movieData.content && (
            <div className="bg-secondary/50 rounded-lg border border-slate-700 p-6">
              <h2 className="text-xl font-heading font-semibold mb-3">Nội dung</h2>
              <div
                className="text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: movieData.content }}
              />
            </div>
          )}

          {/* Categories */}
          {movieData.category && movieData.category.length > 0 && (
            <div>
              <h2 className="text-xl font-heading font-semibold mb-3">Thể loại</h2>
              <div className="flex flex-wrap gap-2">
                {movieData.category.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/explore?category=${cat.slug}`}
                    className="px-3 py-1.5 bg-secondary rounded-lg border border-slate-700 text-sm hover:bg-slate-700 hover:text-white transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Countries */}
          {movieData.country && movieData.country.length > 0 && (
            <div>
              <h2 className="text-xl font-heading font-semibold mb-3 flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Quốc gia
              </h2>
              <div className="flex flex-wrap gap-2">
                {movieData.country.map((country) => (
                  <Link
                    key={country.id}
                    to={`/explore?country=${country.slug}`}
                    className="px-3 py-1.5 bg-secondary rounded-lg border border-slate-700 text-sm hover:bg-slate-700 hover:text-white transition-colors"
                  >
                    {country.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  );
};
