package com.kien.vehicle.booking.exception;

import com.kien.vehicle.booking.model.BookingStatus;

public class InvalidBookingStatusException extends RuntimeException {
    public InvalidBookingStatusException(BookingStatus currentStatus, BookingStatus attemptedStatus) {
        super(String.format("Không thể chuyển trạng thái booking từ %s sang %s.", currentStatus, attemptedStatus));
    }

    public InvalidBookingStatusException(BookingStatus currentStatus, BookingStatus attemptedStatus, String customMessage) {
        super(String.format("%s (từ %s sang %s)", customMessage, currentStatus, attemptedStatus));
    }

    public InvalidBookingStatusException(String message) {
        super(message);
    }
}
