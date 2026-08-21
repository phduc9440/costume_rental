package com.costume_rental.customer_service.controller;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.costume_rental.customer_service.dto.request.AuthenticationRequest;
import com.costume_rental.customer_service.dto.request.CustomerCreationRequest;
import com.costume_rental.customer_service.dto.response.ApiResponse;
import com.costume_rental.customer_service.dto.response.AuthenticationResponse;
import com.costume_rental.customer_service.dto.response.CustomerResponse;
import com.costume_rental.customer_service.service.impl.AuthenticationServiceImpl;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {
    AuthenticationServiceImpl authenticationServiceImpl;

    @PostMapping("/login")
    ApiResponse<AuthenticationResponse> login(@RequestBody AuthenticationRequest request) {
        var result = authenticationServiceImpl.login(request);
        return ApiResponse.<AuthenticationResponse>builder()
                .result(result)
                .message("Login success")
                .build();
    }

    @PostMapping("/register")
    ApiResponse<CustomerResponse> register(@RequestBody @Valid CustomerCreationRequest request) {
        var result = authenticationServiceImpl.register(request);
        return ApiResponse.<CustomerResponse>builder()
                .result(result)
                .message("Register success")
                .build();
    }
}
