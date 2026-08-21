package com.costume_rental.rental_service.controller;

import org.springframework.web.bind.annotation.*;

import com.costume_rental.rental_service.dto.enums.RentalStatus;
import com.costume_rental.rental_service.dto.enums.RentalType;
import com.costume_rental.rental_service.dto.request.CreateRentalOrderRequest;
import com.costume_rental.rental_service.dto.response.ApiResponse;
import com.costume_rental.rental_service.dto.response.CustomerRevenueResponse;
import com.costume_rental.rental_service.dto.response.PageResponse;
import com.costume_rental.rental_service.dto.response.RentalOrderResponse;
import com.costume_rental.rental_service.service.RentalOrderService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/rental-orders")
@RequiredArgsConstructor
public class RentalOrderController {

    private final RentalOrderService rentalOrderService;

    @PostMapping("/online")
    public ApiResponse<RentalOrderResponse> createOnlineOrder(@RequestBody CreateRentalOrderRequest request) {
        return ApiResponse.<RentalOrderResponse>builder()
                .result(rentalOrderService.createOnlineOrder(request))
                .message("Create online rental order successfully")
                .build();
    }

    @PostMapping("/offline")
    public ApiResponse<RentalOrderResponse> createOfflineOrder(@RequestBody CreateRentalOrderRequest request) {
        return ApiResponse.<RentalOrderResponse>builder()
                .result(rentalOrderService.createOfflineOrder(request))
                .message("Create offline rental order successfully")
                .build();
    }

    @GetMapping("/{orderId}")
    public ApiResponse<RentalOrderResponse> getOrderById(@PathVariable String orderId) {
        return ApiResponse.<RentalOrderResponse>builder()
                .result(rentalOrderService.getOrderById(orderId))
                .build();
    }

    @GetMapping("/customer/{customerId}")
    public ApiResponse<PageResponse<RentalOrderResponse>> getOrdersByCustomerId(
            @PathVariable String customerId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.<PageResponse<RentalOrderResponse>>builder()
                .result(rentalOrderService.getOrdersByCustomerId(customerId, page, size))
                .build();
    }

    @GetMapping("/revenue/customer/{customerId}")
    public ApiResponse<CustomerRevenueResponse> getCustomerRevenue(@PathVariable String customerId) {
        return ApiResponse.<CustomerRevenueResponse>builder()
                .result(rentalOrderService.getCustomerRevenue(customerId))
                .build();
    }

    @GetMapping
    public ApiResponse<PageResponse<RentalOrderResponse>> getOrders(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) RentalStatus status,
            @RequestParam(required = false) RentalType type,
            @RequestParam(required = false) Boolean unpaid) {
        return ApiResponse.<PageResponse<RentalOrderResponse>>builder()
                .result(rentalOrderService.getOrders(page, size, status, type, unpaid))
                .build();
    }

    @PutMapping("/{orderId}")
    public ApiResponse<RentalOrderResponse> updateOrder(
            @PathVariable String orderId, @RequestBody CreateRentalOrderRequest request) {
        return ApiResponse.<RentalOrderResponse>builder()
                .result(rentalOrderService.updateOrder(orderId, request))
                .message("Update rental order successfully")
                .build();
    }

    @PutMapping("/{orderId}/confirm")
    public ApiResponse<RentalOrderResponse> confirmOrder(@PathVariable String orderId) {
        return ApiResponse.<RentalOrderResponse>builder()
                .result(rentalOrderService.confirmOrder(orderId))
                .message("Confirm order successfully")
                .build();
    }

    @PutMapping("/{orderId}/cancel")
    public ApiResponse<RentalOrderResponse> cancelOrder(
            @PathVariable String orderId, @RequestParam(required = false) String reason) {
        return ApiResponse.<RentalOrderResponse>builder()
                .result(rentalOrderService.cancelOrder(orderId, reason))
                .message("Cancel order successfully")
                .build();
    }

    @PutMapping("/{orderId}/pickup")
    public ApiResponse<RentalOrderResponse> pickupOrder(@PathVariable String orderId) {
        return ApiResponse.<RentalOrderResponse>builder()
                .result(rentalOrderService.pickupOrder(orderId))
                .message("Pick up order successfully")
                .build();
    }

    @PutMapping("/{orderId}/confirm-deposit")
    public ApiResponse<RentalOrderResponse> confirmDeposit(@PathVariable String orderId) {
        return ApiResponse.<RentalOrderResponse>builder()
                .result(rentalOrderService.confirmDeposit(orderId))
                .message("Confirm deposit successfully")
                .build();
    }
}
