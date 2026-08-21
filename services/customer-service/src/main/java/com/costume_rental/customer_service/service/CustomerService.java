package com.costume_rental.customer_service.service;

import com.costume_rental.customer_service.dto.request.CustomerUpdateRequest;
import com.costume_rental.customer_service.dto.response.CustomerResponse;
import com.costume_rental.customer_service.dto.response.CustomerRevenueResponse;
import com.costume_rental.customer_service.dto.response.PageResponse;

public interface CustomerService {
    // =================================================================
    // 1. DÀNH CHO ADMIN / EMPLOYEE (Quản trị)
    // =================================================================

    PageResponse<CustomerResponse> getAllCustomers(int page, int size);

    CustomerResponse getCustomerById(String id, int page, int size);

    PageResponse<CustomerResponse> getCustomerByPhone(String phone, int page, int size);

    PageResponse<CustomerResponse> getCustomersByName(String name, int page, int size);

    CustomerResponse updateCustomer(String id, CustomerUpdateRequest request);

    void deleteCustomer(String id);

    // =================================================================
    // 2. DÀNH CHO CUSTOMER (Người dùng cuối)
    // =================================================================

    CustomerResponse getMyProfile(int page, int size);

    CustomerResponse updateMyProfile(CustomerUpdateRequest request);

    CustomerRevenueResponse getCustomerRevenue(String id);
}
