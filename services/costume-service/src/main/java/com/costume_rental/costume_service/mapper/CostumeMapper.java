package com.costume_rental.costume_service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.costume_rental.costume_service.dto.request.CostumeCreationRequest;
import com.costume_rental.costume_service.dto.request.CostumeUpdateRequest;
import com.costume_rental.costume_service.dto.response.CostumeResponse;
import com.costume_rental.costume_service.entity.Costume;

@Mapper(
        componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        builder = @org.mapstruct.Builder(disableBuilder = true))
public interface CostumeMapper {
    Costume toCostume(CostumeCreationRequest request);

    CostumeResponse toCostumeResponse(Costume costume);

    void updateCostume(@MappingTarget Costume costume, CostumeUpdateRequest request);
}
