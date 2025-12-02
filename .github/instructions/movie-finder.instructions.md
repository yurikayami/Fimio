---
applyTo: "**"
---

**Role:** Bạn là một chuyên gia Senior Frontend Developer chuyên về React, Tailwind CSS và UI/UX Design.

**Task:** Hãy giúp tôi xây dựng lại một website xem phim cá nhân từ đầu. Trước đây tôi dùng HTML thuần (đã cung cấp context), nay tôi muốn chuyển sang **React (Vite)** kết hợp với **Shadcn UI** và **Tailwind CSS**. Website sử dụng API từ **KKPhim (PhimAPI)**.

**Công nghệ yêu cầu:**

- Framework: React (Vite).
- Styling: Tailwind CSS.
- UI Library: Shadcn UI (sử dụng các component như Card, Button, Input, Select, Dialog, Sheet, Pagination...).
- Icons: Lucide-react.
- Routing: React Router DOM.
- State Management: React Hooks (hoặc Zustand nếu cần), LocalStorage để lưu phim yêu thích.

**Cấu trúc API (Dựa trên tài liệu đã cung cấp):**
Tôi sẽ sử dụng API public từ `phimapi.com`. Các endpoint quan trọng cần tích hợp:

1.  **Trang chủ (Phim mới):** `GET https://phimapi.com/danh-sach/phim-moi-cap-nhat?page={page}`
2.  **Chi tiết phim & Server:** `GET https://phimapi.com/phim/{slug}` (Lấy thông tin phim, danh sách tập và link embed iframe).
3.  **Tìm kiếm:** `GET https://phimapi.com/v1/api/tim-kiem?keyword={keyword}&limit={limit}`
4.  **Lọc & Khám phá:** `GET https://phimapi.com/v1/api/danh-sach/{type_list}`
    - Tham số hỗ trợ: `category` (thể loại), `country` (quốc gia), `year` (năm), `sort_field` (modified.time, \_id, year), `sort_type` (desc, asc).
5.  **Thể loại/Quốc gia:** `GET https://phimapi.com/the-loai` và `GET https://phimapi.com/quoc-gia` để lấy danh sách filter.

**Yêu cầu chức năng chi tiết:**

1.  **Global UI:**

    - Giao diện Dark Mode mặc định (màu nền tối `#000000` giống bản cũ).
    - **Header:** Logo, Thanh tìm kiếm (Search Bar), Menu điều hướng (Home, Khám phá, Kho phim của tôi).
    - **Responsive:** Tương thích hoàn hảo trên Mobile và Desktop.

2.  **Trang Chủ (Home Page):**

    - **Hero Section:** Banner slide các phim nổi bật nhất (lấy từ danh sách phim mới).
    - **Latest Movies:** Danh sách phim mới cập nhật dạng Grid.
    - Sử dụng Skeleton Loading khi đang fetch dữ liệu.

3.  **Trang Khám Phá (Explore & Filter):**

    - Sidebar hoặc Top Bar chứa bộ lọc (Filter):
      - Chọn Thể loại (Hành động, Tình cảm...).
      - Chọn Quốc gia.
      - Chọn Năm phát hành.
      - Sắp xếp (Mới nhất, Cũ nhất).
    - Hiển thị kết quả lọc dạng lưới (Grid) + Phân trang (Pagination của Shadcn).

4.  **Trang Chi tiết & Xem phim (Movie Detail):**

    - Hiển thị Poster, thông tin chi tiết (Diễn viên, nội dung, tag).
    - **Quan trọng:** Tích hợp trình phát video (Iframe) giống file `dynamic_movie_loader.html` cũ.
    - Danh sách tập phim (Episodes): Hiển thị dạng nút bấm, click vào đổi src của iframe.
    - Nút **"Lưu phim" (Bookmark):** Lưu thông tin phim vào LocalStorage.

5.  **Trang Kho phim (Saved Movies):**
    - Hiển thị danh sách các phim người dùng đã lưu (Lấy từ LocalStorage).
    - Cho phép xóa phim khỏi danh sách.

**Yêu cầu đầu ra:**

1.  Hãy khởi tạo cấu trúc thư mục dự án (Project Structure).
2.  Viết code cho các file cấu hình cơ bản (`tailwind.config.js`, `vite.config.js`).
3.  Tạo Hook riêng `useFetch` hoặc service file để gọi API (xử lý logic fetch data tái sử dụng).
4.  Viết code cho các Component chính (MovieCard, MovieDetail, FilterBar).
