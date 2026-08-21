package com.costume_rental.return_service.dto.request;

import jakarta.validation.constraints.NotBlank;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LoiRequest {
    @NotBlank(message = "Tên lỗi không được để trống")
    String tenLoi;

    float mucPhat;
    String moTa;
}
