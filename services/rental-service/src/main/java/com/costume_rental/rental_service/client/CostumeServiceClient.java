package com.costume_rental.rental_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.costume_rental.rental_service.client.impl.CostumeServiceClientImpl;
import com.costume_rental.rental_service.dto.response.ApiResponse;
import com.costume_rental.rental_service.dto.response.CostumeResponse;

@FeignClient(name = "costume-service", fallback = CostumeServiceClientImpl.class)
public interface CostumeServiceClient {
    @GetMapping("/{id}")
    ApiResponse<CostumeResponse> getCostume(@PathVariable String id);
}
