package com.kien.vehicle.booking.dto.request;

import com.kien.vehicle.booking.entity.enums.PaymentMethod;

public record PaymentRequest(
        Long invoiceId,
        PaymentMethod paymentMethod
) {
}

