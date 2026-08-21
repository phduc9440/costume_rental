# Dịch vụ Khám phá (Discovery Service)

## Tổng quan

Dịch vụ Khám phá (Discovery Service) sử dụng Netflix Eureka để quản lý danh sách các vi dịch vụ đang hoạt động trong hệ thống. Nó đóng vai trò như một "danh bạ điện thoại" giúp các dịch vụ tìm thấy nhau một cách động.

### Trách nhiệm chính

- **Đăng ký dịch vụ (Service Registration):** Ghi nhận địa chỉ IP và cổng của các dịch vụ khi chúng khởi động.
- **Phát hiện dịch vụ (Service Discovery):** Cung cấp địa chỉ của một dịch vụ cho các dịch vụ khác cần liên lạc.
- **Kiểm tra trạng thái (Health Check):** Tự động loại bỏ các dịch vụ bị treo hoặc ngừng hoạt động khỏi danh sách.

## Công nghệ sử dụng

| Thành phần | Lựa chọn                           |
| ---------- | ---------------------------------- |
| Ngôn ngữ   | Java 21                            |
| Framework  | Spring Cloud Netflix Eureka Server |

---

## Biến môi trường

Dịch vụ lấy cấu hình từ Config Service.

| Biến môi trường     | Mô tả                  | Giá trị mặc định        |
| ------------------- | ---------------------- | ----------------------- |
| `SERVER_PORT`       | Cổng chạy dịch vụ      | `9999`                  |
| `CONFIG_SERVER_URL` | URL của Config Service | `http://localhost:8888` |

---

## Cấu trúc dự án

```text
discovery-service/
├── Dockerfile          # Cấu hình Docker multi-stage
├── pom.xml             # Quản lý build và dependency Maven
├── readme.md           # Tài liệu hướng dẫn (file này)
└── src/
    ├── main/
    │   ├── java/com/costume_rental/discovery/
    │   │   └── DiscoveryApplication.java # Entry point với @EnableEurekaServer
    │   └── resources/
    │       └── application.yaml # Cấu hình cổng và Eureka server
    └── test/           # Unit tests
```

## Chạy dịch vụ cục bộ

Khuyến khích chạy thông qua Docker Compose ở thư mục gốc:

```bash
# Từ project root
docker compose up discovery-service --build
```

Để chạy riêng lẻ bằng Maven:
```bash
# Trong thư mục discovery-service
./mvnw spring-boot:run
```

---

## Giám sát
- **Eureka Dashboard:** `http://localhost:9999`
- **Health Check:** `http://localhost:9999/actuator/health`
