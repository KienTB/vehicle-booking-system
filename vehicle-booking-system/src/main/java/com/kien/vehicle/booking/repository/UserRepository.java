package com.kien.vehicle.booking.repository;

import com.kien.vehicle.booking.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
