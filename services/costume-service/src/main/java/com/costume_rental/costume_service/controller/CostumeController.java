package com.costume_rental.costume_service.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.costume_rental.costume_service.dto.request.CostumeCreationRequest;
import com.costume_rental.costume_service.dto.request.CostumeUpdateRequest;
import com.costume_rental.costume_service.dto.response.ApiResponse;
import com.costume_rental.costume_service.dto.response.CostumeResponse;
import com.costume_rental.costume_service.dto.response.CostumeRevenueResponse;
import com.costume_rental.costume_service.dto.response.PageResponse;
import com.costume_rental.costume_service.service.CostumeService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
// @RequestMapping("/costumes")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CostumeController {

    CostumeService costumeService;

    @PostMapping
    public ApiResponse<CostumeResponse> createCostume(@RequestBody CostumeCreationRequest request) {
        return ApiResponse.<CostumeResponse>builder()
                .result(costumeService.createCostume(request))
                .message("Create costume successfully")
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<CostumeResponse> getCostumeById(@PathVariable String id) {
        return ApiResponse.<CostumeResponse>builder()
                .result(costumeService.getCostumeById(id))
                .build();
    }

    @GetMapping
    public ApiResponse<?> getCostumes(
            @RequestParam(value = "ids", required = false) List<String> ids,
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "10") int size) {
        if (ids != null && !ids.isEmpty()) {
            return ApiResponse.<List<CostumeResponse>>builder()
                    .result(costumeService.getCostumesByIds(ids))
                    .build();
        }
        return ApiResponse.<PageResponse<CostumeResponse>>builder()
                .result(costumeService.getAllCostumes(page, size))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<CostumeResponse> updateCostume(
            @PathVariable String id, @RequestBody CostumeUpdateRequest request) {
        return ApiResponse.<CostumeResponse>builder()
                .result(costumeService.updateCostume(id, request))
                .message("Update costume successfully")
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteCostume(@PathVariable String id) {
        costumeService.deleteCostume(id);
        return ApiResponse.<Void>builder()
                .message("Delete costume successfully")
                .build();
    }

    @PutMapping("/{id}/quantity")
    public ApiResponse<CostumeResponse> updateQuantity(@PathVariable String id, @RequestParam int quantityChange) {
        return ApiResponse.<CostumeResponse>builder()
                .result(costumeService.updateQuantity(id, quantityChange))
                .message("Update quantity successfully")
                .build();
    }

    @GetMapping("/statistics/revenue")
    public ApiResponse<List<CostumeRevenueResponse>> getCostumeRevenueStatistics() {
        return ApiResponse.<List<CostumeRevenueResponse>>builder()
                .result(costumeService.getCostumeRevenueStatistics())
                .message("Get costume revenue statistics success")
                .build();
    }
}
