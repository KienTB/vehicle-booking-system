package com.kien.vehicle.booking.controller;

import com.kien.vehicle.booking.dto.request.LoginRequest;
import com.kien.vehicle.booking.dto.request.RefreshTokenRequest;
import com.kien.vehicle.booking.dto.request.RegisterRequest;
import com.kien.vehicle.booking.dto.response.ApiResponse;
import com.kien.vehicle.booking.dto.response.AuthenticationResponse;
import com.kien.vehicle.booking.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthenticationResponse>> register(@RequestBody RegisterRequest request) {
        if (request.phone() == null || request.phone().isEmpty() ||
                request.password() == null || request.password().isEmpty()) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(false, "Vui lòng điền đầy đủ thông tin", null));
        }

        AuthenticationResponse response = authService.register(request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Đăng ký thành công", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthenticationResponse>> login(@RequestBody LoginRequest request) {
        if (request.phone() == null || request.password() == null) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse<>(false, "Thiếu thông tin đăng nhập", null));
        }

        AuthenticationResponse response = authService.login(request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Đăng nhập thành công", response));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthenticationResponse>> refresh(@RequestBody RefreshTokenRequest request) {
        AuthenticationResponse response = authService.refresh(request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Làm mới token thành công", response));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout(Authentication authentication){
        authService.logout(authentication.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Đăng xuất thành công", null));
    }
}