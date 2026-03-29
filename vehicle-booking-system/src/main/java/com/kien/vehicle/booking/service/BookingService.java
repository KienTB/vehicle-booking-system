package com.kien.vehicle.booking.service;

import com.kien.vehicle.booking.dto.request.BookingCreateRequest;
import com.kien.vehicle.booking.dto.response.BookingResponse;
import com.kien.vehicle.booking.dto.response.BookingSummaryResponse;

import java.util.List;

public interface BookingService {

    BookingResponse createBooking(BookingCreateRequest request, String currentUserPhone);

    List<BookingSummaryResponse> getAllBookings();

    List<BookingSummaryResponse> getMyBookings(String currentUserPhone);

    BookingResponse getBookingById(Long bookingId, String currentUserPhone, boolean isAdmin);

    BookingResponse cancelBooking(Long bookingId, String currentUserPhone, boolean isAdmin);
}