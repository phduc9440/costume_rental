package com.costume_rental.return_service.service;

import com.costume_rental.return_service.dto.request.LoiRequest;
import com.costume_rental.return_service.dto.response.LoiResponse;
import com.costume_rental.return_service.dto.response.PageResponse;

public interface LoiService {
    LoiResponse createLoi(LoiRequest request);

    LoiResponse updateLoi(String id, LoiRequest request);

    void deleteLoi(String id);

    PageResponse<LoiResponse> getAllLoi(String keyword, int page, int size);

    LoiResponse getLoiById(String id);
}
