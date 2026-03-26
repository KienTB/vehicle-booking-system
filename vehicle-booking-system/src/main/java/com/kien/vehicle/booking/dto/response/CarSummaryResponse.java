package com.kien.vehicle.booking.dto.response;

import com.kien.vehicle.booking.model.CarStatus;

import java.math.BigDecimal;

public record CarSummaryResponse(
        Long id,
        String name,
        String brand,
        String licensePlate,
        BigDecimal pricePerDay,
        CarStatus status,
        String imageUrl,
        Integer seats,
        String location
) {
}