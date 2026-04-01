package com.kien.vehicle.booking.dto.response;

import com.kien.vehicle.booking.model.CarStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CarResponse(
        Long id,
        String name,
        String brand,
        String model,
        String licensePlate,
        BigDecimal pricePerDay,
        CarStatus status,
        String imageUrl,
        Integer seats,
        String transmission,
        String fuelType,
        String location,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}