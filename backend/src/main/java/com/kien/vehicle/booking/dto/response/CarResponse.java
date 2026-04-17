package com.kien.vehicle.booking.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.kien.vehicle.booking.entity.enums.CarStatus;
import com.kien.vehicle.booking.entity.enums.FuelType;
import com.kien.vehicle.booking.entity.enums.Transmission;

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
        Transmission transmission,
        FuelType fuelType,
        String location,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
