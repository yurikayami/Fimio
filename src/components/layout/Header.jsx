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
    <header className="sticky top-0 z-40 w-full border-b border-slate-700 bg-[#000000]">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
              <span className="text-xl font-bold font-heading">M</span>
            </div>
            <span className="hidden text-xl font-bold font-heading sm:inline-block">
              Fimio
            </span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Tìm kiếm phim..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-secondary border border-slate-700/30 rounded-md w-full max-w-md
                  focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0
                  focus:border-slate-500 hover:border-slate-600 transition-colors"
              />
            </div>
          </form>

          {/* Navigation */}
          <nav className="flex items-center gap-2">
            <Link
              to="/home"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Trang chủ</span>
            </Link>
            <Link
              to="/explore"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <Compass className="h-4 w-4" />
              <span className="hidden sm:inline">Khám phá</span>
            </Link>
            <Link
              to="/history"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Lịch sử</span>
            </Link>
            <Link
              to="/saved"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <Bookmark className="h-4 w-4" />
              <span className="hidden sm:inline">Đã lưu</span>
            </Link>
            <Link
              to="/profile"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Hồ sơ</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
