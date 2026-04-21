package com.kien.vehicle.booking.service.impl;

import com.kien.vehicle.booking.dto.response.CarImageResponse;
import com.kien.vehicle.booking.entity.Car;
import com.kien.vehicle.booking.entity.CarImage;
import com.kien.vehicle.booking.exception.AppException;
import com.kien.vehicle.booking.exception.ErrorCode;
import com.kien.vehicle.booking.repository.CarImageRepository;
import com.kien.vehicle.booking.repository.CarRepository;
import com.kien.vehicle.booking.service.CarImageService;
import com.kien.vehicle.booking.service.ImageStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CarImageServiceImpl implements CarImageService {

    private static final long MAX_IMAGES_PER_CAR = 5L;

    private final CarRepository carRepository;
    private final CarImageRepository carImageRepository;
    private final ImageStorageService imageStorageService;

    @Override
    @Transactional
    public CarImageResponse uploadCarImage(Long carId, MultipartFile file) {
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new AppException(ErrorCode.CAR_NOT_FOUND, carId));

        long currentImages = carImageRepository.countByCarCarId(carId);
        if (currentImages >= MAX_IMAGES_PER_CAR) {
            throw new AppException(ErrorCode.CAR_IMAGE_LIMIT_EXCEEDED);
        }
        boolean isFirstImage = currentImages == 0;

        int nextSortOrder = carImageRepository.findMaxSortOrderByCarId(carId)
                .map(value -> value + 1)
                .orElse(0);

        boolean shouldBePrimary = isFirstImage;

        if (shouldBePrimary) {
            carImageRepository.clearPrimaryByCarId(carId);
        }

        ImageStorageService.StoredImage storedImage = imageStorageService.uploadCarImage(file, carId);

        CarImage carImage = new CarImage();
        carImage.setCar(car);
        carImage.setImageUrl(storedImage.url());
        carImage.setPublicId(storedImage.publicId());
        carImage.setFormat(storedImage.format());
        carImage.setBytes(storedImage.bytes());
        carImage.setIsPrimary(shouldBePrimary);
        carImage.setSortOrder(nextSortOrder);

        CarImage saved;
        try {
            saved = carImageRepository.save(carImage);
        } catch (RuntimeException saveException) {
            rollbackUploadedImage(storedImage.publicId(), saveException);
            throw saveException;
        }

        return mapToResponse(saved);
    }

    @Override
    public List<CarImageResponse> getCarImagesByCarId(Long carId) {
        return carImageRepository.findByCarIdOrderBySortThenCreatedAt(carId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public CarImageResponse getPrimaryImageByCarId(Long carId) {
        return carImageRepository.findByCarCarIdAndIsPrimaryTrue(carId)
                .map(this::mapToResponse)
                .orElse(null);
    }

    @Override
    @Transactional
    public CarImageResponse setPrimaryImage(Long carId, Long carImageId) {
        CarImage target = carImageRepository.findByCarImageIdAndCarCarId(carImageId, carId)
                .orElseThrow(() -> new AppException(ErrorCode.CAR_IMAGE_NOT_FOUND, carImageId));

        if (Boolean.TRUE.equals(target.getIsPrimary())) {
            return mapToResponse(target);
        }

        carImageRepository.clearPrimaryByCarId(carId);
        target.setIsPrimary(true);

        CarImage saved = carImageRepository.save(target);

        return mapToResponse(saved);
    }

    private void rollbackUploadedImage(String publicId, RuntimeException saveException) {
        try {
            imageStorageService.deleteByPublicId(publicId);
        } catch (RuntimeException deleteException) {
            saveException.addSuppressed(deleteException);
        }
    }

    private CarImageResponse mapToResponse(CarImage carImage) {
        return new CarImageResponse(
                carImage.getCarImageId(),
                carImage.getCar().getCarId(),
                carImage.getImageUrl(),
                carImage.getPublicId(),
                carImage.getFormat(),
                carImage.getBytes(),
                Boolean.TRUE.equals(carImage.getIsPrimary()),
                carImage.getSortOrder(),
                carImage.getCreatedAt(),
                carImage.getUpdatedAt()
        );
    }

}
