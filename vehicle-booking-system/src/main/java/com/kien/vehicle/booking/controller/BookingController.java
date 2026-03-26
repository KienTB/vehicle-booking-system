package com.kien.vehicle.booking.controller;

import com.kien.vehicle.booking.dto.request.BookingCreateRequest;
import com.kien.vehicle.booking.dto.response.ApiResponse;
import com.kien.vehicle.booking.dto.response.BookingResponse;
import com.kien.vehicle.booking.dto.response.BookingSummaryResponse;
import com.kien.vehicle.booking.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(
            @RequestBody @Valid BookingCreateRequest request,
            Authentication authentication) {

        String currentUserPhone = authentication.getName();

        BookingResponse response = bookingService.createBooking(request, currentUserPhone);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Tạo booking thành công", response));
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<ApiResponse<List<BookingSummaryResponse>>> getMyBookings(
            Authentication authentication) {

        String currentUserPhone = authentication.getName();

        List<BookingSummaryResponse> bookings = bookingService.getMyBookings(currentUserPhone);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Lấy danh sách booking của bạn thành công", bookings)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingById(
            @PathVariable Long id,
            Authentication authentication) {

        String currentUserPhone = authentication.getName();
        boolean isAdmin = false;

        BookingResponse response = bookingService.getBookingById(id, currentUserPhone, isAdmin);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Lấy chi tiết booking thành công", response)
        );
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<BookingResponse>> cancelMyBooking(
            @PathVariable Long id,
            Authentication authentication) {
        String currentUserPhone = authentication.getName();
        boolean isAdmin = false;

        BookingResponse response = bookingService.cancelBooking(id, currentUserPhone, isAdmin);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Huỷ booking thành công", response)
        );
    }
}