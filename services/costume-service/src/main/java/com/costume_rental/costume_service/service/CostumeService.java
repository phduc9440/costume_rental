package com.costume_rental.costume_service.service;

import java.util.List;

import com.costume_rental.costume_service.dto.request.CostumeCreationRequest;
import com.costume_rental.costume_service.dto.request.CostumeUpdateRequest;
import com.costume_rental.costume_service.dto.response.CostumeResponse;
import com.costume_rental.costume_service.dto.response.CostumeRevenueResponse;
import com.costume_rental.costume_service.dto.response.PageResponse;

public interface CostumeService {
    CostumeResponse createCostume(CostumeCreationRequest request);

    CostumeResponse getCostumeById(String id);

    PageResponse<CostumeResponse> getAllCostumes(int page, int size);

    List<CostumeResponse> getCostumesByIds(List<String> ids);

    CostumeResponse updateCostume(String id, CostumeUpdateRequest request);

    void deleteCostume(String id);

    // Cập nhật số lượng (dùng cho internal call từ supplier-service khi nhập hàng)
    CostumeResponse updateQuantity(String id, int quantityChange);

    // Thống kê doanh thu trang phục
    List<CostumeRevenueResponse> getCostumeRevenueStatistics();
}
