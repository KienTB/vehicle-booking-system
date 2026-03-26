package com.kien.vehicle.booking.repository;

import com.kien.vehicle.booking.model.Invoice;
import com.kien.vehicle.booking.model.InvoiceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    Optional<Invoice> findByBookingBookingId(Long bookingId);
    List<Invoice> findByBookingUserUserId(Long userId);
    List<Invoice> findByStatus(InvoiceStatus status);
    @Query(value = """
    SELECT MAX(i.invoice_number) FROM invoice i WHERE i.invoice_number LIKE CONCAT (:prefix, '%') """, nativeQuery = true)
    Optional<String> findMaxInvoiceNumberByPrefix(@Param("prefix") String prefix);
    boolean existsByBookingBookingId(Long bookingId);
}
