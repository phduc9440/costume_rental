package com.costume_rental.customer_service.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DamageDetailResponse {
    String id;
    int totalsDamages;
    float penaltyFee;

    ReturnDetailResponse returnDetailResponse;
    DamageResponse damageResponse;
}
