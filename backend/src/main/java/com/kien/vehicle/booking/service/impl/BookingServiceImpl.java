package com.kien.vehicle.booking.service.impl;

import com.kien.vehicle.booking.dto.request.BookingCreateRequest;
import com.kien.vehicle.booking.dto.response.BookingResponse;
import com.kien.vehicle.booking.dto.response.BookingSummaryResponse;
import com.kien.vehicle.booking.exception.*;
import com.kien.vehicle.booking.model.*;
import com.kien.vehicle.booking.repository.BookingRepository;
import com.kien.vehicle.booking.repository.CarRepository;
import com.kien.vehicle.booking.repository.InvoiceRepository;
import com.kien.vehicle.booking.repository.UserRepository;
import com.kien.vehicle.booking.service.BookingService;
import com.kien.vehicle.booking.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final CarRepository carRepository;
    private final InvoiceRepository invoiceRepository;
    private final UserRepository userRepository;
    private final InvoiceService invoiceService;

    @Override
    @Transactional
    public BookingResponse createBooking(BookingCreateRequest request, String currentUserPhone) {
        if(request.startDate().isAfter(request.endDate())){
            throw new AppException(ErrorCode.BOOKING_INVALID_DATE_RANGE);
        }
        User user = userRepository.findByPhone(currentUserPhone)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Car car = carRepository.findById(request.carId())
                .orElseThrow(() -> new AppException(ErrorCode.CAR_NOT_FOUND, request.carId()));

        List<Booking> overlapping = bookingRepository.findOverlappingBookings(
                car.getCarId(),
                request.startDate(),
                request.endDate()
        );

        if (!overlapping.isEmpty()) {
            Booking conflict = overlapping.get(0);
            throw new AppException(ErrorCode.BOOKING_DATE_CONFLICT, conflict.getStartDate(), conflict.getEndDate());
        }

        long days = request.startDate().until(request.endDate()).getDays() + 1;
        BigDecimal totalPrice = car.getPricePerDay().multiply(BigDecimal.valueOf(days));

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setCar(car);
        booking.setStartDate(request.startDate());
        booking.setEndDate(request.endDate());
        booking.setTotalPrice(totalPrice);
        booking.setStatus(BookingStatus.PENDING);

        booking = bookingRepository.save(booking);

        car.setStatus(CarStatus.PENDING);
        carRepository.save(car);

        invoiceService.createInvoiceForBooking(booking);
        return mapToResponse(booking);
    }

    @Override
    public Page<BookingSummaryResponse> getAllBookings(Pageable pageable) {
        return bookingRepository.findAll(pageable).map(this::mapToSummary);
    }

    @Override
    public Page<BookingSummaryResponse> getMyBookings(String currentUserPhone, Pageable pageable) {
        User user = userRepository.findByPhone(currentUserPhone)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return bookingRepository.findByUserUserId(user.getUserId(), pageable).map(this::mapToSummary);
    }

    @Override
    public BookingResponse getBookingById(Long bookingId, String currentUserPhone, boolean isAdmin) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND, bookingId));

        if (!isAdmin) {
            User currentUser = userRepository.findByPhone(currentUserPhone)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

            if (!booking.getUser().getUserId().equals(currentUser.getUserId())) {
                throw new AppException(ErrorCode.BOOKING_ACCESS_DENIED);
            }
        }

        return mapToResponse(booking);
    }

    @Override
    @Transactional
    public BookingResponse cancelBooking(Long bookingId, String currentUserPhone, boolean isAdmin) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND, bookingId));

        if(!isAdmin) {
            User currentUser = userRepository.findByPhone(currentUserPhone)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND, bookingId));

            if(!booking.getUser().getUserId().equals(currentUser.getUserId())) {
                throw new AppException(ErrorCode.BOOKING_ACCESS_DENIED);
            }

            if(booking.getStatus() != BookingStatus.PENDING) {
                throw new AppException(ErrorCode.BOOKING_CANCEL_NOT_ALLOWED, booking.getStatus());
            }
        }

        if(booking.getStatus() == BookingStatus.CANCELLED) {
            throw new AppException(ErrorCode.BOOKING_INVALID_STATUS_TRANSITION, BookingStatus.CANCELLED, BookingStatus.COMPLETED);
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking = bookingRepository.save(booking);

        return mapToResponse(booking);
    }

    @Override
    @Transactional
    public List<Long> expirePendingUnpaidBookings(LocalDateTime cutoff) {
        List<Booking> candidates = bookingRepository.findExpiredPendingUnpaidBookings(cutoff);
        if (candidates.isEmpty()) {
            return List.of();
        }

        List<Long> expiredBookingIds = new ArrayList<>();

        for (Booking booking : candidates) {
            Invoice invoice = booking.getInvoice();
            Car car = booking.getCar();

            boolean isEligible = booking.getStatus() == BookingStatus.PENDING
                    && invoice != null
                    && invoice.getStatus() == InvoiceStatus.UNPAID
                    && car != null
                    && car.getStatus() == CarStatus.PENDING;

            if (!isEligible) {
                continue;
            }

            booking.setStatus(BookingStatus.CANCELLED);
            invoice.setStatus(InvoiceStatus.FAILED);
            car.setStatus(CarStatus.AVAILABLE);

            expiredBookingIds.add(booking.getBookingId());

        }

        return expiredBookingIds;
    }

    private BookingResponse mapToResponse(Booking booking) {
        return new BookingResponse(
                booking.getBookingId(),
                booking.getUser().getUserId(),
                booking.getInvoice().getInvoiceId(),
                booking.getUser().getName(),
                booking.getUser().getPhone(),
                booking.getCar().getCarId(),
                booking.getCar().getName(),
                booking.getCar().getBrand(),
                booking.getCar().getLicensePlate(),
                booking.getStartDate(),
                booking.getEndDate(),
                booking.getTotalPrice(),
                booking.getStatus(),
                booking.getCreatedAt(),
                booking.getUpdatedAt()
        );
    }

    private BookingSummaryResponse mapToSummary(Booking booking) {
        return new BookingSummaryResponse(
                booking.getBookingId(),
                booking.getCar().getName(),
                booking.getCar().getBrand(),
                booking.getCar().getLicensePlate(),
                booking.getStartDate(),
                booking.getEndDate(),
                booking.getTotalPrice(),
                booking.getStatus()
        );
    }
}
