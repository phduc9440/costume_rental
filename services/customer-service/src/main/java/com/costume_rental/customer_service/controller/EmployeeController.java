package com.costume_rental.customer_service.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.costume_rental.customer_service.dto.request.EmployeeCreationRequest;
import com.costume_rental.customer_service.dto.request.EmployeeUpdateRequest;
import com.costume_rental.customer_service.dto.response.ApiResponse;
import com.costume_rental.customer_service.dto.response.EmployeeResponse;
import com.costume_rental.customer_service.service.EmployeeService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/employees")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmployeeController {

    EmployeeService employeeService;

    @PostMapping
    ApiResponse<EmployeeResponse> createEmployee(@RequestBody EmployeeCreationRequest request) {
        return ApiResponse.<EmployeeResponse>builder()
                .result(employeeService.createEmployee(request))
                .message("Create employee success")
                .build();
    }

    @GetMapping
    ApiResponse<List<EmployeeResponse>> getAllEmployees() {
        return ApiResponse.<List<EmployeeResponse>>builder()
                .result(employeeService.getAllEmployees())
                .message("Get all employees success")
                .build();
    }

    @GetMapping("/{id}")
    ApiResponse<EmployeeResponse> getEmployeeById(@PathVariable String id) {
        return ApiResponse.<EmployeeResponse>builder()
                .result(employeeService.getEmployeeById(id))
                .message("Get employee success")
                .build();
    }

    @PutMapping("/{id}")
    ApiResponse<EmployeeResponse> updateEmployee(@PathVariable String id, @RequestBody EmployeeUpdateRequest request) {
        return ApiResponse.<EmployeeResponse>builder()
                .result(employeeService.updateEmployee(id, request))
                .message("Update employee success")
                .build();
    }

    @DeleteMapping("/{id}")
    ApiResponse<Void> deleteEmployee(@PathVariable String id) {
        employeeService.deleteEmployee(id);
        return ApiResponse.<Void>builder().message("Delete employee success").build();
    }
}
