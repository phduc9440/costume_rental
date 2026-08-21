package com.costume_rental.supplier_service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.costume_rental.supplier_service.dto.request.SupplierCreationRequest;
import com.costume_rental.supplier_service.dto.request.SupplierUpdateRequest;
import com.costume_rental.supplier_service.dto.response.SupplierResponse;
import com.costume_rental.supplier_service.entity.Supplier;

@Mapper(
        componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        builder = @org.mapstruct.Builder(disableBuilder = true))
public interface SupplierMapper {
    Supplier toSupplier(SupplierCreationRequest request);

    SupplierResponse toSupplierResponse(Supplier supplier);

    void updateSupplier(@MappingTarget Supplier supplier, SupplierUpdateRequest request);
}
