package com.costume_rental.customer_service.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CustomerResponse {
    String id;
    String username;
    String role;
    String name;
    String phone;
    String address;
    String email;
    Double totalSpent;
    PageResponse<RentalOrderResponse> rentalHistory;
}
