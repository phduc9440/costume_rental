package com.costume_rental.return_service.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LoiResponse {
    String id;
    String tenLoi;
    float mucPhat;
    String moTa;
}
