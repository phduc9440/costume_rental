package com.costume_rental.costume_service.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CostumeRevenueResponse {
    String costumeId;
    String costumeName;
    float price;
    int totalRented;
    float totalRevenue;
}
