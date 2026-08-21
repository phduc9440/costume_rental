package com.costume_rental.rental_service.service.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.costume_rental.rental_service.client.CostumeServiceClient;
import com.costume_rental.rental_service.client.CustomerServiceClient;
import com.costume_rental.rental_service.dto.enums.RentalStatus;
import com.costume_rental.rental_service.dto.enums.RentalType;
import com.costume_rental.rental_service.dto.request.CreateRentalOrderRequest;
import com.costume_rental.rental_service.dto.request.RentalItemRequest;
import com.costume_rental.rental_service.dto.response.*;
import com.costume_rental.rental_service.dto.response.CustomerResponse;
import com.costume_rental.rental_service.entity.RentalDetail;
import com.costume_rental.rental_service.entity.RentalOrder;
import com.costume_rental.rental_service.exception.AppException;
import com.costume_rental.rental_service.exception.ErrorCode;
import com.costume_rental.rental_service.mapper.RentalDetailMapper;
import com.costume_rental.rental_service.mapper.RentalOrderMapper;
import com.costume_rental.rental_service.repository.RentalDetailRepository;
import com.costume_rental.rental_service.repository.RentalOrderRepository;
import com.costume_rental.rental_service.service.RentalOrderService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RentalOrderServiceImpl implements RentalOrderService {

    RentalOrderRepository rentalOrderRepository;
    RentalDetailRepository rentalDetailRepository;
    RentalOrderMapper rentalOrderMapper;
    RentalDetailMapper rentalDetailMapper;
    CustomerServiceClient customerServiceClient;
    CostumeServiceClient costumeServiceClient;

    @Override
    @Transactional
    public RentalOrderResponse createOnlineOrder(CreateRentalOrderRequest request) {
        return createOrder(request, RentalType.ONLINE, RentalStatus.PENDING, null);
    }

    @Override
    @Transactional
    public RentalOrderResponse createOfflineOrder(CreateRentalOrderRequest request) {
        String employeeId =
                SecurityContextHolder.getContext().getAuthentication().getName();
        return createOrder(request, RentalType.OFFLINE, RentalStatus.CONFIRMED, employeeId);
    }

    private RentalOrderResponse createOrder(
            CreateRentalOrderRequest request, RentalType type, RentalStatus status, String employeeId) {
        List<String> costumeIds =
                request.getItems().stream().map(RentalItemRequest::getCostumeId).toList();

        List<CostumeResponse> costumes = fetchCostumes(costumeIds);

        validateOrder(request, costumes);

        RentalOrder order = RentalOrder.builder()
                .customerId(request.getCustomerId())
                .createDate(LocalDateTime.now())
                .type(type)
                .status(status)
                .employeeId(employeeId)
                .dueDate(
                        request.getDueDate() != null
                                ? request.getDueDate()
                                : LocalDateTime.now().plusDays(3))
                .build();

        float totalAmount = 0;
        Map<String, Float> priceMap =
                costumes.stream().collect(Collectors.toMap(CostumeResponse::getId, CostumeResponse::getPrice));

        rentalOrderRepository.save(order);

        List<RentalDetail> details = new ArrayList<>();

        for (RentalItemRequest item : request.getItems()) {
            RentalDetail detail = RentalDetail.builder()
                    .costumeId(item.getCostumeId())
                    .quantity(item.getQuantity())
                    .price(priceMap.getOrDefault(item.getCostumeId(), 0f))
                    .rentalOrder(order)
                    .build();

            totalAmount += detail.getPrice() * detail.getQuantity();
            details.add(detail);
        }

        rentalOrderRepository.save(order);

        rentalDetailRepository.saveAll(details);

        return rentalOrderMapper.toResponse(order);
    }

    @Override
    @Transactional
    public RentalOrderResponse confirmOrder(String orderId) {
        RentalOrder order =
                rentalOrderRepository.findById(orderId).orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        String employeeId =
                SecurityContextHolder.getContext().getAuthentication().getName();
        order.setEmployeeId(employeeId);
        order.setStatus(RentalStatus.CONFIRMED);

        return rentalOrderMapper.toResponse(rentalOrderRepository.save(order));
    }

    @Override
    @Transactional
    public RentalOrderResponse cancelOrder(String orderId, String cancelReason) {
        RentalOrder order =
                rentalOrderRepository.findById(orderId).orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        String employeeId =
                SecurityContextHolder.getContext().getAuthentication().getName();
        order.setEmployeeId(employeeId);
        order.setStatus(RentalStatus.CANCELLED);
        order.setCancelReason(cancelReason);

        return rentalOrderMapper.toResponse(rentalOrderRepository.save(order));
    }

    @Override
    @Transactional
    public RentalOrderResponse pickupOrder(String orderId) {
        RentalOrder order =
                rentalOrderRepository.findById(orderId).orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        String employeeId =
                SecurityContextHolder.getContext().getAuthentication().getName();
        order.setEmployeeId(employeeId);
        order.setStatus(RentalStatus.RENTING);

        return rentalOrderMapper.toResponse(rentalOrderRepository.save(order));
    }

    @Override
    @Transactional
    public RentalOrderResponse confirmDeposit(String orderId) {
        RentalOrder order =
                rentalOrderRepository.findById(orderId).orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        String employeeId =
                SecurityContextHolder.getContext().getAuthentication().getName();
        order.setEmployeeId(employeeId);
        order.setStatus(RentalStatus.DEPOSIT_PAID);

        return rentalOrderMapper.toResponse(rentalOrderRepository.save(order));
    }

    @Override
    public PageResponse<RentalOrderResponse> getOrders(
            int page, int size, RentalStatus status, RentalType type, Boolean unpaid) {
        Specification<RentalOrder> spec = (root, query, cb) -> cb.conjunction();

        if (status != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), status));
        }

        if (type != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("type"), type));
        }

        if (unpaid != null && unpaid) {
            spec = spec.and(
                    (root, query, cb) -> cb.not(root.get("status").in(RentalStatus.COMPLETED, RentalStatus.CANCELLED)));
        }

        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("createDate").descending());
        Page<RentalOrder> orderPage = rentalOrderRepository.findAll(spec, pageable);

        List<RentalOrderResponse> orderResponses = enrichRentalOrders(orderPage.getContent(), true);

        return PageResponse.<RentalOrderResponse>builder()
                .currentPage(page)
                .pageSize(size)
                .totalPages(orderPage.getTotalPages())
                .totalElements(orderPage.getTotalElements())
                .data(orderResponses)
                .build();
    }

    @Override
    @Transactional
    public RentalOrderResponse updateOrder(String orderId, CreateRentalOrderRequest request) {
        RentalOrder order =
                rentalOrderRepository.findById(orderId).orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        // 1. Permission & Status Check
        var auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isCustomer =
                auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_CUSTOMER"));
        boolean isAdminOrEmployee = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")
                        || a.getAuthority().equals("ROLE_EMPLOYEE"));

        if (isCustomer) {
            // Customer can only update PENDING orders
            if (order.getStatus() != RentalStatus.PENDING) {
                throw new AppException(ErrorCode.UNAUTHORIZED);
            }
            // Ensure they own the order
            if (!order.getCustomerId().equals(request.getCustomerId())) {
                throw new AppException(ErrorCode.UNAUTHORIZED);
            }
        } else if (isAdminOrEmployee) {
            // Admin/Employee can update PENDING or CONFIRMED orders
            if (order.getStatus() != RentalStatus.PENDING && order.getStatus() != RentalStatus.CONFIRMED) {
                throw new AppException(ErrorCode.UNAUTHORIZED);
            }
        } else {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        // 2. Validate Items & Stock
        List<String> costumeIds =
                request.getItems().stream().map(RentalItemRequest::getCostumeId).toList();
        List<CostumeResponse> costumes = fetchCostumes(costumeIds);
        validateOrder(request, costumes);

        // 3. Delete Old Details
        List<RentalDetail> oldDetails = rentalDetailRepository.findByRentalOrderIn(Collections.singletonList(order));
        rentalDetailRepository.deleteAll(oldDetails);

        // 4. Create New Details & Recalculate Total
        float totalAmount = 0;
        Map<String, Float> priceMap =
                costumes.stream().collect(Collectors.toMap(CostumeResponse::getId, CostumeResponse::getPrice));

        List<RentalDetail> newDetails = new ArrayList<>();
        for (RentalItemRequest item : request.getItems()) {
            float unitPrice = priceMap.getOrDefault(item.getCostumeId(), 0f);
            RentalDetail detail = RentalDetail.builder()
                    .costumeId(item.getCostumeId())
                    .quantity(item.getQuantity())
                    .price(unitPrice)
                    .rentalOrder(order)
                    .build();
            totalAmount += unitPrice * item.getQuantity();
            newDetails.add(detail);
        }
        rentalDetailRepository.saveAll(newDetails);

        // 5. Update Order totals and employee ID
        if (isAdminOrEmployee) {
            order.setEmployeeId(auth.getName());
        }
        if (request.getDueDate() != null) {
            order.setDueDate(request.getDueDate());
        }
        rentalOrderRepository.save(order);

        return getOrderById(orderId);
    }

    @Override
    public RentalOrderResponse getOrderById(String orderId) {
        RentalOrder order =
                rentalOrderRepository.findById(orderId).orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        List<RentalOrderResponse> enriched = enrichRentalOrders(Collections.singletonList(order), true);
        return enriched.getFirst();
    }

    @Override
    public PageResponse<RentalOrderResponse> getOrdersByCustomerId(String customerId, int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("createDate").descending());
        Page<RentalOrder> orderPage = rentalOrderRepository.findByCustomerId(customerId, pageable);

        List<RentalOrderResponse> orderResponses = enrichRentalOrders(orderPage.getContent(), false);

        return PageResponse.<RentalOrderResponse>builder()
                .currentPage(page)
                .pageSize(size)
                .totalPages(orderPage.getTotalPages())
                .totalElements(orderPage.getTotalElements())
                .data(orderResponses)
                .build();
    }

    @Override
    public CustomerRevenueResponse getCustomerRevenue(String customerId) {
        Double revenue = rentalOrderRepository.getTotalSpentByCustomerId(customerId);
        return CustomerRevenueResponse.builder()
                .id(customerId)
                .totalSpent(revenue != null ? revenue.floatValue() : 0.0f)
                .build();
    }

    private List<RentalOrderResponse> enrichRentalOrders(List<RentalOrder> orders, boolean enrichCustomerAndEmployee) {
        if (orders == null || orders.isEmpty()) {
            return Collections.emptyList();
        }

        List<RentalDetail> allDetails = rentalDetailRepository.findByRentalOrderIn(orders);

        Map<String, List<RentalDetail>> detailsByOrderId = allDetails.stream()
                .collect(Collectors.groupingBy(d -> d.getRentalOrder().getId()));

        List<String> allCostumeIds =
                allDetails.stream().map(RentalDetail::getCostumeId).distinct().toList();

        List<CostumeResponse> allCostumes = fetchCostumes(allCostumeIds);
        Map<String, CostumeResponse> costumeMap =
                allCostumes.stream().collect(Collectors.toMap(CostumeResponse::getId, c -> c, (a, b) -> a));

        return orders.stream()
                .map(order -> {
                    RentalOrderResponse response = rentalOrderMapper.toResponse(order);

                    if (enrichCustomerAndEmployee) {
                        response.setCustomerResponse(fetchCustomer(order.getCustomerId()));
                        if (order.getEmployeeId() != null) {
                            response.setEmployeeResponse(fetchEmployee(order.getEmployeeId()));
                        }
                    }

                    List<RentalDetail> details = detailsByOrderId.getOrDefault(order.getId(), Collections.emptyList());

                    List<RentalDetailResponse> detailResponses = details.stream()
                            .map(detail -> {
                                RentalDetailResponse dr = rentalDetailMapper.toResponse(detail);
                                CostumeResponse costume = costumeMap.get(detail.getCostumeId());
                                dr.setCostumeResponse(costume);

                                // Use stored price if available, otherwise use current costume price
                                float unitPrice = (detail.getPrice() > 0)
                                        ? detail.getPrice()
                                        : (costume != null ? costume.getPrice() : 0f);
                                dr.setAmount(unitPrice * detail.getQuantity());
                                return dr;
                            })
                            .collect(Collectors.toList());

                    response.setRentalDetailResponses(detailResponses);

                    float totalAmount = calculateTotalAmountFromDetails(details, costumeMap);
                    response.setTotalAmount(totalAmount);
                    response.setDeposit(totalAmount * 0.5f);

                    response.setDueDate(order.getDueDate());

                    return response;
                })
                .collect(Collectors.toList());
    }

    private void validateOrder(CreateRentalOrderRequest request, List<CostumeResponse> costumes) {
        ApiResponse<CustomerResponse> customerResponse = customerServiceClient.getCustomer(request.getCustomerId());
        if (customerResponse == null || customerResponse.getResult() == null) {
            throw new AppException(ErrorCode.USER_NOT_EXISTED);
        }

        for (RentalItemRequest item : request.getItems()) {
            CostumeResponse costume = costumes.stream()
                    .filter(c -> c.getId().equals(item.getCostumeId()))
                    .findFirst()
                    .orElse(null);

            if (costume == null) {
                throw new AppException(ErrorCode.COSTUME_NOT_EXISTED);
            }

            if (costume.getQuantity() < item.getQuantity()) {
                throw new AppException(ErrorCode.INSUFFICIENT_STOCK);
            }
        }
    }

    private List<CostumeResponse> fetchCostumes(List<String> costumeIds) {
        if (costumeIds == null || costumeIds.isEmpty()) return Collections.emptyList();

        List<CostumeResponse> costumes = new ArrayList<>();
        for (String id : costumeIds) {
            ApiResponse<CostumeResponse> response = costumeServiceClient.getCostume(id);
            if (response == null || response.getResult() == null) {
                throw new AppException(ErrorCode.COSTUME_NOT_EXISTED);
            }
            costumes.add(response.getResult());
        }

        return costumes;
    }

    private CustomerResponse fetchCustomer(String customerId) {
        try {
            ApiResponse<CustomerResponse> customerResponse = customerServiceClient.getCustomer(customerId);
            return (customerResponse != null) ? customerResponse.getResult() : null;
        } catch (Exception e) {
            return null;
        }
    }

    private EmployeeResponse fetchEmployee(String employeeId) {
        try {
            ApiResponse<EmployeeResponse> employeeResponse = customerServiceClient.getEmployee(employeeId);
            return (employeeResponse != null) ? employeeResponse.getResult() : null;
        } catch (Exception e) {
            return null;
        }
    }

    private float calculateTotalAmountFromDetails(List<RentalDetail> details, Map<String, CostumeResponse> costumeMap) {
        return (float) details.stream()
                .mapToDouble(detail -> {
                    // Ưu tiên dùng giá đã lưu ở Detail (giá lúc thuê),
                    // nếu chưa có (đơn cũ) thì mới dùng giá hiện tại từ costumeMap
                    if (detail.getPrice() > 0) {
                        return detail.getPrice() * detail.getQuantity();
                    }
                    CostumeResponse costume = costumeMap.get(detail.getCostumeId());
                    return (costume != null) ? costume.getPrice() * detail.getQuantity() : 0.0;
                })
                .sum();
    }
}
