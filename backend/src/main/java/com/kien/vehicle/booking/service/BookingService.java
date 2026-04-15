package com.kien.vehicle.booking.service;

import com.kien.vehicle.booking.dto.request.BookingCreateRequest;
import com.kien.vehicle.booking.dto.response.BookingResponse;
import com.kien.vehicle.booking.dto.response.BookingSummaryResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingService {

    BookingResponse createBooking(BookingCreateRequest request, String currentUserPhone);

    Page<BookingSummaryResponse> getAllBookings(Pageable pageable);

    Page<BookingSummaryResponse> getMyBookings(String currentUserPhone, Pageable pageable);

    BookingResponse getBookingById(Long bookingId, String currentUserPhone, boolean isAdmin);

    BookingResponse cancelBooking(Long bookingId, String currentUserPhone, boolean isAdmin);

    List<Long> expirePendingUnpaidBookings(LocalDateTime cutoff);
}
