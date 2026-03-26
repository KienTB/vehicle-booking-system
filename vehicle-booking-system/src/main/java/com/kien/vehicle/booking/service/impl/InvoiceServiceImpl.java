package com.kien.vehicle.booking.service.impl;

import com.kien.vehicle.booking.dto.response.InvoiceResponse;
import com.kien.vehicle.booking.dto.response.InvoiceSummaryResponse;
import com.kien.vehicle.booking.exception.InvalidBookingStatusException;
import com.kien.vehicle.booking.exception.InvoiceAlreadyExistsException;
import com.kien.vehicle.booking.exception.InvoiceNotFoundException;
import com.kien.vehicle.booking.model.Booking;
import com.kien.vehicle.booking.model.BookingStatus;
import com.kien.vehicle.booking.model.Invoice;
import com.kien.vehicle.booking.model.InvoiceStatus;
import com.kien.vehicle.booking.repository.InvoiceRepository;
import com.kien.vehicle.booking.repository.UserRepository;
import com.kien.vehicle.booking.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class InvoiceServiceImpl implements InvoiceService {
    private final InvoiceRepository invoiceRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public InvoiceResponse createInvoiceForBooking(Booking booking){
        if(invoiceRepository.existsByBookingBookingId(booking.getBookingId())) {
            throw new InvoiceAlreadyExistsException(booking.getBookingId());
        }

        if(booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new InvalidBookingStatusException(booking.getStatus(), BookingStatus.CONFIRMED);
        }

        String invoiceNumber = generateInvoiceNumber();

        Invoice invoice = new Invoice();
        invoice.setBooking(booking);
        invoice.setInvoiceNumber(invoiceNumber);
        invoice.setTotalAmount(booking.getTotalPrice());
        invoice.setStatus(InvoiceStatus.UNPAID);

        Invoice savedInvoice = invoiceRepository.save(invoice);

        return mapToResponse(savedInvoice);
    }

    private String generateInvoiceNumber() {
        int currentYear = LocalDate.now().getYear();
        String prefix = "INV-" + currentYear + "-";
        String maxNumberStr = invoiceRepository.findMaxInvoiceNumberByPrefix(prefix + "%").orElse(prefix + "0000");
        String lastPart = maxNumberStr.substring(prefix.length());
        int nextNumber = Integer.parseInt(lastPart) + 1;
        return prefix + String.format("%04d", nextNumber);
    }

    @Override
    public List<InvoiceSummaryResponse> getMyInvoices(String currentUserPhone) {
        Long userId = userRepository.findByPhone(currentUserPhone).orElseThrow(() -> new RuntimeException("Không tìm thây người dùng")).getUserId();
        List<Invoice> invoices = invoiceRepository.findByBookingUserUserId(userId);
        return invoices.stream().map(this::mapToSummary).collect(Collectors.toList());
    }

    @Override
    public InvoiceResponse getInvoiceById(Long invoiceId, String currentUserPhone, boolean isAdmin) {
        Invoice invoice = invoiceRepository.findById(invoiceId).orElseThrow(() -> new InvoiceNotFoundException(invoiceId));
        if(!isAdmin) {
            Long userId = userRepository.findByPhone(currentUserPhone).orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng")).getUserId();
            if(!invoice.getBooking().getUser().getUserId().equals(userId)){
                throw new IllegalArgumentException("Bạn không có quyền xem hoá đơn này");
            }
        }
        return mapToResponse(invoice);
    }

    @Override
    public List<InvoiceSummaryResponse> getAllInvoices() {
        List<Invoice> invoices = invoiceRepository.findAll();
        return invoices.stream().map(this::mapToSummary).collect(Collectors.toList());
    }

    private InvoiceResponse mapToResponse(Invoice invoice) {
        Booking booking = invoice.getBooking();
        return new InvoiceResponse(
                invoice.getInvoiceId(),
                invoice.getInvoiceNumber(),
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
                invoice.getTotalAmount(),
                invoice.getStatus(),
                invoice.getPaymentMethod(),
                invoice.getCreateAt(),
                invoice.getUpdateAt()
        );
    }

    private InvoiceSummaryResponse mapToSummary(Invoice invoice) {
        Booking booking = invoice.getBooking();
        return new InvoiceSummaryResponse(
                invoice.getInvoiceId(),
                invoice.getInvoiceNumber(),
                booking.getCar().getName(),
                booking.getCar().getLicensePlate(),
                booking.getStartDate(),
                booking.getEndDate(),
                invoice.getTotalAmount(),
                invoice.getStatus(),
                invoice.getCreateAt()
        );
    }
}
