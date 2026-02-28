package com.kien.vehicle.booking.service;

import com.kien.vehicle.booking.model.User;
import com.kien.vehicle.booking.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private static final Logger logger = LoggerFactory.getLogger(CustomUserDetailsService.class);

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String phone) throws UsernameNotFoundException {
        logger.debug("Loading user by phone: {}", phone);

        User user = userRepository.findByPhone(phone)
                .orElseThrow(() -> {
                    logger.warn("User not found with phone: {}", phone);
                    return new UsernameNotFoundException("Không tìm thấy người dùng với số điện thoại: " + phone);
                });

        String role = "ROLE_" + user.getRole().toUpperCase(); // map thành ROLE_USER / ROLE_ADMIN cho Spring Security

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getPhone())
                .password(user.getPassword())
                .authorities(Collections.singleton(new SimpleGrantedAuthority(role)))
                .build();
    }
}