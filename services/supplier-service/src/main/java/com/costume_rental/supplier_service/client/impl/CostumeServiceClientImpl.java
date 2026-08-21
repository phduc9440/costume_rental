package com.costume_rental.supplier_service.client.impl;

import org.springframework.stereotype.Component;

import com.costume_rental.supplier_service.client.CostumeServiceClient;
import com.costume_rental.supplier_service.dto.response.ApiResponse;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class CostumeServiceClientImpl implements CostumeServiceClient {

    @Override
    public ApiResponse<?> updateQuantity(String id, int quantityChange) {
        log.error(
                "Error when calling costume-service updateQuantity for id {} with quantityChange {}",
                id,
                quantityChange);
        return ApiResponse.builder()
                .code(500)
                .message("costume-service is unavailable")
                .build();
    }
}
