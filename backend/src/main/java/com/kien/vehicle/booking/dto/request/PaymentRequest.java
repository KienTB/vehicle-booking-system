package com.kien.vehicle.booking.dto.request;

import com.kien.vehicle.booking.model.PaymentMethod;

public record PaymentRequest(
        Long invoiceId,
        PaymentMethod paymentMethod
) {
}
