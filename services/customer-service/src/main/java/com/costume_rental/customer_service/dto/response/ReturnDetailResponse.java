package com.costume_rental.customer_service.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReturnDetailResponse {
    String id;
    Integer quantity;
    float penaltyFee;

    CostumeResponse costumeResponse;
    ReturnOrderResponse returnOrderResponse;
}
