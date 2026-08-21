# Dịch vụ Trả Trang Phục (Return Service)

## Tổng quan

Dịch vụ Trả Trang Phục (Return Service) chịu trách nhiệm xử lý toàn bộ quy trình khách hàng trả lại trang phục sau khi thuê. Đây là bước cuối cùng trong vòng đời của một đơn thuê, bao gồm kiểm tra tình trạng đồ, tính phí phạt nếu có lỗi, và cập nhật lại tồn kho.

### Trách nhiệm chính

- **Xử lý Trả đồ (Return Processing):** Tạo phiếu trả trang phục dựa theo phiếu thuê, ghi nhận nhân viên phụ trách và chi tiết từng bộ được trả.
- **Quản lý Lỗi/Phạt (Penalty Management):** CRUD danh mục các loại lỗi (rách, bẩn, mất...) với mức phạt tương ứng.
- **Tích hợp nội bộ:** Sau khi tạo phiếu trả, tự động gọi sang **Costume Service** (qua OpenFeign) để tăng số lượng tồn kho.
- **Thống kê doanh thu:** Cung cấp báo cáo doanh thu từ phiếu trả theo tháng/năm và chi tiết hóa đơn theo kỳ.

### Phạm vi nghiệp vụ

Dịch vụ quản lý hai nhóm nghiệp vụ độc lập: **(1)** Phiếu trả (`PhieuTra`) — ghi nhận sự kiện trả đồ thực tế của khách; **(2)** Danh mục lỗi (`Loi`) — cấu hình các loại hỏng hóc và mức phạt để áp dụng khi kiểm tra đồ trả về.

### Dữ liệu sở hữu

Dịch vụ quản trị cơ sở dữ liệu `return_db` bao gồm các bảng chính:

| Bảng            | Mô tả dữ liệu                        | Các trường chính                                              |
| --------------- | ------------------------------------ | ------------------------------------------------------------- |
| `phieu_tra`     | Phiếu trả trang phục                 | `id`, `phieu_thue_id`, `nhan_vien_id`, `ngay_lap`             |
| `chi_tiet_tra`  | Chi tiết từng bộ trang phục được trả | `id`, `phieu_tra_id`, `trang_phuc_id`, `so_luong`             |
| `loi`           | Danh mục loại lỗi/hỏng hóc           | `id`, `ten_loi`, `muc_phat`, `mo_ta`                          |
| `chi_tiet_loi`  | Lỗi phát sinh trên từng bộ trả       | `id`, `chi_tiet_tra_id`, `loi_id`, `tong_loi`                 |

---

## Các Endpoint API

### 1. Quản lý Phiếu Trả (`/returns`)

| Phương thức | Endpoint       | Mô tả                                                             | Quyền truy cập |
| ----------- | -------------- | ----------------------------------------------------------------- | -------------- |
| POST        | `/returns`     | Tạo phiếu trả (tự động cập nhật tồn kho Costume Service)         | Admin/Employee |
| GET         | `/returns`     | Danh sách phiếu trả (phân trang)                                  | Admin/Employee |
| GET         | `/returns/{id}`| Chi tiết một phiếu trả                                            | Admin/Employee |

### 2. Quản lý Lỗi / Phạt (`/errors`)

| Phương thức | Endpoint       | Mô tả                                                | Quyền truy cập |
| ----------- | -------------- | ---------------------------------------------------- | -------------- |
| POST        | `/errors`      | Tạo loại lỗi/phạt mới                                | Admin          |
| GET         | `/errors`      | Danh sách loại lỗi (phân trang, hỗ trợ tìm kiếm)    | Admin/Employee |
| GET         | `/errors/{id}` | Chi tiết một loại lỗi                                | Admin/Employee |
| PUT         | `/errors/{id}` | Cập nhật thông tin loại lỗi                          | Admin          |
| DELETE      | `/errors/{id}` | Xóa loại lỗi                                         | Admin          |

### 3. Thống kê (`/returns/statistics`)

| Phương thức | Endpoint                              | Mô tả                                                        | Quyền truy cập |
| ----------- | ------------------------------------- | ------------------------------------------------------------ | -------------- |
| GET         | `/returns/statistics/revenue`         | Tổng doanh thu theo tháng hoặc năm (`?type=MONTH\|YEAR`)    | Admin          |
| GET         | `/returns/statistics/revenue/details` | Chi tiết hóa đơn trả theo kỳ (`?type=MONTH&period=2025-04`) | Admin          |

### 4. Giám sát (Monitoring)

| Phương thức | Endpoint           | Mô tả                            |
| ----------- | ------------------ | -------------------------------- |
| GET         | `/actuator/health` | Trạng thái hoạt động của dịch vụ |

> Full API specification: [`docs/api-specs/return-service.yaml`](../../docs/api-specs/return-service.yaml)

---

## Cấu trúc dự án

```text
return-service/
├── pom.xml                  # Quản lý build và dependency Maven
├── return_db_schema.sql     # Schema khởi tạo database
├── readme.md                # Tài liệu hướng dẫn (file này)
└── src/
    ├── main/
    │   ├── java/com/costume_rental/return_service/
    │   │   ├── controller/    # Return và Error/Penalty Endpoints
    │   │   ├── service/       # ReturnService, LoiService
    │   │   ├── entity/        # PhieuTra, ChiTietTra, Loi, ChiTietLoi (JPA)
    │   │   ├── repository/    # Truy vấn Spring Data JPA
    │   │   ├── dto/           # DTO cho Request và Response
    │   │   ├── mapper/        # ReturnMapper, LoiMapper (MapStruct)
    │   │   ├── exception/     # AppException, ErrorCode, GlobalExceptionHandler
    │   │   └── configuration/ # Cấu hình bảo mật và Feign Client
    │   └── resources/
    │       └── application.yaml # Cấu hình kết nối Config Server
    └── test/                 # Unit và Integration tests
```

---

## Chạy dịch vụ cục bộ

Khuyến khích chạy thông qua Docker Compose ở thư mục gốc:

```bash
# Từ project root
docker compose up return-service --build
```

Để chạy riêng lẻ bằng Maven (Yêu cầu Discovery & Config Server):
```bash
# Trong thư mục return-service
./mvnw spring-boot:run
```

---

## Biến môi trường

Dịch vụ có thể được cấu hình thông qua các biến môi trường sau (thay thế giá trị mặc định được lấy từ Config Service):

| Biến môi trường     | Mô tả                           | Giá trị mặc định                                                       |
| ------------------- | ------------------------------- | ---------------------------------------------------------------------- |
| `SERVER_PORT`       | Cổng chạy dịch vụ               | `5004`                                                                 |
| `CONFIG_SERVER_URL` | URL của Config Service          | `http://localhost:8888`                                                |
| `EUREKA_SERVER_URL` | URL của Eureka Discovery Server | `http://localhost:9999/eureka/`                                        |
| `DB_URL_RETURN`     | URL của MySQL database          | `jdbc:mysql://localhost:3306/return_db?createDatabaseIfNotExist=true`  |
| `DB_USERNAME`       | Tên đăng nhập cơ sở dữ liệu     | `root`                                                                 |
| `DB_PASSWORD`       | Mật khẩu cơ sở dữ liệu          | (trống)                                                                |
