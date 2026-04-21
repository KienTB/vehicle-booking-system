# Hệ Thống Đặt Xe (Vehicle Booking System)

API REST quản lý đặt xe cho thuê, xây dựng bằng Spring Boot, JWT, MySQL và Swagger UI.

---

## Công nghệ sử dụng

- Java 21
- Spring Boot 3.3.5
- Spring Data JPA (Hibernate)
- MySQL
- Flyway Migration
- Spring Security + JWT
- SpringDoc OpenAPI (Swagger UI)
- Spring Mail
- Actuator
- Gradle

---

## Bảo mật và phân quyền

- Xác thực JWT theo mô hình stateless
- Refresh token rotation
- Phân quyền:
  - `ADMIN`: quản lý xe, booking, xác nhận thanh toán, quản lý hóa đơn
  - `USER`: thao tác tài khoản, xem xe, đặt xe, xem hóa đơn/thanh toán

---

## Tổng quan module

### Module 2 - Authentication & User

**Mục tiêu:** Đăng ký, đăng nhập, refresh token, quản lý hồ sơ người dùng.

| Method | Endpoint | Quyền |
|--------|----------|-------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/refresh` | Public |
| POST | `/api/auth/logout` | USER |
| GET | `/api/user/me` | USER |
| PUT | `/api/user/me` | USER |
| POST | `/api/user/change-password` | USER |

### Module 3 - Security & JWT

- Tạo/validate JWT
- `JwtAuthenticationFilter`
- Rate limit cho endpoint đăng nhập/đăng ký
- Session stateless + RBAC

**Rate limit cho Auth**

- Áp dụng cho:
  - `POST /api/auth/login`
  - `POST /api/auth/register`
- Match theo `POST + exact path`
- Limit theo từng client (key: `endpoint:clientIp`)
- Khi vượt ngưỡng:
  - HTTP `429 Too Many Requests`
  - Header: `Retry-After`, `X-RateLimit-Remaining`
  - Body:
    - `{"success":false,"message":"Too many requests. Please try again later."}`
- Bucket in-memory có TTL, cleanup định kỳ để tránh phình RAM

### Module 4 - Car Management

**Mục tiêu:** Quản lý xe, tìm kiếm nâng cao, lọc theo nhiều tiêu chí.

| Method | Endpoint | Quyền |
|--------|----------|-------|
| GET | `/api/cars` | Public |
| GET | `/api/cars/{id}` | Public |
| GET | `/api/cars/{id}/availability` | Public |
| POST | `/api/admin/cars` | ADMIN |
| PUT | `/api/admin/cars/{id}` | ADMIN |
| DELETE | `/api/admin/cars/{id}` | ADMIN |

**Advanced Search & Filter - `GET /api/cars`**

- Query params hỗ trợ:
  - `onlyAvailable` (mặc định `true`)
  - `brand`, `name`, `location`
  - `transmission` (enum): `AUTOMATIC`, `MANUAL`
  - `fuelType` (enum): `GASOLINE`, `DIESEL`, `ELECTRIC`, `HYBRID`
  - `minPrice`, `maxPrice`
  - `seats` (multi-select): `4`, `5`, `7`, `8`, `9`
- Ví dụ:
  - `/api/cars?brand=toyota&minPrice=500000&maxPrice=1200000`
  - `/api/cars?location=hcm&transmission=AUTOMATIC&fuelType=GASOLINE`
  - `/api/cars?seats=4&seats=5&seats=7`
- Rule validate:
  - `minPrice <= maxPrice`, cả hai không âm
  - `seats` chỉ nhận: `4,5,7,8,9`

**Car Status**

```text
AVAILABLE   -> Xe sẵn sàng cho thuê
PENDING     -> Xe tạm giữ chờ thanh toán
BOOKED      -> Xe đã thanh toán thành công
MAINTENANCE -> Xe đang bảo dưỡng
DISABLED    -> Xe đã bị vô hiệu hóa (soft delete)
```

### Module 4.1 - Car Image Management (Cloudinary)

**Mục tiêu:** Quản lý nhiều ảnh cho mỗi xe, tách riêng khỏi `Car`, và đồng bộ quy tắc ảnh đại diện.

| Method | Endpoint | Quyền |
|--------|----------|-------|
| POST | `/api/admin/cars/{carId}/images` | ADMIN |
| GET | `/api/admin/cars/{carId}/images` | ADMIN |
| GET | `/api/admin/cars/{carId}/images/primary` | ADMIN |
| PATCH | `/api/admin/cars/{carId}/images/{carImageId}/primary` | ADMIN |
| GET | `/api/cars/{carId}/images` | USER |
| GET | `/api/cars/{carId}/images/primary` | USER |

**Business rules**

- Chỉ ADMIN được upload ảnh (hiện tại).
- Chỉ chấp nhận `jpg/jpeg/png`.
- Mỗi xe tối đa 5 ảnh.
- Ảnh đầu tiên tự động là primary.
- Upload ảnh mới giữ lại ảnh cũ.
- Đổi primary bằng endpoint PATCH riêng.

### Module 5 - Booking Management

**Mục tiêu:** USER tạo/xem/hủy booking, ADMIN xem/hủy booking.

| Method | Endpoint | Quyền |
|--------|----------|-------|
| POST | `/api/bookings` | USER |
| GET | `/api/bookings/my-bookings` | USER |
| GET | `/api/bookings/{id}` | USER |
| PUT | `/api/bookings/{id}/cancel` | USER |
| GET | `/api/admin/bookings` | ADMIN |
| PUT | `/api/admin/bookings/{id}/cancel` | ADMIN |

**Business rules**

- Kiểm tra trùng lịch trước khi tạo booking
- Giá booking = số ngày thuê x giá xe/ngày
- Booking tạo mới có trạng thái `PENDING`
- Invoice tự động tạo cùng booking với trạng thái `UNPAID`
- Car chuyển sang `PENDING` khi giữ xe chờ thanh toán
- USER chỉ được hủy booking khi trạng thái `PENDING`
- ADMIN có thể hủy booking ở mọi trạng thái
- Booking `PENDING` + invoice `UNPAID` sẽ auto-expire khi quá timeout
- Config:
  - `booking.expiration.pending-payment-timeout=15m`
  - `booking.expiration.cleanup-interval=5m`

**Booking status flow**

```text
PENDING -> COMPLETED  (payment SUCCESS)
PENDING -> CANCELLED  (user/admin hủy, payment FAILED, hoặc auto-expire)
```

### Module 6 - Invoice Management

**Mục tiêu:** Quản lý hóa đơn, tự động sinh khi tạo booking.

| Method | Endpoint | Quyền |
|--------|----------|-------|
| GET | `/api/invoices/my-invoices` | USER |
| GET | `/api/invoices/{id}` | USER |
| GET | `/api/admin/invoices` | ADMIN |

**Invoice status flow**

```text
UNPAID -> PAID   (payment SUCCESS)
UNPAID -> FAILED (payment FAILED hoặc auto-expire)
```

### Module 7 - Payment Management

**Mục tiêu:** ADMIN xác nhận thanh toán và cập nhật trạng thái liên quan.

| Method | Endpoint | Quyền |
|--------|----------|-------|
| GET | `/api/payments/my-payments` | USER |
| GET | `/api/payments/{id}` | USER |
| GET | `/api/admin/payments` | ADMIN |
| PUT | `/api/admin/payments/confirm/{invoiceId}` | ADMIN |

**Khi confirm SUCCESS**

```text
Payment -> SUCCESS
Invoice -> PAID
Booking -> COMPLETED
Car     -> BOOKED
```

**Khi confirm FAILED**

```text
Payment -> FAILED
Invoice -> FAILED
Booking -> CANCELLED
Car     -> AVAILABLE
```

### Module 8 - Exception & Validation

- Global exception handler (`@RestControllerAdvice`)
- Response wrapper `ApiResponse<T>`
- Domain error code

### Module 9 - Email Notification

- Gửi OTP reset mật khẩu
- Gửi email bất đồng bộ (`@Async`)

### Module 10 - Monitoring & Observability

- Actuator: health, metrics, loggers
- Structured logging + MDC

---

## Phân trang

Tất cả endpoint dạng danh sách hỗ trợ:

- `page` (mặc định `0`)
- `size` (mặc định `10`, tối đa `50`)

---

## Luồng nghiệp vụ chính

```text
1. USER đăng ký / đăng nhập
   -> Nhận Access Token (15 phút) + Refresh Token (7 ngày)

2. USER xem danh sách xe
   GET /api/cars

3. USER xem lịch xe trước khi đặt
   GET /api/cars/{id}/availability

4. USER tạo booking
   POST /api/bookings
   -> Booking: PENDING
   -> Invoice: UNPAID
   -> Car: PENDING

5. USER chuyển khoản theo thông tin hóa đơn (ngoài hệ thống)

6. Scheduler tự động expire booking quá hạn thanh toán
   Chạy định kỳ theo `booking.expiration.cleanup-interval` (mặc định 5m)
   Nếu quá `booking.expiration.pending-payment-timeout` (mặc định 15m):
   -> Booking: CANCELLED
   -> Invoice: FAILED
   -> Car: AVAILABLE

7. ADMIN xác nhận payment
   PUT /api/admin/payments/confirm/{invoiceId}

   Nếu SUCCESS:
   -> Payment: SUCCESS
   -> Invoice: PAID
   -> Booking: COMPLETED
   -> Car: BOOKED

   Nếu FAILED:
   -> Payment: FAILED
   -> Invoice: FAILED
   -> Booking: CANCELLED
   -> Car: AVAILABLE
```

---

## Entity chính

| Entity | Mô tả |
|--------|-------|
| User | Tài khoản người dùng |
| Car | Thông tin xe cho thuê |
| CarImage | Danh sách ảnh của xe, bao gồm ảnh primary |
| Booking | Đơn đặt xe |
| Invoice | Hóa đơn thanh toán (1-1 với Booking) |
| Payment | Giao dịch (1-1 với Invoice) |
| RefreshToken | Refresh token của user |
| PasswordResetToken | OTP đặt lại mật khẩu |

**Quan hệ**

```text
User    1 ---- N Booking
Car     1 ---- N Booking
Car     1 ---- N CarImage
Booking 1 ---- 1 Invoice
Invoice 1 ---- 1 Payment
User    1 ---- 1 RefreshToken
User    1 ---- 1 PasswordResetToken
```


