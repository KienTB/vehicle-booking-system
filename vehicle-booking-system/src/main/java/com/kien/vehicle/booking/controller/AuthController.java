package com.kien.vehicle.booking.controller;

import com.kien.vehicle.booking.dto.request.LoginRequest;
import com.kien.vehicle.booking.dto.request.RegisterRequest;
import com.kien.vehicle.booking.dto.response.ApiResponse;
import com.kien.vehicle.booking.dto.response.AuthenticationResponse;
import com.kien.vehicle.booking.service.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthenticationResponse>> register(@RequestBody RegisterRequest request) {
        try {
            if (request.phone() == null || request.phone().isEmpty() ||
                    request.password() == null || request.password().isEmpty()) {
                logger.warn("Missing required fields for registration");
                return ResponseEntity.badRequest().body(
                        new ApiResponse<>(false, "Vui lòng điền đầy đủ thông tin", null));
            }

            AuthenticationResponse response = authService.register(request);
            return ResponseEntity.ok(new ApiResponse<>(true, "Đăng ký thành công", response));
        } catch (IllegalArgumentException e) {
            logger.warn("Registration failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            logger.error("Unexpected error during registration", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new ApiResponse<>(false, "Lỗi hệ thống", null));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthenticationResponse>> login(@RequestBody LoginRequest request) {
        try {
            if (request.phone() == null || request.password() == null) {
                return ResponseEntity.badRequest().body(
                        new ApiResponse<>(false, "Thiếu thông tin đăng nhập", null));
            }

            AuthenticationResponse response = authService.login(request);
            return ResponseEntity.ok(new ApiResponse<>(true, "Đăng nhập thành công", response));
        } catch (BadCredentialsException e) {
            logger.warn("Login failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(false, "Số điện thoại hoặc mật khẩu không đúng", null));
        } catch (Exception e) {
            logger.error("Unexpected error during login", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new ApiResponse<>(false, "Lỗi hệ thống", null));
        }
    }

    // Endpoint /refresh-token sẽ thêm ở bước sau nếu bạn có RefreshTokenService
}