package com.kien.vehicle.booking.controller;

import com.kien.vehicle.booking.dto.response.ApiResponse;
import com.kien.vehicle.booking.dto.response.CarAvailabilityResponse;
import com.kien.vehicle.booking.dto.response.CarResponse;
import com.kien.vehicle.booking.dto.response.CarSummaryResponse;
import com.kien.vehicle.booking.model.CarStatus;
import com.kien.vehicle.booking.service.CarService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/cars")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class CarController {

    private final CarService carService;

    @GetMapping()
    public ResponseEntity<ApiResponse<List<CarSummaryResponse>>> getAllCars(
            @RequestParam(required = false, defaultValue = "true") boolean onlyAvailable,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) CarStatus status) {

        List<CarSummaryResponse> cars;
        if (brand != null || minPrice != null || maxPrice != null || status != null) {
            cars = carService.searchCars(brand, minPrice, maxPrice, status);
        } else {
            cars = carService.getAllCars(onlyAvailable);
        }

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Lấy danh sách xe thành công", cars)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CarResponse>> getCarById(@PathVariable Long id) {
        CarResponse car = carService.getCarById(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Lấy chi tiết xe thành công", car)
        );
    }

    @GetMapping("/{id}/availability")
    public ResponseEntity<ApiResponse<CarAvailabilityResponse>> getCarAvailability(@PathVariable Long id) {
        CarAvailabilityResponse availabilityResponse = carService.getCarAvailability(id);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Lấy lịch xe thành công", availabilityResponse));
    }
}