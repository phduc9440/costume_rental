package com.costume_rental.supplier_service.dto.request;

import java.util.List;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ImportInvoiceCreationRequest {
    String supplierId;
    String employeeId;
    List<ImportDetailRequest> details;
}
