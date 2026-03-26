package com.kien.vehicle.booking.controller;

import com.kien.vehicle.booking.dto.response.ApiResponse;
import com.kien.vehicle.booking.dto.response.InvoiceResponse;
import com.kien.vehicle.booking.dto.response.InvoiceSummaryResponse;
import com.kien.vehicle.booking.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class InvoiceController {
    private final InvoiceService invoiceService;

    @GetMapping("/my-invoices")
    public ResponseEntity<ApiResponse<List<InvoiceSummaryResponse>>> getMyInvoices(Authentication authentication) {
        String currentUserPhone = authentication.getName();
        List<InvoiceSummaryResponse> invoices = invoiceService.getMyInvoices(currentUserPhone);
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách hoá đơn của bạn thành công", invoices));
    }

    @GetMapping("{id}")
    public ResponseEntity<ApiResponse<InvoiceResponse>> getInvoiceById(@PathVariable Long id, Authentication authentication) {
        String currentUserPhone = authentication.getName();
        boolean isAdmin = false;
        InvoiceResponse invoice = invoiceService.getInvoiceById(id, currentUserPhone, isAdmin);
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy chi tiết hoá đơn thành công", invoice));
    }
}
