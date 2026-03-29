package com.kien.vehicle.booking.repository;

import com.kien.vehicle.booking.model.Payment;
import com.kien.vehicle.booking.model.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    @Query("select count(p) > 0 from Payment p where p.invoice.invoiceId = :invoiceId")
    boolean existsByInvoiceId(@Param("invoiceId") Long invoiceId);

    @Query("select p from Payment p where p.invoice.invoiceId = :invoiceId")
    Optional<Payment> findByInvoiceId(@Param("invoiceId") Long invoiceId);

    @Query("select p from Payment p where p.invoice.booking.user.userId = :userId")
    List<Payment> findByUserId(@Param("userId") Long userId);

    @Query("select p from Payment p where p.paymentStatus = :paymentStatus")
    List<Payment> findByPaymentStatus(@Param("paymentStatus")PaymentStatus paymentStatus);
}
