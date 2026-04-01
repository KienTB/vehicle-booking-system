package com.kien.vehicle.booking.service;

import com.kien.vehicle.booking.model.Payment;
import com.kien.vehicle.booking.model.User;

public interface EmailService {
    void sendOtpResetPassword(User user, String otp);
    void sendPaymentConfirmation(Payment payment);
}
