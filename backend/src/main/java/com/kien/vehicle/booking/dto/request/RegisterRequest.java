package com.kien.vehicle.booking.dto.request;

public record RegisterRequest(
        String name,
        String email,
        String password,
        String phone,
        String driveLicense,
        String role
) {
}
