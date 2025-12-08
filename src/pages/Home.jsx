import { useState, useEffect, Suspense } from 'react';
import { getMoviesByType, getLatestMovies } from '@/services/api';
import { preloadMovieImages } from '@/lib/imageUtils';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { HeroSkeleton } from '@/components/common/LoadingSkeleton';
import { HeroSection } from '@/components/home/HeroSection';
import { CategoryRail } from '@/components/home/CategoryRail';
import { MovieRow } from '@/components/movie/MovieRow';
import { MovieGridSection } from '@/components/home/MovieGridSection';
import { MovieCarouselSection } from '@/components/home/MovieCarouselSection';
import { MovieStackSection } from '@/components/home/MovieStackSection';
import { MovieBannerSection } from '@/components/home/MovieBannerSection';
import { MovieListSection } from '@/components/home/MovieListSection';
import { MovieSpotlightSection } from '@/components/home/MovieSpotlightSection';
import { Top10Section } from '@/components/home/Top10Section';
import { CinemaSection } from '@/components/home/CinemaSection';
import { RecommendedSection } from '@/components/home/RecommendedSection';
import { TrendingSection } from '@/components/home/TrendingSection';
import { AnimeSection } from '@/components/home/AnimeSection';
import { Languages } from 'lucide-react';

export const Home = () => {
  const [heroMovies, setHeroMovies] = useState([]);

  // Sections Data - 9 sections with different layouts
  const [sections, setSections] = useState({
    latest: [],
    korea: [],
    series: [],
    single: [],
    cartoon: [],
    anime: [],
    action: [],
    romance: [],
    comedy: [],
    cinema: [],
    recommended: [],
    trending: []
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch dữ liệu tối ưu - giảm trùng lặp
      const results = await Promise.allSettled([
        getLatestMovies(1), // Hero & Latest & Cinema
        getMoviesByType('phim-bo', { country: 'han-quoc', limit: 10 }), // Korea
        getMoviesByType('hoat-hinh', { country: 'nhat-ban', limit: 10 }), // Series, Recommended, Trending
        getMoviesByType('phim-le', { limit: 4 }), // Single
        getMoviesByType('hoat-hinh', { limit: 12 }), // Cartoon
        getMoviesByType('hoat-hinh', { country: 'nhat-ban', limit: 10, page: 2 }), // Anime (page 2)
        getMoviesByType('phim-bo', { category: 'hanh-dong', limit: 10 }), // Action
        getMoviesByType('phim-bo', { category: 'tinh-cam', limit: 10 }), // Romance
        getMoviesByType('phim-bo', { category: 'hai-huoc', country: 'nhat-ban', limit: 10 }), // Comedy
      ]);

      const [
        latestRes,
        koreaRes,
        seriesRes,
        singleRes,
        cartoonRes,
        animeRes,
        actionRes,
        romanceRes,
        comedyRes
      ] = results;

      // Helper to extract items safely
      const getItems = (res) => (res.status === 'fulfilled' && res.value?.items) ? res.value.items : [];

      const latestItems = getItems(latestRes);
      const koreaItems = getItems(koreaRes);
      const seriesItems = getItems(seriesRes);
      const singleItems = getItems(singleRes);
      const cartoonItems = getItems(cartoonRes);
      const animeItems = getItems(animeRes);
      const actionItems = getItems(actionRes);
      const romanceItems = getItems(romanceRes);
      const comedyItems = getItems(comedyRes);

      setHeroMovies(latestItems.slice(0, 5));

      setSections({
        latest: latestItems,
        korea: koreaItems,
        series: seriesItems,
        single: singleItems,
        cartoon: cartoonItems,
        anime: animeItems,
        action: actionItems,
        romance: romanceItems,
        comedy: comedyItems,
        cinema: latestItems, // Reuse latest
        recommended: seriesItems.slice(0, 6), // Reuse series
        trending: seriesItems.slice(6, 12) // Reuse different subset of series
      });

      // Preload images for visible sections
      setTimeout(() => {
        if (koreaItems.length) preloadMovieImages(koreaItems, 'poster_url', 3);
        if (seriesItems.length) preloadMovieImages(seriesItems, 'poster_url', 2);
      }, 500);

    } catch (err) {
      console.error("Error fetching home data:", err);
      setError("Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  if (error && !heroMovies.length) {
    return (
      <div className="pt-20 container mx-auto px-4">
        <ErrorMessage message={error} onRetry={fetchAllData} />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 min-h-screen">
      {/* Hero Section */}
      <section className="relative -mt-6 w-full">
        {isLoading && !heroMovies.length ? (
          <HeroSkeleton />
        ) : (
          <HeroSection movies={heroMovies} />
        )}
      </section>

      {/* Quick Categories */}
      <div className="container mx-auto px-4 -mt-12 relative z-20">
        <CategoryRail />
      </div>

      {/* Movie Rows */}
      <div className="container mx-auto px-4 space-y-10 mt-8">
        {isLoading && !sections.latest.length ? (
          // Simple loading state for rows
          <div className="space-y-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-4">
                <div className="h-8 w-48 bg-slate-800 rounded animate-pulse" />
                <div className="flex gap-4 overflow-hidden">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <div key={j} className="w-[200px] h-[300px] bg-slate-800 rounded animate-pulse flex-shrink-0" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Section 1: Top 10 - Grid */}
            <Top10Section
              title="Top 10 Phim Hot"
              movies={sections.latest}
              isLoading={isLoading}
            />

            {/* Section 2: Latest Movies - Horizontal Row */}
            <MovieRow
              title="Phim Mới Cập Nhật"
              movies={sections.latest}
              variant="default"
            />

            {/* Section 3: Korea Movies - Banner Style */}
            <MovieBannerSection
              title="Phim Hàn Quốc"
              movies={sections.korea}
            />

            {/* Section 4: Cinema - Grid */}
            <CinemaSection
              title="Màn Nhấn với Phim Chiếu Rạp"
              movies={sections.cinema}
              isLoading={isLoading}
            />

            {/* Section 5: TV Series - Spotlight Style */}
            <MovieSpotlightSection
              title="Phim Bộ Hay"
              movies={sections.series}
            />



            {/* Section 6: Single Movies - List Style */}
            <MovieListSection
              title="Phim Lẻ Hay"
              movies={sections.single}
            />

            {/* Section 7: Recommended - Grid */}
            <RecommendedSection
              title="Được Đề Xuất Cho Bạn"
              movies={sections.recommended}
              isLoading={isLoading}
            />

            {/* Section 8: Cartoon & Anime - Grid Style */}
            <MovieGridSection
              title="Hoạt Hình"
              movies={sections.cartoon}
              cols={6}
            />

            {/* Section 9: Anime - Specialized Card Style */}
            {sections.anime.length > 0 && (
              <AnimeSection
                title="Anime & Nhật Bản"
                movies={sections.anime}
                isLoading={isLoading}
              />
            )}

            {/* Section 10: Action Movies - Carousel Style */}
            {sections.action.length > 0 && (
              <MovieCarouselSection
                title="Phim Hành Động"
                movies={sections.action}
              />
            )}

            {/* Section 11: Romance Movies - Stack Style */}
            {sections.romance.length > 0 && (
              <MovieStackSection
                title="Phim Tình Cảm"
                movies={sections.romance}
              />
            )}

            {/* Section 12: Comedy Movies - Grid Style */}
            {sections.comedy.length > 0 && (
              <MovieGridSection
                title="Phim Hài Hước"
                movies={sections.comedy}
                cols={5}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};