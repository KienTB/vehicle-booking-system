package com.kien.vehicle.booking.exception;

public class PaymentAlreadyExistsException extends RuntimeException {
    public PaymentAlreadyExistsException(Long invoiceId) {
        super("Hoá đơn  ID " + invoiceId + " đã có payment. Không thể tạo thêm");
    }
    public PaymentAlreadyExistsException(String message) {
        super(message);
    }
}
