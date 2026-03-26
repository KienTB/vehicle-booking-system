package com.kien.vehicle.booking.service;

import com.kien.vehicle.booking.dto.response.InvoiceResponse;
import com.kien.vehicle.booking.dto.response.InvoiceSummaryResponse;
import com.kien.vehicle.booking.model.Booking;
import org.springframework.stereotype.Service;

import java.util.List;

public interface InvoiceService {
    InvoiceResponse createInvoiceForBooking(Booking booking);
    List<InvoiceSummaryResponse> getMyInvoices(String currentUserPhone);
    InvoiceResponse getInvoiceById(Long invoiceId, String currentUserPhone, boolean isAdmin);
    List<InvoiceSummaryResponse>  getAllInvoices();
}
