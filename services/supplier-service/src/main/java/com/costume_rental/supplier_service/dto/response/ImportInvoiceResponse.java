package com.costume_rental.supplier_service.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ImportInvoiceResponse {
    String id;
    SupplierResponse supplier;
    String employeeId;
    LocalDateTime importDate;
    double totalAmount;
    List<ImportDetailResponse> importDetails;
}
