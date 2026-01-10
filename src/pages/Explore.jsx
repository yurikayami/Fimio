import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MovieGrid } from '@/components/movie/MovieGrid';
import { Pagination } from '@/components/common/Pagination';
import { getMoviesByType } from '@/services/api';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { FilterCombobox } from '@/components/common/FilterCombobox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SlidersHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Explore = () => {
  const [searchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [pageInput, setPageInput] = useState('1');

  // Filters - Initialize category from URL query param
  const [typeList, setTypeList] = useState('phim-le');
  const [category, setCategory] = useState(() => searchParams.get('category') || 'all');
  const [country, setCountry] = useState(() => searchParams.get('country') || 'all');

  // Sync state with URL params on navigation (e.g. clicking from MovieDetail)
  useEffect(() => {
    const catParam = searchParams.get('category');
    if (catParam && catParam !== category) {
      setCategory(catParam);
    }
    
    const countryParam = searchParams.get('country');
    if (countryParam && countryParam !== country) {
      setCountry(countryParam);
    }
  }, [searchParams, category, country]);
  const [year, setYear] = useState('all');
  const [sortType, setSortType] = useState('desc');

  const currentYear = new Date().getFullYear();

  const loadMovies = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getMoviesByType(typeList, {
        page: currentPage,
        limit: 30,
        category: category !== 'all' ? category : '',
        country: country !== 'all' ? country : '',
        year: year !== 'all' ? year : '',
        sort_field: 'modified.time',
        sort_type: sortType,
      });

      if (response.status && response.items) {
        setMovies(response.items);
        setTotalPages(response.pagination?.totalPages || 1);
      } else {
        setMovies([]);
      }
    } catch (err) {
      console.error(err);
      setError('Không thể tải danh sách phim. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  }, [typeList, category, country, year, sortType, currentPage]);

  useEffect(() => {
    loadMovies();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [loadMovies]);

  // Update pageInput when currentPage changes from pagination
  useEffect(() => {
    setPageInput(currentPage.toString());
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setPageInput(page.toString());
  };

  const handlePageInputChange = (e) => {
    const value = e.target.value;
    setPageInput(value);
  };

  const handleGoToPage = () => {
    const pageNum = parseInt(pageInput, 10);
    if (!isNaN(pageNum) && pageNum > 0 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    } else {
      setPageInput(currentPage.toString());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleGoToPage();
    }
  };

  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setCategory('all');
    setCountry('all');
    setYear('all');
    setSortType('desc');
    handleFilterChange();
  };

  const years = Array.from({ length: 20 }, (_, i) => currentYear - i);

  // Human readable labels for typeList values
  const typeLabels = {
    'phim-le': 'Phim Lẻ',
    'phim-bo': 'Phim Bộ',
    'hoat-hinh': 'Hoạt Hình',
    'tv-shows': 'TV Shows',
    'phim-vietsub': 'Phim Vietsub',
    'phim-thuyet-minh': 'Phim Thuyết Minh',
    'phim-long-tieng': 'Phim Lồng Tiếng'
  };

  // Hardcoded categories
  const categoriesList = [
    { slug: 'hanh-dong', name: 'Hành động' },
    { slug: 'co-trang', name: 'Cổ trang' },
    { slug: 'chien-tranh', name: 'Chiến tranh' },
    { slug: 'vien-tuong', name: 'Viễn tưởng' },
    { slug: 'kinh-di', name: 'Kinh dị' },
    { slug: 'tai-lieu', name: 'Tài liệu' },
    { slug: 'bi-an', name: 'Bí ẩn' },
    { slug: 'phim-18-cong', name: 'Phim 18+' },
    { slug: 'tinh-cam', name: 'Tình cảm' },
    { slug: 'tam-ly', name: 'Tâm lý' },
    { slug: 'the-thao', name: 'Thể thao' },
    { slug: 'phieu-luu', name: 'Phiêu lưu' },
    { slug: 'am-nhac', name: 'Âm nhạc' },
    { slug: 'gia-dinh', name: 'Gia đình' },
    { slug: 'hoc-duong', name: 'Học đường' },
    { slug: 'hai-huoc', name: 'Hài hước' },
    { slug: 'hinh-su', name: 'Hình sự' },
    { slug: 'vo-thuat', name: 'Võ thuật' },
    { slug: 'khoa-hoc', name: 'Khoa học' },
    { slug: 'than-thoai', name: 'Thần thoại' },
    { slug: 'chinh-kich', name: 'Chính kịch' },
    { slug: 'kinh-dien', name: 'Kinh điển' }
  ];

  // Hardcoded countries
  const countriesList = [
    { slug: 'trung-quoc', name: 'Trung Quốc' },
    { slug: 'thai-lan', name: 'Thái Lan' },
    { slug: 'hong-kong', name: 'Hồng Kông' },
    { slug: 'phap', name: 'Pháp' },
    { slug: 'duc', name: 'Đức' },
    { slug: 'ha-lan', name: 'Hà Lan' },
    { slug: 'mexico', name: 'Mexico' },
    { slug: 'thuy-dien', name: 'Thụy Điển' },
    { slug: 'philippines', name: 'Philippines' },
    { slug: 'dan-mach', name: 'Đan Mạch' },
    { slug: 'thuy-si', name: 'Thụy Sỹ' },
    { slug: 'ukraina', name: 'Ukraina' },
    { slug: 'han-quoc', name: 'Hàn Quốc' },
    { slug: 'au-my', name: 'Âu Mỹ' },
    { slug: 'an-do', name: 'Ấn Độ' },
    { slug: 'canada', name: 'Canada' },
    { slug: 'tay-ban-nha', name: 'Tây Ban Nha' },
    { slug: 'indonesia', name: 'Indonesia' },
    { slug: 'ba-lan', name: 'Ba Lan' },
    { slug: 'malaysia', name: 'Malaysia' },
    { slug: 'bo-dao-nha', name: 'Bồ Đào Nha' },
    { slug: 'uae', name: 'UAE' },
    { slug: 'chau-phi', name: 'Châu Phi' },
    { slug: 'a-rap-xe-ut', name: 'Ả Rập Xê-út' },
    { slug: 'nhat-ban', name: 'Nhật Bản' },
    { slug: 'dai-loan', name: 'Đài Loan' },
    { slug: 'anh', name: 'Anh' },
    { slug: 'tho-nhi-ky', name: 'Thổ Nhĩ Kỳ' },
    { slug: 'nga', name: 'Nga' },
    { slug: 'uc', name: 'Úc' },
    { slug: 'brazil', name: 'Brazil' },
    { slug: 'y', name: 'Ý' },
    { slug: 'na-uy', name: 'Na Uy' },
    { slug: 'nam-phi', name: 'Nam Phi' },
    { slug: 'viet-nam', name: 'Việt Nam' },
    { slug: 'quoc-gia-khac', name: 'Quốc gia khác' }
  ];

  return (
    <div className="flex flex-1">
      <div className="w-full mx-auto px-4 md:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-4 md:gap-8 min-h-screen">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex items-center justify-between mb-3 md:mb-4">
          <h1 className="text-xl md:text-2xl font-heading font-bold">Khám phá</h1>
        <Button variant="outline" onClick={() => setShowMobileFilters(true)} className="min-h-[44px] h-11 active:scale-95">
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Bộ lọc
        </Button>
      </div>

      {/* Sidebar Filters - Desktop & Mobile Overlay */}
      <aside className={cn(
        "lg:w-72 flex-shrink-0",
        showMobileFilters ? "fixed inset-0 z-50 bg-black/95 backdrop-blur-sm p-4 overflow-y-auto" : "hidden lg:block"
      )}>
        <Card className="border-slate-700 bg-slate-900/95">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base md:text-lg">Bộ lọc tìm kiếm</CardTitle>
              {showMobileFilters && (
                <Button variant="ghost" size="icon" onClick={() => setShowMobileFilters(false)} className="lg:hidden min-h-[44px] min-w-[44px] active:scale-95">
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3 md:space-y-4">
            {/* Type Filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Loại phim</label>
              <FilterCombobox
                options={[
                  { value: 'phim-le', label: 'Phim lẻ' },
                  { value: 'phim-bo', label: 'Phim bộ' },
                  { value: 'tv-shows', label: 'TV Shows' },
                  { value: 'hoat-hinh', label: 'Hoạt hình' },
                  { value: 'phim-vietsub', label: 'Phim Vietsub' },
                  { value: 'phim-thuyet-minh', label: 'Phim Thuyết Minh' },
                  { value: 'phim-long-tieng', label: 'Phim Lồng Tiếng' },
                ]}
                value={typeList}
                onValueChange={(val) => {
                  setTypeList(val);
                  handleFilterChange();
                }}
                placeholder="Chọn loại phim"
                searchPlaceholder="Tìm loại phim..."
              />
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Thể loại</label>
              <FilterCombobox
                options={[
                  { value: 'all', label: 'Tất cả thể loại' },
                  ...categoriesList.map((cat) => ({ value: cat.slug, label: cat.name }))
                ]}
                value={category}
                onValueChange={(val) => {
                  setCategory(val);
                  handleFilterChange();
                }}
                placeholder="Chọn thể loại"
                searchPlaceholder="Tìm thể loại..."
              />
            </div>

            {/* Country Filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Quốc gia</label>
              <FilterCombobox
                options={[
                  { value: 'all', label: 'Tất cả quốc gia' },
                  ...countriesList.map((c) => ({ value: c.slug, label: c.name }))
                ]}
                value={country}
                onValueChange={(val) => {
                  setCountry(val);
                  handleFilterChange();
                }}
                placeholder="Chọn quốc gia"
                searchPlaceholder="Tìm quốc gia..."
              />
            </div>

            {/* Year Filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Năm phát hành</label>
              <FilterCombobox
                options={[
                  { value: 'all', label: 'Tất cả năm' },
                  ...years.map((y) => ({ value: y.toString(), label: y.toString() }))
                ]}
                value={year}
                onValueChange={(val) => {
                  setYear(val);
                  handleFilterChange();
                }}
                placeholder="Chọn năm"
                searchPlaceholder="Tìm năm..."
              />
            </div>

            {/* Sort Filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Sắp xếp</label>
              <FilterCombobox
                options={[
                  { value: 'desc', label: 'Mới nhất' },
                  { value: 'asc', label: 'Cũ nhất' },
                ]}
                value={sortType}
                onValueChange={(val) => {
                  setSortType(val);
                  handleFilterChange();
                }}
                placeholder="Chọn thứ tự"
                searchPlaceholder="Tìm thứ tự..."
              />
            </div>

            <div className="pt-2 space-y-2">
              <Button 
                variant="outline" 
                className="w-full border-slate-600 text-slate-200 hover:bg-slate-800"
                onClick={clearFilters}
              >
                <X className="h-4 w-4 mr-2" />
                Xóa bộ lọc
              </Button>
              
              {showMobileFilters && (
                <Button 
                  className="w-full hover:bg-red-700"
                  onClick={() => setShowMobileFilters(false)}
                >
                  Áp dụng
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <div className="hidden lg:flex items-center justify-between mb-6">
          <h1 className="text-3xl font-heading font-bold">{typeLabels[typeList] || 'TV Shows'}</h1>
          <div className="text-sm text-muted-foreground">
            {movies.length > 0 ? `Hiển thị trang ${currentPage}` : ''}
          </div>
        </div>

        {error ? (
          <ErrorMessage message={error} onRetry={loadMovies} />
        ) : (
          <>
            <MovieGrid movies={movies} isLoading={isLoading} />
            {!isLoading && movies.length > 0 && (
              <div className="mt-8 space-y-4">
                 <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
                
                {/* Go to specific page input */}
                <div className="flex items-center justify-center gap-2 mt-6">
                  <label htmlFor="page-input" className="text-sm text-slate-400">
                    Đi đến trang:
                  </label>
                  <Input
                    id="page-input"
                    type="number"
                    min="1"
                    max={totalPages}
                    value={pageInput}
                    onChange={handlePageInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Nhập số trang"
                    className="w-20 h-10 text-center border-slate-600"
                  />
                  <Button 
                    onClick={handleGoToPage}
                    className="h-10 px-4 bg-red-600 hover:bg-red-700"
                  >
                    Đi
                  </Button>
                  <span className="text-sm text-slate-400 ml-2">
                    / {totalPages}
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      </div>
    </div>
  );
};