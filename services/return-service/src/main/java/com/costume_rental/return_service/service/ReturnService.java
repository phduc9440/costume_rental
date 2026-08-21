package com.costume_rental.return_service.service;

import java.util.List;

import com.costume_rental.return_service.dto.request.ReturnRequest;
import com.costume_rental.return_service.dto.response.PageResponse;
import com.costume_rental.return_service.dto.response.ReturnInvoiceDetailResponse;
import com.costume_rental.return_service.dto.response.ReturnResponse;
import com.costume_rental.return_service.dto.response.RevenueStatisticResponse;

public interface ReturnService {
    ReturnResponse createReturnTicket(ReturnRequest request);

    ReturnResponse getReturnTicketById(String id);

    PageResponse<ReturnResponse> getAllReturnTickets(int page, int size);

    List<RevenueStatisticResponse> getRevenueStatistics(String type);

    List<ReturnInvoiceDetailResponse> getRevenueDetails(String type, String period);
}
