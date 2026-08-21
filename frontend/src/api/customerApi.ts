import apiClient from "./apiClient";
import type {
  ApiResponse,
  Customer,
  CustomerRevenue,
  CustomerUpdateRequest,
  PageResponse,
} from "../types/customer";

export const customerApi = {
  getMyProfile: () =>
    apiClient.get<ApiResponse<Customer>>("/member/customers/my-profile"),

  updateMyProfile: (data: CustomerUpdateRequest) =>
    apiClient.put<ApiResponse<Customer>>("/member/customers/my-profile", data),

  getAllCustomers: (page = 1, size = 10) =>
    apiClient.get<ApiResponse<PageResponse<Customer>>>("/member/customers", {
      params: { page, size },
    }),

  getCustomerByPhone: (phone: string, page = 1, size = 10) =>
    apiClient.get<ApiResponse<PageResponse<Customer>>>(
      `/member/customers/phone/${phone}`,
      {
        params: { page, size },
      },
    ),

  getCustomersByName: (name: string, page = 1, size = 10) =>
    apiClient.get<ApiResponse<PageResponse<Customer>>>(
      `/member/customers/name/${name}`,
      {
        params: { page, size },
      },
    ),

  getCustomerById: (id: string, page = 1, size = 10) =>
    apiClient.get<ApiResponse<Customer>>(`/member/customers/${id}`, {
      params: { page, size },
    }),

  updateCustomer: (id: string, data: CustomerUpdateRequest) =>
    apiClient.put<ApiResponse<Customer>>(`/member/customers/${id}`, data),

  deleteCustomer: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`/member/customers/${id}`),

  getCustomerRevenue: (id: string) =>
    apiClient.get<ApiResponse<CustomerRevenue>>(`/member/customers/${id}/revenue`),
};
