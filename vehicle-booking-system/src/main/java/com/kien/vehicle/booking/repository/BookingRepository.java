package com.kien.vehicle.booking.repository;

import com.kien.vehicle.booking.model.Booking;
import com.kien.vehicle.booking.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query(value = """
        SELECT * 
        FROM booking b
        WHERE b.car_id = :carId
          AND b.status IN ('PENDING', 'CONFIRMED')
          AND b.start_date <= :endDate
          AND b.end_date   >= :startDate
        """,
            nativeQuery = true)
    List<Booking> findOverlappingBookings(
            @Param("carId") Long carId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    List<Booking> findByUserUserId(Long userId);

    List<Booking> findByUserUserIdAndStatus(Long userId, BookingStatus status);

    List<Booking> findByStatus(BookingStatus status);

//    List<Booking> findByCarId(Long carId);
}