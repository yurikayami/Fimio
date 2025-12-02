import { Card, CardContent } from '@/components/ui/card';

export function Terms() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-12 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Điều Khoản Dịch Vụ
          </h1>
          <p className="text-slate-400">
            Cập nhật lần cuối: Tháng 12, 2025
          </p>
        </div>

        {/* Terms Content */}
        <div className="space-y-8">
          {/* Section 1 */}
          <Card className="border-slate-700 bg-slate-800/30">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-2xl font-bold text-white">1. Chấp Nhận Điều Khoản</h2>
              <p className="text-slate-400 leading-relaxed">
                Bằng cách truy cập và sử dụng Fimio, bạn chấp nhận tuân theo những điều khoản này. 
                Nếu bạn không đồng ý với bất kỳ phần nào của những điều khoản này, vui lòng không sử dụng dịch vụ của chúng tôi.
              </p>
            </CardContent>
          </Card>

          {/* Section 2 */}
          <Card className="border-slate-700 bg-slate-800/30">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-2xl font-bold text-white">2. Sử Dụng Hợp Pháp</h2>
              <p className="text-slate-400 leading-relaxed">
                Bạn đồng ý rằng:
              </p>
              <ul className="list-disc list-inside text-slate-400 space-y-2 ml-2">
                <li>Sẽ không sử dụng Fimio cho bất kỳ mục đích bất hợp pháp nào</li>
                <li>Sẽ không cố gắng truy cập hoặc phá vỡ hệ thống bảo mật của chúng tôi</li>
                <li>Sẽ không phân phối lại hoặc bán lại nội dung từ Fimio</li>
                <li>Sẽ tuân thủ tất cả các luật pháp và quy định hiện hành</li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 3 */}
          <Card className="border-slate-700 bg-slate-800/30">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-2xl font-bold text-white">3. Quyền Sở Hữu Trí Tuệ</h2>
              <p className="text-slate-400 leading-relaxed">
                Tất cả nội dung trên Fimio, bao gồm nhưng không giới hạn đến các bộ phim, 
                hình ảnh, văn bản, được bảo vệ bởi luật bản quyền quốc tế. 
                Bạn được phép xem nội dung cho mục đích cá nhân, không thương mại.
              </p>
            </CardContent>
          </Card>

          {/* Section 4 */}
          <Card className="border-slate-700 bg-slate-800/30">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-2xl font-bold text-white">4. Miễn Trừ Trách Nhiệm</h2>
              <p className="text-slate-400 leading-relaxed">
                Fimio được cung cấp "như hiện tại". Chúng tôi không bảo đảm rằng dịch vụ sẽ 
                không bị gián đoạn hoặc miễn lỗi. Chúng tôi không chịu trách nhiệm về bất kỳ 
                thiệt hại gián tiếp, ngẫu nhiên hoặc hệ quả nào phát sinh từ việc sử dụng dịch vụ.
              </p>
            </CardContent>
          </Card>

          {/* Section 5 */}
          <Card className="border-slate-700 bg-slate-800/30">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-2xl font-bold text-white">5. Dữ Liệu Cá Nhân & Quyền Riêng Tư</h2>
              <p className="text-slate-400 leading-relaxed">
                Chúng tôi cam kết bảo vệ quyền riêng tư của bạn. Dữ liệu của bạn được lưu trữ 
                an toàn và sẽ không được chia sẻ với bên thứ ba mà không có sự đồng ý của bạn. 
                Xin tham khảo Chính Sách Bảo Mật của chúng tôi để biết thêm chi tiết.
              </p>
            </CardContent>
          </Card>

          {/* Section 6 */}
          <Card className="border-slate-700 bg-slate-800/30">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-2xl font-bold text-white">6. Hạn Chế Sử Dụng</h2>
              <p className="text-slate-400 leading-relaxed">
                Bạn không được phép:
              </p>
              <ul className="list-disc list-inside text-slate-400 space-y-2 ml-2">
                <li>Tải xuống hoặc lưu trữ nội dung mà không có phép</li>
                <li>Sử dụng Fimio cho mục đích phát sóng công khai hoặc thương mại</li>
                <li>Thay đổi, dịch hoặc tạo tác phẩm phái sinh từ nội dung</li>
                <li>Sử dụng công cụ tự động để truy cập Fimio</li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 7 */}
          <Card className="border-slate-700 bg-slate-800/30">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-2xl font-bold text-white">7. Chấm Dứt Dịch Vụ</h2>
              <p className="text-slate-400 leading-relaxed">
                Fimio có quyền chấm dứt hoặc tạm ngưng quyền truy cập của bạn nếu bạn vi phạm 
                bất kỳ điều khoản nào được quy định trong Thỏa Thuận này.
              </p>
            </CardContent>
          </Card>

          {/* Section 8 */}
          <Card className="border-slate-700 bg-slate-800/30">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-2xl font-bold text-white">8. Thay Đổi Điều Khoản</h2>
              <p className="text-slate-400 leading-relaxed">
                Chúng tôi có quyền sửa đổi những điều khoản này bất kỳ lúc nào. Việc sử dụng 
                dịch vụ tiếp tục sau khi các thay đổi được đăng lên có nghĩa là bạn chấp nhận 
                những thay đổi đó.
              </p>
            </CardContent>
          </Card>

          {/* Section 9 */}
          <Card className="border-slate-700 bg-slate-800/30">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-2xl font-bold text-white">9. Luật Pháp & Quản Độc Lập</h2>
              <p className="text-slate-400 leading-relaxed">
                Những Điều Khoản này được chi phối bởi pháp luật của Việt Nam. 
                Bất kỳ tranh chấp nào phát sinh từ hoặc liên quan đến Điều Khoản này 
                sẽ được giải quyết dưới các luật pháp của Việt Nam.
              </p>
            </CardContent>
          </Card>

          {/* Section 10 */}
          <Card className="border-slate-700 bg-slate-800/30">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-2xl font-bold text-white">10. Liên Hệ</h2>
              <p className="text-slate-400 leading-relaxed">
                Nếu bạn có bất kỳ câu hỏi hoặc nhận xét về Điều Khoản này, vui lòng liên hệ với chúng tôi:
              </p>
              <div className="space-y-2 text-slate-300">
                <p>📧 Email: support@fimio.com</p>
                <p>📞 Điện thoại: +84 (123) 456-789</p>
                <p>📍 Địa chỉ: Tây Ninh, Việt Nam</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Note */}
        <Card className="border-slate-700 bg-accent/5 mt-12">
          <CardContent className="p-6 text-center">
            <p className="text-slate-400">
              © 2025 Fimio. Tất cả quyền được bảo lưu. 
              Bằng cách tiếp tục sử dụng Fimio, bạn chấp nhận Điều Khoản Dịch Vụ này.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
