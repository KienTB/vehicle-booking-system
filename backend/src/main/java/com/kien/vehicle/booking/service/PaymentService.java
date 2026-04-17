package com.kien.vehicle.booking.service;

import com.kien.vehicle.booking.dto.request.PaymentRequest;
import com.kien.vehicle.booking.dto.response.PaymentResponse;
import com.kien.vehicle.booking.dto.response.PaymentSummaryResponse;
import com.kien.vehicle.booking.entity.enums.PaymentStatus;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PaymentService {
    Page<PaymentSummaryResponse> getMyPayments(String currentUserPhone, Pageable pageable);
    PaymentResponse getPaymentById(Long paymentId, String currentUserPhone, boolean isAdmin);
    PaymentResponse confirmPayment(Long invoiceId, PaymentStatus result);
    Page<PaymentSummaryResponse> getAllPayments(PaymentStatus paymentStatus, Pageable pageable);
}

