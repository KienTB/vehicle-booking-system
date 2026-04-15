package com.kien.vehicle.booking.service;

import com.kien.vehicle.booking.dto.request.CarCreateRequest;
import com.kien.vehicle.booking.dto.request.CarUpdateRequest;
import com.kien.vehicle.booking.dto.response.CarAvailabilityResponse;
import com.kien.vehicle.booking.dto.response.CarResponse;
import com.kien.vehicle.booking.dto.response.CarSummaryResponse;
import com.kien.vehicle.booking.model.CarStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;

public interface CarService {

    CarResponse createCar(CarCreateRequest request);

    CarResponse updateCar(Long id, CarUpdateRequest request);

    void deleteCar(Long id);

    CarResponse getCarById(Long id);

    Page<CarSummaryResponse> getAllCars(boolean onlyAvailable, Pageable pageable);

    Page<CarSummaryResponse> searchCars(
            boolean onlyAvailable,
            String brand,
            String name,
            String location,
            String transmission,
            String fuelType,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            List<Integer> seats,
            Pageable pageable
    );

    CarAvailabilityResponse getCarAvailability(Long carId);
}
