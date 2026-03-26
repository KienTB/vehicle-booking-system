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
- **Roles**:
  - ADMIN: Quản lý xe, duyệt booking, hóa đơn, thanh toán, user
  - CUSTOMER: Đăng ký/đăng nhập, xem xe, đặt xe, thanh toán

---

## 🏗 Architecture

- Layered: Controller → Service → Repository → DB
- DTO pattern
- Global Exception Handling
- RESTful API
- API Documentation: Swagger UI / OpenAPI 3.0

---

## 📚 API Documentation

Swagger UI
Sau khi chạy ứng dụng, truy cập:

Swagger UI: http://localhost:8080/swagger-ui.html
API Docs (JSON): http://localhost:8080/v3/api-docs

---

## 📦 Module Overview

### Module 1 – Project Setup
- Khởi tạo Spring Boot project
- Cấu hình DB, JPA, logging

### Module 2 – Authentication & User
- Đăng ký / đăng nhập
- Profile, đổi mật khẩu
- Rate limiting login/register

**Endpoint**:
- POST /api/auth/register
- POST /api/auth/login
- GET/PUT /api/user/me
- POST /api/user/change-password

**Security**: JWT + role-based

### Module 3 – Security & JWT
- JWT generate/validate
- Custom filter
- Rate limiting

**Security**: Stateless, RBAC

### Module 4 – Car Management
- USER: Xem xe
- ADMIN: CRUD xe

**Endpoint**:
- GET /api/cars
- GET /api/cars/{id}
- POST /api/admin/cars
- PUT /api/admin/cars/{id}
- DELETE /api/admin/cars/{id}

**Rules**:
- licensePlate unique
- Soft delete (DISABLED)

**Security**:
- /api/cars/** → permitAll
- /api/admin/** → ADMIN

### Module 5 – Booking Management

**Mục tiêu**:  
Cho phép USER tạo/xem booking, ADMIN duyệt/hủy booking, kiểm tra trùng thời gian thuê xe.

**Business Rules**:
- Không đặt xe trùng thời gian (overlapping check bằng native query)
- Giá booking = số ngày thuê × giá xe/ngày
- Chỉ USER tạo booking (status PENDING)
- Chỉ ADMIN duyệt (PENDING → CONFIRMED hoặc CANCEL)
- Status flow: PENDING → CONFIRMED / CANCELLED → COMPLETED (sau thanh toán)

**Endpoints**:

**USER**:
- POST   /api/bookings              → Tạo booking mới
- GET    /api/bookings/my-bookings  → Xem danh sách booking của tôi
- GET    /api/bookings/{id}         → Xem chi tiết booking (của tôi)

**ADMIN**:
- GET    /api/admin/bookings        → Xem tất cả booking
- PUT    /api/admin/bookings/{id}/confirm → Duyệt booking
- PUT    /api/admin/bookings/{id}/cancel  → Hủy booking

### Module 6 – Invoice Management
- Tự động tạo khi confirm booking
- Xem invoice

**Endpoint**:
- GET /api/invoices/my-invoices
- GET /api/invoices/{id}
- GET /api/admin/invoices

**Rules**: 1 Booking → 1 Invoice (UNPAID → PAID)

### Module 7 – Payment Management
- USER thanh toán
- ADMIN xác nhận

**Endpoint**:
- POST /api/payments
- PUT /api/admin/payments/{id}/confirm

**Rules**: UNPAID → PAID/FAILED → cập nhật booking & xe

### Module 8 – Exception & Validation
- Global handler
- Bean Validation (@Valid)
- ApiResponse thống nhất

---

## 🚀 Business Flow

1. Authenticate → JWT
2. USER tạo booking (PENDING)
3. ADMIN confirm → invoice UNPAID
4. USER thanh toán
5. PAID → booking COMPLETED, xe AVAILABLE

---

## 📌 Status Flows

- **Booking**: PENDING → CONFIRMED → COMPLETED / CANCELLED
- **Car**: AVAILABLE / BOOKED / MAINTENANCE / DISABLED
- **Invoice**: UNPAID → PAID
- **Payment**: UNPAID → PAID / FAILED

---

## ⚙️ Setup & Run

1. Clone repo
   ```bash
   git clone https://github.com/your-username/vehicle-booking-system.git
   cd vehicle-booking-system