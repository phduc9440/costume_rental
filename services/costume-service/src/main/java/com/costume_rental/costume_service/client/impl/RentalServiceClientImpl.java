package com.costume_rental.costume_service.client.impl;

import java.util.List;

import org.springframework.stereotype.Component;

import com.costume_rental.costume_service.client.RentalServiceClient;
import com.costume_rental.costume_service.dto.response.ApiResponse;
import com.costume_rental.costume_service.dto.response.RentalDetailRevenueDTO;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class RentalServiceClientImpl implements RentalServiceClient {

    @Override
    public ApiResponse<List<RentalDetailRevenueDTO>> getCostumeRevenueRawData() {
        log.error("Rental Service is down - cannot get costume revenue data");
        throw new RuntimeException("Rental Service unavailable");
    }
}
