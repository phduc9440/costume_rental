package com.costume_rental.supplier_service.dto.request;

import jakarta.validation.constraints.NotBlank;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SupplierCreationRequest {
    @NotBlank(message = "Name cannot be blank")
    String name;

    String address;
    String phone;
}
