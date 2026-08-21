import type { RentalOrder } from "./rental";

export interface Customer {
  id: string;
  username: string;
  role: string;
  name: string;
  phone: string;
  address: string;
  email: string;
  totalSpent?: number;
  rentalHistory?: PageResponse<RentalOrder>;
}

export interface CustomerRevenue extends Customer {
}

export interface CustomerUpdateRequest {
  name: string;
  phone: string;
  address: string;
  email: string;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

export interface PageResponse<T> {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalElements: number;
  data: T[];
}

export interface Employee {
  id: string;
  username: string;
  role: string;
  position: string;
}

export interface EmployeeCreationRequest {
  username: string;
  password?: string;
  position: string;
}

export interface EmployeeUpdateRequest {
  position: string;
}
