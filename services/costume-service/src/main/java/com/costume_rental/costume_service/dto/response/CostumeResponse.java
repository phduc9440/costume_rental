package com.costume_rental.costume_service.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CostumeResponse {
    String id;
    String name;
    int quantity;
    float price;
}
