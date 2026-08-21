package com.costume_rental.supplier_service.service;

import com.costume_rental.supplier_service.dto.request.SupplierCreationRequest;
import com.costume_rental.supplier_service.dto.request.SupplierUpdateRequest;
import com.costume_rental.supplier_service.dto.response.PageResponse;
import com.costume_rental.supplier_service.dto.response.SupplierResponse;

public interface SupplierService {
    SupplierResponse createSupplier(SupplierCreationRequest request);

    SupplierResponse getSupplierById(String id);

    PageResponse<SupplierResponse> getAllSuppliers(int page, int size);

    SupplierResponse updateSupplier(String id, SupplierUpdateRequest request);

    void deleteSupplier(String id);
}
