package com.kien.vehicle.booking.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.kien.vehicle.booking.entity.enums.PaymentMethod;
import com.kien.vehicle.booking.entity.enums.PaymentStatus;

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

