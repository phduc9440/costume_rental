# Quy tắc & Tiêu chuẩn Frontend

## 1. Cấu trúc thư mục

- Thư mục gốc `frontend/` PHẢI được giữ sạch sẽ và chuẩn mực Vite. Nó chứa các file cấu hình như `Dockerfile`, `readme.md`, `FRONTEND_RULES.md`, `package.json`, `vite.config.ts`, `index.html` và thư mục `src/`.
- TOÀN BỘ mã nguồn React (components, pages, hooks, styles...) PHẢI được đặt bên trong thư mục `frontend/src/`.
- **Trong `src/pages/`**: Phải chia rành mạch các module:
  - `src/pages/admin/` cho các giao diện của Quản trị viên/Nhân viên.
  - `src/pages/customer/` cho các giao diện của Khách hàng.
  - `src/pages/auth/` cho các giao diện Đăng nhập / Đăng ký.
- **Trong `src/types/`**: Phải chứa toàn bộ các Type / Interface của Typescript (chia theo từng entity như `auth.ts`, `user.ts`...).
- **Trong `src/api/`**: Nơi chứa toàn bộ code thao tác gọi API và các HTTP Client.

## 2. Công nghệ sử dụng (Tech Stack)

- React + TypeScript + Vite.
- Styling: Plain CSS Modules / Global CSS (Không sử dụng TailwindCSS trừ khi có yêu cầu rõ ràng).
- Calling API: Bắt buộc sử dụng **Axios**. Cấu hình base sẵn trong `apiClient.ts` để tự động đính kèm Token. Không được gọi rải rác trong Component.

## 3. Thẩm mỹ Giao diện (Premium Feeling)

- **Nội dung động (Dynamic Content)**: Sử dụng các hiệu ứng chuyển động mượt mà khi mount/unmount component (hiện/ẩn).
- Khi hover vào các element tương tác (nút bấm, thẻ...) phải có trạng thái thay đổi rõ ràng.
- Sử dụng typography sạch thẻ và quản lý khoảng trắng (whitespace) tốt.

## 4. Cấu hình Routing & Authentication

- Tài khoản có vai trò `Customer` phải được chuyển hướng đến `/customer/home`.
- Tài khoản có vai trò `Admin` hoặc `Employee` phải được chuyển hướng đến `/admin/dashboard`.
- Token trả về là JWT, cần giải mã claim `scope` (ví dụ `ROLE_CUSTOMER`, `ROLE_ADMIN`) để phân biệt vai trò.

## 5. Biến Môi Trường (.env)

- Bắt buộc phải sử dụng biến môi trường (Environment Variables) cho các giá trị có thể thay đổi giữa các môi trường (Dev, Staging, Prod).
- Tiền tố của tên biến bắt buộc phải là `VITE_` (ví dụ: `VITE_API_GATEWAY_URL`).
- Sử dụng cấu trúc `import.meta.env.VITE_XXX` để gọi giá trị trong React component/service, tuyệt đối KHÔNG ĐƯỢC hardcode URL vào thẳng mã nguồn.
