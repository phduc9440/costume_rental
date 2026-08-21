package com.costume_rental.customer_service.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import com.costume_rental.customer_service.dto.enums.RentalStatus;
import com.costume_rental.customer_service.dto.enums.RentalType;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RentalOrderResponse {
    String id;
    float deposit;
    float totalAmount;
    LocalDateTime createDate;
    RentalType type;
    RentalStatus status;
    String cancelReason;
    LocalDateTime dueDate;

    EmployeeResponse employeeResponse;
    CustomerResponse customerResponse;
    List<RentalDetailResponse> rentalDetailResponses;
}
