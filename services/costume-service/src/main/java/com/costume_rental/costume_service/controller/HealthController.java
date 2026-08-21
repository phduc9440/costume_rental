package com.costume_rental.costume_service.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.costume_rental.costume_service.dto.response.ApiResponse;

@RestController
public class HealthController {

    @GetMapping("/health")
    public ApiResponse<String> health() {
        return ApiResponse.<String>builder()
                .result("ok")
                .message("Service Costume is healthy")
                .build();
    }
}
