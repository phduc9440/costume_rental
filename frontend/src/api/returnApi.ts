import apiClient from "./apiClient";
import type { ApiResponse, PageResponse } from "../types/customer";
import type { 
  ReturnRequest, 
  ReturnResponse, 
  RevenueStatisticResponse, 
  ReturnInvoiceDetailResponse 
} from "../types/return";

export const returnApi = {
  createReturn: (data: ReturnRequest) =>
    apiClient.post<ApiResponse<ReturnResponse>>("/return/returns", data),

  getAllReturns: (page = 1, size = 10) =>
    apiClient.get<ApiResponse<PageResponse<ReturnResponse>>>("/return/returns", {
      params: { page, size },
    }),

  getReturnById: (id: string) =>
    apiClient.get<ApiResponse<ReturnResponse>>(`/return/returns/${id}`),

  getRevenueStatistics: (type: string) =>
    apiClient.get<ApiResponse<RevenueStatisticResponse[]>>("/return/returns/statistics/revenue", {
      params: { type },
    }),

  getRevenueDetails: (type: string, period: string) =>
    apiClient.get<ApiResponse<ReturnInvoiceDetailResponse[]>>("/return/returns/statistics/revenue/details", {
      params: { type, period },
    }),
};
