package com.costume_rental.customer_service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.costume_rental.customer_service.dto.request.CustomerCreationRequest;
import com.costume_rental.customer_service.dto.request.CustomerUpdateRequest;
import com.costume_rental.customer_service.dto.response.CustomerResponse;
import com.costume_rental.customer_service.entity.Customer;

@Mapper(
        componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        builder = @org.mapstruct.Builder(disableBuilder = true))
public interface CustomerMapper {
    Customer toCustomer(CustomerCreationRequest request);

    CustomerResponse toCustomerResponse(Customer customer);

    void updateCustomer(@MappingTarget Customer customer, CustomerUpdateRequest request);
}
