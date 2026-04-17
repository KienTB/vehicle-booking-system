package com.kien.vehicle.booking.service;

import com.kien.vehicle.booking.entity.Payment;
import com.kien.vehicle.booking.entity.User;

public interface EmailService {
    void sendOtpResetPassword(User user, String otp);
    void sendPaymentConfirmation(Payment payment);
}
