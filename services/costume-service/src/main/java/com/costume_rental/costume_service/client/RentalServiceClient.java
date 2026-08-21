package com.costume_rental.costume_service.client;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import com.costume_rental.costume_service.client.impl.RentalServiceClientImpl;
import com.costume_rental.costume_service.dto.response.ApiResponse;
import com.costume_rental.costume_service.dto.response.RentalDetailRevenueDTO;

@FeignClient(name = "rental-service", fallback = RentalServiceClientImpl.class)
public interface RentalServiceClient {
    @GetMapping("/rental-orders/internal/orders/revenue-by-costume")
    ApiResponse<List<RentalDetailRevenueDTO>> getCostumeRevenueRawData();
}
