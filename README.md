# Fimio - Nền Tảng Xem Phim Online Miễn Phí

<div align="center">

**Khám phá hàng ngàn bộ phim, series, anime chất lượng cao — hoàn toàn miễn phí**

![Fimio](https://i.ibb.co/tTNSSGWY/Fimio.png)

[🌐 Truy Cập Website](#) • [📚 Tài Liệu](#) • [🐛 Báo Cáo Lỗi](#) • [💬 Liên Hệ](#)

</div>

---

## 📖 Giới Thiệu

**Fimio** là một nền tảng xem phim online hiện đại, được xây dựng bằng **React (Vite)**, **Tailwind CSS** và **Shadcn UI**. Ứng dụng cung cấp trải nghiệm xem phim mượt mà với giao diện thân thiện, tính năng tìm kiếm mạnh mẽ, và khả năng lưu phim yêu thích.

### Điểm Nổi Bật

- ✅ **Miễn Phí 100%** — Không phí đăng ký, không biện pháp ẩn
- 🎬 **Kho Phim Khổng Lồ** — Hàng ngàn bộ phim, series, anime
- 🚀 **Hiệu Suất Cao** — Tối ưu hóa tải nhanh, responsive
- 🔍 **Tìm Kiếm Thông Minh** — Lọc theo thể loại, quốc gia, năm
- 📱 **Mobile Friendly** — Tương thích tất cả thiết bị (desktop, tablet, mobile)
- 🎨 **Giao Diện Đẹp** — Dark mode, thiết kế hiện đại
- 💾 **Lưu Phim Yêu Thích** — Bookmark phim, theo dõi lịch sử xem
- 👤 **Quản Lý Hồ Sơ** — Tùy chỉnh avatar, banner, thống kê cá nhân

---

## 🎯 Tính Năng Chính

### 1. **Trang Chủ (Home)**

- 🎞️ Hero Section với slider các phim nổi bật
- 📺 Danh sách phim mới cập nhật theo danh mục:
  - Phim Hàn Quốc
  - Phim Mới Cập Nhật
  - Anime
  - Phim Cinema
  - Top 10 Phim Hot
- 🔥 Trending Movies & Recommended
- ⚡ Lazy loading hình ảnh để tối ưu hiệu suất

### 2. **Trang Khám Phá (Explore)**

- 🎯 Lọc phim theo:
  - Thể loại (Hành động, Tình cảm, Kinh dị, v.v.)
  - Quốc gia (Mỹ, Anh, Hàn Quốc, Nhật Bản, v.v.)
  - Năm phát hành
  - Sắp xếp (Mới nhất, Cũ nhất, Trending)
- 📄 Phân trang thông minh
- 📊 Grid view linh hoạt

### 3. **Chi Tiết Phim (Movie Detail)**

- 🎬 Poster, backdrop, metadata chi tiết
- 🎞️ Trình phát video tích hợp
- 📑 Danh sách tập phim/server
- 💬 Mô tả nội dung, diễn viên, đánh giá
- 🔖 Lưu/Xóa phim yêu thích
- 📊 Thống kê xem phim

### 4. **Tìm Kiếm (Search)**

- 🔎 Tìm kiếm thời gian thực
- ⚡ Debounce tối ưu
- 🎬 Kết quả từ các bộ phim, series, anime

### 5. **Kho Phim Đã Lưu (Saved Movies)**

- 📚 Xem danh sách phim đã bookmark
- ❌ Xóa phim khỏi danh sách yêu thích
- 💾 Lưu trữ tự động trên LocalStorage

### 6. **Lịch Sử Xem (Watch History)**

- ⏱️ Theo dõi các phim đã xem
- 🕐 Thời gian xem gần đây
- 🔄 Tiếp tục xem từ lần trước

### 7. **Hồ Sơ Người Dùng (User Profile)**

- 👤 Tùy chỉnh tên người dùng
- 🖼️ Tải lên avatar/banner tùy chỉnh
- 📊 Thống kê:
  - Tổng phim đã xem
  - Thời gian xem
  - Phim yêu thích
  - Danh sách lưu
- 💾 Lưu trữ dữ liệu trên LocalStorage

### 8. **Trang Tĩnh (Landing, FAQ, Terms)**

- 🏠 Landing Page với CTA
- ❓ FAQ — Câu hỏi thường gặp
- ⚖️ Điều khoản dịch vụ
- 📄 Trang về (About)

---

## 🛠️ Tech Stack

### Frontend

- **React 18+** — Thư viện UI hiện đại
- **Vite** — Build tool nhanh, hiệu suất cao
- **React Router v6** — Routing client-side
- **Tailwind CSS v3** — Utility-first CSS framework
- **Shadcn UI** — Thành phần UI component có sẵn
- **Lucide React** — Thư viện icon SVG

### Styling & UI

- **PostCSS** — CSS post-processing
- **Class Variance Authority** — Quản lý variant CSS
- **Tailwind Merge** — Merge Tailwind classes thông minh

### APIs & Data

- **PhimAPI** (phimapi.com) — Nguồn dữ liệu phim
- **Fetch API** — HTTP requests
- **LocalStorage** — Lưu trữ dữ liệu phía client

### Development Tools

- **ESLint** — Linter code
- **Node.js & npm** — Package manager & runtime

### Optimizations

- 📈 Image lazy loading
- 🎨 Code splitting (route-based + vendor)
- 📦 Tree-shaking icon library
- ⚡ Preload critical assets (preconnect, dns-prefetch)
- 🖼️ LQIP (Low Quality Image Placeholder)

---

## 📦 Cài Đặt

### Yêu Cầu Hệ Thống

- **Node.js** v16+
- **npm** v7+ (hoặc **yarn**, **pnpm**)

### Bước 1: Clone Repository

```bash
git clone https://github.com/your-username/fimio.git
cd fimio
```

### Bước 2: Cài Đặt Dependencies

```bash
npm install
```

### Bước 3: Chạy Development Server

```bash
npm run dev
```

Website sẽ mở ở `http://localhost:5173`

### Bước 4: Build cho Production

```bash
npm run build
```

### Bước 5: Preview Build

```bash
npm run preview
```

---

## 📁 Cấu Trúc Thư Mục

```
fimio/
├── public/                    # Static assets
│   └── favicon.svg
├── src/
│   ├── assets/               # Images, fonts
│   ├── components/           # React components
│   │   ├── common/          # Shared components (ErrorMessage, LoadingSkeleton, Pagination)
│   │   ├── home/            # Home page components (HeroSection, MovieGridSection)
│   │   ├── layout/          # Layout (Header, Footer, Layout wrapper)
│   │   ├── movie/           # Movie components (MovieCard, MovieDetail, VideoPlayer)
│   │   └── ui/              # Shadcn UI components (Button, Card, Input, Dialog, etc.)
│   ├── hooks/               # Custom React hooks
│   │   ├── useDebounce.js
│   │   ├── useImagePreload.js
│   │   └── useLocalStorage.js
│   ├── lib/                 # Utilities
│   │   ├── imageUtils.js
│   │   ├── lazyLoadUtils.js
│   │   ├── savedMovies.js
│   │   ├── userStats.js
│   │   ├── watchHistory.js
│   │   └── utils.js
│   ├── pages/               # Page components (Home, Explore, MovieDetail, Search, etc.)
│   ├── services/            # API services
│   │   └── api.js           # PhimAPI integration
│   ├── App.jsx              # Main app component & routing
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── index.html               # HTML entry file (với Open Graph meta tags)
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
├── eslint.config.js         # ESLint configuration
├── package.json             # Dependencies & scripts
└── README.md                # This file
```

---

## 🚀 Hướng Dẫn Sử Dụng

### Xem Phim

1. Truy cập trang chủ, tìm phim bạn muốn xem
2. Nhấp vào poster hoặc thẻ phim
3. Trên trang chi tiết, chọn tập hoặc server
4. Trình phát video sẽ hiển thị — nhấn Play để xem

### Tìm Kiếm Phim

1. Sử dụng thanh tìm kiếm trên header
2. Nhập tên phim, diễn viên, hoặc từ khóa
3. Xem kết quả tức thời

### Lọc & Khám Phá

1. Vào trang **Khám Phá**
2. Chọn bộ lọc: Thể loại, Quốc gia, Năm, Sắp xếp
3. Xem danh sách phim phù hợp

### Lưu Phim Yêu Thích

1. Trên trang chi tiết phim, nhấp nút **"Lưu Phim"**
2. Phim sẽ được lưu vào **Kho Phim của Tôi**
3. Để xóa, nhấp lại hoặc vào Kho Phim → Xóa

### Quản Lý Hồ Sơ

1. Vào **Hồ Sơ** từ menu
2. Nhấp **Chỉnh Sửa** để thay đổi:
   - Tên người dùng
   - Avatar (tải ảnh từ máy)
   - Banner (tải ảnh từ máy)
3. Nhấp **Lưu** để cập nhật

---

## 📊 Optimizations & Performance

- ⚡ **Image Optimization**: Lazy loading, LQIP placeholders
- 📦 **Code Splitting**: Route-based + vendor splitting
- 🎯 **Tree-Shaking**: Icon library tối ưu hóa
- 🔗 **Preconnect/DNS-Prefetch**: Kết nối sớm với API & CDN
- 🖼️ **Critical CSS**: Inline critical styles
- 📱 **Responsive Design**: Mobile-first approach
- ♿ **Accessibility**: ARIA labels, semantic HTML

---

## 🤝 Đóng Góp

Chúng tôi chào đón mọi đóng góp! Để bắt đầu:

### Fork & Clone

```bash
git clone https://github.com/your-username/fimio.git
cd fimio
git checkout -b feature/your-feature
```

### Commit & Push

```bash
git add .
git commit -m "✨ Add: Your awesome feature"
git push origin feature/your-feature
```

### Tạo Pull Request

- Mô tả rõ ràng thay đổi của bạn
- Tham chiếu issue liên quan (nếu có)
- Đảm bảo code không có lỗi ESLint

### Hướng Dẫn Style

- Sử dụng **Prettier** & **ESLint**
- Commit messages theo chuẩn Conventional Commits
- Kiểm tra mobile responsiveness trước khi PR

---

## 🐛 Báo Cáo Lỗi

Phát hiện lỗi? Vui lòng [tạo issue](https://github.com/your-username/fimio/issues) với thông tin:

1. **Mô tả lỗi** — Điều gì không hoạt động?
2. **Bước tái hiện** — Làm thế nào để tái hiện lỗi?
3. **Kết quả mong đợi** — Kết quả nên là gì?
4. **Screenshots/Video** — Thêm hình ảnh nếu có thể
5. **Environment** — Trình duyệt, OS, Node.js version

---

## 📝 Giấy Phép

Dự án này được cấp phép dưới **MIT License** — xem file [LICENSE](./LICENSE) để biết thêm chi tiết.

---

## 🙋 FAQ

### Q: Website sử dụng dữ liệu từ đâu?

**A:** Dữ liệu phim được lấy từ API công khai [PhimAPI](https://phimapi.com). Tất cả dữ liệu phim được cung cấp bởi các nhà cung cấp phim trực tuyến.

### Q: Có cần đăng ký để sử dụng?

**A:** Không! Fimio hoàn toàn miễn phí và không cần đăng ký. Tuy nhiên, hồ sơ và phim yêu thích được lưu trên thiết bị của bạn qua LocalStorage.

### Q: Tôi có thể tải phim về không?

**A:** Không, Fimio chỉ cho phép xem trực tuyến. Tuy nhiên, bạn có thể lưu phim vào danh sách yêu thích để truy cập nhanh.

### Q: Ứng dụng có phải trả phí hosting không?

**A:** Hosting domain được tính phí thương mại, nhưng code nguồn hoàn toàn miễn phí. Bạn có thể self-host trên server của riêng bạn.

### Q: Làm cách nào để liên hệ với đội ngũ?

**A:** Vui lòng gửi email hoặc tạo issue trên GitHub.

---

## 📞 Liên Hệ

- **Website**: https://fimio.com
- **Email**: support@fimio.com
- **GitHub**: https://github.com/your-username/fimio
- **Twitter**: [@fimio_app](https://twitter.com/fimio_app)

---

## 🙏 Cảm Ơn

Cảm ơn tất cả những người đóng góp, sử dụng và yêu thích **Fimio**!

**Hãy cho chúng tôi một ⭐ nếu bạn thích dự án này!**

---

<div align="center">

**Made with ❤️ by Fimio Team**

_Nâng tầm trải nghiệm xem phim online của bạn_

</div>
