package com.costume_rental.rental_service.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.costume_rental.rental_service.dto.response.ApiResponse;

@RestController
public class HealthController {

    @GetMapping("/health")
    public ApiResponse<String> health() {
        return ApiResponse.<String>builder()
                .result("ok")
                .message("Service Rental is healthy")
                .build();
    }
}
