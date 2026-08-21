package com.costume_rental.rental_service.dto.request;

import java.time.LocalDateTime;
import java.util.List;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateRentalOrderRequest {
    String customerId;
    List<RentalItemRequest> items;
    LocalDateTime dueDate;
}
