package com.kien.vehicle.booking.exception;

import com.kien.vehicle.booking.model.InvoiceStatus;

public class InvalidInvoiceStatusException extends RuntimeException {
    public InvalidInvoiceStatusException(InvoiceStatus currentStatus, InvoiceStatus attemptedStatus) {
        super(String.format("Không thể chuyển trạng thái hoá đơn từ %s sang %s", currentStatus, attemptedStatus));
    }
    public InvalidInvoiceStatusException(String message) {
        super(message);
    }
}
