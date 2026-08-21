package com.costume_rental.costume_service.service.impl;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.costume_rental.costume_service.client.RentalServiceClient;
import com.costume_rental.costume_service.dto.request.CostumeCreationRequest;
import com.costume_rental.costume_service.dto.request.CostumeUpdateRequest;
import com.costume_rental.costume_service.dto.response.*;
import com.costume_rental.costume_service.entity.Costume;
import com.costume_rental.costume_service.exception.AppException;
import com.costume_rental.costume_service.exception.ErrorCode;
import com.costume_rental.costume_service.mapper.CostumeMapper;
import com.costume_rental.costume_service.repository.CostumeRepository;
import com.costume_rental.costume_service.service.CostumeService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CostumeServiceImpl implements CostumeService {

    CostumeRepository costumeRepository;
    CostumeMapper costumeMapper;
    RentalServiceClient rentalServiceClient;

    @Override
    @Transactional
    public CostumeResponse createCostume(CostumeCreationRequest request) {
        Costume costume = costumeMapper.toCostume(request);
        costume = costumeRepository.save(costume);
        return costumeMapper.toCostumeResponse(costume);
    }

    @Override
    public CostumeResponse getCostumeById(String id) {
        Costume costume =
                costumeRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.COSTUME_NOT_EXISTED));
        return costumeMapper.toCostumeResponse(costume);
    }

    @Override
    public PageResponse<CostumeResponse> getAllCostumes(int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Costume> pageData = costumeRepository.findAll(pageable);

        return PageResponse.<CostumeResponse>builder()
                .currentPage(page)
                .pageSize(size)
                .totalPages(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .data(pageData.getContent().stream()
                        .map(costumeMapper::toCostumeResponse)
                        .toList())
                .build();
    }

    @Override
    public List<CostumeResponse> getCostumesByIds(List<String> ids) {
        List<Costume> costumes = costumeRepository.findByIdIn(ids);
        return costumes.stream().map(costumeMapper::toCostumeResponse).toList();
    }

    @Override
    @Transactional
    public CostumeResponse updateCostume(String id, CostumeUpdateRequest request) {
        Costume costume =
                costumeRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.COSTUME_NOT_EXISTED));

        costumeMapper.updateCostume(costume, request);

        Costume saved = costumeRepository.save(costume);
        return costumeMapper.toCostumeResponse(saved);
    }

    @Override
    @Transactional
    public void deleteCostume(String id) {
        if (!costumeRepository.existsById(id)) {
            throw new AppException(ErrorCode.COSTUME_NOT_EXISTED);
        }
        costumeRepository.deleteById(id);
    }

    @Override
    @Transactional
    public CostumeResponse updateQuantity(String id, int quantityChange) {
        Costume costume =
                costumeRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.COSTUME_NOT_EXISTED));

        int newQuantity = costume.getQuantity() + quantityChange;
        if (newQuantity < 0) {
            throw new AppException(ErrorCode.INSUFFICIENT_STOCK);
        }

        costume.setQuantity(newQuantity);
        Costume saved = costumeRepository.save(costume);
        return costumeMapper.toCostumeResponse(saved);
    }

    @Override
    public List<CostumeRevenueResponse> getCostumeRevenueStatistics() {
        try {
            ApiResponse<List<RentalDetailRevenueDTO>> rawData = rentalServiceClient.getCostumeRevenueRawData();
            if (rawData == null || rawData.getResult() == null) {
                return Collections.emptyList();
            }

            List<RentalDetailRevenueDTO> revenueData = rawData.getResult();
            List<String> costumeIds = revenueData.stream()
                    .map(RentalDetailRevenueDTO::getCostumeId)
                    .distinct()
                    .toList();

            List<Costume> costumes = costumeRepository.findByIdIn(costumeIds);
            Map<String, Costume> costumeMap =
                    costumes.stream().collect(Collectors.toMap(Costume::getId, c -> c, (a, b) -> a));

            return revenueData.stream()
                    .map(dto -> {
                        Costume costume = costumeMap.get(dto.getCostumeId());
                        if (costume == null) return null;
                        return CostumeRevenueResponse.builder()
                                .costumeId(costume.getId())
                                .costumeName(costume.getName())
                                .price(costume.getPrice())
                                .totalRented(dto.getTotalQuantity())
                                .totalRevenue(dto.getTotalRevenue())
                                .build();
                    })
                    .filter(java.util.Objects::nonNull)
                    .sorted((a, b) -> Float.compare(b.getTotalRevenue(), a.getTotalRevenue()))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }
}
