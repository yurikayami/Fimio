import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const maxVisible = 5;
    const pages = [];

    if (totalPages <= maxVisible + 2) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always show first page
    pages.push(1);

    let start = Math.max(2, currentPage - Math.floor((maxVisible - 2) / 2));
    let end = Math.min(totalPages - 1, currentPage + Math.ceil((maxVisible - 2) / 2) - 1);

    // Adjust if we're at the beginning
    if (currentPage <= Math.ceil(maxVisible / 2)) {
      end = maxVisible - 1;
      start = 2;
    }
    // Adjust if we're at the end
    else if (currentPage > totalPages - Math.ceil(maxVisible / 2)) {
      start = totalPages - maxVisible + 2;
      end = totalPages - 1;
    }

    // Add ellipsis after first page if needed
    if (start > 2) {
      pages.push('...');
    }

    // Add middle pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add ellipsis before last page if needed
    if (end < totalPages - 1) {
      pages.push('...');
    }

    // Always show last page
    pages.push(totalPages);

    return pages;
  };

  const pageNumbers = getPageNumbers();

  const handlePageClick = (page) => {
    if (page !== '...' && page !== currentPage) {
      onPageChange(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex items-center justify-center gap-1.5 md:gap-2 mt-6 md:mt-8 px-4">
      {/* Previous Button - Tăng touch target */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-10 w-10 md:h-9 md:w-9 min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 active:scale-95"
      >
        <ChevronLeft className="h-4 w-4 md:h-4 md:w-4" />
      </Button>

      {/* Page Numbers - Ẩn một số trang trên mobile */}
      <div className="flex gap-1">
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <div
                key={`ellipsis-${index}`}
                className="hidden sm:flex h-10 w-10 md:h-9 md:w-9 items-center justify-center text-muted-foreground text-sm md:text-base"
              >
                ...
              </div>
            );
          }

          // Trên mobile, chỉ hiển thị trang hiện tại và các trang gần nó
          const shouldShowOnMobile = 
            page === 1 || 
            page === totalPages || 
            Math.abs(page - currentPage) <= 1;

          return (
            <Button
              key={page}
              variant={page === currentPage ? 'default' : 'outline'}
              size="icon"
              onClick={() => handlePageClick(page)}
              className={cn(
                'h-10 w-10 md:h-9 md:w-9 min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 text-sm md:text-base active:scale-95',
                page === currentPage && 'bg-accent text-accent-foreground',
                !shouldShowOnMobile && 'hidden sm:flex'
              )}
            >
              {page}
            </Button>
          );
        })}
      </div>

      {/* Next Button - Tăng touch target */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-10 w-10 md:h-9 md:w-9 min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 active:scale-95"
      >
        <ChevronRight className="h-4 w-4 md:h-4 md:w-4" />
      </Button>
    </div>
  );
};
