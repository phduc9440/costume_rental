package com.costume_rental.return_service.client.impl;

import org.springframework.stereotype.Component;

import com.costume_rental.return_service.client.RentalServiceClient;
import com.costume_rental.return_service.dto.response.ApiResponse;
import com.costume_rental.return_service.dto.response.RentalOrderResponse;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class RentalServiceClientImpl implements RentalServiceClient {

    @Override
    public ApiResponse<RentalOrderResponse> getOrderById(String orderId) {
        log.error("Rental Service is down - cannot get order with id: {}", orderId);
        throw new RuntimeException("Rental Service unavailable");
    }
}
