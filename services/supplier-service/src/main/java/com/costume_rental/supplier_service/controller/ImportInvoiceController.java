package com.costume_rental.supplier_service.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.costume_rental.supplier_service.dto.request.ImportInvoiceCreationRequest;
import com.costume_rental.supplier_service.dto.response.ApiResponse;
import com.costume_rental.supplier_service.dto.response.ImportInvoiceResponse;
import com.costume_rental.supplier_service.dto.response.PageResponse;
import com.costume_rental.supplier_service.dto.response.TopSupplierResponse;
import com.costume_rental.supplier_service.service.ImportInvoiceService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/import-invoices")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ImportInvoiceController {

    ImportInvoiceService importInvoiceService;

    @PostMapping
    public ApiResponse<ImportInvoiceResponse> createImportInvoice(@RequestBody ImportInvoiceCreationRequest request) {
        return ApiResponse.<ImportInvoiceResponse>builder()
                .result(importInvoiceService.createImportInvoice(request))
                .message("Create import invoice successfully")
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<ImportInvoiceResponse> getImportInvoiceById(@PathVariable String id) {
        return ApiResponse.<ImportInvoiceResponse>builder()
                .result(importInvoiceService.getImportInvoiceById(id))
                .build();
    }

    @GetMapping
    public ApiResponse<PageResponse<ImportInvoiceResponse>> getImportInvoices(
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "10") int size) {

        return ApiResponse.<PageResponse<ImportInvoiceResponse>>builder()
                .result(importInvoiceService.getAllImportInvoices(page, size))
                .build();
    }

    @GetMapping("/statistics/top-importers")
    public ApiResponse<List<TopSupplierResponse>> getTopSuppliers() {
        return ApiResponse.<List<TopSupplierResponse>>builder()
                .result(importInvoiceService.getTopSuppliers())
                .message("Get top importers successfully")
                .build();
    }
}
