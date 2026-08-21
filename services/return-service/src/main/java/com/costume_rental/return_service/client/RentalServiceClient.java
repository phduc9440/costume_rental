package com.costume_rental.return_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.costume_rental.return_service.client.impl.RentalServiceClientImpl;
import com.costume_rental.return_service.dto.response.ApiResponse;
import com.costume_rental.return_service.dto.response.RentalOrderResponse;

@FeignClient(name = "rental-service", fallback = RentalServiceClientImpl.class)
public interface RentalServiceClient {
    @GetMapping("/rental-orders/{orderId}")
    ApiResponse<RentalOrderResponse> getOrderById(@PathVariable("orderId") String orderId);
}
