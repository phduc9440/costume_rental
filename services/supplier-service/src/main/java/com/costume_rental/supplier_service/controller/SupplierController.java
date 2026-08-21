package com.costume_rental.supplier_service.controller;

import org.springframework.web.bind.annotation.*;

import com.costume_rental.supplier_service.dto.request.SupplierCreationRequest;
import com.costume_rental.supplier_service.dto.request.SupplierUpdateRequest;
import com.costume_rental.supplier_service.dto.response.ApiResponse;
import com.costume_rental.supplier_service.dto.response.PageResponse;
import com.costume_rental.supplier_service.dto.response.SupplierResponse;
import com.costume_rental.supplier_service.service.SupplierService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/suppliers")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SupplierController {

    SupplierService supplierService;

    @PostMapping
    public ApiResponse<SupplierResponse> createSupplier(@RequestBody SupplierCreationRequest request) {
        return ApiResponse.<SupplierResponse>builder()
                .result(supplierService.createSupplier(request))
                .message("Create supplier successfully")
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<SupplierResponse> getSupplierById(@PathVariable String id) {
        return ApiResponse.<SupplierResponse>builder()
                .result(supplierService.getSupplierById(id))
                .build();
    }

    @GetMapping
    public ApiResponse<PageResponse<SupplierResponse>> getSuppliers(
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "10") int size) {

        return ApiResponse.<PageResponse<SupplierResponse>>builder()
                .result(supplierService.getAllSuppliers(page, size))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<SupplierResponse> updateSupplier(
            @PathVariable String id, @RequestBody SupplierUpdateRequest request) {
        return ApiResponse.<SupplierResponse>builder()
                .result(supplierService.updateSupplier(id, request))
                .message("Update supplier successfully")
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteSupplier(@PathVariable String id) {
        supplierService.deleteSupplier(id);
        return ApiResponse.<Void>builder()
                .message("Delete supplier successfully")
                .build();
    }
}
