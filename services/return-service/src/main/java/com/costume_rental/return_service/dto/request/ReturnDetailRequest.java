package com.costume_rental.return_service.dto.request;

import java.util.List;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReturnDetailRequest {
    int soLuong;
    String trangPhucId;

    List<ReturnErrorDetailRequest> chiTietLois;
}
