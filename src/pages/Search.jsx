import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MovieGrid } from '@/components/movie/MovieGrid';
import { Pagination } from '@/components/common/Pagination';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { searchMovies } from '@/services/api';

export const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });

  const performSearch = useCallback(async (page = 1) => {
    try {
      setIsLoading(true);
      setError(null);

      const searchKeyword = searchParams.get('keyword') || '';
      const searchCategory = searchParams.get('category') || '';
      const searchCountry = searchParams.get('country') || '';
      const searchYear = searchParams.get('year') || '';
      const searchSortField = searchParams.get('sort_field') || 'modified.time';
      const searchSortType = searchParams.get('sort_type') || 'desc';

      if (!searchKeyword) {
        setMovies([]);
        setIsLoading(false);
        return;
      }

      const response = await searchMovies(searchKeyword, {
        page,
        limit: 24,
        category: searchCategory,
        country: searchCountry,
        year: searchYear,
        sort_field: searchSortField,
        sort_type: searchSortType,
      });

      if (response.status && response.items) {
        setMovies(response.items);
        setPagination({
          currentPage: response.pagination?.currentPage || 1,
          totalPages: response.pagination?.totalPages || 1,
        });
      } else {
        setMovies([]);
      }
    } catch (err) {
      setError(err.message);
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    const page = parseInt(searchParams.get('page')) || 1;
    performSearch(page);
  }, [searchParams, performSearch]);

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    setSearchParams(params);
  };

  return (
    <div className="space-y-6">
      {/* Results */}
      {error ? (
        <ErrorMessage message={error} onRetry={() => performSearch(pagination.currentPage)} />
      ) : (
        <>
          {!isLoading && movies.length > 0 && (
            <div className="text-sm text-slate-400">
              Tìm thấy {movies.length} kết quả
            </div>
          )}
          
          <MovieGrid movies={movies} isLoading={isLoading} />
          
          {!isLoading && movies.length > 0 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};
