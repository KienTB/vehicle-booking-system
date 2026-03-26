package com.kien.vehicle.booking.dto.response;

import com.kien.vehicle.booking.model.InvoiceStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record InvoiceResponse(
        Long invoiceId,
        String invoiceNumber,
        Long bookingId,
        Long userId,
        String userName,
        String userPhone,
        Long carId,
        String carName,
        String carBrand,
        String carLicensePlate,
        LocalDate startDate,
        LocalDate endDate,
        BigDecimal totalAmount,
        InvoiceStatus status,
        String paymentMethod,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
