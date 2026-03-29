package com.kien.vehicle.booking.service;

import com.kien.vehicle.booking.dto.request.CarCreateRequest;
import com.kien.vehicle.booking.dto.request.CarUpdateRequest;
import com.kien.vehicle.booking.dto.response.CarAvailabilityResponse;
import com.kien.vehicle.booking.dto.response.CarResponse;
import com.kien.vehicle.booking.dto.response.CarSummaryResponse;
import com.kien.vehicle.booking.model.CarStatus;

import java.math.BigDecimal;
import java.util.List;

public interface CarService {

    CarResponse createCar(CarCreateRequest request);

    CarResponse updateCar(Long id, CarUpdateRequest request);

    void deleteCar(Long id);

    CarResponse getCarById(Long id);

    List<CarSummaryResponse> getAllCars(boolean onlyAvailable);

    List<CarSummaryResponse> searchCars(String brand, BigDecimal minPrice, BigDecimal maxPrice, CarStatus status);

    CarAvailabilityResponse getCarAvailability(Long carId);
}