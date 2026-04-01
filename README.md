# 🚗 Vehicle Booking System

Hệ thống quản lý đặt xe (Car Rental Management System) gồm hai phần:

- **Backend**: Spring Boot 3.3.5 + Java 21 + MySQL
- **Frontend**: Next.js 16.2.0 + React 19 + TypeScript

---

## 📋 Yêu cầu hệ thống

| Thành phần | Phiên bản yêu cầu |
|---|---|
| JDK | **21** (LTS) |
| IntelliJ IDEA | 2023.1 trở lên (Community hoặc Ultimate) |
| Node.js | **18.x** trở lên (khuyến nghị 20.x LTS) |
| npm | **9.x** trở lên |
| MySQL | 8.x |

---

## 🔧 Backend – Spring Boot

### 1. Cài đặt JDK 21

- Tải JDK 21 tại: https://adoptium.net/ hoặc https://www.oracle.com/java/technologies/downloads/#java21
- Cài đặt và thiết lập biến môi trường `JAVA_HOME` trỏ đến thư mục cài đặt JDK 21.
- Kiểm tra phiên bản:
  ```bash
  java -version
  # java version "21.x.x" ...
  ```

### 2. Cấu hình Database

- Tạo database MySQL và cập nhật thông tin kết nối trong file:
  ```
  backend/src/main/resources/application.properties
  ```
  ```properties
  spring.datasource.url=jdbc:mysql://localhost:3306/vehicle_booking
  spring.datasource.username=root
  spring.datasource.password=your_password
  ```

### 3. Chạy Backend bằng IntelliJ IDEA

1. Mở **IntelliJ IDEA** → chọn **Open** → trỏ đến thư mục `backend/`
2. IntelliJ sẽ tự động nhận diện project Gradle và tải dependencies.
3. Đảm bảo **Project SDK** được đặt là **Java 21**:
   - Vào `File` → `Project Structure` → `Project` → chọn **SDK = 21**
4. Tìm class `VehicleBookingSystemApplication.java` (trong `src/main/java`)
5. Click chuột phải → **Run 'VehicleBookingSystemApplication'**
6. Backend mặc định chạy tại: **http://localhost:8080**
7. Swagger UI: **http://localhost:8080/swagger-ui/index.html**

> **Lưu ý:** Nếu IntelliJ chưa tự build Gradle, vào tab **Gradle** ở thanh bên phải → click **🔄 Reload All Gradle Projects**.

---

## 🌐 Frontend – Next.js

### 1. Yêu cầu Node.js

- Tải và cài đặt **Node.js 20.x LTS** tại: https://nodejs.org/
- Kiểm tra phiên bản:
  ```bash
  node -v
  # v20.x.x
  npm -v
  # 10.x.x
  ```

### 2. Chạy Frontend

Mở terminal (Command Prompt / PowerShell) và thực hiện các lệnh sau:

```bash
# Bước 1: Di chuyển vào thư mục frontend
cd E:\Dowloads\vehicle-booking-system\frontend

# Bước 2: Cài đặt dependencies
npm install

# Bước 3: Khởi động development server
npx next dev
```

Frontend sẽ chạy tại: **http://localhost:3000**

> **Lưu ý:** Đảm bảo backend đang chạy ở `http://localhost:8080` trước khi sử dụng frontend.

---

## 🗂️ Cấu trúc thư mục

```
vehicle-booking-system/
├── backend/          # Spring Boot API (Java 21)
│   ├── src/
│   ├── build.gradle
│   └── ...
└── frontend/         # Next.js App (React 19)
    ├── app/
    ├── components/
    ├── package.json
    └── ...
```

---

## 🚀 Thứ tự khởi chạy

1. ✅ Khởi động **MySQL** database
2. ✅ Chạy **Backend** (IntelliJ IDEA) → http://localhost:8080
3. ✅ Chạy **Frontend** (terminal) → http://localhost:3000

--- 

## 📞 Hỗ trợ

Nếu gặp lỗi, hãy kiểm tra:
- Java version: `java -version`
- Node version: `node -v`
- MySQL đang chạy
- File `application.properties` đã cấu hình đúng thông tin database
