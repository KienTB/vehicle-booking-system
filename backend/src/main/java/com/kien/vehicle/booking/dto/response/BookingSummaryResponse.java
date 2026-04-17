package com.kien.vehicle.booking.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.kien.vehicle.booking.entity.enums.BookingStatus;

public record BookingSummaryResponse(
        Long bookingId,
        String carName,
        String carBrand,
        String carLicensePlate,
        LocalDate startDate,
        LocalDate endDate,
        BigDecimal totalPrice,
        BookingStatus status
) {
}

