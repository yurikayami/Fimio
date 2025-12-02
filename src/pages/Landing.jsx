import { Link } from 'react-router-dom';
import { Film, Search, Bookmark, Clock, Heart, Zap, Shield, Smartphone, ArrowRight, Play, Star, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function Landing() {
  const features = [
    {
      icon: Search,
      title: 'Tìm kiếm thông minh',
      description: 'Tìm kiếm phim nhanh chóng với bộ lọc theo thể loại, quốc gia, năm phát hành và nhiều tiêu chí khác.',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: Film,
      title: 'Kho phim đa dạng',
      description: 'Hàng nghìn bộ phim từ khắp nơi trên thế giới, cập nhật liên tục với chất lượng cao.',
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
    },
    {
      icon: Bookmark,
      title: 'Lưu phim yêu thích',
      description: 'Dễ dàng lưu lại các bộ phim bạn thích để xem lại bất cứ lúc nào.',
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10',
    },
    {
      icon: Clock,
      title: 'Lịch sử xem',
      description: 'Theo dõi lịch sử xem phim và tiếp tục từ tập phim bạn đã dừng lại.',
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: Zap,
      title: 'Tốc độ cao',
      description: 'Giao diện mượt mà, tải nhanh với công nghệ tối ưu hóa hiện đại.',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
    },
    {
      icon: Shield,
      title: 'An toàn & bảo mật',
      description: 'Dữ liệu của bạn được lưu trữ an toàn với công nghệ mã hóa.',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
    {
      icon: Heart,
      title: 'Giao diện thân thiện',
      description: 'Thiết kế hiện đại, dễ sử dụng với trải nghiệm người dùng tuyệt vời.',
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
    },
    {
      icon: Smartphone,
      title: 'Responsive',
      description: 'Tương thích hoàn hảo trên mọi thiết bị: máy tính, tablet và điện thoại.',
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px]"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center space-y-8">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 shadow-2xl shadow-red-500/50 mb-8 animate-float">
            <Film className="w-12 h-12 text-white" />
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
            <span className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent animate-gradient">
              Fimio
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Nền tảng xem phim trực tuyến hiện đại với kho phim khổng lồ,
            <br />
            <span className="text-accent font-semibold">hoàn toàn miễn phí</span> và trải nghiệm tuyệt vời
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 py-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-red-400 mb-2">30,000+</div>
              <div className="text-sm text-slate-400">Bộ phim</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">24/7</div>
              <div className="text-sm text-slate-400">Trực tuyến</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-green-400 mb-2">100%</div>
              <div className="text-sm text-slate-400">Miễn phí</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link to="/home">
              <Button className="group bg-accent hover:bg-accent/90 text-white px-8 py-6 text-lg rounded-xl shadow-2xl shadow-accent/50 transition-all duration-300 hover:scale-105">
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Bắt đầu xem ngay
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="#features">
              <Button variant="outline" className="border-2 border-slate-700 hover:border-accent bg-transparent hover:bg-accent/10 text-white px-8 py-6 text-lg rounded-xl transition-all duration-300">
                Khám phá tính năng
              </Button>
            </a>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 pt-12 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-400" />
              <span>An toàn & bảo mật</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span>Tốc độ cao</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-orange-400" />
              <span>Chất lượng HD/4K</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-slate-600 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-slate-500 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent">
                Tính năng nổi bật
              </span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Trải nghiệm xem phim đỉnh cao với các tính năng được thiết kế tối ưu cho người dùng
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index}
                  className="border-slate-700 bg-slate-800/30 backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-300 hover:shadow-xl hover:shadow-accent/10 hover:border-accent/30 hover:-translate-y-2 group"
                >
                  <CardContent className="p-6 space-y-4">
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${feature.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-7 h-7 ${feature.color}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-accent transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Fimio Section */}
      <section className="relative py-24 px-4 bg-gradient-to-b from-transparent via-slate-900/50 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent">
                Tại sao chọn Fimio?
              </span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Những lý do hàng đầu khiến người dùng yêu thích Fimio
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <Card className="border-slate-700 bg-gradient-to-br from-red-500/10 to-transparent backdrop-blur-sm hover:shadow-xl hover:shadow-red-500/20 transition-all duration-300 group">
              <CardContent className="p-8 space-y-4">
                <div className="w-14 h-14 rounded-xl bg-red-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Star className="w-7 h-7 text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Chất lượng cao</h3>
                <p className="text-slate-400 leading-relaxed">
                  Phim HD, Full HD và 4K với âm thanh sống động. Trải nghiệm xem phim như rạp chiếu phim tại nhà.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="border-slate-700 bg-gradient-to-br from-blue-500/10 to-transparent backdrop-blur-sm hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 group">
              <CardContent className="p-8 space-y-4">
                <div className="w-14 h-14 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Cập nhật liên tục</h3>
                <p className="text-slate-400 leading-relaxed">
                  Phim mới được cập nhật hàng ngày. Không bỏ lỡ bất kỳ bộ phim hot nào đang được săn đón.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="border-slate-700 bg-gradient-to-br from-green-500/10 to-transparent backdrop-blur-sm hover:shadow-xl hover:shadow-green-500/20 transition-all duration-300 group">
              <CardContent className="p-8 space-y-4">
                <div className="w-14 h-14 rounded-xl bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Zap className="w-7 h-7 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Không quảng cáo phiền nhiễu</h3>
                <p className="text-slate-400 leading-relaxed">
                  Trải nghiệm xem phim mượt mà, không bị gián đoạn bởi quảng cáo dài và phiền phức.
                </p>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="border-slate-700 bg-gradient-to-br from-purple-500/10 to-transparent backdrop-blur-sm hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 group">
              <CardContent className="p-8 space-y-4">
                <div className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Heart className="w-7 h-7 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Hoàn toàn miễn phí</h3>
                <p className="text-slate-400 leading-relaxed">
                  Không cần đăng ký, không cần thanh toán. Xem phim bao nhiêu tùy thích, không giới hạn.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Sẵn sàng trải nghiệm?
          </h2>
          <p className="text-xl text-slate-400">
            Hàng nghìn bộ phim đang chờ bạn khám phá
          </p>
          <Link to="/home">
            <Button className="group bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 hover:from-red-600 hover:via-pink-600 hover:to-purple-600 text-white px-12 py-8 text-xl rounded-2xl shadow-2xl shadow-accent/50 transition-all duration-300 hover:scale-110">
              <Play className="w-6 h-6 mr-3 group-hover:scale-125 transition-transform" />
              Vào trang chủ ngay
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center text-slate-500 text-sm">
          <p>© 2025 Fimio. Tất cả quyền được bảo lưu.</p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
