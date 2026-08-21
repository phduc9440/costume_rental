# API Gateway

## Tổng quan

API Gateway đóng vai trò là điểm truy cập duy nhất cho tất cả các yêu cầu từ phía client. Nó chịu trách nhiệm điều hướng yêu cầu, bảo mật, và cân bằng tải bằng cách sử dụng **Spring Cloud Gateway**.

## Trách nhiệm chính

- **Điều hướng yêu cầu (Routing)**: Chuyển tiếp các yêu cầu đến các microservice tương ứng dựa trên đường dẫn URL.
- **Bảo mật (Security)**: Xác thực JWT tập trung tại Gateway trước khi cho phép yêu cầu đi vào hệ thống.
- **Cân bằng tải (Load Balancing)**: Tích hợp với Eureka để phân phối lưu lượng giữa các instance của dịch vụ.
- **Biến đổi đường dẫn (Path Transformation)**: Sử dụng `StripPrefix` để loại bỏ các định danh dịch vụ khỏi đường dẫn URL khi gửi đến dịch vụ đích.

## Công nghệ sử dụng

| Thành phần    | Lựa chọn                    |
| ------------- | --------------------------- |
| Framework     | Spring Cloud Gateway        |
| Ngôn ngữ      | Java 21 (Spring Boot 3.5.x) |
| Bảo mật       | Spring Security (OAuth2)    |
| Khám phá      | Spring Cloud Netflix Eureka |
| Cấu hình      | Spring Cloud Config         |
| Công cụ build | Maven                       |

## Bảng điều hướng (Routing Table)

Gateway được cấu hình để điều hướng đến các dịch vụ sau (mặc định tại cổng **8080**):

| Đường dẫn ngoài    | Dịch vụ đích (Eureka ID) | Bộ lọc          | Chức năng chính          |
| ------------------ | ------------------------ | --------------- | ------------------------ |
| `/rental/**`       | `rental-service`         | `StripPrefix=1` | Quản lý đơn thuê đồ      |
| `/member/**`       | `customer-service`       | `StripPrefix=1` | Quản lý khách hàng       |
| `/costume/**`      | `costume-service`        | `StripPrefix=1` | Quản lý trang phục       |
| `/return/**`       | `return-service`         | `StripPrefix=1` | Quản lý đơn trả đồ       |
| `/supplier/**`     | `supplier-service`       | `StripPrefix=1` | Quản lý nhà cung cấp     |
| `/{SERVICE-ID}/**` | Tự động                  | Không           | Truy cập trực tiếp (Dev) |

## Cấu hình Bảo mật

Gateway sử dụng **OAuth2 Resource Server** với JWT.

### Endpoint công khai (Không yêu cầu Token):

- **Auth**: `POST /member/auth/**` (Đăng ký, Đăng nhập)
- **Monitoring**: `/rental/health/**`, `/member/health/**`
- **Documentation**: `/swagger-ui/**`, `/v3/api-docs/**`, `/swagger-ui.html`

### Endpoint yêu cầu xác thực:

Tất cả các endpoint còn lại đều yêu cầu header `Authorization: Bearer <TOKEN>`.

## Cấu trúc dự án

```text
gateway/
├── Dockerfile          # Cấu hình Docker multi-stage
├── pom.xml             # Quản lý build và dependency Maven
├── readme.md           # Tài liệu hướng dẫn (file này)
└── src/
    ├── main/
    │   ├── java/com/costume_rental/gateway/
    │   │   ├── configuration/ # Cấu hình Security (JWT, CORS)
    │   │   ├── dto/           # Đối tượng chuyển đổi dữ liệu
    │   │   ├── exception/     # Xử lý lỗi tập trung
    │   │   └── GatewayApplication.java
    │   └── resources/
    │       └── application.yaml # Cấu hình Discovery & Config Server
    └── test/           # Unit và Integration tests
```

## Chạy dịch vụ cục bộ

Khuyến khích chạy toàn bộ hệ thống thông qua Docker Compose ở thư mục gốc:

```bash
# From project root
docker compose up gateway --build

# Or run locally
cd gateway
./mvnw spring-boot:run
```

## Biến môi trường quan trọng

| Biến môi trường     | Mô tả                           | Giá trị mặc định                |
| ------------------- | ------------------------------- | ------------------------------- |
| `SERVER_PORT`       | Cổng chạy Gateway               | `8080`                          |
| `EUREKA_SERVER_URL` | URL của Eureka Discovery Server | `http://localhost:9999/eureka/` |
| `CONFIG_SERVER_URL` | URL của Config Service          | `http://localhost:8888`         |

---

## Giám sát và Tài liệu

- **Health Check**: `http://localhost:8080/actuator/health`
- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **Eureka Dashboard**: `http://localhost:9999` (Thông qua Discovery Service)
