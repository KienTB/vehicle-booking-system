package com.kien.vehicle.booking.exception;

public class InvoiceAlreadyExistsException extends RuntimeException {
    public InvoiceAlreadyExistsException(Long bookingId) {
        super("Booking ID " + bookingId + " đã có hoá đơn. Không thể tạo thêm.");
    }
    public InvoiceAlreadyExistsException(String message) {
        super(message);
    }
}
