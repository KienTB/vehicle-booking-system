package com.kien.vehicle.booking.dto.response;

import com.kien.vehicle.booking.model.InvoiceStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record InvoiceSummaryResponse(
        Long invoiceId,
        String invoiceNumber,
        String carName,
        String carLicensePlate,
        LocalDate startDate,
        LocalDate endDate,
        BigDecimal totalAmount,
        InvoiceStatus invoiceStatus,
        LocalDateTime createAt
) {
}
