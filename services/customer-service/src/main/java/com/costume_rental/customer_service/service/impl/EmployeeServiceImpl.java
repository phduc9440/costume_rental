package com.costume_rental.customer_service.service.impl;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.costume_rental.customer_service.dto.request.EmployeeCreationRequest;
import com.costume_rental.customer_service.dto.request.EmployeeUpdateRequest;
import com.costume_rental.customer_service.dto.response.EmployeeResponse;
import com.costume_rental.customer_service.entity.Employee;
import com.costume_rental.customer_service.mapper.EmployeeMapper;
import com.costume_rental.customer_service.repository.EmployeeRepository;
import com.costume_rental.customer_service.service.EmployeeService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmployeeServiceImpl implements EmployeeService {

    EmployeeRepository employeeRepository;
    EmployeeMapper employeeMapper;
    PasswordEncoder passwordEncoder;

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public EmployeeResponse createEmployee(EmployeeCreationRequest request) {
        if (employeeRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("ErrorCode.USER_EXISTED");
        }

        Employee employee = employeeMapper.toEmployee(request);
        employee.setPassword(passwordEncoder.encode(request.getPassword()));
        employee.setRole("EMPLOYEE");

        return employeeMapper.toEmployeeResponse(employeeRepository.save(employee));
    }

    @Override
    public List<EmployeeResponse> getAllEmployees() {
        return employeeRepository.findAll().stream()
                .map(employeeMapper::toEmployeeResponse)
                .toList();
    }

    @Override
    public EmployeeResponse getEmployeeById(String id) {
        return employeeMapper.toEmployeeResponse(
                employeeRepository.findById(id).orElseThrow(() -> new RuntimeException("ErrorCode.USER_NOT_EXISTED")));
    }

    @Override
    public EmployeeResponse updateEmployee(String id, EmployeeUpdateRequest request) {
        Employee employee =
                employeeRepository.findById(id).orElseThrow(() -> new RuntimeException("ErrorCode.USER_NOT_EXISTED"));

        employeeMapper.updateEmployee(employee, request);

        return employeeMapper.toEmployeeResponse(employeeRepository.save(employee));
    }

    @Override
    public void deleteEmployee(String id) {
        employeeRepository.deleteById(id);
    }
}
