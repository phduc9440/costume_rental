package com.costume_rental.return_service.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReturnErrorDetailResponse {
    String id;
    int tongLoi;

    LoiResponse loi;
}
