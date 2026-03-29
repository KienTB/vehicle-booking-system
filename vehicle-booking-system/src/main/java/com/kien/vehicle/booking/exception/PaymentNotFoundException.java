package com.kien.vehicle.booking.exception;

public class PaymentNotFoundException extends RuntimeException {
    public PaymentNotFoundException(Long paymentId) {
        super("Không tìm thấy paymentId: " + paymentId);
    }
    public PaymentNotFoundException(String message) {
        super(message);
    }
}
