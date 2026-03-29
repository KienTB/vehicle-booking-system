package com.kien.vehicle.booking.controller.admin;

import com.kien.vehicle.booking.dto.response.ApiResponse;
import com.kien.vehicle.booking.dto.response.PaymentResponse;
import com.kien.vehicle.booking.dto.response.PaymentSummaryResponse;
import com.kien.vehicle.booking.model.PaymentStatus;
import com.kien.vehicle.booking.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/payments")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminPaymentController {
    private final PaymentService paymentService;
    @GetMapping
    public ResponseEntity<ApiResponse<List<PaymentSummaryResponse>>> getAllPayments(@RequestParam(required = false) PaymentStatus paymentStatus) {
        List<PaymentSummaryResponse> payments = paymentService.getAllPayments(paymentStatus);
        String message = paymentStatus != null ? "Lấy danh sách payment theo trạng thái " + paymentStatus + " thành công" : "Lấy danh sách tất cả payment thành công";
        return ResponseEntity.ok(new ApiResponse<>(true, message, payments));
    }

    @PutMapping("/confirm/{invoiceId}")
    public ResponseEntity<ApiResponse<PaymentResponse>> confirmPayment(@PathVariable Long invoiceId, @RequestParam PaymentStatus result){
        PaymentResponse payment = paymentService.confirmPayment(invoiceId, result);
        String message = result == PaymentStatus.SUCCESS ? "Xác nhận thanh toán thành công" : "Xác nhận thanh toán thất bại";
        return ResponseEntity.ok(new ApiResponse<>(true, message, payment));
    }
}
