package com.costume_rental.return_service.dto.response;

import java.util.Date;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReturnInvoiceDetailResponse {
    String id;
    String customerName;
    Date borrowDate;
    Date returnDate;
    int totalItems;
    double totalAmount;
}
