package com.kien.vehicle.booking.service;

import com.kien.vehicle.booking.dto.response.InvoiceResponse;
import com.kien.vehicle.booking.dto.response.InvoiceSummaryResponse;
import com.kien.vehicle.booking.entity.Booking;
import com.kien.vehicle.booking.entity.enums.InvoiceStatus;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

public interface InvoiceService {
    InvoiceResponse createInvoiceForBooking(Booking booking);
    Page<InvoiceSummaryResponse> getMyInvoices(String currentUserPhone, Pageable pageable);
    InvoiceResponse getInvoiceById(Long invoiceId, String currentUserPhone, boolean isAdmin);
    Page<InvoiceSummaryResponse>  getAllInvoices(InvoiceStatus invoiceStatus, Pageable pageable);
}

