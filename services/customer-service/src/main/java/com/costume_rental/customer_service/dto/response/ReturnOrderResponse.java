package com.costume_rental.customer_service.dto.response;

import java.time.LocalDateTime;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReturnOrderResponse {
    String id;
    float totalPenaltyFee;
    LocalDateTime createdDate;

    EmployeeResponse employeeResponse;
    RentalOrderResponse rentalOrderResponse;
}
