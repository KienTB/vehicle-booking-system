package com.kien.vehicle.booking.exception;

public class BookingNotFoundException extends RuntimeException {
    public BookingNotFoundException(Long bookingId) {
        super("Không tìm thấy booking với ID: " + bookingId);
    }
    public BookingNotFoundException(String message) {
        super(message);
    }
}
