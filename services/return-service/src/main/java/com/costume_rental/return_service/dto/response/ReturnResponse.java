package com.costume_rental.return_service.dto.response;

import java.util.Date;
import java.util.List;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReturnResponse {
    String id;

    Date ngayLap;
    String nhanVienId;

    String phieuThueId;

    CustomerResponse customer;
    EmployeeResponse employee;

    List<ReturnDetailResponse> chiTietTras;
}
