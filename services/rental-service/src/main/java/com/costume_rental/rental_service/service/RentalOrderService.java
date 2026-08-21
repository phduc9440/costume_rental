package com.costume_rental.rental_service.service;

import com.costume_rental.rental_service.dto.enums.RentalStatus;
import com.costume_rental.rental_service.dto.enums.RentalType;
import com.costume_rental.rental_service.dto.request.CreateRentalOrderRequest;
import com.costume_rental.rental_service.dto.response.CustomerRevenueResponse;
import com.costume_rental.rental_service.dto.response.PageResponse;
import com.costume_rental.rental_service.dto.response.RentalOrderResponse;

public interface RentalOrderService {
    RentalOrderResponse createOnlineOrder(CreateRentalOrderRequest request);

    RentalOrderResponse createOfflineOrder(CreateRentalOrderRequest request);

    RentalOrderResponse confirmOrder(String orderId);

    RentalOrderResponse cancelOrder(String orderId, String cancelReason);

    // GIAO ĐỒ CHO KHÁCH
    RentalOrderResponse pickupOrder(String orderId);

    RentalOrderResponse confirmDeposit(String orderId);

    RentalOrderResponse getOrderById(String orderId);

    PageResponse<RentalOrderResponse> getOrders(
            int page, int size, RentalStatus status, RentalType type, Boolean unpaid);

    RentalOrderResponse updateOrder(String orderId, CreateRentalOrderRequest request);

    PageResponse<RentalOrderResponse> getOrdersByCustomerId(String customerId, int page, int size);

    CustomerRevenueResponse getCustomerRevenue(String customerId);
}
