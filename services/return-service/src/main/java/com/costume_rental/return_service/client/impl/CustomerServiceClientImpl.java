package com.costume_rental.return_service.client.impl;

import org.springframework.stereotype.Component;

import com.costume_rental.return_service.client.CustomerServiceClient;
import com.costume_rental.return_service.dto.response.ApiResponse;
import com.costume_rental.return_service.dto.response.CustomerResponse;
import com.costume_rental.return_service.dto.response.EmployeeResponse;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class CustomerServiceClientImpl implements CustomerServiceClient {

    @Override
    public ApiResponse<CustomerResponse> getCustomer(String id) {
        log.error("Customer Service is down - cannot get customer with id: {}", id);
        throw new RuntimeException("Customer Service unavailable");
    }

    @Override
    public ApiResponse<EmployeeResponse> getEmployee(String id) {
        log.error("Customer Service is down - cannot get employee with id: {}", id);
        throw new RuntimeException("Employee Service unavailable");
    }
}
