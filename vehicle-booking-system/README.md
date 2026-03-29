# 🚗 Vehicle Booking System

RESTful API quản lý đặt xe cho thuê (car rental).  
Spring Boot + JWT + MySQL + SwaggerUI.

---

## 📌 Tech Stack

- Java 21
- Spring Boot 3.3.5
- Spring Data JPA (Hibernate)
- MySQL
- Spring Security + JWT
- SpringDoc OpenAPI (Swagger UI)
- Gradle

---

## 🔐 Security & Roles

- **JWT stateless authentication**
- **Refresh Token rotation**
- **Roles**:
  - `ADMIN`: Quản lý xe, quản lý booking, xác nhận thanh toán, quản lý hóa đơn
  - `USER`: Đăng ký/đăng nhập, xem xe, đặt xe, xem hóa đơn & payment

---

## 📦 Module Overview

---

### Module 2 – Authentication & User

**Mục tiêu:** Đăng ký, đăng nhập, quản lý thông tin cá nhân, refresh token.

**Endpoints:**

| Method | Endpoint | Role | Mô tả |
|--------|----------|------|-------|
| POST | /api/auth/register | Public | Đăng ký tài khoản |
| POST | /api/auth/login | Public | Đăng nhập, nhận Access Token + Refresh Token |
| POST | /api/auth/refresh | Public | Xin Access Token mới bằng Refresh Token |
| POST | /api/auth/logout | USER | Đăng xuất, xóa Refresh Token |
| GET | /api/user/me | USER | Xem thông tin cá nhân |
| PUT | /api/user/me | USER | Cập nhật thông tin cá nhân |
| POST | /api/user/change-password | USER | Đổi mật khẩu |

**Business Rules:**
- Số điện thoại unique
- Password mã hóa BCrypt
- JWT stateless, role-based
- Mỗi user chỉ có 1 Refresh Token tại 1 thời điểm
- Refresh Token rotate mỗi lần sử dụng — token cũ bị xóa, token mới được cấp

---

### Module 3 – Security & JWT

**Mục tiêu:** Bảo mật toàn bộ API.

**Features:**
- JWT generate / validate
- Custom `JwtAuthenticationFilter`
- Rate limiting login (10 req/phút), register (5 req/phút) bằng Bucket4j
- Stateless session, RBAC

**Cơ chế verify JWT:**
```
Token gồm 3 phần: Header.Payload.Signature

Tạo token:
HMAC-SHA256(Header + Payload, secret_key) → Signature

Verify token:
1. Tách Header, Payload, Signature
2. Tính lại HMAC-SHA256(Header + Payload, secret_key)
3. So sánh với Signature trong token
   → Khớp + còn hạn → hợp lệ → cho đi tiếp
   → Không khớp     → reject 401
```

---

### Module 4 – Car Management

**Mục tiêu:** USER xem xe, ADMIN CRUD xe.

**Endpoints:**

| Method | Endpoint | Role | Mô tả |
|--------|----------|------|-------|
| GET | /api/cars | Public | Xem danh sách xe (filter brand, price, status) |
| GET | /api/cars/{id} | Public | Xem chi tiết xe |
| GET | /api/cars/{id}/availability | Public | Xem lịch các ngày đã được đặt của xe |
| POST | /api/admin/cars | ADMIN | Tạo xe mới |
| PUT | /api/admin/cars/{id} | ADMIN | Cập nhật thông tin xe |
| DELETE | /api/admin/cars/{id} | ADMIN | Xóa xe (soft delete) |

**Business Rules:**
- `licensePlate` unique
- Soft delete: chuyển status → `DISABLED`
- `GET /api/cars/{id}/availability` trả về danh sách ngày đã bị đặt từ hôm nay trở đi, dựa trên Booking table (không dựa vào `Car.status`)

**Car Status:**
```
AVAILABLE   → xe sẵn sàng cho thuê
BOOKED      → xe đang được giữ (set thủ công bởi Admin)
MAINTENANCE → xe đang bảo dưỡng
DISABLED    → xe đã bị xóa (soft delete)
```

---

### Module 5 – Booking Management

**Mục tiêu:** USER tạo/xem/hủy booking, ADMIN xem/hủy booking.

**Endpoints:**

| Method | Endpoint | Role | Mô tả |
|--------|----------|------|-------|
| POST | /api/bookings | USER | Tạo booking mới |
| GET | /api/bookings/my-bookings | USER | Xem danh sách booking của tôi |
| GET | /api/bookings/{id} | USER | Xem chi tiết booking của tôi |
| PUT | /api/bookings/{id}/cancel | USER | Hủy booking (chỉ khi PENDING) |
| GET | /api/admin/bookings | ADMIN | Xem tất cả booking |
| PUT | /api/admin/bookings/{id}/cancel | ADMIN | Hủy booking bất kỳ |

**Business Rules:**
- Kiểm tra trùng lịch (overlapping) bằng native query trước khi tạo booking
- Giá booking = số ngày thuê × giá xe/ngày
- Booking tạo ra với status `PENDING`
- **Invoice tự động sinh ngay khi booking được tạo** (status `UNPAID`)
- USER chỉ hủy được booking khi status = `PENDING`
- ADMIN có thể hủy booking ở bất kỳ trạng thái nào

**Booking Status Flow:**
```
PENDING → COMPLETED  (khi payment SUCCESS)
PENDING → CANCELLED  (khi user/admin hủy hoặc payment FAILED)
```

---

### Module 6 – Invoice Management

**Mục tiêu:** Quản lý hóa đơn, tự động sinh khi booking được tạo.

**Endpoints:**

| Method | Endpoint | Role | Mô tả |
|--------|----------|------|-------|
| GET | /api/invoices/my-invoices | USER | Xem danh sách hóa đơn của tôi |
| GET | /api/invoices/{id} | USER | Xem chi tiết hóa đơn của tôi |
| GET | /api/admin/invoices | ADMIN | Xem tất cả hóa đơn (filter theo status) |

**Query params:**
```
GET /api/admin/invoices?status=UNPAID
GET /api/admin/invoices?status=PAID
GET /api/admin/invoices?status=FAILED
```

**Business Rules:**
- Invoice tự động tạo khi booking được tạo, không thể tạo thủ công
- Quan hệ 1-1 giữa Booking và Invoice
- `totalAmount` = `totalPrice` của Booking
- Invoice number tự sinh theo format: `INV-{năm}-{số thứ tự 4 chữ số}` (VD: `INV-2026-0001`)
- USER chỉ xem được invoice của chính mình

**Invoice Status Flow:**
```
UNPAID → PAID    (khi payment SUCCESS)
UNPAID → FAILED  (khi payment FAILED)
```

---

### Module 7 – Payment Management

**Mục tiêu:** ADMIN xác nhận thanh toán, hệ thống tự động cập nhật trạng thái Invoice và Booking.

**Endpoints:**

| Method | Endpoint | Role | Mô tả |
|--------|----------|------|-------|
| GET | /api/payments/my-payments | USER | Xem danh sách payment của tôi |
| GET | /api/payments/{id} | USER | Xem chi tiết payment của tôi |
| GET | /api/admin/payments | ADMIN | Xem tất cả payment (filter theo status) |
| PUT | /api/admin/payments/confirm/{invoiceId} | ADMIN | Xác nhận thanh toán |

**Query params:**
```
GET /api/admin/payments?status=SUCCESS
GET /api/admin/payments?status=PENDING
GET /api/admin/payments?status=FAILED
```

**Confirm Payment Request Body:**
```json
{
    "result": "SUCCESS",
    "paymentMethod": "BANK_TRANSFER",
    "transactionCode": "FT26087123456"
}
```

**Business Rules:**
- Payment không do USER tạo thủ công — được tạo tự động khi ADMIN confirm
- Invoice phải ở trạng thái `UNPAID` mới confirm được
- Mỗi Invoice chỉ có tối đa 1 Payment (tránh double confirm)
- `paymentMethod` mặc định `BANK_TRANSFER` nếu không truyền
- `transactionCode` nullable — dùng cho đối soát, tích hợp gateway sau này

**Khi confirm SUCCESS:**
```
Payment  → SUCCESS
Invoice  → PAID
Booking  → COMPLETED
```

**Khi confirm FAILED:**
```
Payment  → FAILED
Invoice  → FAILED
Booking  → CANCELLED
Car      → AVAILABLE
```

**Payment Status:**
```
SUCCESS  → thanh toán thành công
FAILED   → thanh toán thất bại
```

**Payment Method:**
```
CASH          → tiền mặt
BANK_TRANSFER → chuyển khoản (mặc định)
MOMO          → placeholder tích hợp sau
ZALOPAY       → placeholder tích hợp sau
VNPAY         → placeholder tích hợp sau
```

---

### Module 8 – Exception & Validation

**Mục tiêu:** Xử lý lỗi tập trung, response thống nhất.

**Features:**
- `@RestControllerAdvice` — Global Exception Handler
- `ApiResponse<T>` wrapper thống nhất cho tất cả response
- Custom exceptions cho từng domain

---

## 🚀 Business Flow hoàn chỉnh

```
1. USER đăng ký / đăng nhập
   → Nhận Access Token (15 phút) + Refresh Token (7 ngày)

2. USER xem danh sách xe available
   GET /api/cars

3. USER xem lịch xe trước khi đặt
   GET /api/cars/{id}/availability
   → Trả về danh sách ngày đã bị đặt

4. USER tạo booking
   POST /api/bookings
   → Booking: PENDING
   → Invoice: UNPAID (tự sinh ngay)

5. USER chuyển khoản theo thông tin hóa đơn (ngoài hệ thống)

6. ADMIN xác nhận thanh toán
   PUT /api/admin/payments/confirm/{invoiceId}

   Nếu SUCCESS:
   → Payment:  SUCCESS
   → Invoice:  PAID
   → Booking:  COMPLETED

   Nếu FAILED:
   → Payment:  FAILED
   → Invoice:  FAILED
   → Booking:  CANCELLED
   → Car:      AVAILABLE

7. Access Token hết hạn trong quá trình sử dụng
   POST /api/auth/refresh { "refreshToken": "..." }
   → Rotate: xóa token cũ, cấp token mới
   → Tiếp tục dùng bình thường, user không cần làm gì

8. USER đăng xuất
   POST /api/auth/logout
   → Refresh Token bị xóa khỏi DB
   → Không thể xin Access Token mới
   → Access Token tự hết hạn sau 15 phút
```

---

## ⚙️ Setup & Run

### 1. Clone project

```bash
git clone https://github.com/your-username/vehicle-booking-system.git
cd vehicle-booking-system
```

---

**Entities chính:**

| Entity | Mô tả |
|--------|-------|
| User | Tài khoản người dùng (ADMIN / USER) |
| Car | Thông tin xe cho thuê |
| Booking | Đơn đặt xe |
| Invoice | Hóa đơn thanh toán (1-1 với Booking) |
| Payment | Lịch sử giao dịch (1-1 với Invoice) |
| RefreshToken | Refresh Token của user (1-1 với User, lưu DB) |

**Relationships:**
```
User         1 ──── N  Booking
Car          1 ──── N  Booking
Booking      1 ──── 1  Invoice
Invoice      1 ──── 1  Payment
User         1 ──── 1  RefreshToken
```
