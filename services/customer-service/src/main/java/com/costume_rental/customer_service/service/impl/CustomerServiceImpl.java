package com.costume_rental.customer_service.service.impl;

import java.util.*;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.costume_rental.customer_service.client.RentalServiceClient;
import com.costume_rental.customer_service.dto.request.CustomerUpdateRequest;
import com.costume_rental.customer_service.dto.response.*;
import com.costume_rental.customer_service.entity.Customer;
import com.costume_rental.customer_service.exception.AppException;
import com.costume_rental.customer_service.exception.ErrorCode;
import com.costume_rental.customer_service.mapper.CustomerMapper;
import com.costume_rental.customer_service.repository.CustomerRepository;
import com.costume_rental.customer_service.service.CustomerService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CustomerServiceImpl implements CustomerService {
    CustomerRepository customerRepository;
    CustomerMapper customerMapper;
    RentalServiceClient rentalServiceClient;

    // =================================================================
    // 1. DÀNH CHO ADMIN / EMPLOYEE (Quản trị)
    // =================================================================

    @Override
    public PageResponse<CustomerResponse> getAllCustomers(int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        var pageData = customerRepository.findAll(pageable);

        return PageResponse.<CustomerResponse>builder()
                .currentPage(page)
                .pageSize(size)
                .totalPages(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .data(pageData.getContent().stream()
                        .map(customerMapper::toCustomerResponse)
                        .toList())
                .build();
    }

    @Override
    public CustomerResponse getCustomerById(String id, int page, int size) {
        Customer customer =
                customerRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        CustomerResponse response = customerMapper.toCustomerResponse(customer);

        try {
            ApiResponse<PageResponse<RentalOrderResponse>> ordersResponse =
                    rentalServiceClient.getOrdersByCustomerId(id, page, size);
            if (ordersResponse != null && ordersResponse.getResult() != null) {
                response.setRentalHistory(ordersResponse.getResult());
            }

            ApiResponse<CustomerRevenueResponse> revenueResponse = rentalServiceClient.getCustomerRevenue(id);
            if (revenueResponse != null && revenueResponse.getResult() != null) {
                response.setTotalSpent(revenueResponse.getResult().getTotalSpent());
            }
        } catch (Exception e) {
            // Log or ignore if rental service is unavailable
        }

        return response;
    }

    @Override
    public PageResponse<CustomerResponse> getCustomerByPhone(String phone, int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        var pageData = customerRepository.findByPhoneContaining(phone, pageable);

        return PageResponse.<CustomerResponse>builder()
                .currentPage(page)
                .pageSize(size)
                .totalPages(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .data(pageData.getContent().stream()
                        .map(customerMapper::toCustomerResponse)
                        .toList())
                .build();
    }

    @Override
    public PageResponse<CustomerResponse> getCustomersByName(String name, int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        var pageData = customerRepository.findByNameContaining(name, pageable);

        return PageResponse.<CustomerResponse>builder()
                .currentPage(page)
                .pageSize(size)
                .totalPages(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .data(pageData.getContent().stream()
                        .map(customerMapper::toCustomerResponse)
                        .toList())
                .build();
    }

    @Override
    public CustomerResponse updateCustomer(String id, CustomerUpdateRequest request) {
        Customer customer =
                customerRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        customerMapper.updateCustomer(customer, request);

        Customer saved = customerRepository.save(customer);
        return customerMapper.toCustomerResponse(saved);
    }

    @Override
    public void deleteCustomer(String id) {
        if (!customerRepository.existsById(id)) {
            throw new AppException(ErrorCode.USER_NOT_EXISTED);
        }
        customerRepository.deleteById(id);
    }

    // =================================================================
    // 2. DÀNH CHO CUSTOMER (Người dùng cuối)
    // =================================================================

    @Override
    public CustomerResponse getMyProfile(int page, int size) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        return getCustomerById(userId, page, size);
    }

    @Override
    public CustomerResponse updateMyProfile(CustomerUpdateRequest request) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        return updateCustomer(userId, request);
    }

    @Override
    public CustomerRevenueResponse getCustomerRevenue(String id) {
        try {
            ApiResponse<CustomerRevenueResponse> response = rentalServiceClient.getCustomerRevenue(id);
            return (response != null) ? response.getResult() : null;
        } catch (Exception e) {
            return null;
        }
    }
}
