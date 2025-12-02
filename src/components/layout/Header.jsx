import { Link, useNavigate } from 'react-router-dom';
import { Search, Home, Compass, Bookmark, Clock, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedSearch = searchTerm.trim();
    
    if (trimmedSearch.length > 0) {
      navigate(`/search?keyword=${encodeURIComponent(trimmedSearch)}`);
      setSearchTerm(''); // Clear input after search
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-700 bg-[#000000] backdrop-blur-sm">
      <div className="container mx-auto px-3 py-3 md:px-4 md:py-4">
        <div className="flex items-center justify-between gap-2 md:gap-4">
          {/* Logo - Tăng kích thước touch target */}
          <Link to="/" className="flex items-center space-x-2 min-h-[44px] min-w-[44px]">
            <div className="flex h-10 w-10 md:h-10 md:w-10 items-center justify-center rounded-lg bg-accent flex-shrink-0">
              <span className="text-xl font-bold font-heading">M</span>
            </div>
            <span className="hidden text-lg md:text-xl font-bold font-heading sm:inline-block">
              Fimio
            </span>
          </Link>

          {/* Search Bar - Tối ưu cho mobile, chiếm hết không gian còn lại */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-2 md:mx-0">
            <div className="relative">
              <Search className="absolute left-2 md:left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 md:pl-10 pr-3 h-10 md:h-auto bg-secondary border border-slate-700/30 rounded-md w-full
                  text-sm md:text-base
                  focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0
                  focus:border-slate-500 hover:border-slate-600 transition-colors"
              />
            </div>
          </form>

          {/* Desktop Navigation - Ẩn trên mobile */}
          <nav className="hidden md:flex items-center gap-2">
            <Link
              to="/home"
              className="flex items-center gap-2 rounded-lg px-3 py-2 min-h-[44px] text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground active:scale-95"
            >
              <Home className="h-4 w-4" />
              <span>Trang chủ</span>
            </Link>
            <Link
              to="/explore"
              className="flex items-center gap-2 rounded-lg px-3 py-2 min-h-[44px] text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground active:scale-95"
            >
              <Compass className="h-4 w-4" />
              <span>Khám phá</span>
            </Link>
            <Link
              to="/history"
              className="flex items-center gap-2 rounded-lg px-3 py-2 min-h-[44px] text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground active:scale-95"
            >
              <Clock className="h-4 w-4" />
              <span>Lịch sử</span>
            </Link>
            <Link
              to="/saved"
              className="flex items-center gap-2 rounded-lg px-3 py-2 min-h-[44px] text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground active:scale-95"
            >
              <Bookmark className="h-4 w-4" />
              <span>Đã lưu</span>
            </Link>
            <Link
              to="/profile"
              className="flex items-center gap-2 rounded-lg px-3 py-2 min-h-[44px] text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground active:scale-95"
            >
              <User className="h-4 w-4" />
              <span>Hồ sơ</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
