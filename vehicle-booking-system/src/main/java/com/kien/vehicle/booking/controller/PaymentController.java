package com.kien.vehicle.booking.controller;

import com.kien.vehicle.booking.dto.response.ApiResponse;
import com.kien.vehicle.booking.dto.response.PaymentResponse;
import com.kien.vehicle.booking.dto.response.PaymentSummaryResponse;
import com.kien.vehicle.booking.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class PaymentController {
    private final PaymentService paymentService;
    @GetMapping("/my-payments")
    public ResponseEntity<ApiResponse<List<PaymentSummaryResponse>>> getMyPayments(Authentication authentication) {
        String currentUserPhone = authentication.getName();
        List<PaymentSummaryResponse> payments = paymentService.getMyPayments(currentUserPhone);
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách payment của bạn thành công", payments));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PaymentResponse>> getPaymentById(@PathVariable Long id, Authentication authentication){
        String currentUserPhone = authentication.getName();
        PaymentResponse payment = paymentService.getPaymentById(id, currentUserPhone, false);
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy chi tiết payment thành công", payment));
    }
}
