package com.costume_rental.supplier_service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.costume_rental.supplier_service.dto.request.ImportInvoiceCreationRequest;
import com.costume_rental.supplier_service.dto.response.ImportDetailResponse;
import com.costume_rental.supplier_service.dto.response.ImportInvoiceResponse;
import com.costume_rental.supplier_service.entity.ImportDetail;
import com.costume_rental.supplier_service.entity.ImportInvoice;

@Mapper(
        componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        uses = {SupplierMapper.class},
        builder = @org.mapstruct.Builder(disableBuilder = true))
public interface ImportInvoiceMapper {
    ImportInvoice toImportInvoice(ImportInvoiceCreationRequest request);

    ImportInvoiceResponse toImportInvoiceResponse(ImportInvoice importInvoice);

    ImportDetailResponse toImportDetailResponse(ImportDetail importDetail);
}
