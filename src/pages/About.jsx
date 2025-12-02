import { Film, Search, Bookmark, Clock, Heart, Zap, Shield, Smartphone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function About() {
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
    <div className="container mx-auto px-4 py-12 space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 mb-4">
          <Film className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
          Giới thiệu về Fimio
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed">
          Fimio là nền tảng xem phim trực tuyến hiện đại, mang đến trải nghiệm giải trí tuyệt vời với kho phim phong phú và công nghệ tiên tiến.
        </p>
      </div>

      {/* Mission Section */}
      <Card className="border-slate-700 bg-gradient-to-br from-slate-800/50 to-slate-900/50">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Sứ mệnh của chúng tôi</h2>
          <p className="text-slate-300 leading-relaxed">
            Chúng tôi cam kết mang đến cho người dùng Việt Nam một nền tảng xem phim trực tuyến chất lượng cao, 
            hoàn toàn miễn phí với giao diện thân thiện và trải nghiệm mượt mà. Fimio không chỉ là nơi xem phim, 
            mà còn là không gian giải trí để bạn khám phá, lưu trữ và theo dõi những bộ phim yêu thích của mình.
          </p>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">Tính năng nổi bật</h2>
          <p className="text-slate-400">Khám phá những tính năng độc đáo của Fimio</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="border-slate-700 bg-slate-800/30 hover:bg-slate-800/60 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10 hover:border-accent/30"
              >
                <CardContent className="p-6 space-y-4">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.bgColor}`}>
                    <Icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-slate-700 bg-gradient-to-br from-red-500/10 to-transparent text-center">
          <CardContent className="p-8">
            <div className="text-4xl font-bold text-red-400 mb-2">30,000+</div>
            <p className="text-slate-400">Bộ phim trong kho</p>
          </CardContent>
        </Card>
        <Card className="border-slate-700 bg-gradient-to-br from-blue-500/10 to-transparent text-center">
          <CardContent className="p-8">
            <div className="text-4xl font-bold text-blue-400 mb-2">24/7</div>
            <p className="text-slate-400">Hoạt động liên tục</p>
          </CardContent>
        </Card>
        <Card className="border-slate-700 bg-gradient-to-br from-green-500/10 to-transparent text-center">
          <CardContent className="p-8">
            <div className="text-4xl font-bold text-green-400 mb-2">100%</div>
            <p className="text-slate-400">Miễn phí</p>
          </CardContent>
        </Card>
      </div>


      {/* Contact Section */}
      <Card className="border-slate-700 bg-gradient-to-br from-slate-800/50 to-slate-900/50">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">📧 Liên hệ với chúng tôi</h2>
          <p className="text-slate-400 mb-6">
            Nếu bạn có bất kỳ câu hỏi, góp ý hoặc cần hỗ trợ, đừng ngần ngại liên hệ với chúng tôi!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="mailto:support@fimio.com" 
              className="px-6 py-3 bg-accent hover:bg-accent/90 rounded-lg font-semibold transition-colors"
            >
              Email: support@fimio.com
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
