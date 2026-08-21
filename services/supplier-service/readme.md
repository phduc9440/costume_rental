# Dịch vụ Nhà Cung Cấp (Supplier Service)

## Tổng quan

Dịch vụ Nhà Cung Cấp (Supplier Service) chịu trách nhiệm quản lý toàn bộ thông tin nhà cung cấp và quy trình nhập hàng vào kho trang phục. Đây là điểm khởi đầu của chuỗi cung ứng trong hệ thống Thuê Trang Phục.

### Trách nhiệm chính

- **Quản lý Nhà cung cấp (Supplier Management):** CRUD thông tin nhà cung cấp (tên, địa chỉ, số điện thoại).
- **Quản lý Nhập kho (Import Invoice Management):** Tạo và theo dõi các hóa đơn nhập hàng, bao gồm danh sách trang phục được nhập và số lượng.
- **Cập nhật Tồn kho:** Sau khi tạo hóa đơn nhập, tự động gọi sang **Costume Service** (qua OpenFeign) để tăng số lượng tồn kho.
- **Thống kê nhập hàng:** Cung cấp báo cáo top nhà cung cấp theo tổng giá trị và số lần nhập hàng.

### Phạm vi nghiệp vụ

Dịch vụ này quản lý đầu vào của kho hàng. Mỗi hóa đơn nhập (`ImportInvoice`) ghi nhận thời điểm nhập, nhân viên phụ trách, nhà cung cấp và chi tiết từng loại trang phục được nhập vào.

### Dữ liệu sở hữu

Dịch vụ quản trị cơ sở dữ liệu `supplier_db` bao gồm các bảng chính:

| Bảng              | Mô tả dữ liệu                     | Các trường chính                                          |
| ----------------- | --------------------------------- | --------------------------------------------------------- |
| `suppliers`       | Thông tin nhà cung cấp            | `id`, `name`, `address`, `phone`                          |
| `import_invoices` | Hóa đơn nhập hàng                 | `id`, `supplier_id`, `employee_id`, `import_date`, `total_amount` |
| `import_details`  | Chi tiết từng dòng hàng trong hóa đơn | `id`, `invoice_id`, `costume_id`, `quantity`, `price` |

---

## Các Endpoint API

### 1. Quản lý Nhà Cung Cấp (`/suppliers`)

| Phương thức | Endpoint          | Mô tả                                      | Quyền truy cập |
| ----------- | ----------------- | ------------------------------------------ | -------------- |
| POST        | `/suppliers`      | Tạo mới nhà cung cấp                       | Admin/Employee |
| GET         | `/suppliers`      | Danh sách nhà cung cấp (phân trang)        | Admin/Employee |
| GET         | `/suppliers/{id}` | Chi tiết thông tin một nhà cung cấp        | Admin/Employee |
| PUT         | `/suppliers/{id}` | Cập nhật thông tin nhà cung cấp            | Admin/Employee |
| DELETE      | `/suppliers/{id}` | Xóa nhà cung cấp khỏi hệ thống             | Admin          |

### 2. Quản lý Hóa Đơn Nhập Hàng (`/import-invoices`)

| Phương thức | Endpoint                  | Mô tả                                                                  | Quyền truy cập |
| ----------- | ------------------------- | ---------------------------------------------------------------------- | -------------- |
| POST        | `/import-invoices`        | Tạo hóa đơn nhập hàng (tự động cập nhật tồn kho Costume Service)      | Admin/Employee |
| GET         | `/import-invoices`        | Danh sách hóa đơn nhập (phân trang)                                    | Admin/Employee |
| GET         | `/import-invoices/{id}`   | Chi tiết một hóa đơn nhập                                              | Admin/Employee |

### 3. Thống kê (`/import-invoices/statistics`)

| Phương thức | Endpoint                                  | Mô tả                                                          | Quyền truy cập |
| ----------- | ----------------------------------------- | -------------------------------------------------------------- | -------------- |
| GET         | `/import-invoices/statistics/top-importers` | Top nhà cung cấp theo tổng giá trị và số lần nhập hàng       | Admin          |

### 4. Giám sát (Monitoring)

| Phương thức | Endpoint           | Mô tả                            |
| ----------- | ------------------ | -------------------------------- |
| GET         | `/actuator/health` | Trạng thái hoạt động của dịch vụ |

> Full API specification: [`docs/api-specs/supplier-service.yaml`](../../docs/api-specs/supplier-service.yaml)

---

## Cấu trúc dự án

```text
supplier-service/
├── pom.xml             # Quản lý build và dependency Maven
├── readme.md           # Tài liệu hướng dẫn (file này)
└── src/
    ├── main/
    │   ├── java/com/costume_rental/supplier_service/
    │   │   ├── controller/    # Supplier và ImportInvoice Endpoints
    │   │   ├── service/       # Nghiệp vụ nhà cung cấp và nhập kho
    │   │   ├── entity/        # Supplier, ImportInvoice, ImportDetail (JPA)
    │   │   ├── repository/    # Truy vấn Spring Data JPA
    │   │   ├── dto/           # DTO cho Request và Response
    │   │   ├── mapper/        # MapStruct mappers
    │   │   ├── exception/     # AppException, ErrorCode, GlobalExceptionHandler
    │   │   └── configuration/ # Cấu hình bảo mật và Feign Client
    │   └── resources/
    │       └── application.yaml # Cấu hình kết nối Config Server
    └── test/            # Unit và Integration tests
```

---

## Chạy dịch vụ cục bộ

Khuyến khích chạy thông qua Docker Compose ở thư mục gốc:

```bash
# Từ project root
docker compose up supplier-service --build
```

Để chạy riêng lẻ bằng Maven (Yêu cầu Discovery & Config Server):
```bash
# Trong thư mục supplier-service
./mvnw spring-boot:run
```

---

## Biến môi trường

Dịch vụ có thể được cấu hình thông qua các biến môi trường sau (thay thế giá trị mặc định được lấy từ Config Service):

| Biến môi trường      | Mô tả                           | Giá trị mặc định                                                         |
| -------------------- | ------------------------------- | ------------------------------------------------------------------------ |
| `SERVER_PORT`        | Cổng chạy dịch vụ               | `5003`                                                                   |
| `CONFIG_SERVER_URL`  | URL của Config Service          | `http://localhost:8888`                                                  |
| `EUREKA_SERVER_URL`  | URL của Eureka Discovery Server | `http://localhost:9999/eureka/`                                          |
| `DB_URL_SUPPLIER`    | URL của MySQL database          | `jdbc:mysql://localhost:3306/supplier_db?createDatabaseIfNotExist=true`  |
| `DB_USERNAME`        | Tên đăng nhập cơ sở dữ liệu     | `root`                                                                   |
| `DB_PASSWORD`        | Mật khẩu cơ sở dữ liệu          | (trống)                                                                  |
