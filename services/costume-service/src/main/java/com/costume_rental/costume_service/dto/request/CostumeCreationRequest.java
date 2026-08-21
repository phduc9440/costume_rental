package com.costume_rental.costume_service.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CostumeCreationRequest {
    String name;
    int quantity;
    float price;
}
