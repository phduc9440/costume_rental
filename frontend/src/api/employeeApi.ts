import apiClient from "./apiClient";
import type {
  ApiResponse,
  Employee,
  EmployeeCreationRequest,
  EmployeeUpdateRequest,
} from "../types/customer";

export const employeeApi = {
  getAllEmployees: () =>
    apiClient.get<ApiResponse<Employee[]>>("/member/employees"),

  getEmployeeById: (id: string) =>
    apiClient.get<ApiResponse<Employee>>(`/member/employees/${id}`),

  createEmployee: (data: EmployeeCreationRequest) =>
    apiClient.post<ApiResponse<Employee>>("/member/employees", data),

  updateEmployee: (id: string, data: EmployeeUpdateRequest) =>
    apiClient.put<ApiResponse<Employee>>(`/member/employees/${id}`, data),

  deleteEmployee: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`/member/employees/${id}`),
};
