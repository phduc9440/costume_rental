package com.costume_rental.customer_service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.costume_rental.customer_service.dto.request.EmployeeCreationRequest;
import com.costume_rental.customer_service.dto.request.EmployeeUpdateRequest;
import com.costume_rental.customer_service.dto.response.EmployeeResponse;
import com.costume_rental.customer_service.entity.Employee;

@Mapper(
        componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        builder = @org.mapstruct.Builder(disableBuilder = true))
public interface EmployeeMapper {
    Employee toEmployee(EmployeeCreationRequest request);

    EmployeeResponse toEmployeeResponse(Employee employee);

    void updateEmployee(@MappingTarget Employee employee, EmployeeUpdateRequest request);
}
