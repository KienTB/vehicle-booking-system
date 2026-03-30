package com.kien.vehicle.booking.repository;

import com.kien.vehicle.booking.model.Booking;
import com.kien.vehicle.booking.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("""
    SELECT b FROM Booking b
    WHERE b.car.carId = :carId
      AND b.status IN ('PENDING', 'COMPLETED')
      AND b.startDate <= :endDate
      AND b.endDate >= :startDate
    """)
    List<Booking> findOverlappingBookings(
            @Param("carId") Long carId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    List<Booking> findByUserUserId(Long userId);

    List<Booking> findByUserUserIdAndStatus(Long userId, BookingStatus status);

    List<Booking> findByStatus(BookingStatus status);

    @Query("""
    select b from Booking b
    where b.car.carId = :carId 
        and b.status in :statuses
        and b.endDate >= :today
    """)
    List<Booking> findActiveBookingsByCarId(
            @Param("carId") Long carId,
            @Param("today") LocalDate today,
            @Param("statuses") List<BookingStatus> statuses);
}