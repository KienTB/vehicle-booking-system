# Vehicle Booking System

RESTful API quan ly dat xe cho thue (car rental).
Spring Boot + JWT + MySQL + Swagger UI.

---

## Tech Stack

- Java 21
- Spring Boot 3.3.5
- Spring Data JPA (Hibernate)
- MySQL
- SpringDoc OpenAPI (Swagger UI)
- Spring Mail
- Gradle

---

## Security & Roles

- JWT stateless authentication
- Refresh token rotation
- Roles:
  - `ADMIN`: quan ly xe, booking, xac nhan thanh toan, quan ly hoa don
  - `USER`: dang ky/dang nhap, xem xe, dat xe, xem hoa don va payment

---

## Module Overview

### Module 2 - Authentication & User

**Muc tieu:** Dang ky, dang nhap, refresh token, quan ly profile.

**Endpoints:**

| Method | Endpoint | Role |
|--------|----------|------|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| POST | /api/auth/refresh | Public |
| POST | /api/auth/logout | USER |
| GET | /api/user/me | USER |
| PUT | /api/user/me | USER |
| POST | /api/user/change-password | USER |

### Module 3 - Security & JWT

- JWT generate/validate
- `JwtAuthenticationFilter`
- Rate limit login/register
- Stateless session + RBAC

### Module 4 - Car Management

**Muc tieu:** USER xem xe, ADMIN CRUD xe.

**Endpoints:**

| Method | Endpoint | Role |
|--------|----------|------|
| GET | /api/cars | Public |
| GET | /api/cars/{id} | Public |
| GET | /api/cars/{id}/availability | Public |
| POST | /api/admin/cars | ADMIN |
| PUT | /api/admin/cars/{id} | ADMIN |
| DELETE | /api/admin/cars/{id} | ADMIN |

**Car Status:**

```text
AVAILABLE   -> xe san sang cho thue
PENDING     -> xe duoc tam giu trong thoi gian cho thanh toan
BOOKED      -> booking da thanh toan thanh cong
MAINTENANCE -> xe dang bao duong
DISABLED    -> xe da bi xoa (soft delete)
```

### Module 5 - Booking Management

**Muc tieu:** USER tao/xem/huy booking, ADMIN xem/huy booking.

**Endpoints:**

| Method | Endpoint | Role |
|--------|----------|------|
| POST | /api/bookings | USER |
| GET | /api/bookings/my-bookings | USER |
| GET | /api/bookings/{id} | USER |
| PUT | /api/bookings/{id}/cancel | USER |
| GET | /api/admin/bookings | ADMIN |
| PUT | /api/admin/bookings/{id}/cancel | ADMIN |

**Business Rules:**

- Kiem tra trung lich (overlapping) truoc khi tao booking
- Gia booking = so ngay thue x gia xe/ngay
- Booking tao ra voi status `PENDING`
- Invoice tu dong sinh ngay khi booking duoc tao voi status `UNPAID`
- Car chuyen sang `PENDING` khi booking de tam giu xe cho thanh toan
- USER chi huy duoc booking khi status `PENDING`
- ADMIN co the huy booking o bat ky trang thai nao
- Booking `PENDING` + invoice `UNPAID` se auto-expire khi qua timeout thanh toan
- Config timeout/interval:
  - `booking.expiration.pending-payment-timeout=15m`
  - `booking.expiration.cleanup-interval=5m`

**Booking Status Flow:**

```text
PENDING -> COMPLETED  (payment SUCCESS)
PENDING -> CANCELLED  (user/admin huy, payment FAILED, hoac auto-expire)
```

### Module 6 - Invoice Management

**Muc tieu:** Quan ly hoa don, tu dong sinh khi tao booking.

**Endpoints:**

| Method | Endpoint | Role |
|--------|----------|------|
| GET | /api/invoices/my-invoices | USER |
| GET | /api/invoices/{id} | USER |
| GET | /api/admin/invoices | ADMIN |

**Invoice Status Flow:**

```text
UNPAID -> PAID   (payment SUCCESS)
UNPAID -> FAILED (payment FAILED hoac auto-expire)
```

### Module 7 - Payment Management

**Muc tieu:** ADMIN xac nhan thanh toan va cap nhat trang thai lien quan.

**Endpoints:**

| Method | Endpoint | Role |
|--------|----------|------|
| GET | /api/payments/my-payments | USER |
| GET | /api/payments/{id} | USER |
| GET | /api/admin/payments | ADMIN |
| PUT | /api/admin/payments/confirm/{invoiceId} | ADMIN |

**Khi confirm SUCCESS:**

```text
Payment -> SUCCESS
Invoice -> PAID
Booking -> COMPLETED
Car     -> BOOKED
```

**Khi confirm FAILED:**

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

- Gui OTP reset password
- Gui email async (`@Async`)

### Module 10 - Monitoring & Observability

- Actuator: health, metrics, loggers
- Structured logging + MDC

---

## Pagination

Tat ca endpoint list ho tro:

- `page` (default `0`)
- `size` (default `10`, max `50`)

---

## Business Flow hoan chinh

```text
1. USER dang ky / dang nhap
   -> Nhan Access Token (15 phut) + Refresh Token (7 ngay)

2. USER xem danh sach xe available
   GET /api/cars

3. USER xem lich xe truoc khi dat
   GET /api/cars/{id}/availability

4. USER tao booking
   POST /api/bookings
   -> Booking: PENDING
   -> Invoice: UNPAID
   -> Car: PENDING

5. USER chuyen khoan theo thong tin hoa don (ngoai he thong)

6. Scheduler auto-expire booking qua han thanh toan
   Chay dinh ky theo `booking.expiration.cleanup-interval` (mac dinh 5m)
   Neu qua `booking.expiration.pending-payment-timeout` (mac dinh 15m):
   -> Booking: CANCELLED
   -> Invoice: FAILED
   -> Car: AVAILABLE

7. ADMIN confirm payment
   PUT /api/admin/payments/confirm/{invoiceId}

   Neu SUCCESS:
   -> Payment: SUCCESS
   -> Invoice: PAID
   -> Booking: COMPLETED
   -> Car: BOOKED

   Neu FAILED:
   -> Payment: FAILED
   -> Invoice: FAILED
   -> Booking: CANCELLED
   -> Car: AVAILABLE
```

---

## Main Entities

| Entity | Mo ta |
|--------|-------|
| User | Tai khoan nguoi dung |
| Car | Thong tin xe cho thue |
| Booking | Don dat xe |
| Invoice | Hoa don thanh toan (1-1 voi Booking) |
| Payment | Giao dich (1-1 voi Invoice) |
| RefreshToken | Refresh token cua user |
| PasswordResetToken | OTP dat lai mat khau |

**Relationships:**

```text
User    1 ---- N Booking
Car     1 ---- N Booking
Booking 1 ---- 1 Invoice
Invoice 1 ---- 1 Payment
User    1 ---- 1 RefreshToken
User    1 ---- 1 PasswordResetToken
```
