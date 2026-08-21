# Dịch vụ Khách hàng (Customer Service)

## Tổng quan

Dịch vụ Khách hàng (Customer Service) là trung tâm quản lý định danh và thông tin người dùng trong hệ sinh thái Thuê Trang Phục. Dịch vụ này đóng vai trò là "nguồn chân lý" (Source of Truth) cho tất cả các thực thể liên quan đến con người tham gia vào hệ thống.

### Trách nhiệm chính

- **Quản lý Định danh (Identity Management):** Xử lý đăng ký, đăng nhập và xác thực cho cả khách hàng và nhân viên.
- **Quản lý Hồ sơ (Profile Management):** Lưu trữ và cập nhật thông tin chi tiết của khách hàng (tên, SĐT, địa chỉ) và nhân viên (chức vụ).
- **Phân quyền (Authorization):** Định nghĩa vai trò (Role) cho người dùng để kiểm soát quyền truy cập trên toàn hệ thống.
- **Thống kê dữ liệu khách hàng:** Cung cấp thông tin tổng hợp về hành vi khách hàng, ví dụ như tổng doanh thu từ một khách hàng cụ thể.

### Phạm vi nghiệp vụ

Dịch vụ này tập trung hoàn toàn vào việc quản lý con người trong hệ thống. Nó chịu trách nhiệm xác thực người dùng (đăng ký/đăng nhập) và lưu giữ hồ sơ chi tiết của khách hàng cũng như nhân viên.

### Dữ liệu sở hữu

Dịch vụ quản trị cơ sở dữ liệu `customer_db` bao gồm các bảng chính:

| Bảng        | Mô tả dữ liệu                    | Các trường chính                                 |
| ----------- | -------------------------------- | ------------------------------------------------ |
| `members`   | Thông tin định danh và tài khoản | `id`, `username`, `password`, `role`             |
| `customers` | Hồ sơ chi tiết của khách hàng    | `member_id`, `name`, `phone`, `address`, `email` |
| `employees` | Hồ sơ chi tiết của nhân viên     | `member_id`, `position`                          |

---

## Các Endpoint API

### 1. Xác thực & Đăng ký (`/auth`)

| Phương thức | Endpoint         | Mô tả                            | Quyền truy cập |
| ----------- | ---------------- | -------------------------------- | -------------- |
| POST        | `/auth/login`    | Đăng nhập và nhận JWT token      | Công khai      |
| POST        | `/auth/register` | Đăng ký tài khoản khách hàng mới | Công khai      |

### 2. Quản lý Khách hàng (`/customers`)

| Phương thức | Endpoint                   | Mô tả                                          | Quyền truy cập |
| ----------- | -------------------------- | ---------------------------------------------- | -------------- |
| GET         | `/customers`               | Danh sách tất cả khách hàng (phân trang)       | Admin/Employee |
| GET         | `/customers/{id}`          | Chi tiết thông tin một khách hàng              | Admin/Employee |
| GET         | `/customers/phone/{phone}` | Tìm khách hàng theo số điện thoại              | Admin/Employee |
| PUT         | `/customers/{id}`          | Cập nhật thông tin khách hàng bất kỳ           | Admin/Employee |
| DELETE      | `/customers/{id}`          | Xóa khách hàng khỏi hệ thống                   | Admin          |
| GET         | `/customers/{id}/revenue`  | Lấy tổng doanh thu từ một khách hàng           | Admin/Employee |
| GET         | `/customers/my-profile`    | Lấy hồ sơ cá nhân của người dùng hiện tại      | Customer       |
| PUT         | `/customers/my-profile`    | Cập nhật hồ sơ cá nhân của người dùng hiện tại | Customer       |

### 3. Quản lý Nhân viên (`/employees`)

| Phương thức | Endpoint          | Mô tả                                  | Quyền truy cập |
| ----------- | ----------------- | -------------------------------------- | -------------- |
| GET         | `/employees`      | Danh sách tất cả nhân viên             | Admin          |
| POST        | `/employees`      | Tạo mới tài khoản nhân viên (Internal) | Admin          |
| GET         | `/employees/{id}` | Chi tiết thông tin nhân viên           | Admin          |
| PUT         | `/employees/{id}` | Cập nhật thông tin nhân viên           | Admin          |
| DELETE      | `/employees/{id}` | Xóa tài khoản nhân viên                | Admin          |

### 3. Giám sát (Monitoring)

| Phương thức | Endpoint           | Mô tả                            |
| ----------- | ------------------ | -------------------------------- |
| GET         | `/actuator/health` | Trạng thái hoạt động của dịch vụ |

> Full API specification: [`docs/api-specs/customer-service.yaml`](../../docs/api-specs/customer-service.yaml)

## Cấu trúc dự án

```text
customer-service/
├── Dockerfile          # Cấu hình Docker multi-stage
├── pom.xml             # Quản lý build và dependency Maven
├── readme.md           # Tài liệu hướng dẫn (file này)
└── src/
    ├── main/
    │   ├── java/com/costume_rental/customer/
    │   │   ├── controller/ # Auth và Resource Endpoints
    │   │   ├── service/    # Quản lý định danh và hồ sơ
    │   │   ├── entity/     # Member, Customer, Employee (JPA)
    │   │   ├── repository/ # Truy vấn Spring Data JPA
    │   │   ├── dto/        # DTO cho Auth và Profile
    │   │   └── configuration/ # Cấu hình bảo mật nội bộ
    │   └── resources/
    │       └── application.yaml # Cấu hình cổng và kết nối DB
    └── test/           # Unit và Integration tests
```

## Chạy dịch vụ cục bộ

Khuyến khích chạy thông qua Docker Compose ở thư mục gốc:

```bash
# Từ project root
docker compose up customer-service --build
```

Để chạy riêng lẻ bằng Maven (Yêu cầu Discovery & Config Server):
```bash
# Trong thư mục customer-service
./mvnw spring-boot:run
```

## Biến môi trường

Dịch vụ có thể được cấu hình thông qua các biến môi trường sau (thay thế giá trị mặc định được lấy từ Config Service):

| Biến môi trường     | Mô tả                           | Giá trị mặc định                                                        |
| ------------------- | ------------------------------- | ----------------------------------------------------------------------- |
| `SERVER_PORT`       | Cổng chạy dịch vụ               | `5001`                                                                  |
| `CONFIG_SERVER_URL` | URL của Config Service          | `http://localhost:8888`                                                 |
| `EUREKA_SERVER_URL` | URL của Eureka Discovery Server | `http://localhost:9999/eureka/`                                         |
| `DB_URL_CUSTOMER`   | URL của MySQL database          | `jdbc:mysql://localhost:3306/customer_db?createDatabaseIfNotExist=true` |
| `DB_USERNAME`       | Tên đăng nhập cơ sở dữ liệu     | `root`                                                                  |
| `DB_PASSWORD`       | Mật khẩu cơ sở dữ liệu          | (trống)                                                                 |
