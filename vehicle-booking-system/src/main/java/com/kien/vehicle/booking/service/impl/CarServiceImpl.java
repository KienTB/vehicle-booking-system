package com.kien.vehicle.booking.service.impl;

import com.kien.vehicle.booking.dto.request.CarCreateRequest;
import com.kien.vehicle.booking.dto.request.CarUpdateRequest;
import com.kien.vehicle.booking.dto.response.CarResponse;
import com.kien.vehicle.booking.dto.response.CarSummaryResponse;
import com.kien.vehicle.booking.exception.CarNotFoundException;
import com.kien.vehicle.booking.exception.LicensePlateAlreadyExistsException;
import com.kien.vehicle.booking.model.Car;
import com.kien.vehicle.booking.model.CarStatus;
import com.kien.vehicle.booking.repository.CarRepository;
import com.kien.vehicle.booking.service.CarService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CarServiceImpl implements CarService {

    private final CarRepository carRepository;

    @Override
    @Transactional
    public CarResponse createCar(CarCreateRequest request) {
        if (carRepository.existsByLicensePlate(request.licensePlate())) {
            throw new LicensePlateAlreadyExistsException("Biển số xe đã tồn tại: " + request.licensePlate());
        }

        Car car = new Car();
        car.setName(request.name());
        car.setBrand(request.brand());
        car.setModel(request.model());
        car.setLicensePlate(request.licensePlate());
        car.setPricePerDay(request.pricePerDay());
        car.setStatus(request.carStatus() != null ? request.carStatus() : CarStatus.AVAILABLE);
        car.setImageUrl(request.imageUrl());
        car.setSeats(request.seats() != null ? request.seats() : 5);
        car.setTransmission(request.transmission() != null ? request.transmission() : "Automatic");
        car.setFuelType(request.fuelType() != null ? request.fuelType() : "Gasoline");
        car.setLocation(request.location());

        Car saved = carRepository.save(car);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public CarResponse updateCar(Long id, CarUpdateRequest request) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new CarNotFoundException("Không tìm thấy xe với ID: " + id));

        if (request.licensePlate() != null && !request.licensePlate().equals(car.getLicensePlate())) {
            if (carRepository.existsByLicensePlate(request.licensePlate())) {
                throw new LicensePlateAlreadyExistsException("Biển số xe đã tồn tại: " + request.licensePlate());
            }
            car.setLicensePlate(request.licensePlate());
        }

        if (request.name() != null) car.setName(request.name());
        if (request.brand() != null) car.setBrand(request.brand());
        if (request.model() != null) car.setModel(request.model());
        if (request.pricePerDay() != null) car.setPricePerDay(request.pricePerDay());
        if (request.status() != null) car.setStatus(request.status());
        if (request.imageUrl() != null) car.setImageUrl(request.imageUrl());
        if (request.seats() != null) car.setSeats(request.seats());
        if (request.transmission() != null) car.setTransmission(request.transmission());
        if (request.fuelType() != null) car.setFuelType(request.fuelType());
        if (request.location() != null) car.setLocation(request.location());

        Car updated = carRepository.save(car);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void deleteCar(Long id) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new CarNotFoundException("Không tìm thấy xe với ID: " + id));

        // Soft delete: chuyển status thành DISABLED
        car.setStatus(CarStatus.DISABLED);
        carRepository.save(car);
    }

    @Override
    public CarResponse getCarById(Long id) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new CarNotFoundException("Không tìm thấy xe với ID: " + id));
        return mapToResponse(car);
    }

    @Override
    public List<CarSummaryResponse> getAllCars(boolean onlyAvailable) {
        List<Car> cars;
        if (onlyAvailable) {
            cars = carRepository.findByStatus(CarStatus.AVAILABLE);
        } else {
            cars = carRepository.findAll();
        }
        return cars.stream()
                .map(this::mapToSummary)
                .collect(Collectors.toList());
    }

    @Override
    public List<CarSummaryResponse> searchCars(String brand, BigDecimal minPrice, BigDecimal maxPrice, CarStatus status) {
        List<Car> cars = carRepository.findAll();
        return cars.stream()
                .filter(car -> (brand == null || car.getBrand().toLowerCase().contains(brand.toLowerCase())))
                .filter(car -> (minPrice == null || car.getPricePerDay().compareTo(minPrice) >= 0))
                .filter(car -> (maxPrice == null || car.getPricePerDay().compareTo(maxPrice) <= 0))
                .filter(car -> (status == null || car.getStatus() == status))
                .map(this::mapToSummary)
                .collect(Collectors.toList());
    }

    private CarResponse mapToResponse(Car car) {
        return new CarResponse(
                car.getCarId(),
                car.getName(),
                car.getBrand(),
                car.getModel(),
                car.getLicensePlate(),
                car.getPricePerDay(),
                car.getStatus(),
                car.getImageUrl(),
                car.getSeats(),
                car.getTransmission(),
                car.getFuelType(),
                car.getLocation(),
                car.getCreatedAt(),
                car.getUpdatedAt()
        );
    }

    private CarSummaryResponse mapToSummary(Car car) {
        return new CarSummaryResponse(
                car.getCarId(),
                car.getName(),
                car.getBrand(),
                car.getLicensePlate(),
                car.getPricePerDay(),
                car.getStatus(),
                car.getImageUrl(),
                car.getSeats(),
                car.getLocation()
        );
    }
}