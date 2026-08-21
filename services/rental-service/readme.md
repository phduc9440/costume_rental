# Dịch vụ Cho thuê (Rental Service)

## Tổng quan

Dịch vụ Cho thuê (Rental Service) là trung tâm điều phối nghiệp vụ cốt lõi của hệ thống, quản lý toàn bộ vòng đời của một đơn thuê trang phục từ lúc đặt hàng đến khi hoàn tất hoặc hủy bỏ.

### Trách nhiệm chính

- **Quản lý Vòng đời Đơn hàng:** Xử lý quy trình từ `PENDING` (Chờ) -> `CONFIRMED` (Xác nhận) -> `RENTING` (Khách đã lấy) -> `COMPLETED` (Đã trả).
- **Hỗ trợ Đa kênh:** Quản lý song song đơn hàng trực tuyến (Online) và đơn hàng tại quầy (Offline).
- **Kiểm soát Thời hạn & Cọc:** Theo dõi hạn trả đồ (`dueDate`) và quản lý trạng thái tiền đặt cọc.
- **Tích hợp Liên dịch vụ:** Giao tiếp với `costume-service` để kiểm tra/cập nhật kho và `customer-service` để lấy thông tin khách hàng.
- **Thống kê Doanh thu:** Tính toán tổng chi tiêu của khách hàng và doanh thu hệ thống.

### Phạm vi nghiệp vụ

Đây là nơi xử lý toàn bộ quy trình thuê đồ của cửa hàng. Dịch vụ này điều phối việc đặt hàng (Online/Offline), kiểm soát trạng thái đồ đang cho thuê, tính toán tiền cọc và quản lý thời hạn khách phải trả đồ.

### Dữ liệu sở hữu

Dịch vụ quản trị cơ sở dữ liệu `rental_db` bao gồm các bảng chính:

| Bảng            | Mô tả dữ liệu                | Các trường chính                                                                               |
| --------------- | ---------------------------- | ---------------------------------------------------------------------------------------------- |
| `rental_orders` | Thông tin chung của đơn thuê | `id`, `createDate`, `type` (Online/Offline), `status`, `customer_id`, `employee_id`, `dueDate` |
| `rental_detail` | Chi tiết sản phẩm trong đơn  | `id`, `rental_order_id`, `costume_id`, `quantity`, `price` (tại thời điểm thuê)                |

## Công nghệ sử dụng

| Thành phần       | Lựa chọn               |
| ---------------- | ---------------------- |
| Ngôn ngữ         | Java 21                |
| Framework        | Spring Boot 3.5.x      |
| Cơ sở dữ liệu    | MySQL (`rental_db`)    |
| Khám phá dịch vụ | Spring Cloud Eureka    |
| Cấu hình         | Spring Cloud Config    |
| Giao tiếp        | Spring Cloud OpenFeign |

## Các Endpoint API

### 1. Quản lý Đơn thuê (`/rental-orders`)

| Phương thức | Endpoint                              | Mô tả                                        |
| ----------- | ------------------------------------- | -------------------------------------------- |
| POST        | `/rental-orders/online`               | Tạo đơn thuê trực tuyến mới                  |
| POST        | `/rental-orders/offline`              | Tạo đơn thuê tại cửa hàng (Admin)            |
| GET         | `/rental-orders/{id}`                 | Lấy chi tiết đơn thuê                        |
| GET         | `/rental-orders/customer/{id}`        | Danh sách đơn thuê của một khách hàng        |
| GET         | `/rental-orders`                      | Danh sách tất cả đơn thuê (Admin, có bộ lọc) |
| PUT         | `/rental-orders/{id}`                 | Cập nhật thông tin đơn thuê                  |
| PUT         | `/rental-orders/{id}/confirm`         | Xác nhận đơn hàng đang chờ                   |
| PUT         | `/rental-orders/{id}/pickup`          | Đánh dấu khách đã lấy đồ                     |
| PUT         | `/rental-orders/{id}/confirm-deposit` | Xác nhận đã nhận tiền cọc                    |
| PUT         | `/rental-orders/{id}/cancel`          | Hủy đơn hàng (kèm lý do)                     |

### 2. Thống kê Doanh thu (`/rental-orders/revenue`)

| Phương thức | Endpoint                               | Mô tả                                       |
| ----------- | -------------------------------------- | ------------------------------------------- |
| GET         | `/rental-orders/revenue/customer/{id}` | Lấy tổng doanh thu từ một khách hàng cụ thể |

### 3. Giám sát (Monitoring)

| Phương thức | Endpoint           | Mô tả                            |
| ----------- | ------------------ | -------------------------------- |
| GET         | `/actuator/health` | Trạng thái hoạt động của dịch vụ |

> Full API specification: [`docs/api-specs/rental-service.yaml`](../../docs/api-specs/rental-service.yaml)

## Cấu trúc dự án

```text
rental-service/
├── Dockerfile          # Cấu hình Docker multi-stage
├── pom.xml             # Quản lý build và dependency Maven
├── readme.md           # Tài liệu hướng dẫn (file này)
└── src/
    ├── main/
    │   ├── java/com/costume_rental/rental/
    │   │   ├── controller/ # REST Endpoints
    │   │   ├── service/    # Xử lý nghiệp vụ thuê đồ
    │   │   ├── entity/     # Khai báo bảng database (JPA)
    │   │   ├── repository/ # Truy vấn dữ liệu
    │   │   ├── dto/        # Request/Response data
    │   │   └── client/     # Gọi các service khác (Feign Client)
    │   └── resources/
    │       └── application.yaml # Cấu hình cổng và kết nối DB
    └── test/           # Unit và Integration tests
```

## Chạy dịch vụ cục bộ

Khuyến khích chạy thông qua Docker Compose ở thư mục gốc:

```bash
# Từ project root
docker compose up rental-service --build
```

Để chạy riêng lẻ bằng Maven (Yêu cầu Discovery & Config Server):

```bash
# Trong thư mục rental-service
./mvnw spring-boot:run
```

## Biến môi trường

Dịch vụ có thể được cấu hình thông qua các biến môi trường sau:

| Biến môi trường     | Mô tả                           | Giá trị mặc định                                                      |
| ------------------- | ------------------------------- | --------------------------------------------------------------------- |
| `SERVER_PORT`       | Cổng chạy dịch vụ               | `5004`                                                                |
| `CONFIG_SERVER_URL` | URL của Config Service          | `http://localhost:8888`                                               |
| `EUREKA_SERVER_URL` | URL của Eureka Discovery Server | `http://localhost:9999/eureka/`                                       |
| `DB_URL_RENTAL`     | URL của MySQL database          | `jdbc:mysql://localhost:3306/rental_db?createDatabaseIfNotExist=true` |
| `DB_USERNAME`       | Tên đăng nhập cơ sở dữ liệu     | `root`                                                                |
| `DB_PASSWORD`       | Mật khẩu cơ sở dữ liệu          | (trống)                                                               |
