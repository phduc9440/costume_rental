package com.costume_rental.return_service.service.impl;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.costume_rental.return_service.dto.request.LoiRequest;
import com.costume_rental.return_service.dto.response.LoiResponse;
import com.costume_rental.return_service.dto.response.PageResponse;
import com.costume_rental.return_service.entity.Loi;
import com.costume_rental.return_service.exception.AppException;
import com.costume_rental.return_service.exception.ErrorCode;
import com.costume_rental.return_service.mapper.LoiMapper;
import com.costume_rental.return_service.repository.LoiRepository;
import com.costume_rental.return_service.service.LoiService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LoiServiceImpl implements LoiService {
    LoiRepository loiRepository;
    LoiMapper loiMapper;

    @Override
    public LoiResponse createLoi(LoiRequest request) {
        Loi loi = loiMapper.toLoi(request);
        loi = loiRepository.save(loi);
        return loiMapper.toLoiResponse(loi);
    }

    @Override
    public LoiResponse updateLoi(String id, LoiRequest request) {
        Loi loi = loiRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.ERROR_NOT_FOUND));
        loiMapper.updateLoi(loi, request);
        return loiMapper.toLoiResponse(loiRepository.save(loi));
    }

    @Override
    public void deleteLoi(String id) {
        Loi loi = loiRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.ERROR_NOT_FOUND));
        loiRepository.delete(loi);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<LoiResponse> getAllLoi(String keyword, int page, int size) {
        if (page < 1) page = 1;
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("tenLoi").ascending());
        var pageData = (keyword != null && !keyword.isEmpty())
                ? loiRepository.findByTenLoiContaining(keyword, pageable)
                : loiRepository.findAll(pageable);

        return PageResponse.<LoiResponse>builder()
                .currentPage(page)
                .pageSize(size)
                .totalPages(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .data(pageData.getContent().stream()
                        .map(loiMapper::toLoiResponse)
                        .toList())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public LoiResponse getLoiById(String id) {
        Loi loi = loiRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.ERROR_NOT_FOUND));
        return loiMapper.toLoiResponse(loi);
    }
}
