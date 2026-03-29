package com.kien.vehicle.booking.controller.admin;

import com.kien.vehicle.booking.dto.response.ApiResponse;
import com.kien.vehicle.booking.dto.response.BookingResponse;
import com.kien.vehicle.booking.dto.response.BookingSummaryResponse;
import com.kien.vehicle.booking.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/bookings")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminBookingController {

    private final BookingService bookingService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<BookingSummaryResponse>>> getAllBookings() {
        List<BookingSummaryResponse> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Lấy danh sách tất cả booking thành công", bookings)
        );
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<BookingResponse>> cancelBooking(@PathVariable Long id) {
        BookingResponse response = bookingService.cancelBooking(id, null, true);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Hủy booking thành công", response)
        );
    }
}