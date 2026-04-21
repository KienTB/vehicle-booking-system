package com.kien.vehicle.booking.controller;

import com.kien.vehicle.booking.dto.response.ApiResponse;
import com.kien.vehicle.booking.dto.response.CarAvailabilityResponse;
import com.kien.vehicle.booking.dto.response.CarImageResponse;
import com.kien.vehicle.booking.dto.response.CarResponse;
import com.kien.vehicle.booking.dto.response.CarSummaryResponse;
import com.kien.vehicle.booking.dto.response.PageResponse;
import com.kien.vehicle.booking.entity.enums.FuelType;
import com.kien.vehicle.booking.entity.enums.Transmission;
import com.kien.vehicle.booking.service.CarImageService;
import com.kien.vehicle.booking.service.CarService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/cars")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class CarController {

    private final CarService carService;
    private final CarImageService carImageService;

    @GetMapping()
    public ResponseEntity<ApiResponse<PageResponse<CarSummaryResponse>>> getAllCars(
            @RequestParam(required = false, defaultValue = "true") boolean onlyAvailable,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Transmission transmission,
            @RequestParam(required = false) FuelType fuelType,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) List<Integer> seats,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, Math.min(size, 50));

        boolean hasAdvancedFilters = brand != null
                || minPrice != null
                || maxPrice != null
                || name != null
                || location != null
                || transmission != null
                || fuelType != null
                || (seats != null && !seats.isEmpty());

        Page<CarSummaryResponse> result;
        if (hasAdvancedFilters) {
            result = carService.searchCars(
                    onlyAvailable,
                    brand,
                    name,
                    location,
                    transmission,
                    fuelType,
                    minPrice,
                    maxPrice,
                    seats,
                    pageable
            );
        } else {
            result = carService.getAllCars(onlyAvailable, pageable);
        }

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Lay danh sach xe thanh cong", PageResponse.of(result)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CarResponse>> getCarById(@PathVariable Long id) {
        CarResponse car = carService.getCarById(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Lay chi tiet xe thanh cong", car)
        );
    }

    @GetMapping("/{id}/availability")
    public ResponseEntity<ApiResponse<CarAvailabilityResponse>> getCarAvailability(@PathVariable Long id) {
        CarAvailabilityResponse availabilityResponse = carService.getCarAvailability(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Lay lich xe thanh cong", availabilityResponse));
    }

    @GetMapping("/{carId}/images")
    public ResponseEntity<ApiResponse<List<CarImageResponse>>> getCarImages(@PathVariable Long carId) {
        List<CarImageResponse> images = carImageService.getCarImagesByCarId(carId);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Lay danh sach hinh anh xe thanh cong", images));
    }

    @GetMapping("/{carId}/images/primary")
    public ResponseEntity<ApiResponse<CarImageResponse>> getPrimaryCarImage(@PathVariable Long carId) {
        CarImageResponse primaryImage = carImageService.getPrimaryImageByCarId(carId);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Lay anh dai dien xe thanh cong", primaryImage));
    }
}
