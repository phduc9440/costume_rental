package com.costume_rental.supplier_service.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ImportDetailResponse {
    String id;
    String costumeId;
    int quantity;
    double price;
}
