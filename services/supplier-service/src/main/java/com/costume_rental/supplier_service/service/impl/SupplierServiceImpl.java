package com.costume_rental.supplier_service.service.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.costume_rental.supplier_service.dto.request.SupplierCreationRequest;
import com.costume_rental.supplier_service.dto.request.SupplierUpdateRequest;
import com.costume_rental.supplier_service.dto.response.PageResponse;
import com.costume_rental.supplier_service.dto.response.SupplierResponse;
import com.costume_rental.supplier_service.entity.Supplier;
import com.costume_rental.supplier_service.exception.AppException;
import com.costume_rental.supplier_service.exception.ErrorCode;
import com.costume_rental.supplier_service.mapper.SupplierMapper;
import com.costume_rental.supplier_service.repository.SupplierRepository;
import com.costume_rental.supplier_service.service.SupplierService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SupplierServiceImpl implements SupplierService {

    SupplierRepository supplierRepository;
    SupplierMapper supplierMapper;

    @Override
    public SupplierResponse createSupplier(SupplierCreationRequest request) {
        Supplier supplier = supplierMapper.toSupplier(request);
        supplier = supplierRepository.save(supplier);
        return supplierMapper.toSupplierResponse(supplier);
    }

    @Override
    public SupplierResponse getSupplierById(String id) {
        Supplier supplier =
                supplierRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.SUPPLIER_NOT_FOUND));
        return supplierMapper.toSupplierResponse(supplier);
    }

    @Override
    public PageResponse<SupplierResponse> getAllSuppliers(int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Supplier> pageData = supplierRepository.findAll(pageable);

        return PageResponse.<SupplierResponse>builder()
                .currentPage(page)
                .pageSize(size)
                .totalPages(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .data(pageData.getContent().stream()
                        .map(supplierMapper::toSupplierResponse)
                        .toList())
                .build();
    }

    @Override
    public SupplierResponse updateSupplier(String id, SupplierUpdateRequest request) {
        Supplier supplier =
                supplierRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.SUPPLIER_NOT_FOUND));

        supplierMapper.updateSupplier(supplier, request);
        supplier = supplierRepository.save(supplier);
        return supplierMapper.toSupplierResponse(supplier);
    }

    @Override
    public void deleteSupplier(String id) {
        Supplier supplier =
                supplierRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.SUPPLIER_NOT_FOUND));
        supplierRepository.delete(supplier);
    }
}
