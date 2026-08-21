package com.costume_rental.return_service.service.impl;

import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.costume_rental.return_service.client.CostumeServiceClient;
import com.costume_rental.return_service.client.CustomerServiceClient;
import com.costume_rental.return_service.client.RentalServiceClient;
import com.costume_rental.return_service.dto.request.ReturnRequest;
import com.costume_rental.return_service.dto.response.PageResponse;
import com.costume_rental.return_service.dto.response.RentalDetailResponse;
import com.costume_rental.return_service.dto.response.RentalOrderResponse;
import com.costume_rental.return_service.dto.response.ReturnInvoiceDetailResponse;
import com.costume_rental.return_service.dto.response.ReturnResponse;
import com.costume_rental.return_service.dto.response.RevenueStatisticResponse;
import com.costume_rental.return_service.entity.ChiTietLoi;
import com.costume_rental.return_service.entity.ChiTietTra;
import com.costume_rental.return_service.entity.Loi;
import com.costume_rental.return_service.entity.PhieuTra;
import com.costume_rental.return_service.exception.AppException;
import com.costume_rental.return_service.exception.ErrorCode;
import com.costume_rental.return_service.mapper.ReturnMapper;
import com.costume_rental.return_service.repository.LoiRepository;
import com.costume_rental.return_service.repository.PhieuTraRepository;
import com.costume_rental.return_service.service.ReturnService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ReturnServiceImpl implements ReturnService {

    PhieuTraRepository phieuTraRepository;
    LoiRepository loiRepository;
    ReturnMapper returnMapper;
    RentalServiceClient rentalServiceClient;
    CustomerServiceClient customerServiceClient;
    CostumeServiceClient costumeServiceClient;

    @Override
    @Transactional
    public ReturnResponse createReturnTicket(ReturnRequest request) {
        final PhieuTra phieuTra = PhieuTra.builder()
                .ngayLap(new Date())
                .phieuThueId(request.getPhieuThueId())
                .nhanVienId(request.getNhanVienId())
                .build();

        if (request.getChiTietTras() != null && !request.getChiTietTras().isEmpty()) {
            List<ChiTietTra> chiTietTras = request.getChiTietTras().stream()
                    .map(chiTietReq -> {
                        ChiTietTra chiTietTra = ChiTietTra.builder()
                                .phieuTra(phieuTra)
                                .soLuong(chiTietReq.getSoLuong())
                                .trangPhucId(chiTietReq.getTrangPhucId())
                                .build();

                        if (chiTietReq.getChiTietLois() != null
                                && !chiTietReq.getChiTietLois().isEmpty()) {
                            List<ChiTietLoi> chiTietLois = chiTietReq.getChiTietLois().stream()
                                    .map(loiReq -> {
                                        Loi loi = loiRepository
                                                .findById(loiReq.getLoiId())
                                                .orElseThrow(() -> new AppException(ErrorCode.ERROR_NOT_FOUND));

                                        return ChiTietLoi.builder()
                                                .chiTietTra(chiTietTra)
                                                .tongLoi(loiReq.getTongLoi())
                                                .loi(loi)
                                                .build();
                                    })
                                    .collect(Collectors.toList());
                            chiTietTra.setChiTietLois(chiTietLois);
                        }
                        return chiTietTra;
                    })
                    .collect(Collectors.toList());
            phieuTra.setChiTietTras(chiTietTras);
        }

        PhieuTra savedPhieuTra = phieuTraRepository.save(phieuTra);
        return populateExternalData(returnMapper.toReturnResponse(savedPhieuTra));
    }

    @Override
    @Transactional(readOnly = true)
    public ReturnResponse getReturnTicketById(String id) {
        PhieuTra phieuTra =
                phieuTraRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.RETURN_TICKET_NOT_FOUND));
        return populateExternalData(returnMapper.toReturnResponse(phieuTra));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ReturnResponse> getAllReturnTickets(int page, int size) {
        if (page < 1) page = 1;
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("ngayLap").descending());
        var pageData = phieuTraRepository.findAll(pageable);
        return PageResponse.<ReturnResponse>builder()
                .currentPage(page)
                .pageSize(size)
                .totalPages(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .data(pageData.getContent().stream()
                        .map(returnMapper::toReturnResponse)
                        .map(this::populateExternalData)
                        .toList())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<RevenueStatisticResponse> getRevenueStatistics(String type) {
        List<PhieuTra> allTickets = phieuTraRepository.findAll();
        // Use a map to aggregate, then sort the results
        Map<String, Double> revenueMap = new TreeMap<>(); // Temporary map for aggregation

        for (PhieuTra phieuTra : allTickets) {
            if (phieuTra.getNgayLap() == null) {
                log.warn("Return ticket {} has null ngayLap, skipping from statistics", phieuTra.getId());
                continue;
            }
            String periodKey = getPeriodKey(phieuTra.getNgayLap(), type);
            double revenue = calculateTotalRevenue(phieuTra);
            revenueMap.put(periodKey, revenueMap.getOrDefault(periodKey, 0.0) + revenue);
        }

        return revenueMap.entrySet().stream()
                .sorted(Map.Entry.<String, Double>comparingByKey().reversed())
                .map(entry -> RevenueStatisticResponse.builder()
                        .period(entry.getKey())
                        .totalRevenue(entry.getValue())
                        .build())
                .collect(Collectors.toList());
    }

    private String getPeriodKey(Date date, String type) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        int year = cal.get(Calendar.YEAR);
        int month = cal.get(Calendar.MONTH) + 1;

        return switch (type.toUpperCase()) {
            case "MONTH" -> String.format("%d-%02d", year, month);
            case "QUARTER" -> String.format("%d-Q%d", year, (month - 1) / 3 + 1);
            case "YEAR" -> String.valueOf(year);
            default -> "Other";
        };
    }

    private String formatPeriodKey(String key, String type) {
        if ("MONTH".equalsIgnoreCase(type) && key.contains("-")) {
            String[] parts = key.split("-");
            return parts[1] + "/" + parts[0];
        }
        if ("QUARTER".equalsIgnoreCase(type) && key.contains("-")) {
            String[] parts = key.split("-");
            return parts[1] + "/" + parts[0];
        }
        return key;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReturnInvoiceDetailResponse> getRevenueDetails(String type, String period) {
        List<PhieuTra> allTickets = phieuTraRepository.findAll();
        List<ReturnInvoiceDetailResponse> details = new ArrayList<>();

        for (PhieuTra phieuTra : allTickets) {
            if (phieuTra.getNgayLap() == null) continue;

            String periodKey = getPeriodKey(phieuTra.getNgayLap(), type);

            if (periodKey.equals(period)) {
                RentalOrderResponse rentalOrder = null;
                if (phieuTra.getPhieuThueId() != null) {
                    try {
                        var response = rentalServiceClient.getOrderById(phieuTra.getPhieuThueId());
                        if (response != null) {
                            rentalOrder = response.getResult();
                        }
                    } catch (Exception e) {
                        log.error(
                                "Error fetching rental order {} for statistics: {}",
                                phieuTra.getPhieuThueId(),
                                e.getMessage());
                    }
                }

                double penaltyTotal = calculatePenaltyTotal(phieuTra);
                double totalAmount = (rentalOrder != null ? rentalOrder.getTotalAmount() : 0) + penaltyTotal;

                details.add(ReturnInvoiceDetailResponse.builder()
                        .id(phieuTra.getId())
                        .customerName(
                                rentalOrder != null && rentalOrder.getCustomerResponse() != null
                                        ? rentalOrder.getCustomerResponse().getName()
                                        : "Unknown")
                        .borrowDate(
                                rentalOrder != null
                                        ? Date.from(rentalOrder
                                                .getCreateDate()
                                                .atZone(ZoneId.systemDefault())
                                                .toInstant())
                                        : null)
                        .returnDate(phieuTra.getNgayLap())
                        .totalItems(
                                rentalOrder != null && rentalOrder.getRentalDetailResponses() != null
                                        ? rentalOrder.getRentalDetailResponses().stream()
                                                .mapToInt(RentalDetailResponse::getQuantity)
                                                .sum()
                                        : 0)
                        .totalAmount(totalAmount)
                        .build());
            }
        }
        // Sort by return date descending, handling nulls just in case
        details.sort((a, b) -> {
            if (a.getReturnDate() == null && b.getReturnDate() == null) return 0;
            if (a.getReturnDate() == null) return 1;
            if (b.getReturnDate() == null) return -1;
            return b.getReturnDate().compareTo(a.getReturnDate());
        });
        return details;
    }

    private double calculateTotalRevenue(PhieuTra phieuTra) {
        double penaltyTotal = calculatePenaltyTotal(phieuTra);
        double rentalAmount = 0;
        if (phieuTra.getPhieuThueId() != null) {
            try {
                var response = rentalServiceClient.getOrderById(phieuTra.getPhieuThueId());
                if (response != null && response.getResult() != null) {
                    rentalAmount = response.getResult().getTotalAmount();
                }
            } catch (Exception e) {
                log.error("Error fetching rental order amount for ticket {}: {}", phieuTra.getId(), e.getMessage());
            }
        } else {
            log.warn("Return ticket {} has no phieuThueId", phieuTra.getId());
        }
        return rentalAmount + penaltyTotal;
    }

    private double calculatePenaltyTotal(PhieuTra phieuTra) {
        double penaltyTotal = 0;
        if (phieuTra.getChiTietTras() != null) {
            for (ChiTietTra ct : phieuTra.getChiTietTras()) {
                if (ct.getChiTietLois() != null) {
                    for (ChiTietLoi ctl : ct.getChiTietLois()) {
                        if (ctl.getLoi() != null) {
                            penaltyTotal += ctl.getTongLoi() * ctl.getLoi().getMucPhat();
                        }
                    }
                }
            }
        }
        return penaltyTotal;
    }

    private ReturnResponse populateExternalData(ReturnResponse response) {
        if (response == null) {
            return null;
        }

        // Populate Rental Order and Customer Info
        if (response.getPhieuThueId() != null) {
            try {
                RentalOrderResponse rentalOrder = rentalServiceClient
                        .getOrderById(response.getPhieuThueId())
                        .getResult();
                if (rentalOrder != null) {
                    response.setCustomer(rentalOrder.getCustomerResponse());
                }
            } catch (Exception e) {
                log.error("Error fetching rental order info: {}", e.getMessage());
            }
        }

        // Populate Employee Info
        if (response.getNhanVienId() != null) {
            try {
                response.setEmployee(customerServiceClient
                        .getEmployee(response.getNhanVienId())
                        .getResult());
            } catch (Exception e) {
                log.error("Error fetching employee info: {}", e.getMessage());
            }
        }

        // Populate Costume Info for each detail
        if (response.getChiTietTras() != null) {
            response.getChiTietTras().forEach(detail -> {
                if (detail.getTrangPhucId() != null) {
                    try {
                        detail.setCostume(costumeServiceClient
                                .getCostume(detail.getTrangPhucId())
                                .getResult());
                    } catch (Exception e) {
                        log.error("Error fetching costume info: {}", e.getMessage());
                    }
                }
            });
        }

        return response;
    }
}
