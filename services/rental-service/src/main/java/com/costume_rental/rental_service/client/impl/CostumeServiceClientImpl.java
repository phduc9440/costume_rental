package com.costume_rental.rental_service.client.impl;

import org.springframework.stereotype.Component;

import com.costume_rental.rental_service.client.CostumeServiceClient;
import com.costume_rental.rental_service.dto.response.ApiResponse;
import com.costume_rental.rental_service.dto.response.CostumeResponse;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class CostumeServiceClientImpl implements CostumeServiceClient {

    @Override
    public ApiResponse<CostumeResponse> getCostume(String id) {
        log.error("Costume Service is down - cannot get costume with id: {}", id);
        throw new RuntimeException("Costume Service unavailable");
    }
}
