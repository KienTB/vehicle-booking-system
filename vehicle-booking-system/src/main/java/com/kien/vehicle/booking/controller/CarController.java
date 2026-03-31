package com.kien.vehicle.booking.controller;

import com.kien.vehicle.booking.dto.response.*;
import com.kien.vehicle.booking.model.CarStatus;
import com.kien.vehicle.booking.service.CarService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
    public ResponseEntity<ApiResponse<PageResponse<CarSummaryResponse>>> getAllCars(
            @RequestParam(required = false, defaultValue = "true") boolean onlyAvailable,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) CarStatus status,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, Math.min(size, 50));

        Page<CarSummaryResponse> result;
        if (brand != null || minPrice != null || maxPrice != null || status != null) {
            result = carService.searchCars(brand, minPrice, maxPrice, status, pageable);
        } else {
            result = carService.getAllCars(onlyAvailable, pageable);
        }

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Lấy danh sách xe thành công", PageResponse.of(result)));
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