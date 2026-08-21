package com.costume_rental.rental_service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.costume_rental.rental_service.dto.response.RentalDetailResponse;
import com.costume_rental.rental_service.entity.RentalDetail;

@Mapper(componentModel = "spring")
public interface RentalDetailMapper {

    @Mapping(target = "costumeResponse", ignore = true)
    @Mapping(target = "rentalOrderResponse", ignore = true)
    @Mapping(target = "amount", ignore = true)
    RentalDetailResponse toResponse(RentalDetail rentalDetail);
}
