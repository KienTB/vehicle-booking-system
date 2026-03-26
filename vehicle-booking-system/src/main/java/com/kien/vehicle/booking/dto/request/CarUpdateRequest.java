package com.kien.vehicle.booking.dto.request;

import com.kien.vehicle.booking.model.CarStatus;

import java.math.BigDecimal;

public record CarUpdateRequest(
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
        String location
) {
}
