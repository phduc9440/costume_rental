package com.costume_rental.return_service.dto.request;

import java.util.List;

import jakarta.validation.constraints.NotNull;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReturnRequest {

    @NotNull(message = "Id phiếu thuê không được để trống")
    String phieuThueId;

    String nhanVienId;

    List<ReturnDetailRequest> chiTietTras;
}
