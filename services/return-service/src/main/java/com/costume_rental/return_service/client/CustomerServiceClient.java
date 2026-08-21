package com.costume_rental.return_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.costume_rental.return_service.client.impl.CustomerServiceClientImpl;
import com.costume_rental.return_service.dto.response.ApiResponse;
import com.costume_rental.return_service.dto.response.CustomerResponse;
import com.costume_rental.return_service.dto.response.EmployeeResponse;

@FeignClient(name = "customer-service", fallback = CustomerServiceClientImpl.class)
public interface CustomerServiceClient {
    @GetMapping("/customers/{id}")
    ApiResponse<CustomerResponse> getCustomer(@PathVariable("id") String id);

    @GetMapping("/employees/{id}")
    ApiResponse<EmployeeResponse> getEmployee(@PathVariable("id") String id);
}
