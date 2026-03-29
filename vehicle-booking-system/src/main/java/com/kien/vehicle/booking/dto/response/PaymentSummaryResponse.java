package com.kien.vehicle.booking.dto.response;

import com.kien.vehicle.booking.model.PaymentMethod;
import com.kien.vehicle.booking.model.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record PaymentSummaryResponse(
        Long paymentId,
        Long invoiceId,
        String invoiceNumber,
        Long userId,
        String name,
        BigDecimal amount,
        PaymentMethod paymentMethod,
        PaymentStatus paymentStatus,
        LocalDateTime createAt
) {
}
