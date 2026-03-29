package com.kien.vehicle.booking.service.impl;

import com.kien.vehicle.booking.dto.request.PaymentRequest;
import com.kien.vehicle.booking.dto.response.PaymentResponse;
import com.kien.vehicle.booking.dto.response.PaymentSummaryResponse;
import com.kien.vehicle.booking.exception.*;
import com.kien.vehicle.booking.model.*;
import com.kien.vehicle.booking.repository.*;
import com.kien.vehicle.booking.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.awt.print.Book;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PaymentServiceImpl implements PaymentService {
    private final PaymentRepository paymentRepository;
    private final InvoiceRepository invoiceRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final CarRepository carRepository;

    @Override
    public List<PaymentSummaryResponse> getMyPayments(String currentUserPhone) {
        User curentUser = userRepository.findByPhone(currentUserPhone).orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        List<Payment> payments = paymentRepository.findByUserId(curentUser.getUserId());
        return payments.stream().map(this::mapToSummary).collect(Collectors.toList());
    }

    @Override
    public PaymentResponse getPaymentById(Long paymentId, String currentUserPhone, boolean isAdmin) {
        Payment payment = paymentRepository.findById(paymentId).orElseThrow(() -> new PaymentNotFoundException(paymentId));
        if(!isAdmin){
            User currentUser = userRepository.findByPhone(currentUserPhone).orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
            Long ownerUserId = payment.getInvoice().getBooking().getUser().getUserId();
            if(!ownerUserId.equals(currentUser.getUserId())){
                throw new PaymentNotAllowedException("Bạn không có quyền xem payment này");
            }
        }
        return mapToResponse(payment);
    }

    @Override
    @Transactional
    public PaymentResponse confirmPayment(Long invoiceId, PaymentStatus result) {
        if(result != PaymentStatus.SUCCESS && result != PaymentStatus.FAILED){
            throw new InvalidPaymentStatusException("Kết quả xác nhận chỉ được là SUCCESS hoặc FAILED");
        }

        Invoice invoice = invoiceRepository.findById(invoiceId).orElseThrow(() -> new InvoiceNotFoundException(invoiceId));

        if(invoice.getStatus() != InvoiceStatus.UNPAID){
            throw new InvalidInvoiceStatusException("Hoá đơn ở trạng thái UNPAID mới có thể xác nhận thanh toán. " + "Trạng thái hiện tại: " + invoice.getStatus());
        }

        if(paymentRepository.existsByInvoiceId(invoiceId)){
            throw new PaymentAlreadyExistsException(invoiceId);
        }

        Booking booking = invoice.getBooking();
        Car car = booking.getCar();

        Payment payment = new Payment();
        payment.setInvoice(invoice);
        payment.setAmount(invoice.getTotalAmount());
        payment.setPaymentStatus(result);
        payment.setPaymentMethod(PaymentMethod.BANK_TRANSFER);

        paymentRepository.save(payment);

        if(result == PaymentStatus.SUCCESS){
            invoice.setStatus(InvoiceStatus.PAID);
            booking.setStatus(BookingStatus.COMPLETED);
        } else {
            invoice.setStatus(InvoiceStatus.FAILED);
            booking.setStatus(BookingStatus.CANCELLED);
            car.setStatus(CarStatus.AVAILABLE);
        }

        invoiceRepository.save(invoice);
        bookingRepository.save(booking);
        carRepository.save(car);

        return mapToResponse(payment);
    }

    @Override
    public List<PaymentSummaryResponse> getAllPayments(PaymentStatus paymentStatus) {
        List<Payment> payments;
        if (paymentStatus != null) {
            payments = paymentRepository.findByPaymentStatus(paymentStatus);
        } else {
            payments = paymentRepository.findAll();
        }
        return payments.stream().map(this::mapToSummary).collect(Collectors.toList());
    }

    private PaymentResponse mapToResponse(Payment payment){
        return new PaymentResponse(
                payment.getPaymentId(),
                payment.getInvoice().getInvoiceId(),
                payment.getInvoice().getInvoiceNumber(),
                payment.getAmount(),
                payment.getPaymentMethod(),
                payment.getPaymentStatus(),
                payment.getTransactionCode(),
                payment.getCreateAt(),
                payment.getUpdateAt()
        );
    }

    private PaymentSummaryResponse mapToSummary(Payment payment){
        User user = payment.getInvoice().getBooking().getUser();
        return new PaymentSummaryResponse(
                payment.getPaymentId(),
                payment.getInvoice().getInvoiceId(),
                payment.getInvoice().getInvoiceNumber(),
                user.getUserId(),
                user.getName(),
                payment.getAmount(),
                payment.getPaymentMethod(),
                payment.getPaymentStatus(),
                payment.getCreateAt()
        );
    }
}
