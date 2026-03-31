package com.kien.vehicle.booking.repository;

import com.kien.vehicle.booking.model.Car;
import com.kien.vehicle.booking.model.CarStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface CarRepository extends JpaRepository<Car, Long> {
    Optional<Car> findByLicensePlate(String licensePlate);

    List<Car> findByStatus(CarStatus status);
    Page<Car> findByStatus(CarStatus status, Pageable pageable);

    List<Car> findByBrandContainingIgnoreCase(String brand);

    boolean existsByLicensePlate(String licensePlate);

    @Query("""
    SELECT c FROM Car c
    WHERE (:brand IS NULL OR LOWER(c.brand) LIKE LOWER(CONCAT('%', :brand, '%')))
      AND (:minPrice IS NULL OR c.pricePerDay >= :minPrice)
      AND (:maxPrice IS NULL OR c.pricePerDay <= :maxPrice)
      AND (:status IS NULL OR c.status = :status)
      AND (:onlyAvailable = false OR c.status = 'AVAILABLE')
    """)
    Page<Car> findWithFilters(
            @Param("brand")         String brand,
            @Param("minPrice")      BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("status")        CarStatus status,
            @Param("onlyAvailable") boolean onlyAvailable,
            Pageable pageable
    );
}
