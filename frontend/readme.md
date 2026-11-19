# Giao diện Hệ thống (Frontend)

## Tổng quan

Giao diện chính của hệ thống Thuê Trang Phục, cung cấp trải nghiệm ứng dụng đơn trang (SPA) mượt mà cho cả Khách hàng và Quản trị viên với giao diện sáng hiện đại (sidebar tối cho trang quản trị), toàn bộ bằng tiếng Việt, tương thích mobile. Design tokens (màu, bo góc, đổ bóng) khai báo trong `src/index.css`; định dạng tiền tệ dùng chung `src/utils/format.ts`.

---

## Công nghệ sử dụng

| Thành phần | Lựa chọn                    |
| ---------- | --------------------------- |
| Framework  | React 19                    |
| Build Tool | Vite                        |
| Ngôn ngữ   | TypeScript                  |
| Routing    | React Router DOM 7          |
| Styling    | Vanilla CSS (Modern custom) |
| API Client | Axios                       |

---

## Các phân hệ chính

### 1. Khách hàng (`/customer`)

- **Trang chủ:** Giới thiệu và các bộ sưu tập nổi bật.
- **Danh sách trang phục:** Tìm kiếm và lọc đồ theo nhu cầu.
- **Giỏ hàng:** Quản lý danh sách đồ dự kiến thuê.
- **Đơn hàng của tôi:** Xem lịch sử và chi tiết các đơn đã đặt.

### 2. Quản trị (`/admin`)

- **Dashboard:** Thống kê nhanh tình hình kinh doanh.
- **Quản lý đơn thuê:** Xử lý xác nhận, lấy đồ, trả đồ và tạo đơn offline.
- **Quản lý khách hàng:** Hồ sơ và lịch sử chi tiêu của người thuê.
- **Quản lý kho:** Cập nhật thông tin, số lượng trang phục.

---

## Cấu trúc dự án

```text
frontend/
├── public/             # Tài sản tĩnh (favicon, v.v.)
├── src/
│   ├── api/            # Cấu hình Axios và các cuộc gọi API
│   ├── components/     # Các UI Component dùng chung (Button, Card, v.v.)
│   ├── context/        # Quản lý trạng thái ứng dụng (AuthContext)
│   ├── pages/          # Các trang chính (Home, Login, Admin Dashboard)
│   ├── types/          # Định nghĩa kiểu dữ liệu TypeScript
│   ├── utils/          # Các hàm tiện ích bổ trợ
│   ├── App.tsx         # Thành phần gốc của ứng dụng
│   ├── main.tsx        # Điểm nhập chính của React
│   └── index.css       # File phong cách (styles) trung tâm
├── index.html          # File mẫu HTML
├── package.json        # Danh sách thư viện và script
├── tsconfig.json       # Cấu hình TypeScript
└── vite.config.ts      # Cấu hình build của Vite
```

## Biến môi trường

| Biến môi trường | Mô tả                   | Giá trị mặc định        |
| --------------- | ----------------------- | ----------------------- |
| `VITE_API_URL`  | URL kết nối đến Gateway | `http://localhost:8080` |

---

## Chạy dịch vụ cục bộ

```bash
# From project root
docker compose up frontend --build

# Or run locally
cd frontend
npm install
npm run dev
```
