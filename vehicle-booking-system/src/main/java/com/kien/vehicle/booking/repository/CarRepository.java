package com.kien.vehicle.booking.repository;

import com.kien.vehicle.booking.model.Car;
import com.kien.vehicle.booking.model.CarStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CarRepository extends JpaRepository<Car, Long> {
    Optional<Car> findByLicensePlate(String licensePlate);

    List<Car> findByStatus(CarStatus status);

    List<Car> findByBrandContainingIgnoreCase(String brand);

    boolean existsByLicensePlate(String licensePlate);
}
