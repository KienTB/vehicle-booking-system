package com.kien.vehicle.booking.service;

import com.kien.vehicle.booking.dto.request.PaymentRequest;
import com.kien.vehicle.booking.dto.response.PaymentResponse;
import com.kien.vehicle.booking.dto.response.PaymentSummaryResponse;
import com.kien.vehicle.booking.model.PaymentStatus;

import java.util.List;

public interface PaymentService {
    List<PaymentSummaryResponse> getMyPayments(String currentUserPhone);
    PaymentResponse getPaymentById(Long paymentId, String currentUserPhone, boolean isAdmin);
    PaymentResponse confirmPayment(Long invoiceId, PaymentStatus result);
    List<PaymentSummaryResponse> getAllPayments(PaymentStatus paymentStatus);
}
