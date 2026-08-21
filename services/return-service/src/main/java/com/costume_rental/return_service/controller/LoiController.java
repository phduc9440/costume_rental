package com.costume_rental.return_service.controller;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import com.costume_rental.return_service.dto.request.LoiRequest;
import com.costume_rental.return_service.dto.response.ApiResponse;
import com.costume_rental.return_service.dto.response.LoiResponse;
import com.costume_rental.return_service.dto.response.PageResponse;
import com.costume_rental.return_service.service.LoiService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/errors")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LoiController {
    LoiService loiService;

    @PostMapping
    public ApiResponse<LoiResponse> createLoi(@RequestBody @Valid LoiRequest request) {
        return ApiResponse.<LoiResponse>builder()
                .result(loiService.createLoi(request))
                .message("Create error penalty success")
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<LoiResponse> updateLoi(@PathVariable String id, @RequestBody @Valid LoiRequest request) {
        return ApiResponse.<LoiResponse>builder()
                .result(loiService.updateLoi(id, request))
                .message("Update error penalty success")
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteLoi(@PathVariable String id) {
        loiService.deleteLoi(id);
        return ApiResponse.<Void>builder()
                .message("Delete error penalty success")
                .build();
    }

    @GetMapping
    public ApiResponse<PageResponse<LoiResponse>> getAllLoi(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.<PageResponse<LoiResponse>>builder()
                .result(loiService.getAllLoi(keyword, page, size))
                .message("Get all errors success")
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<LoiResponse> getLoiById(@PathVariable String id) {
        return ApiResponse.<LoiResponse>builder()
                .result(loiService.getLoiById(id))
                .message("Get error penalty success")
                .build();
    }
}
