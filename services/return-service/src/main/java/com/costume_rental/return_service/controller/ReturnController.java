package com.costume_rental.return_service.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import com.costume_rental.return_service.dto.request.ReturnRequest;
import com.costume_rental.return_service.dto.response.ApiResponse;
import com.costume_rental.return_service.dto.response.PageResponse;
import com.costume_rental.return_service.dto.response.ReturnInvoiceDetailResponse;
import com.costume_rental.return_service.dto.response.ReturnResponse;
import com.costume_rental.return_service.dto.response.RevenueStatisticResponse;
import com.costume_rental.return_service.service.ReturnService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/returns")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ReturnController {

    ReturnService returnService;

    @PostMapping
    public ApiResponse<ReturnResponse> createReturnTicket(@RequestBody @Valid ReturnRequest request) {
        return ApiResponse.<ReturnResponse>builder()
                .result(returnService.createReturnTicket(request))
                .message("Return clothing successfully")
                .build();
    }

    @GetMapping
    public ApiResponse<PageResponse<ReturnResponse>> getAllReturnTickets(
            @RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.<PageResponse<ReturnResponse>>builder()
                .result(returnService.getAllReturnTickets(page, size))
                .message("Get all return tickets success")
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<ReturnResponse> getReturnTicketById(@PathVariable String id) {
        return ApiResponse.<ReturnResponse>builder()
                .result(returnService.getReturnTicketById(id))
                .message("Get return ticket success")
                .build();
    }

    @GetMapping("/statistics/revenue")
    public ApiResponse<List<RevenueStatisticResponse>> getRevenueStatistics(@RequestParam String type) {
        return ApiResponse.<List<RevenueStatisticResponse>>builder()
                .result(returnService.getRevenueStatistics(type))
                .build();
    }

    @GetMapping("/statistics/revenue/details")
    public ApiResponse<List<ReturnInvoiceDetailResponse>> getRevenueDetails(
            @RequestParam String type, @RequestParam String period) {
        return ApiResponse.<List<ReturnInvoiceDetailResponse>>builder()
                .result(returnService.getRevenueDetails(type, period))
                .build();
    }
}
