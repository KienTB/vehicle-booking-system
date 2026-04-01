package com.kien.vehicle.booking.service;

import com.kien.vehicle.booking.dto.request.ChangePasswordRequest;
import com.kien.vehicle.booking.dto.request.UpdateProfileRequest;
import com.kien.vehicle.booking.dto.response.UserResponse;
import com.kien.vehicle.booking.model.User;
import com.kien.vehicle.booking.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public void changePassword(String phone, ChangePasswordRequest request) {
        if (request.newPassword() == null || request.confirmPassword() == null ||
                !request.newPassword().equals(request.confirmPassword())) {
            logger.warn("New password and confirm password do not match for phone: {}", phone);
            throw new IllegalArgumentException("Mật khẩu mới và xác nhận không khớp");
        }

        Optional<User> userOpt = userRepository.findByPhone(phone);
        if (userOpt.isEmpty()) {
            logger.warn("User not found for phone: {}", phone);
            throw new IllegalArgumentException("Không tìm thấy người dùng");
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(request.oldPassword(), user.getPassword())) {
            logger.warn("Old password incorrect for phone: {}", phone);
            throw new BadCredentialsException("Mật khẩu cũ không đúng");
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);

        logger.info("Password changed successfully for phone: {}", phone);
    }

    public UserResponse getCurrentUser(String phone) {
        Optional<User> userOpt = userRepository.findByPhone(phone);
        if (userOpt.isEmpty()) {
            logger.warn("User not found for phone: {}", phone);
            throw new IllegalArgumentException("Không tìm thấy người dùng");
        }

        User user = userOpt.get();
        return new UserResponse(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getDriveLicense(),
                user.getRole()
        );
    }

    public UserResponse updateProfile(String phone, UpdateProfileRequest request) {
        Optional<User> userOpt = userRepository.findByPhone(phone);
        if (userOpt.isEmpty()) {
            logger.warn("User not found for phone: {}", phone);
            throw new IllegalArgumentException("Không tìm thấy người dùng");
        }

        User user = userOpt.get();

        if (request.name() != null && !request.name().isBlank()) {
            user.setName(request.name());
        }
        if (request.email() != null && !request.email().isBlank()) {
            user.setEmail(request.email());
        }
        if (request.driveLicense() != null && !request.driveLicense().isBlank()) {
            user.setDriveLicense(request.driveLicense());
        }

        userRepository.save(user);

        logger.info("Profile updated successfully for phone: {}", phone);

        return new UserResponse(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getDriveLicense(),
                user.getRole()
        );
    }

}