import apiClient from "./apiClient";
import type { ApiResponse, PageResponse } from "../types/customer";
import type { Supplier, SupplierCreationRequest, SupplierUpdateRequest } from "../types/supplier";

export const supplierApi = {
  getAllSuppliers: (page: number = 1, size: number = 10) => {
    return apiClient.get<ApiResponse<PageResponse<Supplier>>>(`/supplier/suppliers?page=${page}&size=${size}`);
  },

  getSupplierById: (id: string) =>
    apiClient.get<ApiResponse<Supplier>>(`/supplier/suppliers/${id}`),

  createSupplier: (data: SupplierCreationRequest) =>
    apiClient.post<ApiResponse<Supplier>>('/supplier/suppliers', data),

  updateSupplier: (id: string, data: SupplierUpdateRequest) =>
    apiClient.put<ApiResponse<Supplier>>(`/supplier/suppliers/${id}`, data),

  deleteSupplier: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`/supplier/suppliers/${id}`),
};
