package com.costume_rental.rental_service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.costume_rental.rental_service.dto.response.RentalOrderResponse;
import com.costume_rental.rental_service.entity.RentalOrder;

@Mapper(componentModel = "spring")
public interface RentalOrderMapper {

    @Mapping(target = "employeeResponse", ignore = true) // không map field này
    @Mapping(target = "customerResponse", ignore = true)
    @Mapping(target = "rentalDetailResponses", ignore = true)
    @Mapping(target = "totalAmount", ignore = true)
    @Mapping(target = "deposit", ignore = true)
    RentalOrderResponse toResponse(RentalOrder rentalOrder);
}
