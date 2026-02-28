package com.kien.vehicle.booking.service;

import com.kien.vehicle.booking.dto.request.LoginRequest;
import com.kien.vehicle.booking.dto.request.RegisterRequest;
import com.kien.vehicle.booking.dto.response.AuthenticationResponse;
import com.kien.vehicle.booking.model.User;
import com.kien.vehicle.booking.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        Optional<User> existingUser = userRepository.findByPhone(request.phone());
        if (existingUser.isPresent()) {
            logger.warn("Phone number already exists: {}", request.phone());
            throw new IllegalArgumentException("Số điện thoại đã tồn tại");
        }

        // Optional: check email nếu muốn unique

        User user = new User();
        user.setName(request.name());
        user.setEmail(request.email());
        user.setPhone(request.phone());
        user.setDriveLicense(request.driveLicense());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(request.role() != null && !request.role().isEmpty() ? request.role() : "user");

        userRepository.save(user);
        logger.info("User registered successfully: {}", user.getPhone());

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getPhone());
        String token = jwtService.generateToken(userDetails);

        // Giả sử bạn có RefreshTokenService, ở đây tạm bỏ qua hoặc thêm sau
        String refreshToken = "dummy-refresh-token-for-now"; // Thay bằng logic thực sau

        return new AuthenticationResponse(
                token,
                refreshToken,
                user.getUserId(),
                user.getName(),
                user.getPhone(),
                user.getRole()
        );
    }

    public AuthenticationResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.phone(), request.password())
            );
        } catch (BadCredentialsException e) {
            logger.warn("Invalid credentials for phone: {}", request.phone());
            throw new BadCredentialsException("Số điện thoại hoặc mật khẩu không đúng");
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.phone());
        String token = jwtService.generateToken(userDetails);

        // Tương tự refresh token
        String refreshToken = "dummy-refresh-token-for-now";

        User user = userRepository.findByPhone(request.phone())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new AuthenticationResponse(
                token,
                refreshToken,
                user.getUserId(),
                user.getName(),
                user.getPhone(),
                user.getRole()
        );
    }

    // Change password & refresh sẽ thêm ở bước sau nếu cần
}