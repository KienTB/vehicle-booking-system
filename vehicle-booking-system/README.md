# 🚗 Vehicle Booking System

Vehicle Booking System is a secure RESTful API for managing a car rental business.  
Built with Spring Boot, MySQL, JPA, and Spring Security using JWT authentication.

---

## 📌 Tech Stack

- Java 21
- Spring Boot 3.3.5
- Spring Data JPA (Hibernate)
- MySQL
- Spring Security
- JWT Authentication
- Gradle

---

## 🔐 Security & Authorization

Authentication and authorization are implemented using Spring Security with JWT (stateless).

### Roles

- **ADMIN**
  - Manage cars (CRUD)
  - View all bookings
  - Confirm / cancel bookings
  - Generate invoices
  - Confirm payments
  - Manage users

- **CUSTOMER**
  - Register & login
  - View available cars
  - Create bookings
  - View own bookings
  - Make payments

### Security Features

- JWT-based authentication
- Role-based access control (RBAC)
- Password encryption using BCrypt
- Stateless session management
- Custom JWT filter
- Global exception handling

---

## 🏗 Architecture

Layered Architecture:

controller → service → repository → database

Additional Security Layer:

security config → JWT filter → authentication provider

---

## 🗄 Database Design

Main Entities:

- Users (ADMIN / CUSTOMER)
- Car
- Booking
- Invoice
- Payment

### Relationships

- 1 User (CUSTOMER) → many Bookings
- 1 Car → many Bookings
- 1 Booking → 1 Invoice
- 1 Invoice → many Payments

---

## 🚀 Business Flow

1. User authenticates via JWT
2. Customer creates a booking (status: PENDING)
3. Admin confirms booking (status: CONFIRMED)
4. System generates invoice (status: UNPAID)
5. Customer makes payment
6. Invoice becomes PAID
7. Booking completed and car becomes AVAILABLE again

---

## 📌 Booking Status Flow

- PENDING
- CONFIRMED
- COMPLETED
- CANCELLED

## 📌 Car Status

- AVAILABLE
- RENTED
- MAINTENANCE

## 📌 Invoice Status

- UNPAID
- PAID

## 📌 Payment Status

- SUCCESS
- FAILED

---

## ⚙️ Setup & Run

### 1️⃣ Clone project

```bash
git clone https://github.com/your-username/vehicle-booking-system.git
cd vehicle-booking-system