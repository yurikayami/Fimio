import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Clock, Bookmark, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export const BottomNavigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/home', label: 'Trang chủ', icon: Home },
    { path: '/explore', label: 'Khám phá', icon: Compass },
    { path: '/history', label: 'Lịch sử', icon: Clock },
    { path: '/saved', label: 'Đã lưu', icon: Bookmark },
    { path: '/profile', label: 'Hồ sơ', icon: User },
  ];

  const isActive = (path) => {
    if (path === '/home' && location.pathname === '/') return false;
    return location.pathname === path || location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Bottom Navigation - Chỉ hiển thị trên mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-slate-700/80 bg-[#000000] backdrop-blur-xl shadow-[0_-4px_12px_rgba(0,0,0,0.8)]">
        <div className="flex items-center justify-around pb-safe">
          {navItems.map(({ path, label, icon }) => {
            const active = isActive(path);
            const Icon = icon;

            return (
              <Link
                key={path}
                to={path}
                className={cn(
                  'flex flex-col items-center justify-center flex-1 py-3 px-2 text-center transition-all duration-200 active:scale-90 min-h-[68px] touch-manipulation gap-1',
                  active
                    ? 'text-accent'
                    : 'text-slate-400 hover:text-white'
                )}
                title={label}
              >
                <Icon className="h-6 w-6 flex-shrink-0" strokeWidth={active ? 2.5 : 2} />
                <span className="text-[11px] font-medium leading-tight whitespace-nowrap">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
      {/* Spacer để content không bị che bởi fixed bottom nav */}
      <div className="md:hidden h-[68px] pb-safe" />
    </>
  );
};
