package com.costume_rental.customer_service.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RentalDetailResponse {
    String id;
    int quantity;
    float amount;

    CostumeResponse costumeResponse;
    RentalOrderResponse rentalOrderResponse;
}
