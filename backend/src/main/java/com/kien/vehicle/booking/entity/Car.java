package com.kien.vehicle.booking.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.kien.vehicle.booking.entity.enums.CarStatus;
import com.kien.vehicle.booking.entity.enums.FuelType;
import com.kien.vehicle.booking.entity.enums.Transmission;

@Entity
@Table(name = "car")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Car {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "car_id")
    private Long carId;

    @Column(name = "name")
    private String name;

    @Column(name = "brand")
    private String brand;

    @Column(name = "model")
    private String model;

    @Column(name = "license_plate")
    private String licensePlate;

    @Column(name = "price_per_day")
    private BigDecimal pricePerDay;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private CarStatus status;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "location")
    private String location;

    @Column(name = "seats")
    private Integer seats = 5;

    @Enumerated(EnumType.STRING)
    @Column(name = "transmission")
    private Transmission transmission = Transmission.AUTOMATIC;

    @Enumerated(EnumType.STRING)
    @Column(name = "fuel_type")
    private FuelType fuelType = FuelType.GASOLINE;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
