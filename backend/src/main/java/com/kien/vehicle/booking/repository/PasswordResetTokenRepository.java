package com.kien.vehicle.booking.repository;

import com.kien.vehicle.booking.model.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByOtpAndUserEmail(String otp, String email);

    @Modifying
    @Query("DELETE FROM PasswordResetToken t WHERE t.user.userId = :userId")
    void deleteByUserId(@Param("userId") Long userId);
}
