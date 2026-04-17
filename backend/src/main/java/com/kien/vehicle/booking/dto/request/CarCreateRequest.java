package com.kien.vehicle.booking.dto.request;

import java.math.BigDecimal;

import com.kien.vehicle.booking.entity.enums.CarStatus;
import com.kien.vehicle.booking.entity.enums.FuelType;
import com.kien.vehicle.booking.entity.enums.Transmission;

public record CarCreateRequest(
        String name,
        String brand,
        String model,
        String licensePlate,
        BigDecimal pricePerDay,
        CarStatus carStatus,
        String imageUrl,
        Integer seats,
        Transmission transmission,
        FuelType fuelType,
        String location
) {
}

