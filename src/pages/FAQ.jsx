import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export function FAQ() {
  const [openItems, setOpenItems] = useState({});

  const faqs = [
    {
      question: 'Fimio là gì?',
      answer: 'Fimio là nền tảng xem phim trực tuyến miễn phí với kho phim đa dạng từ khắp nơi trên thế giới. Bạn có thể tìm kiếm, lưu phim yêu thích và theo dõi lịch sử xem phim của mình.',
    },
    {
      question: 'Có cần phải trả tiền để sử dụng Fimio không?',
      answer: 'Không, Fimio hoàn toàn miễn phí. Bạn không cần trả bất kỳ khoản phí nào để xem phim. Không có chi phí ẩn, không cần đăng ký tài khoản',
    },
    {
      question: 'Làm cách nào để lưu phim yêu thích?',
      answer: 'Khi bạn xem một bộ phim, bạn sẽ thấy biểu tượng bookmar ở trang chi tiết phim. Click vào nó để lưu phim vào danh sách "Phim Yêu Thích". Bạn có thể xem danh sách của mình bất kỳ lúc nào.',
    },
    {
      question: 'Có thể xem lại phim đã xem trước đó không?',
      answer: 'Có, Fimio sẽ lưu lịch sử xem của bạn. Bạn có thể truy cập phần "Lịch Sử Xem" để xem lại các bộ phim bạn đã xem trước đó và tiếp tục từ tập cuối cùng bạn xem.',
    },
    {
      question: 'Chất lượng phim như thế nào?',
      answer: 'Fimio cung cấp phim với nhiều chất lượng khác nhau bao gồm HD, Full HD và 4K (tùy thuộc vào nguồn phim). Chất lượng sẽ tự động điều chỉnh dựa trên tốc độ kết nối của bạn.',
    },
    {
      question: 'Làm cách nào để liên hệ hỗ trợ kỹ thuật?',
      answer: 'Nếu bạn gặp vấn đề kỹ thuật, vui lòng liên hệ với chúng tôi qua email: support@fimio.com hoặc gọi: +84 (123) 456-789. Chúng tôi sẽ hỗ trợ bạn trong thời gian sớm nhất.',
    },
    {
      question: 'Có những phim phụ đề Tiếng Việt không?',
      answer: 'Có, Fimio cung cấp nhiều bộ phim với phụ đề Tiếng Việt. Bạn có thể lọc theo phụ đề khi tìm kiếm phim hoặc chọn phụ đề từ trình phát video.',
    },
    {
      question: 'Có thể xem phim trên di động không?',
      answer: 'Có, Fimio hoàn toàn tương thích với các thiết bị di động như điện thoại và máy tính bảng. Bạn có thể xem phim trên bất kỳ thiết bị nào với kết nối internet.',
    },
  ];

  const toggleItem = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Câu hỏi thường gặp
          </h1>
          <p className="text-lg text-slate-400">
            Tìm câu trả lời cho những câu hỏi phổ biến về Fimio
          </p>
        </div>

        {/* FAQs */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card 
              key={index}
              className="border-slate-700 bg-slate-800/30 cursor-pointer hover:bg-slate-800/60 transition-all duration-300 overflow-hidden"
              onClick={() => toggleItem(index)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                  <CardTitle className="text-lg text-white text-left pr-4">
                    {faq.question}
                  </CardTitle>
                  <ChevronDown 
                    className={`w-5 h-5 text-accent flex-shrink-0 transition-transform duration-300 ${
                      openItems[index] ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </CardHeader>

              {openItems[index] && (
                <CardContent className="pt-0 animate-in fade-in duration-300">
                  <p className="text-slate-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Contact Section */}
        <Card className="border-slate-700 bg-gradient-to-br from-accent/10 to-transparent mt-12">
          <CardContent className="p-8 text-center space-y-4">
            <h3 className="text-2xl font-bold text-white">Không tìm thấy câu trả lời?</h3>
            <p className="text-slate-400">
              Vui lòng liên hệ với chúng tôi để được hỗ trợ
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
              <a href="mailto:support@fimio.com" className="px-6 py-2 bg-accent hover:bg-accent/90 rounded-lg text-white font-semibold transition-colors">
                Email: support@fimio.com
              </a>
              <a href="tel:+84123456789" className="px-6 py-2 border border-accent text-accent hover:bg-accent/10 rounded-lg font-semibold transition-colors">
                Gọi: +84 (123) 456-789
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
