package com.costume_rental.supplier_service.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.costume_rental.supplier_service.client.CostumeServiceClient;
import com.costume_rental.supplier_service.dto.request.ImportInvoiceCreationRequest;
import com.costume_rental.supplier_service.dto.response.ApiResponse;
import com.costume_rental.supplier_service.dto.response.ImportInvoiceResponse;
import com.costume_rental.supplier_service.dto.response.PageResponse;
import com.costume_rental.supplier_service.dto.response.TopSupplierResponse;
import com.costume_rental.supplier_service.entity.ImportDetail;
import com.costume_rental.supplier_service.entity.ImportInvoice;
import com.costume_rental.supplier_service.entity.Supplier;
import com.costume_rental.supplier_service.exception.AppException;
import com.costume_rental.supplier_service.exception.ErrorCode;
import com.costume_rental.supplier_service.mapper.ImportInvoiceMapper;
import com.costume_rental.supplier_service.mapper.SupplierMapper;
import com.costume_rental.supplier_service.repository.ImportInvoiceRepository;
import com.costume_rental.supplier_service.repository.SupplierRepository;
import com.costume_rental.supplier_service.service.ImportInvoiceService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ImportInvoiceServiceImpl implements ImportInvoiceService {

    ImportInvoiceRepository importInvoiceRepository;
    SupplierRepository supplierRepository;
    ImportInvoiceMapper importInvoiceMapper;
    SupplierMapper supplierMapper;
    CostumeServiceClient costumeServiceClient;

    @Override
    @Transactional
    public ImportInvoiceResponse createImportInvoice(ImportInvoiceCreationRequest request) {
        Supplier supplier = supplierRepository
                .findById(request.getSupplierId())
                .orElseThrow(() -> new AppException(ErrorCode.SUPPLIER_NOT_FOUND));

        ImportInvoice importInvoice = new ImportInvoice();
        importInvoice.setSupplier(supplier);
        importInvoice.setEmployeeId(request.getEmployeeId());
        importInvoice.setImportDate(LocalDateTime.now());

        final ImportInvoice finalImportInvoice = importInvoice;

        double totalAmount = 0;
        List<ImportDetail> importDetails = request.getDetails().stream()
                .map(detailReq -> {
                    ImportDetail detail = new ImportDetail();
                    detail.setImportInvoice(finalImportInvoice);
                    detail.setCostumeId(detailReq.getCostumeId());
                    detail.setQuantity(detailReq.getQuantity());
                    detail.setPrice(detailReq.getPrice());
                    return detail;
                })
                .collect(Collectors.toList());

        for (ImportDetail detail : importDetails) {
            totalAmount += (detail.getPrice() * detail.getQuantity());

            // Gọi Costume Service qua Feign để cộng vào kho
            ApiResponse<?> response = costumeServiceClient.updateQuantity(detail.getCostumeId(), detail.getQuantity());
            if (response == null || response.getCode() != 200) {
                log.error("Failed to update quantity for costume {}", detail.getCostumeId());
                // Throw exception hoặc handle tuỳ nghiệp vụ. Ở đây ta throw để rollback Transaction.
                throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
            }
        }

        importInvoice.setImportDetails(importDetails);
        importInvoice.setTotalAmount(totalAmount);

        importInvoice = importInvoiceRepository.save(importInvoice);
        return importInvoiceMapper.toImportInvoiceResponse(importInvoice);
    }

    @Override
    public ImportInvoiceResponse getImportInvoiceById(String id) {
        ImportInvoice importInvoice =
                importInvoiceRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.INVOICE_NOT_FOUND));
        return importInvoiceMapper.toImportInvoiceResponse(importInvoice);
    }

    @Override
    public PageResponse<ImportInvoiceResponse> getAllImportInvoices(int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<ImportInvoice> pageData = importInvoiceRepository.findAll(pageable);

        return PageResponse.<ImportInvoiceResponse>builder()
                .currentPage(page)
                .pageSize(size)
                .totalPages(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .data(pageData.getContent().stream()
                        .map(importInvoiceMapper::toImportInvoiceResponse)
                        .toList())
                .build();
    }

    @Override
    public List<TopSupplierResponse> getTopSuppliers() {
        // Lấy tất cả supplier
        List<Supplier> suppliers = supplierRepository.findAll();

        // Thống kê lượng nhập
        return suppliers.stream()
                .map(supplier -> {
                    List<ImportInvoice> invoices = importInvoiceRepository.findAll().stream()
                            .filter(inv -> inv.getSupplier().getId().equals(supplier.getId()))
                            .toList();

                    double totalAmount = invoices.stream()
                            .mapToDouble(ImportInvoice::getTotalAmount)
                            .sum();

                    return TopSupplierResponse.builder()
                            .supplier(supplierMapper.toSupplierResponse(supplier))
                            .totalImportAmount(totalAmount)
                            .totalImportInvoiceCount(invoices.size())
                            .build();
                })
                .sorted((s1, s2) -> Double.compare(s2.getTotalImportAmount(), s1.getTotalImportAmount()))
                .toList();
    }
}
