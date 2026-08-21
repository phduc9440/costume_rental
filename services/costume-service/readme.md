# Dịch vụ Trang Phục (Costume Service)

## Tổng quan

Dịch vụ Trang Phục (Costume Service) là trung tâm quản lý kho hàng và danh mục trang phục trong hệ sinh thái Thuê Trang Phục. Dịch vụ này đóng vai trò là "nguồn chân lý" (Source of Truth) cho toàn bộ thông tin về trang phục và số lượng tồn kho.

### Trách nhiệm chính

- **Quản lý Danh mục (Catalog Management):** Xử lý CRUD cho tất cả trang phục trong hệ thống (tạo, xem, cập nhật, xóa).
- **Quản lý Tồn kho (Inventory Management):** Theo dõi và cập nhật số lượng trang phục theo thời gian thực khi có giao dịch thuê/trả/nhập hàng.
- **Hỗ trợ nội bộ (Internal Support):** Cung cấp API truy vấn theo danh sách IDs cho các service khác (Rental, Return, Supplier) thông qua OpenFeign.
- **Thống kê doanh thu:** Cung cấp dữ liệu tổng hợp về hiệu quả kinh doanh của từng trang phục.

### Phạm vi nghiệp vụ

Dịch vụ này tập trung hoàn toàn vào việc quản lý tài sản trang phục. Nó không xử lý bất kỳ nghiệp vụ thuê/trả nào mà chỉ phản ánh trạng thái kho hàng dựa trên lệnh từ các service nghiệp vụ.

### Dữ liệu sở hữu

Dịch vụ quản trị cơ sở dữ liệu `costume_db` bao gồm bảng chính:

| Bảng       | Mô tả dữ liệu              | Các trường chính                        |
| ---------- | -------------------------- | --------------------------------------- |
| `costumes` | Thông tin và tồn kho trang phục | `id`, `name`, `quantity`, `price`  |

---

## Các Endpoint API

### 1. Quản lý Trang Phục (`/costumes`)

| Phương thức | Endpoint                       | Mô tả                                                        | Quyền truy cập  |
| ----------- | ------------------------------ | ------------------------------------------------------------ | --------------- |
| POST        | `/costumes`                    | Tạo mới trang phục                                           | Admin/Employee  |
| GET         | `/costumes`                    | Danh sách trang phục (phân trang)                            | Public          |
| GET         | `/costumes?ids={id1}&ids={id2}`| Lấy nhiều trang phục theo danh sách IDs (dùng nội bộ)        | Internal        |
| GET         | `/costumes/{id}`               | Chi tiết thông tin một trang phục                            | Public          |
| PUT         | `/costumes/{id}`               | Cập nhật thông tin trang phục                                | Admin/Employee  |
| DELETE      | `/costumes/{id}`               | Xóa trang phục khỏi hệ thống                                 | Admin           |
| PUT         | `/costumes/{id}/quantity`      | Cập nhật số lượng tồn kho (thuê: `-1`, trả/nhập: `+n`)       | Internal        |

### 2. Thống kê (`/costumes/statistics`)

| Phương thức | Endpoint                        | Mô tả                                        | Quyền truy cập |
| ----------- | ------------------------------- | -------------------------------------------- | -------------- |
| GET         | `/costumes/statistics/revenue`  | Thống kê doanh thu và số lần thuê theo trang phục | Admin      |

### 3. Giám sát (Monitoring)

| Phương thức | Endpoint           | Mô tả                            |
| ----------- | ------------------ | -------------------------------- |
| GET         | `/actuator/health` | Trạng thái hoạt động của dịch vụ |

> Full API specification: [`docs/api-specs/costume-service.yaml`](../../docs/api-specs/costume-service.yaml)

---

## Cấu trúc dự án

```text
costume-service/
├── pom.xml             # Quản lý build và dependency Maven
├── readme.md           # Tài liệu hướng dẫn (file này)
└── src/
    ├── main/
    │   ├── java/com/costume_rental/costume_service/
    │   │   ├── controller/    # Costume Endpoints
    │   │   ├── service/       # Nghiệp vụ quản lý trang phục và kho
    │   │   ├── entity/        # Costume (JPA)
    │   │   ├── repository/    # Truy vấn Spring Data JPA
    │   │   ├── dto/           # DTO cho Request và Response
    │   │   ├── mapper/        # MapStruct mapper
    │   │   ├── exception/     # AppException, ErrorCode, GlobalExceptionHandler
    │   │   └── configuration/ # Cấu hình bảo mật (JWT Resource Server)
    │   └── resources/
    │       └── application.yaml # Cấu hình kết nối Config Server
    └── test/            # Unit và Integration tests
```

---

## Chạy dịch vụ cục bộ

Khuyến khích chạy thông qua Docker Compose ở thư mục gốc:

```bash
# Từ project root
docker compose up costume-service --build
```

Để chạy riêng lẻ bằng Maven (Yêu cầu Discovery & Config Server):
```bash
# Trong thư mục costume-service
./mvnw spring-boot:run
```

---

## Biến môi trường

Dịch vụ có thể được cấu hình thông qua các biến môi trường sau (thay thế giá trị mặc định được lấy từ Config Service):

| Biến môi trường     | Mô tả                           | Giá trị mặc định                                                        |
| ------------------- | ------------------------------- | ----------------------------------------------------------------------- |
| `SERVER_PORT`       | Cổng chạy dịch vụ               | `5002`                                                                  |
| `CONFIG_SERVER_URL` | URL của Config Service          | `http://localhost:8888`                                                 |
| `EUREKA_SERVER_URL` | URL của Eureka Discovery Server | `http://localhost:9999/eureka/`                                         |
| `DB_URL_COSTUME`    | URL của MySQL database          | `jdbc:mysql://localhost:3306/costume_db?createDatabaseIfNotExist=true`  |
| `DB_USERNAME`       | Tên đăng nhập cơ sở dữ liệu     | `root`                                                                  |
| `DB_PASSWORD`       | Mật khẩu cơ sở dữ liệu          | (trống)                                                                 |
