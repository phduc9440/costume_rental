package com.costume_rental.customer_service.controller;

import org.springframework.web.bind.annotation.*;

import com.costume_rental.customer_service.dto.request.CustomerUpdateRequest;
import com.costume_rental.customer_service.dto.response.*;
import com.costume_rental.customer_service.service.CustomerService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/customers")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CustomerController {
    CustomerService customerService;

    // =================================================================
    // 1. DÀNH CHO ADMIN / EMPLOYEE (Quản trị)
    // =================================================================

    @GetMapping
    ApiResponse<PageResponse<CustomerResponse>> getAllCustomers(
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "10") int size) {
        return ApiResponse.<PageResponse<CustomerResponse>>builder()
                .result(customerService.getAllCustomers(page, size))
                .message("Get all customers success")
                .build();
    }

    @GetMapping("/{id}")
    ApiResponse<CustomerResponse> getCustomerById(
            @PathVariable String id,
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "10") int size) {
        return ApiResponse.<CustomerResponse>builder()
                .result(customerService.getCustomerById(id, page, size))
                .message("Get customer success")
                .build();
    }

    @GetMapping("/phone/{phone}")
    ApiResponse<PageResponse<CustomerResponse>> getCustomerByPhone(
            @PathVariable String phone,
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "10") int size) {
        return ApiResponse.<PageResponse<CustomerResponse>>builder()
                .result(customerService.getCustomerByPhone(phone, page, size))
                .message("Get customer by phone success")
                .build();
    }

    @GetMapping("/name/{name}")
    ApiResponse<PageResponse<CustomerResponse>> getCustomersByName(
            @PathVariable String name,
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "10") int size) {
        return ApiResponse.<PageResponse<CustomerResponse>>builder()
                .result(customerService.getCustomersByName(name, page, size))
                .message("Get customers by name success")
                .build();
    }

    @PutMapping("/{id}")
    ApiResponse<CustomerResponse> updateCustomer(@PathVariable String id, @RequestBody CustomerUpdateRequest request) {
        return ApiResponse.<CustomerResponse>builder()
                .result(customerService.updateCustomer(id, request))
                .message("Update customer success")
                .build();
    }

    @DeleteMapping("/{id}")
    ApiResponse<Void> deleteCustomer(@PathVariable String id) {
        customerService.deleteCustomer(id);
        return ApiResponse.<Void>builder().message("Delete customer success").build();
    }

    @GetMapping("/{id}/revenue")
    ApiResponse<CustomerRevenueResponse> getCustomerRevenue(@PathVariable String id) {
        return ApiResponse.<CustomerRevenueResponse>builder()
                .result(customerService.getCustomerRevenue(id))
                .message("Get customer revenue success")
                .build();
    }

    // =================================================================
    // 2. DÀNH CHO CUSTOMER (Người dùng cuối)
    // =================================================================

    @GetMapping("/my-profile")
    ApiResponse<CustomerResponse> getMyProfile(
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "10") int size) {
        return ApiResponse.<CustomerResponse>builder()
                .result(customerService.getMyProfile(page, size))
                .message("Get my profile success")
                .build();
    }

    @PutMapping("/my-profile")
    ApiResponse<CustomerResponse> updateMyProfile(@RequestBody CustomerUpdateRequest request) {
        return ApiResponse.<CustomerResponse>builder()
                .result(customerService.updateMyProfile(request))
                .message("Update my profile success")
                .build();
    }
}
