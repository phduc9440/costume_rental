package com.costume_rental.customer_service.service;

import java.util.List;

import com.costume_rental.customer_service.dto.request.EmployeeCreationRequest;
import com.costume_rental.customer_service.dto.request.EmployeeUpdateRequest;
import com.costume_rental.customer_service.dto.response.EmployeeResponse;

public interface EmployeeService {
    EmployeeResponse createEmployee(EmployeeCreationRequest request);

    List<EmployeeResponse> getAllEmployees();

    EmployeeResponse getEmployeeById(String id);

    EmployeeResponse updateEmployee(String id, EmployeeUpdateRequest request);

    void deleteEmployee(String id);
}
