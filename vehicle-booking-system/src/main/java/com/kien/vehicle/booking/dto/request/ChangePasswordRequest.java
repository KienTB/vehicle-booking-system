package com.kien.vehicle.booking.dto.request;

public record ChangePasswordRequest(
        String name,
        String email,
        String driveLicense
) {
}
