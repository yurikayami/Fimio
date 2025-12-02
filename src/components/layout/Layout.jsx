import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Header } from './Header';
import { BottomNavigation } from './BottomNavigation';
import { Github, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export const Layout = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-1 w-full">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
          <Outlet />
        </div>
      </main>
      
      {/* Bottom Navigation - Mobile only */}
      <BottomNavigation />
      
      {/* Professional Footer - Ẩn trên mobile */}
      <footer className="hidden md:block border-t border-slate-700 bg-slate-900/50 mt-16 mb-2.5">
        <div className="container mx-auto px-4 pt-8">
          {/* Grid - Ẩn trên mobile, responsive trên desktop */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 hidden md:grid">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-heading font-bold text-white">Fimio</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Nền tảng xem phim trực tuyến hàng đầu với kho phim đa dạng từ các quốc gia trên thế giới.
              </p>
              {/* Social Media */}
              <div className="flex gap-3 pt-2">
                <a href="https://github.com/yurikayami/Fimio" className="p-2 rounded-lg bg-slate-800 hover:bg-accent transition-colors text-slate-300 hover:text-white">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-accent transition-colors text-slate-300 hover:text-white">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-accent transition-colors text-slate-300 hover:text-white">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-accent transition-colors text-slate-300 hover:text-white">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Khám Phá</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/home" className="text-slate-400 hover:text-accent transition-colors">Trang Chủ</Link></li>
                <li><Link to="/explore" className="text-slate-400 hover:text-accent transition-colors">Khám Phá</Link></li>
                <li><Link to="/saved" className="text-slate-400 hover:text-accent transition-colors">Phim Yêu Thích</Link></li>
                <li><Link to="/history" className="text-slate-400 hover:text-accent transition-colors">Lịch Sử Xem</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Hỗ Trợ</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="text-slate-400 hover:text-accent transition-colors">Giới Thiệu</Link></li>
                <li><Link to="/faq" className="text-slate-400 hover:text-accent transition-colors">Câu Hỏi Thường Gặp</Link></li>
                <li><Link to="/terms" className="text-slate-400 hover:text-accent transition-colors">Điều Khoản Dịch Vụ</Link></li>
                <li><a href="#" className="text-slate-400 hover:text-accent transition-colors">Liên Hệ</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Liên Hệ</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-slate-400 hover:text-accent transition-colors">
                  <Mail className="w-5 h-5" />
                  <a href="mailto:nguyengocphuc@fimio.com">support@fimio.com</a>
                </div>
                <div className="flex items-center gap-3 text-slate-400 hover:text-accent transition-colors">
                  <Phone className="w-5 h-5" />
                  <a href="tel:+84123456789">+84 (123) 456-789</a>
                </div>
                <div className="flex items-start gap-3 text-slate-400">
                  <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>Tây Ninh, Việt Nam</span>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-700 my-8" />

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              © 2025 Fimio. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-slate-400 hover:text-accent transition-colors">Chính Sách Bảo Mật</a>
              <Link to="/terms" className="text-slate-400 hover:text-accent transition-colors">Điều Khoản</Link>
              <a href="#" className="text-slate-400 hover:text-accent transition-colors">Cookie</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};