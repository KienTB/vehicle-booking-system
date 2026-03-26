package com.kien.vehicle.booking.exception;

public class InvoiceNotFoundException extends RuntimeException {
    public InvoiceNotFoundException (Long invoiceId) {
        super("Không tìm thấy hoá đơn với ID: " + invoiceId);
    }
    public InvoiceNotFoundException(String message) {
        super(message);
    }
}
