package com.kien.vehicle.booking.service;

import com.kien.vehicle.booking.dto.request.LoginRequest;
import com.kien.vehicle.booking.dto.request.RefreshTokenRequest;
import com.kien.vehicle.booking.dto.request.RegisterRequest;
import com.kien.vehicle.booking.dto.response.AuthenticationResponse;
import com.kien.vehicle.booking.exception.AppException;
import com.kien.vehicle.booking.exception.ErrorCode;
import com.kien.vehicle.booking.model.RefreshToken;
import com.kien.vehicle.booking.model.User;
import com.kien.vehicle.booking.repository.RefreshTokenRepository;
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

    @Autowired
    private RefreshTokenService refreshTokenService;

    public AuthenticationResponse register(RegisterRequest request) {
        if (userRepository.findByPhone(request.phone()).isPresent()) {
            throw new AppException(ErrorCode.AUTH_PHONE_ALREADY_EXISTS, request.phone());
        }

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
        String accessToken = jwtService.generateToken(userDetails);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

        return new AuthenticationResponse(
                accessToken,
                refreshToken.getToken(),
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
            throw new AppException(ErrorCode.AUTH_INVALID_CREDENTIALS);
        }

        User user = userRepository.findByPhone(request.phone()).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.phone());
        String accessToken = jwtService.generateToken(userDetails);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

        logger.info("User logged in: {}", user.getPhone());

        return new AuthenticationResponse(
                accessToken,
                refreshToken.getToken(),
                user.getUserId(),
                user.getName(),
                user.getPhone(),
                user.getRole()
        );
    }

    public AuthenticationResponse refresh(RefreshTokenRequest request){
        RefreshToken newRefreshToken = refreshTokenService.rotateRefreshToken(request.refreshToken());

        User user = newRefreshToken.getUser();
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getPhone());
        String newAccessToken = jwtService.generateToken(userDetails);

        logger.info("Token refreshed for user: {}", user.getPhone());

        return new AuthenticationResponse(
                newAccessToken,
                newRefreshToken.getToken(),
                user.getUserId(),
                user.getName(),
                user.getPhone(),
                user.getRole()
        );
    }

    public void logout(String currentUserPhone){
        User user = userRepository.findByPhone(currentUserPhone).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        refreshTokenService.deleteByUserId(user.getUserId());
        logger.info("User logged out: {}", currentUserPhone);
    }
}