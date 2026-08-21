package com.costume_rental.return_service.dto.response;

import java.util.List;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReturnDetailResponse {
    String id;
    int soLuong;

    String trangPhucId;
    CostumeResponse costume;

    List<ReturnErrorDetailResponse> chiTietLois;
}
