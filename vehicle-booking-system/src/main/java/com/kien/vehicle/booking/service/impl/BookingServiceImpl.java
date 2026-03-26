package com.kien.vehicle.booking.service.impl;

import com.kien.vehicle.booking.dto.request.BookingCreateRequest;
import com.kien.vehicle.booking.dto.response.BookingResponse;
import com.kien.vehicle.booking.dto.response.BookingSummaryResponse;
import com.kien.vehicle.booking.exception.BookingConflictException;
import com.kien.vehicle.booking.exception.BookingNotFoundException;
import com.kien.vehicle.booking.exception.InvalidBookingStatusException;
import com.kien.vehicle.booking.model.*;
import com.kien.vehicle.booking.repository.BookingRepository;
import com.kien.vehicle.booking.repository.CarRepository;
import com.kien.vehicle.booking.repository.UserRepository;
import com.kien.vehicle.booking.service.BookingService;
import com.kien.vehicle.booking.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final CarRepository carRepository;
    private final UserRepository userRepository;
    private final InvoiceService invoiceService;

    @Override
    @Transactional
    public BookingResponse createBooking(BookingCreateRequest request, String currentUserPhone) {
        User user = userRepository.findByPhone(currentUserPhone)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        Car car = carRepository.findById(request.carId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy xe"));

        List<Booking> overlapping = bookingRepository.findOverlappingBookings(
                car.getCarId(),
                request.startDate(),
                request.endDate()
        );

        if (!overlapping.isEmpty()) {
            Booking conflict = overlapping.get(0);
            throw new BookingConflictException(
                    "Xe đã được đặt từ " + conflict.getStartDate() +
                            " đến " + conflict.getEndDate() + ". Vui lòng chọn khoảng thời gian khác."
            );
        }

        if (request.startDate().isAfter(request.endDate())) {
            throw new IllegalArgumentException("Ngày bắt đầu phải trước hoặc bằng ngày kết thúc");
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

        return mapToResponse(booking);
    }

    @Override
    public List<BookingSummaryResponse> getAllBookings() {
        List<Booking> bookings = bookingRepository.findAll();
        return bookings.stream()
                .map(this::mapToSummary)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingSummaryResponse> getMyBookings(String currentUserPhone) {
        User user = userRepository.findByPhone(currentUserPhone)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        List<Booking> bookings = bookingRepository.findByUserUserId(user.getUserId());

        return bookings.stream()
                .map(this::mapToSummary)
                .collect(Collectors.toList());
    }

    private BookingResponse mapToResponse(Booking booking) {
        return new BookingResponse(
                booking.getBookingId(),
                booking.getUser().getUserId(),
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

    @Override
    public BookingResponse getBookingById(Long bookingId, String currentUserPhone, boolean isAdmin) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException(bookingId));

        if (!isAdmin) {
            User currentUser = userRepository.findByPhone(currentUserPhone)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

            if (!booking.getUser().getUserId().equals(currentUser.getUserId())) {
                throw new IllegalArgumentException("Bạn không có quyền xem booking này");
            }
        }

        return mapToResponse(booking);
    }

    @Override
    @Transactional
    public BookingResponse confirmBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new BookingNotFoundException(bookingId));
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new InvalidBookingStatusException(booking.getStatus(), BookingStatus.CONFIRMED
            );
        }

        booking.setStatus(BookingStatus.CONFIRMED);
        booking = bookingRepository.save(booking);

        try {
            invoiceService.createInvoiceForBooking(booking);
        } catch (Exception e) {
            throw new RuntimeException("Xác nhận booking thành công nhưng tạo hoá đơn thất bại: " + e.getMessage());
        }

        return mapToResponse(booking);
    }

    @Override
    @Transactional
    public BookingResponse cancelBooking(Long bookingId, String currentUserPhone, boolean isAdmin) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException(bookingId));

        if(!isAdmin) {
            User currentUser = userRepository.findByPhone(currentUserPhone)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

            if(!booking.getUser().getUserId().equals(currentUser.getUserId())) {
                throw new IllegalArgumentException("Bạn không có quyền huỷ booking này");
            }

            if(booking.getStatus() != BookingStatus.PENDING) {
                throw new InvalidBookingStatusException(
                        booking.getStatus(),
                        BookingStatus.CANCELLED,
                        "USER chỉ có thể hủy booking khi trạng thái là PENDING"
                );
            }
        }

        if(booking.getStatus() == BookingStatus.CANCELLED) {
            throw new InvalidBookingStatusException("Không thể huỷ booking đã hoàn tất");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking = bookingRepository.save(booking);

        return mapToResponse(booking);
    }
}