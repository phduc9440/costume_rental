package com.costume_rental.customer_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import com.costume_rental.customer_service.dto.response.ApiResponse;
import com.costume_rental.customer_service.dto.response.CustomerRevenueResponse;
import com.costume_rental.customer_service.dto.response.PageResponse;
import com.costume_rental.customer_service.dto.response.RentalOrderResponse;

@FeignClient(name = "rental-service")
public interface RentalServiceClient {
    @GetMapping("/rental-orders/customer/{customerId}")
    ApiResponse<PageResponse<RentalOrderResponse>> getOrdersByCustomerId(
            @PathVariable("customerId") String customerId,
            @RequestParam("page") int page,
            @RequestParam("size") int size);

    @GetMapping("/rental-orders/revenue/customer/{customerId}")
    ApiResponse<CustomerRevenueResponse> getCustomerRevenue(@PathVariable("customerId") String customerId);
}
