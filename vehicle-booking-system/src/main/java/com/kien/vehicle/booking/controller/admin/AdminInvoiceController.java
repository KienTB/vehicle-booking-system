package com.kien.vehicle.booking.controller.admin;

import com.kien.vehicle.booking.dto.response.ApiResponse;
import com.kien.vehicle.booking.dto.response.InvoiceResponse;
import com.kien.vehicle.booking.dto.response.InvoiceSummaryResponse;
import com.kien.vehicle.booking.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/invoices")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminInvoiceController {
    private final InvoiceService invoiceService;
    @GetMapping
    public ResponseEntity<ApiResponse<List<InvoiceSummaryResponse>>> getAllInvoices() {
        List<InvoiceSummaryResponse> invoices = invoiceService.getAllInvoices();
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách tất cả hoá đơn thành công", invoices));
    }
}
