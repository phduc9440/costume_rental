# Dịch vụ Cấu hình (Config Service)

## Tổng quan

Dịch vụ Cấu hình (Config Service) là trung tâm quản lý cấu hình tập trung cho toàn bộ các vi dịch vụ trong hệ thống Thuê Trang Phục. Thay vì lưu trữ cấu hình rải rác ở từng dịch vụ, Config Service giúp quản lý chúng tại một nơi duy nhất.

### Trách nhiệm chính

- **Quản lý tập trung:** Lưu trữ các file cấu hình YAML/Properties cho tất cả các dịch vụ (`gateway`, `customer-service`, `rental-service`,...).
- **Cung cấp cấu hình động:** Các dịch vụ sẽ truy vấn cấu hình từ đây khi khởi động.
- **Bảo mật:** Giúp tập trung việc quản lý các thông tin nhạy cảm.

### Phạm vi nghiệp vụ

Dịch vụ này đóng vai trò là "Kho lưu trữ tri thức" về cách vận hành của hệ thống. Nó giúp đảm bảo tính nhất quán: khi thay đổi một thông số (ví dụ: URL cơ sở dữ liệu), bạn chỉ cần sửa tại đây thay vì phải vào từng dịch vụ để cập nhật.

---

## Công nghệ sử dụng

| Thành phần     | Lựa chọn                   |
| -------------- | -------------------------- |
| Ngôn ngữ       | Java 21                    |
| Framework      | Spring Cloud Config Server |
| Chế độ lưu trữ | Native (File system)       |

---

## Biến môi trường

| Biến môi trường | Mô tả             | Giá trị mặc định |
| --------------- | ----------------- | ---------------- |
| `SERVER_PORT`   | Cổng chạy dịch vụ | `8888`           |

---

## Cấu trúc dự án

```text
config-service/
├── Dockerfile          # Cấu hình Docker multi-stage
├── pom.xml             # Quản lý build và dependency Maven
├── readme.md           # Tài liệu hướng dẫn (file này)
└── src/
    ├── main/
    │   ├── java/com/costume_rental/config_service/
    │   │   └── ConfigServiceApplication.java # Entry point với @EnableConfigServer
    │   └── resources/
    │       ├── application.yaml # Cấu hình của chính Config Service
    │       └── shared/          # 🔹 TỔNG KHO CẤU HÌNH của tất cả microservices
    │           ├── gateway.yaml
    │           ├── rental-service.yaml
    │           ├── customer-service.yaml
    │           └── ...
    └── test/           # Unit tests
```

## Chạy dịch vụ cục bộ

Khuyến khích chạy thông qua Docker Compose ở thư mục gốc:

```bash
# Từ project root
docker compose up config-service --build
```

Để chạy riêng lẻ bằng Maven:
```bash
# Trong thư mục config-service
./mvnw spring-boot:run
```

---

## Giám sát & Kiểm tra
- **Health Check:** `http://localhost:8888/actuator/health`
- **Kiểm tra cấu hình (ví dụ gateway):** `http://localhost:8888/gateway/default`
