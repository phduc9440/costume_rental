package com.costume_rental.supplier_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.costume_rental.supplier_service.client.impl.CostumeServiceClientImpl;
import com.costume_rental.supplier_service.dto.response.ApiResponse;

@FeignClient(name = "costume-service", fallback = CostumeServiceClientImpl.class)
public interface CostumeServiceClient {
    @PutMapping("/costumes/{id}/quantity")
    ApiResponse<?> updateQuantity(@PathVariable("id") String id, @RequestParam("quantityChange") int quantityChange);
}
