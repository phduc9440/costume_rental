import apiClient from "./apiClient";
import type { ApiResponse, PageResponse } from "../types/customer";
import type { RentalOrder, CreateRentalOrderRequest } from "../types/rental";

export const rentalApi = {
  createOnlineOrder: (data: CreateRentalOrderRequest) =>
    apiClient.post<ApiResponse<RentalOrder>>(
      "/rental/rental-orders/online",
      data,
    ),

  createOfflineOrder: (data: CreateRentalOrderRequest) =>
    apiClient.post<ApiResponse<RentalOrder>>(
      "/rental/rental-orders/offline",
      data,
    ),

  getMyOrders: (customerId: string, page = 1, size = 10) =>
    apiClient.get<ApiResponse<PageResponse<RentalOrder>>>(
      `/rental/rental-orders/customer/${customerId}`,
      {
        params: { page, size },
      },
    ),

  getOrderDetails: (orderId: string) =>
    apiClient.get<ApiResponse<RentalOrder>>(`/rental/rental-orders/${orderId}`),

  updateOrder: (orderId: string, data: CreateRentalOrderRequest) =>
    apiClient.put<ApiResponse<RentalOrder>>(`/rental/rental-orders/${orderId}`, data),

  getAllOrders: (params: { 
    page?: number; 
    size?: number; 
    status?: string; 
    type?: string; 
    unpaid?: boolean 
  }) =>
    apiClient.get<ApiResponse<PageResponse<RentalOrder>>>("/rental/rental-orders", {
      params,
    }),

  confirmOrder: (orderId: string) =>
    apiClient.put<ApiResponse<RentalOrder>>(`/rental/rental-orders/${orderId}/confirm`),

  cancelOrder: (orderId: string, reason?: string) =>
    apiClient.put<ApiResponse<RentalOrder>>(`/rental/rental-orders/${orderId}/cancel`, null, {
      params: { reason },
    }),

  pickupOrder: (orderId: string) =>
    apiClient.put<ApiResponse<RentalOrder>>(`/rental/rental-orders/${orderId}/pickup`),

  confirmDeposit: (orderId: string) =>
    apiClient.put<ApiResponse<RentalOrder>>(`/rental/rental-orders/${orderId}/confirm-deposit`),
};
