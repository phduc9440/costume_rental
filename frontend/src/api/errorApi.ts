import apiClient from "./apiClient";
import type { ApiResponse, PageResponse } from "../types/customer";
import type { ErrorPenalty, LoiRequest } from "../types/error";

export const errorApi = {
  getAllErrors: (keyword?: string, page = 1, size = 10) =>
    apiClient.get<ApiResponse<PageResponse<ErrorPenalty>>>("/return/errors", {
      params: { keyword, page, size },
    }),

  getErrorById: (id: string) =>
    apiClient.get<ApiResponse<ErrorPenalty>>(`/return/errors/${id}`),

  createError: (data: LoiRequest) =>
    apiClient.post<ApiResponse<ErrorPenalty>>("/return/errors", data),

  updateError: (id: string, data: LoiRequest) =>
    apiClient.put<ApiResponse<ErrorPenalty>>(`/return/errors/${id}`, data),

  deleteError: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`/return/errors/${id}`),
};
