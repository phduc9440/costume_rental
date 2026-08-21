package com.costume_rental.supplier_service.service;

import java.util.List;

import com.costume_rental.supplier_service.dto.request.ImportInvoiceCreationRequest;
import com.costume_rental.supplier_service.dto.response.ImportInvoiceResponse;
import com.costume_rental.supplier_service.dto.response.PageResponse;
import com.costume_rental.supplier_service.dto.response.TopSupplierResponse;

public interface ImportInvoiceService {
    ImportInvoiceResponse createImportInvoice(ImportInvoiceCreationRequest request);

    ImportInvoiceResponse getImportInvoiceById(String id);

    PageResponse<ImportInvoiceResponse> getAllImportInvoices(int page, int size);

    // Thống kê
    List<TopSupplierResponse> getTopSuppliers();
}
