import apiClient from "./apiClient";
import type { ApiResponse, PageResponse } from "../types/customer";
import type { Costume } from "../types/costume";

export const costumeApi = {
  getAllCostumes: (name?: string, page: number = 1, size: number = 10) => {
    let url = `/costume/costumes?page=${page}&size=${size}`;
    if (name) url += `&name=${encodeURIComponent(name)}`;
    return apiClient.get<ApiResponse<PageResponse<Costume>>>(url);
  },

  getCostumeById: (id: string) =>
    apiClient.get<ApiResponse<Costume>>(`/costume/costumes/${id}`),

  createCostume: (data: Partial<Costume>) =>
    apiClient.post<ApiResponse<Costume>>('/costume/costumes', data),

  updateCostume: (id: string, data: Partial<Costume>) =>
    apiClient.put<ApiResponse<Costume>>(`/costume/costumes/${id}`, data),

  deleteCostume: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`/costume/costumes/${id}`),
};
