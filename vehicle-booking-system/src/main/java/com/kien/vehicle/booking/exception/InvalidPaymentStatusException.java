package com.kien.vehicle.booking.exception;

import com.kien.vehicle.booking.model.PaymentStatus;

public class InvalidPaymentStatusException extends RuntimeException {
    public InvalidPaymentStatusException(PaymentStatus currentStatus, PaymentStatus attemptedStatus) {
        super(String.format("Không thể chuyển trạng thái payment từ %s sang %s", currentStatus, attemptedStatus));
    }
    public InvalidPaymentStatusException(String message) {
        super(message);
    }
}