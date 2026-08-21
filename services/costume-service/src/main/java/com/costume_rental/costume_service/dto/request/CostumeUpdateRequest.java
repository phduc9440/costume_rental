package com.costume_rental.costume_service.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CostumeUpdateRequest {
    String name;
    Integer quantity;
    Float price;
}
