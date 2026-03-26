package com.kien.vehicle.booking.dto.response;

import com.kien.vehicle.booking.model.BookingStatus;

import java.math.BigDecimal;
import java.time.LocalDate;

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
