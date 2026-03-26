package com.kien.vehicle.booking.dto.response;

import com.kien.vehicle.booking.model.BookingStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record BookingResponse(
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
        BigDecimal totalPrice,
        BookingStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}